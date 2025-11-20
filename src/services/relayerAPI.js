const RELAYER_URL = process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3001';

/**
 * Add a member to a vault via the relayer
 * Note: Vaults are Semaphore groups - they're the same thing
 * @param {string|BigInt} identityCommitment - The identity commitment to add to the vault
 * @param {number} vaultId - The vault ID (required)
 * @returns {Promise<{success: boolean, transactionHash: string, blockNumber: number, vaultId: number}>}
 */
export async function addMemberToVault(identityCommitment, vaultId) {
  if (!vaultId && vaultId !== 0) {
    throw new Error('vaultId is required');
  }

  if (!identityCommitment) {
    throw new Error('identityCommitment is required');
  }

  try {
    const response = await fetch(`${RELAYER_URL}/api/vault/add-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        identityCommitment: identityCommitment.toString(), 
        vaultId: Number(vaultId) 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || error.details || 'Failed to add member to vault');
    }

    const result = await response.json();
    console.log('✅ Member added to vault:', result.transactionHash);

    return result;
  } catch (error) {
    console.error('❌ Error adding member to vault:', error);
    throw error;
  }
}

/**
 * Create a new inheritance (which creates a vault) via the relayer (gasless)
 * @param {string} owner - The owner's wallet address
 * @param {string|BigInt} successorCommitment - Semaphore commitment hash of the successor
 * @param {string} ipfsHash - IPFS hash of the encrypted file
 * @param {string} tag - Category tag for the inheritance
 * @param {string} fileName - Name of the file
 * @param {number|string|BigInt} fileSize - Size of the file in bytes
 * @returns {Promise<{success: boolean, transactionHash: string, blockNumber: number, inheritanceId: string, vaultId: string}>}
 */
export async function createInheritance(owner, successorCommitment, ipfsHash, tag, fileName, fileSize) {
  try {
    const response = await fetch(`${RELAYER_URL}/api/vault/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner,
        successorCommitment: successorCommitment.toString(),
        ipfsHash,
        tag,
        fileName,
        fileSize: fileSize.toString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || error.details || 'Failed to create inheritance');
    }

    const result = await response.json();
    console.log('✅ Inheritance created via relayer:', result.inheritanceId, result.transactionHash);

    return result;
  } catch (error) {
    console.error('❌ Error creating inheritance via relayer:', error);
    throw error;
  }
}

/**
 * Get all vaults from the contract
 * @returns {Promise<{success: boolean, totalVaults: number, vaults: Array<{vaultId: string, index: number}>}>}
 */
export async function getVaults() {
  try {
    const response = await fetch(`${RELAYER_URL}/api/vaults`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || error.details || 'Failed to get vaults');
    }

    const result = await response.json();
    console.log('✅ Vaults fetched:', result.totalVaults);

    return result;
  } catch (error) {
    console.error('❌ Error fetching vaults:', error);
    throw error;
  }
}

/**
 * Check if a user is a member of a specific vault
 * @param {string|BigInt} identityCommitment - The identity commitment to check
 * @param {number} vaultId - The vault ID to check
 * @returns {Promise<{success: boolean, isMember: boolean, vaultId: string, identityCommitment: string, source: string}>}
 */
export async function checkMember(identityCommitment, vaultId) {
  try {
    const response = await fetch(
      `${RELAYER_URL}/api/vault/check-member?identityCommitment=${identityCommitment.toString()}&vaultId=${vaultId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || error.details || 'Failed to check membership');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error checking membership:', error);
    throw error;
  }
}

/**
 * Check if the relayer is online and healthy
 * @returns {Promise<{status: string, message: string, contract: string, network: string}>}
 */
export async function checkRelayerHealth() {
  try {
    const response = await fetch(`${RELAYER_URL}/health`);

    if (!response.ok) {
      throw new Error('Relayer health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Relayer health check failed:', error);
    throw new Error('Relayer server is not available. Make sure it is running.');
  }
}
