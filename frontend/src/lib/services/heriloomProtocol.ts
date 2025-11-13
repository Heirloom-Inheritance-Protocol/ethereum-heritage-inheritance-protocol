import { decodeEventLog } from "viem";
import { sepolia } from "viem/chains";
import { getWalletClient, publicClient } from "../viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

interface CreateInheritanceParams {
  successor: `0x${string}`;
  ipfsHash: string;
  tag: string;
  fileName: string;
  fileSize: bigint;
}

export interface InheritanceData {
  id: bigint;
  owner: string;
  successor: string;
  ipfsHash: string;
  tag: string;
  fileName: string;
  fileSize: bigint;
  timestamp: bigint;
  isActive: boolean;
  isClaimed: boolean;
}

/**
 * Creates a new inheritance on the blockchain
 * @returns The inheritance ID
 */
export async function createInheritance({
  successor,
  ipfsHash,
  tag,
  fileName,
  fileSize,
}: CreateInheritanceParams): Promise<bigint> {
  const { walletClient, address } = await getWalletClient();

  // Check if wallet is on the correct chain
  const chainId = await walletClient.getChainId();
  if (chainId !== sepolia.id) {
    try {
      // Request chain switch
      await walletClient.switchChain({ id: sepolia.id });
    } catch {
      throw new Error(
        `Please switch your wallet to Sepolia network. Current chain: ${chainId}, Required: ${sepolia.id}`,
      );
    }
  }

  // Simulate the transaction to check for errors
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "createInheritance",
    args: [successor, ipfsHash, tag, fileName, fileSize],
    account: address,
  });

  // Execute the transaction
  const hash = await walletClient.writeContract(request);

  // Wait for the transaction to be mined
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Parse the logs to get the inheritance ID from the InheritanceCreated event
  const log = receipt.logs.find((log) => {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACT_ABI,
        data: log.data,
        topics: log.topics,
      });
      return decoded.eventName === "InheritanceCreated";
    } catch {
      return false;
    }
  });

  if (!log) {
    throw new Error("InheritanceCreated event not found in transaction logs");
  }

  const decoded = decodeEventLog({
    abi: CONTRACT_ABI,
    data: log.data,
    topics: log.topics,
  });

  const args = decoded.args as unknown as { inheritanceId: bigint };
  return args.inheritanceId;
}

/**
 * Deletes an inheritance from the blockchain
 * @param inheritanceId The ID of the inheritance to delete
 * @returns The transaction hash
 */
export async function deleteInheritance(
  inheritanceId: bigint,
): Promise<`0x${string}`> {
  const { walletClient, address } = await getWalletClient();

  // Check if wallet is on the correct chain
  const chainId = await walletClient.getChainId();
  if (chainId !== sepolia.id) {
    try {
      // Request chain switch
      await walletClient.switchChain({ id: sepolia.id });
    } catch {
      throw new Error(
        `Please switch your wallet to Sepolia network. Current chain: ${chainId}, Required: ${sepolia.id}`,
      );
    }
  }

  // Simulate the transaction to check for errors
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "deleteInheritance",
    args: [inheritanceId],
    account: address,
  });

  // Execute the transaction
  const hash = await walletClient.writeContract(request);

  // Wait for the transaction to be mined
  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}

/**
 * Fetches all inheritances owned by a specific address
 * @param ownerAddress The address of the owner
 * @returns Array of inheritance data, filtered to exclude deleted ones
 */
export async function getOwnerInheritances(
  ownerAddress: `0x${string}`,
): Promise<InheritanceData[]> {
  // Get array of inheritance IDs for the owner
  const inheritanceIds = (await publicClient.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getOwnerInheritances",
    args: [ownerAddress],
  })) as bigint[];

  // Fetch details for each inheritance
  const inheritancePromises = inheritanceIds.map(async (id) => {
    const data = (await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getInheritance",
      args: [id],
    })) as [string, string, string, string, string, bigint, bigint, boolean, boolean];

    return {
      id,
      owner: data[0],
      successor: data[1],
      ipfsHash: data[2],
      tag: data[3],
      fileName: data[4],
      fileSize: data[5],
      timestamp: data[6],
      isActive: data[7],
      isClaimed: data[8],
    };
  });

  const allInheritances = await Promise.all(inheritancePromises);

  // Filter out deleted inheritances (ipfsHash === "0")
  return allInheritances.filter(
    (inheritance) => inheritance.ipfsHash !== "0" && inheritance.ipfsHash !== "",
  );
}
