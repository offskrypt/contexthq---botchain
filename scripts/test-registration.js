const { ethers } = require('ethers');
const deployed = require('../src/contracts/ContextRegistration.json');

async function test() {
  console.log('Testing ContextRegistration Contract on BOT Chain...');
  const provider = new ethers.JsonRpcProvider(deployed.rpcUrl);
  const contract = new ethers.Contract(deployed.contractAddress, deployed.abi, provider);

  const owner = await contract.owner();
  const fee = await contract.registrationFee();
  console.log('Owner:', owner);
  console.log('Registration Fee:', ethers.formatEther(fee), 'BOT');

  // Check random address
  const testAddress = '0x000000000000000000000000000000000000dEaD';
  const [registered, timestamp] = await contract.isRegistered(testAddress);
  console.log(`Address ${testAddress} registered?`, registered, 'timestamp:', timestamp.toString());

  // Check deployer address
  const [ownerRegistered, ownerTimestamp] = await contract.isRegistered(owner);
  console.log(`Address ${owner} registered?`, ownerRegistered, 'timestamp:', ownerTimestamp.toString());

  // Test registration with deployer wallet if not registered yet and private key is supplied
  if (!ownerRegistered) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.log('Skipping live transaction test: PRIVATE_KEY env var not set.');
      return;
    }
    console.log('Testing registration transaction for owner...');
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    const feeData = await provider.getFeeData();
    const tx = await contractWithSigner.register({
      value: fee,
      gasPrice: feeData.gasPrice,
    });
    console.log('Register Tx Hash:', tx.hash);
    const receipt = await tx.wait();
    console.log('Registration confirmed in block:', receipt.blockNumber);

    const [afterReg, afterTs] = await contract.isRegistered(owner);
    console.log('After registration check:', afterReg, 'registered at:', new Date(Number(afterTs) * 1000).toISOString());
  } else {
    console.log('Owner is already registered at:', new Date(Number(ownerTimestamp) * 1000).toISOString());
  }

  const total = await contract.totalRegistered();
  console.log('Total registered wallets:', total.toString());
  console.log('All on-chain tests PASSED successfully!');
}

test().catch(console.error);
