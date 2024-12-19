import type { Plugin } from "@ai16z/eliza";
import { getOnChainActions } from "./actions";
import { getWalletClient, getWalletProvider } from "./wallet";

// EVM imports
// import { sendETH } from "@goat-sdk/core";
// import { erc20 } from "@goat-sdk/plugin-erc20";
// import { USDC } from "@goat-sdk/plugin-erc20";

// Solana imports (commented)
// import { sendSOL } from "@goat-sdk/core";
// import { spl } from "@goat-sdk/plugin-spl";
// import { USDC_SPL } from "@goat-sdk/plugin-spl";

async function createGoatPlugin(
  getSetting: (key: string) => string | undefined
): Promise<Plugin> {
  const walletClient = await getWalletClient(getSetting, {
    network: "evm",
    chainId: 84532,
  });

  // For Solana:
  // const solanaWalletClient = await getWalletClient(getSetting, {
  //   network: "solana",
  //   cluster: "devnet", // or "mainnet-beta" for mainnet
  // });

  const actions = await getOnChainActions({
    wallet: walletClient as any,
    plugins: [
      // EVM plugins
      // sendETH(),
      // erc20({ tokens: [USDC] }),

      // Solana plugins (commented)
      // sendSOL(),
      // spl({ tokens: [USDC_SPL] }),
    ],
  });

  return {
    name: "[GOAT] EVM Onchain Actions",
    description: "EVM integration plugin",
    providers: [getWalletProvider(walletClient)],
    evaluators: [],
    services: [],
    actions: actions,
  };
}

export default createGoatPlugin;
