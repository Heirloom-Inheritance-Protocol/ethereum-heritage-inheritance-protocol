# DigitalInheritance Contract

**Purpose**:
A Solidity smart contract for managing **digital asset inheritance** with IPFS storage references. It supports inheritance chains, successor updates, and asset tracking.

---

## Key Features

- **Inheritance Chains**: Track asset lineage (e.g., passed from parent → child → grandchild).
- **IPFS Integration**: Store encrypted files off-chain (IPFS hashes stored on-chain).
- **Access Control**: Only owners/successors can modify or claim inheritances.
- **Multi-Generational**: Assets can be passed down indefinitely with `generationLevel` tracking.

---

## Structs

### `Inheritance`

| Field                 | Type      | Description                                    |
| --------------------- | --------- | ---------------------------------------------- |
| `owner`               | `address` | Current owner of the inheritance.              |
| `successor`           | `address` | Address set to inherit the asset.              |
| `ipfsHash`            | `string`  | IPFS hash of the encrypted file.               |
| `tag`                 | `string`  | Category tag (e.g., "Family Photos").          |
| `fileName`            | `string`  | Name of the inherited file.                    |
| `fileSize`            | `uint256` | Size of the file in bytes.                     |
| `timestamp`           | `uint256` | Creation/modification time.                    |
| `isActive`            | `bool`    | Whether the inheritance is active.             |
| `isClaimed`           | `bool`    | Whether the successor has claimed it.          |
| `parentInheritanceId` | `uint256` | ID of the parent inheritance (0 if original).  |
| `generationLevel`     | `uint256` | How many times the asset has been passed down. |

---

## Functions

### Core Functions

| Function              | Description                                                                   | Access Control                       |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| `createInheritance`   | Creates a new inheritance record with IPFS metadata. Returns `inheritanceId`. | Anyone (sets `msg.sender` as owner). |
| `claimInheritance`    | Successor claims ownership of the inheritance.                                | Successor only.                      |
| `passDownInheritance` | Passes an inheritance to a new successor (creates a new record in the chain). | Owner or current successor.          |
| `revokeInheritance`   | Deactivates an inheritance (prevents claiming).                               | Owner only.                          |
| `updateSuccessor`     | Changes the successor for an inheritance.                                     | Owner only.                          |
| `deleteInheritance`   | **Permanently deletes** an inheritance (irreversible).                        | Owner only.                          |

### View Functions

| Function                     | Description                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `getInheritance`             | Returns full details of an inheritance by `inheritanceId`.                     |
| `getInheritanceChain`        | Returns the **full chain** of inheritances (from root to current).             |
| `getInheritanceChildren`     | Lists all child inheritances for a given `inheritanceId`.                      |
| `getInheritancesByIpfsHash`  | Finds all inheritances using a specific IPFS hash (asset tracking).            |
| `getRootInheritance`         | Returns the root `inheritanceId` for any inheritance in a chain.               |
| `getOwnerInheritances`       | Lists all inheritances owned by an address.                                    |
| `getSuccessorInheritances`   | Lists all inheritances where an address is the successor.                      |
| `canAccessInheritance`       | Checks if an address (`_user`) can access an inheritance (owner or successor). |
| `getActiveInheritancesCount` | Counts active inheritances for an owner.                                       |

---

## Events

| Event                   | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `InheritanceCreated`    | Emitted when a new inheritance is created.                                                    |
| `InheritanceClaimed`    | Emitted when a successor claims an inheritance.                                               |
| `InheritanceRevoked`    | Emitted when an owner revokes an inheritance.                                                 |
| `SuccessorUpdated`      | Emitted when the successor of an inheritance is changed.                                      |
| `InheritanceDeleted`    | Emitted when an inheritance is permanently deleted.                                           |
| `InheritancePassedDown` | Emitted when an inheritance is passed to a new successor (creates a new record in the chain). |

---

## Mappings (Data Storage)

| Mapping                  | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `inheritances`           | Stores `Inheritance` structs by `inheritanceId`.                        |
| `ownerInheritances`      | Maps owner addresses to their `inheritanceId` arrays.                   |
| `successorInheritances`  | Maps successor addresses to `inheritanceId` arrays they can claim.      |
| `inheritanceChildren`    | Tracks child inheritances for a given `inheritanceId` (tree structure). |
| `ipfsHashToInheritances` | Maps IPFS hashes to all `inheritanceId`s using that asset.              |

---

## Security Notes

1. **Access Control**: Only owners/successors can modify inheritances.
2. **Immutability**: Deleted inheritances (`deleteInheritance`) are **permanently removed**.
3. **Reentrancy**: No external calls in state-changing functions (safe from reentrancy).
4. **Input Validation**: Checks for zero addresses, empty strings, and invalid states.

---

## Example Workflow

1. **Create**: Alice calls `createInheritance` to leave a file for Bob.
2. **Pass Down**: Bob later passes it to Charlie via `passDownInheritance`.
3. **Claim**: Charlie claims it with `claimInheritance`.
4. **Track**: Anyone can view the chain with `getInheritanceChain(inheritanceId)`.

---

## Compiler

- **Solidity**: `^0.8.20` (uses built-in overflow checks).
- **License**: MIT.
