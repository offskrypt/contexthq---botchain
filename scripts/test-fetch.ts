import { fetchWalletData } from "../src/lib/botchain";

async function test() {
  const t0 = Date.now();
  console.log("Fetching wallet data...");
  const data = await fetchWalletData("0x129aB54BD8d303Fa14B224930B26596dA00Cbc63");
  console.log("Elapsed:", Date.now() - t0, "ms");
  console.log("Address:", data.address);
  console.log("Active Chains:", data.activeChains.map((c) => c.name));
  console.log("Registration:", data.registration);
  console.log("Chain Data count:", data.chainData.length);
  process.exit(0);
}

test().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
