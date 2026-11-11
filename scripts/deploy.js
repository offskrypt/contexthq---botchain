const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const solc = require('solc');

async function main() {
  const rpcUrl = process.env.BOTCHAIN_RPC || process.env.NEXT_PUBLIC_BOTCHAIN_RPC || 'https://rpc.botchain.ai';
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is required to deploy the contract.');
  }
  const feeInBot = process.env.REGISTRATION_FEE || '0.001';

  console.log('--- ContextRegistration BOT Chain Deployment ---');
  console.log('RPC URL:', rpcUrl);

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  console.log('Connected Network Chain ID:', network.chainId.toString());

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log('Deployer Address:', wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log('Deployer Balance:', ethers.formatEther(balance), 'BOT');

  if (balance === 0n) {
    throw new Error('Deployer wallet has 0 BOT balance. Please fund the wallet.');
  }

  // Compile contract
  console.log('Compiling ContextRegistration.sol...');
  const contractPath = path.join(__dirname, '..', 'contracts', 'ContextRegistration.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'ContextRegistration.sol': {
        content: source,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    for (const err of output.errors) {
      console.log(err.formattedMessage);
    }
    const hasError = output.errors.some((e) => e.severity === 'error');
    if (hasError) throw new Error('Contract compilation failed');
  }

  const compiled = output.contracts['ContextRegistration.sol']['ContextRegistration'];
  const abi = compiled.abi;
  const bytecode = '0x' + compiled.evm.bytecode.object;

  const initialFee = ethers.parseEther(feeInBot);
  console.log(`Deploying with initial registration fee: ${feeInBot} BOT (${initialFee.toString()} wei)...`);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  // Get fee data
  const feeData = await provider.getFeeData();
  const tx = await factory.deploy(initialFee, {
    gasPrice: feeData.gasPrice,
  });

  console.log('Deployment Transaction Hash:', tx.deploymentTransaction()?.hash);
  console.log('Waiting for confirmation...');

  await tx.waitForDeployment();
  const contractAddress = await tx.getAddress();
  console.log('SUCCESS! ContextRegistration deployed at:', contractAddress);

  // Verification calls
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const owner = await contract.owner();
  const onChainFee = await contract.registrationFee();
  console.log('Contract Owner:', owner);
  console.log('Contract Fee:', ethers.formatEther(onChainFee), 'BOT');

  // Save deployment artifact
  const deploymentInfo = {
    contractAddress,
    chainId: Number(network.chainId),
    network: 'BOT Chain',
    rpcUrl,
    explorerUrl: `https://scan.botchain.ai/address/${contractAddress}`,
    registrationFeeWei: onChainFee.toString(),
    registrationFeeBot: feeInBot,
    deployedAt: new Date().toISOString(),
    deployer: wallet.address,
    transactionHash: tx.deploymentTransaction()?.hash,
    abi,
  };

  const contractsDir = path.join(__dirname, '..', 'contracts');
  fs.writeFileSync(
    path.join(contractsDir, 'deployed.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  const srcContractsDir = path.join(__dirname, '..', 'src', 'contracts');
  if (!fs.existsSync(srcContractsDir)) {
    fs.mkdirSync(srcContractsDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(srcContractsDir, 'ContextRegistration.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('Deployment info saved to contracts/deployed.json and src/contracts/ContextRegistration.json');
  return deploymentInfo;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { main };
