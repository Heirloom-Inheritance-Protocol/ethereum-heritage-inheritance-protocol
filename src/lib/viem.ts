//lib/viem.ts
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export async function getWalletClient() {
  if (!window.ethereum) throw new Error("No ethereum provider found");

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const [address] = await walletClient.getAddresses();

  return { walletClient, address };
}
