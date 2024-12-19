import {
  createLitNodeClient,
  createEthersWallet,
  createLitContractsClient,
  mintCapacityCredit,
  mintPKP,
  getPKPSessionSigs,
  generateWrappedKey,
  getWrappedKeyMetadata,
  lit,
} from "@goat-sdk/wallet-lit";
import { SolanaWalletClient } from "@goat-sdk/wallet-solana";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";

type WalletNetwork = "evm" | "solana";

interface WalletConfig {
  network: WalletNetwork;
  rpcUrl?: string;
  chainId?: number;
  litEVMChainIdentifier?: string;
  solanaCluster?: "devnet" | "mainnet-beta" | "testnet";
}

type WalletClientType = EVMWalletClient | SolanaWalletClient;

export async function getWalletClient(
  getSetting: (key: string) => string | undefined,
  config: WalletConfig
): Promise<WalletClientType> {
  const privateKey = getSetting("WALLET_PRIVATE_KEY");
  if (!privateKey) {
    throw new Error("WALLET_PRIVATE_KEY is required");
  }

  // Initialize Lit components
  const litNodeClient = await createLitNodeClient(LIT_NETWORK.DatilTest);
  const ethersWallet = createEthersWallet(privateKey);
  const litContractsClient = await createLitContractsClient(
    ethersWallet,
    LIT_NETWORK.DatilTest
  );

  // Mint capacity credits and PKP
  const capacityCredit = await mintCapacityCredit(litContractsClient, 10, 30);
  const pkp = await mintPKP(litContractsClient);

  // Get session sigs
  const pkpSessionSigs = await getPKPSessionSigs(
    litNodeClient,
    pkp.publicKey,
    pkp.ethAddress,
    ethersWallet,
    capacityCredit.capacityTokenId
  );

  // Generate wrapped key and get metadata
  const wrappedKey = await generateWrappedKey(
    litNodeClient,
    pkpSessionSigs,
    "evm"
  );
  const wrappedKeyMetadata = await getWrappedKeyMetadata(
    litNodeClient,
    pkpSessionSigs,
    wrappedKey.id
  );

  // Create wallet client depending on network
  if (config.network === "evm") {
    const viemWalletClient = createWalletClient({
      transport: http(config.rpcUrl || "https://sepolia.base.org"),
      chain: baseSepolia,
    });

    const evmWallet = lit({
      litNodeClient,
      pkpSessionSigs,
      wrappedKeyMetadata,
      network: "evm",
      chainId: config.chainId || 84532,
      litEVMChainIdentifier: config.litEVMChainIdentifier || "base-sepolia",
      viemWalletClient,
    });

    return evmWallet;
  } else if (config.network === "solana") {
    const connection = new Connection(
      config.rpcUrl || clusterApiUrl(config.solanaCluster || "devnet"),
      "confirmed"
    );

    const solanaWallet = lit({
      litNodeClient,
      pkpSessionSigs,
      wrappedKeyMetadata,
      network: "solana",
      connection,
      chain: config.solanaCluster || "devnet",
    });

    return solanaWallet as any as EVMWalletClient | SolanaWalletClient;
  }

  throw new Error(`Unsupported network: ${config.network}`);
}

export function getWalletProvider(walletClient: any) {
  return {
    id: "wallet",
    name: "Wallet Provider",
    provides: ["wallet"],
    init: async () => walletClient,
    get: async () => walletClient,
  };
}
