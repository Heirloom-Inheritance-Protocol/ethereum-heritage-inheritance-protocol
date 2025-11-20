# Contract Deployment Summary

## Deployment Details

**Network:** Scroll Sepolia Testnet
**Contract Name:** ZkHeriloom3
**Contract Address:** `0xd839B90604A101735Fcb7Dd9314C14Ac76911658`
**Deployment Date:** November 20, 2024
**Semaphore Address:** `0x689B1d8FB0c64ACFEeFA6BdE1d31f215e92B6fd4`

## Contract Features

This deployment implements the **Semaphore commitment-based inheritance system**:

### Key Changes from Previous Version:
- ✅ Uses `uint256 successorCommitment` instead of `address successor`
- ✅ Privacy-preserving: Successors are identified by commitment hashes, not wallet addresses
- ✅ Zero-knowledge proof ready for inheritance claiming
- ✅ Semaphore group integration for access control
- ✅ Gasless transactions via relayer for inheritance creation

### Main Functions:
1. **createInheritance(successorCommitment, ipfsHash, tag, fileName, fileSize)**
   - Creates a new inheritance with a Semaphore commitment as successor
   - Automatically creates a Semaphore vault (group)
   - Returns inheritanceId

2. **getSuccessorInheritances(successorCommitment)**
   - Queries inheritances by commitment hash instead of address
   - Returns array of inheritance IDs

3. **passDownInheritance(inheritanceId, newSuccessorCommitment)**
   - Pass inheritance to new successor using commitment
   - Creates new generation of inheritance

4. **claimInheritance(inheritanceId)**
   - Claims inheritance (requires ZK proof in production)
   - Transfers ownership to claimer

## Updated Files

### 1. Contract Configuration

#### [relayer/config/constants.js](relayer/config/constants.js)
```javascript
export const HERILOOM_CONTRACT_ADDRESS = "0xd839B90604A101735Fcb7Dd9314C14Ac76911658";
```

#### [src/lib/contract.ts](src/lib/contract.ts)
```typescript
export const CONTRACT_ADDRESS = "0xd839B90604A101735Fcb7Dd9314C14Ac76911658";
export const CONTRACT_ABI = [...]; // Full ABI with commitment-based functions
```

#### [relayer/routes/createVault.js](relayer/routes/createVault.js:14)
```javascript
const abiPath = join(__dirname, "../../out/zkheriloom3.sol/ZkHeriloom3.json");
```

### 2. ABI Updates

The new ABI includes commitment-based function signatures:

**createInheritance:**
```solidity
function createInheritance(
    uint256 _successorCommitment,
    string memory _ipfsHash,
    string memory _tag,
    string memory _fileName,
    uint256 _fileSize
) external returns (uint256)
```

**getInheritance returns:**
```solidity
(
    address owner,
    uint256 successorCommitment,  // Changed from address
    string ipfsHash,
    string tag,
    string fileName,
    uint256 fileSize,
    uint256 timestamp,
    bool isActive,
    bool isClaimed,
    uint256 parentInheritanceId,
    uint256 generationLevel
)
```

**Events:**
```solidity
event InheritanceCreated(
    uint256 indexed inheritanceId,
    address indexed owner,
    uint256 indexed successorCommitment,  // Changed from address
    string ipfsHash,
    string tag,
    uint256 parentInheritanceId,
    uint256 generationLevel
);
```

## Integration Status

### ✅ Completed Integration

1. **Relayer Backend**
   - Updated to accept `successorCommitment` parameter
   - Event parsing updated for commitment-based events
   - Contract address updated to new deployment

2. **Frontend Services**
   - `relayerAPI.js`: Passes commitment hash to relayer
   - `heriloomProtocol.ts`: All functions use commitment types
   - `inheritance-form.tsx`: Generates commitments before creating inheritances
   - `received-inheritances.tsx`: Queries by commitment, displays commitment hashes

3. **Type Safety**
   - TypeScript interfaces updated with `successorCommitment: bigint`
   - Contract return types match new ABI structure
   - All address-based successor logic removed

### Architecture Flow

```
User creates inheritance:
1. Frontend generates successorCommitment from wallet address
2. Encrypts file for both owner and successor
3. Uploads to IPFS
4. Calls relayer with commitment hash
5. Relayer creates inheritance on-chain (gasless)
6. Vault (Semaphore group) created automatically
7. Owner and successor added as vault members
```

## Testing Checklist

Before production use, verify:

- [ ] Can create inheritance with commitment hash
- [ ] Vault is created and accessible
- [ ] Owner and successor are added to vault
- [ ] Can query inheritances by owner address
- [ ] Can query inheritances by successor commitment
- [ ] Events emit correct commitment values
- [ ] Frontend displays commitments properly
- [ ] Relayer can parse events correctly
- [ ] Gas costs are acceptable

## Smart Contract Verification

To verify the contract on Scrollscan:

```bash
cd src/contract
forge verify-contract \
  0xd839B90604A101735Fcb7Dd9314C14Ac76911658 \
  src/contract/zkheriloom3.sol:ZkHeriloom3 \
  --chain scroll-sepolia \
  --constructor-args $(cast abi-encode "constructor(address)" 0x689B1d8FB0c64ACFEeFA6BdE1d31f215e92B6fd4) \
  --etherscan-api-key $SCROLLSCAN_API_KEY
```

## Security Considerations

1. **ZK Proof Implementation**: The `claimInheritance` function currently trusts the caller. In production, implement Semaphore proof verification.

2. **Commitment Generation**: Commitments are generated deterministically from wallet addresses using Semaphore Identity. This allows successors to recreate their identity and prove ownership.

3. **Privacy**: Successor identities are hidden until they claim. Only commitment hashes are stored on-chain.

4. **Access Control**: Vault membership is managed via Semaphore groups, enabling zero-knowledge access control.

## Contract Explorer

View the deployed contract:
- **Scrollscan**: https://sepolia.scrollscan.com/address/0xd839B90604A101735Fcb7Dd9314C14Ac76911658
- **Block Explorer**: Scroll Sepolia Testnet

## Next Steps

1. **Test the full flow** with real transactions
2. **Implement ZK proof verification** in `claimInheritance`
3. **Monitor gas costs** and optimize if needed
4. **Add more comprehensive error handling**
5. **Consider mainnet deployment** after thorough testing

## Support

For issues or questions:
- Check contract events on Scrollscan
- Review relayer logs for transaction failures
- Verify commitment generation matches expectations
- Ensure Semaphore integration is working correctly

---

**Deployment completed successfully! 🎉**

All components updated and ready for integration testing.
