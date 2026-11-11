"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import deployedRegistration from "@/contracts/ContextRegistration.json";
import { BOTCHAIN_CONFIG } from "@/lib/botchain";

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

function getEthereum(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
  return eth ?? null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Transaction failed";
}

function getErrorCode(error: unknown): number | string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code: number | string }).code;
  }
  return undefined;
}

interface BotChainContextType {
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  balance: string;
  isRegistered: boolean;
  registeredAt: number | null;
  registrationFee: string;
  isConnecting: boolean;
  isRegistering: boolean;
  txHash: string | null;
  txError: string | null;
  txSuccess: boolean;
  hasProvider: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBotChain: () => Promise<boolean>;
  registerWallet: () => Promise<{ success: boolean; hash?: string; error?: string }>;
  checkRegistrationForAddress: (
    addr: string
  ) => Promise<{ registered: boolean; timestamp: number }>;
  refreshState: () => Promise<void>;
  clearTxState: () => void;
}

const BotChainContext = createContext<BotChainContextType | undefined>(
  undefined
);

export function BotChainProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0.000");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredAt, setRegisteredAt] = useState<number | null>(null);
  const [registrationFee, setRegistrationFee] = useState<string>(
    BOTCHAIN_CONFIG.defaultRegistrationFee
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [hasProvider] = useState<boolean>(() => getEthereum() !== null);

  const isCorrectNetwork = chainId === BOTCHAIN_CONFIG.chainId;

  // Fetch registration fee & address status from BOT Chain RPC
  const checkRegistrationForAddress = useCallback(
    async (addr: string): Promise<{ registered: boolean; timestamp: number }> => {
      try {
        const provider = new ethers.JsonRpcProvider(BOTCHAIN_CONFIG.rpcUrl);
        const contract = new ethers.Contract(
          BOTCHAIN_CONFIG.registrationContract,
          deployedRegistration.abi,
          provider
        );
        const [reg, ts] = await contract.isRegistered(addr);
        return {
          registered: Boolean(reg),
          timestamp: Number(ts),
        };
      } catch (err) {
        console.warn("Error querying registration:", err);
        return { registered: false, timestamp: 0 };
      }
    },
    []
  );

  // Refresh balance & registration status
  const refreshState = useCallback(async () => {
    if (!account) return;

    try {
      const rpcProvider = new ethers.JsonRpcProvider(BOTCHAIN_CONFIG.rpcUrl);
      const balWei = await rpcProvider.getBalance(account);
      const balFormatted = parseFloat(ethers.formatEther(balWei)).toFixed(4);
      setBalance(balFormatted);

      const contract = new ethers.Contract(
        BOTCHAIN_CONFIG.registrationContract,
        deployedRegistration.abi,
        rpcProvider
      );

      const feeWei = await contract.registrationFee().catch(() => null);
      if (feeWei) {
        setRegistrationFee(ethers.formatEther(feeWei));
      }

      const [reg, ts] = await contract.isRegistered(account);
      setIsRegistered(Boolean(reg));
      setRegisteredAt(Number(ts));
    } catch (err) {
      console.warn("Failed refreshing BOT Chain state:", err);
    }
  }, [account]);

  // Handle network switch to BOT Chain (Chain ID: 677)
  const switchToBotChain = useCallback(async (): Promise<boolean> => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setTxError("No Web3 wallet detected. Please install MetaMask, OKX, or Rabby.");
      return false;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BOTCHAIN_CONFIG.chainIdHex }],
      });
      setChainId(BOTCHAIN_CONFIG.chainId);
      setTxError(null);
      return true;
    } catch (switchError: unknown) {
      const code = getErrorCode(switchError);
      // Error code 4902 indicates chain not yet added
      if (code === 4902 || code === "4902") {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BOTCHAIN_CONFIG.chainIdHex,
                chainName: BOTCHAIN_CONFIG.name,
                nativeCurrency: BOTCHAIN_CONFIG.currency,
                rpcUrls: [BOTCHAIN_CONFIG.rpcUrl],
                blockExplorerUrls: [BOTCHAIN_CONFIG.explorerUrl],
              },
            ],
          });
          setChainId(BOTCHAIN_CONFIG.chainId);
          setTxError(null);
          return true;
        } catch (addError: unknown) {
          setTxError(getErrorMessage(addError));
          return false;
        }
      }
      setTxError(getErrorMessage(switchError));
      return false;
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setTxError("No Web3 wallet found. Please install MetaMask or another Web3 extension.");
      return;
    }

    setIsConnecting(true);
    setTxError(null);

    try {
      const rawAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const accounts = Array.isArray(rawAccounts) ? (rawAccounts as string[]) : [];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const chainIdHex = (await ethereum.request({
          method: "eth_chainId",
        })) as string;
        const currentChainId = parseInt(chainIdHex, 16);
        setChainId(currentChainId);

        // If wrong network, auto-prompt switch
        if (currentChainId !== BOTCHAIN_CONFIG.chainId) {
          await switchToBotChain();
        }
      }
    } catch (err: unknown) {
      const code = getErrorCode(err);
      if (code === 4001 || code === "4001") {
        setTxError("Connection request rejected by user.");
      } else {
        setTxError(getErrorMessage(err));
      }
    } finally {
      setIsConnecting(false);
    }
  }, [switchToBotChain]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setBalance("0.000");
    setIsRegistered(false);
    setRegisteredAt(null);
    setTxHash(null);
    setTxError(null);
    setTxSuccess(false);
  }, []);

  // Clear transaction status
  const clearTxState = useCallback(() => {
    setTxHash(null);
    setTxError(null);
    setTxSuccess(false);
  }, []);

  // Register wallet via smart contract
  const registerWallet = useCallback(async (): Promise<{
    success: boolean;
    hash?: string;
    error?: string;
  }> => {
    const ethereum = getEthereum();
    if (!ethereum || !account) {
      const msg = "Please connect your wallet first.";
      setTxError(msg);
      return { success: false, error: msg };
    }

    // Ensure correct network
    if (chainId !== BOTCHAIN_CONFIG.chainId) {
      const switched = await switchToBotChain();
      if (!switched) {
        const msg = "Please switch your wallet network to BOT Chain (Chain ID: 677).";
        setTxError(msg);
        return { success: false, error: msg };
      }
    }

    setIsRegistering(true);
    setTxError(null);
    setTxSuccess(false);
    setTxHash(null);

    try {
      const browserProvider = new ethers.BrowserProvider(ethereum as unknown as ethers.Eip1193Provider);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(
        BOTCHAIN_CONFIG.registrationContract,
        deployedRegistration.abi,
        signer
      );

      // Check balance
      const currentBalance = await browserProvider.getBalance(account);
      const feeWei = ethers.parseEther(registrationFee);

      if (currentBalance < feeWei) {
        throw new Error(
          `Insufficient BOT balance. Required: ${registrationFee} BOT, Available: ${ethers.formatEther(
            currentBalance
          )} BOT.`
        );
      }

      // Check if already registered
      const [alreadyReg] = await contract.isRegistered(account);
      if (alreadyReg) {
        setIsRegistered(true);
        throw new Error("This wallet is already registered on BOT Chain.");
      }

      // Execute registration transaction
      const tx = await contract.register({
        value: feeWei,
      });

      setTxHash(tx.hash);

      // Wait for 1 confirmation
      const receipt = await tx.wait(1);

      if (receipt && receipt.status === 1) {
        setIsRegistered(true);
        setRegisteredAt(Math.floor(Date.now() / 1000));
        setTxSuccess(true);
        await refreshState();
        return { success: true, hash: tx.hash };
      } else {
        throw new Error("Transaction reverted on-chain.");
      }
    } catch (err: unknown) {
      let errMsg = getErrorMessage(err);
      const code = getErrorCode(err);

      if (code === "ACTION_REJECTED" || code === 4001 || code === "4001") {
        errMsg = "Transaction was rejected by user in wallet.";
      } else if (errMsg.includes("insufficient funds")) {
        errMsg = `Insufficient BOT balance to pay gas and registration fee (${registrationFee} BOT).`;
      } else if (errMsg.includes("already registered")) {
        errMsg = "This wallet address is already registered on ContextHQ BOT Chain.";
        setIsRegistered(true);
      }

      setTxError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsRegistering(false);
    }
  }, [account, chainId, registrationFee, refreshState, switchToBotChain]);

  // Listen to provider events (account and chain changes)
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    // Auto-detect existing accounts
    ethereum
      .request({ method: "eth_accounts" })
      .then((rawAccounts: unknown) => {
        const accounts = Array.isArray(rawAccounts) ? (rawAccounts as string[]) : [];
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          ethereum
            .request({ method: "eth_chainId" })
            .then((cid: unknown) => {
              if (typeof cid === "string") {
                setChainId(parseInt(cid, 16));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? (args[0] as string[]) : [];
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const newChainIdHex = args[0];
      if (typeof newChainIdHex === "string") {
        setChainId(parseInt(newChainIdHex, 16));
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [disconnectWallet]);

  // Load account on-chain state asynchronously
  useEffect(() => {
    let isMounted = true;
    if (!account) return;

    const loadAccountData = async () => {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(BOTCHAIN_CONFIG.rpcUrl);
        const balWei = await rpcProvider.getBalance(account);
        const balFormatted = parseFloat(ethers.formatEther(balWei)).toFixed(4);

        const contract = new ethers.Contract(
          BOTCHAIN_CONFIG.registrationContract,
          deployedRegistration.abi,
          rpcProvider
        );

        const feeWei = await contract.registrationFee().catch(() => null);
        const [reg, ts] = await contract.isRegistered(account);

        if (isMounted) {
          setBalance(balFormatted);
          if (feeWei) {
            setRegistrationFee(ethers.formatEther(feeWei));
          }
          setIsRegistered(Boolean(reg));
          setRegisteredAt(Number(ts));
        }
      } catch (err) {
        console.warn("Failed refreshing BOT Chain state:", err);
      }
    };

    void loadAccountData();

    return () => {
      isMounted = false;
    };
  }, [account, chainId]);

  return (
    <BotChainContext.Provider
      value={{
        account,
        chainId,
        isCorrectNetwork,
        balance,
        isRegistered,
        registeredAt,
        registrationFee,
        isConnecting,
        isRegistering,
        txHash,
        txError,
        txSuccess,
        hasProvider,
        connectWallet,
        disconnectWallet,
        switchToBotChain,
        registerWallet,
        checkRegistrationForAddress,
        refreshState,
        clearTxState,
      }}
    >
      {children}
    </BotChainContext.Provider>
  );
}

export function useBotChain() {
  const context = useContext(BotChainContext);
  if (!context) {
    throw new Error("useBotChain must be used within a BotChainProvider");
  }
  return context;
}
