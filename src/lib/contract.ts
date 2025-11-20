// ZkHeriloom3 contract address - Deployed on Scroll Sepolia
// Deployed at: 0xC8a7872EDfD72d812FE08949986C0EbE5B452dDb
export const CONTRACT_ADDRESS = 
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ||
  "0xC8a7872EDfD72d812FE08949986C0EbE5B452dDb";

export const CONTRACT_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_semaphoreAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "acceptVaultAdmin",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addMember",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_identityCommitment",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "canAccessInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "changeAdmin",
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "changeVaultAdmin",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_newAdmin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createInheritance",
    "inputs": [
      {
        "name": "_successorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_ipfsHash",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_tag",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_fileSize",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deleteInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveInheritancesCount",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllUsersFromVault",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllVaultIds",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "successorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ipfsHash",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "tag",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileSize",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isActive",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "isClaimed",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "parentInheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "generationLevel",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInheritanceChain",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "chain",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInheritanceChildren",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getInheritancesByIpfsHash",
    "inputs": [
      {
        "name": "_ipfsHash",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOwnerInheritances",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRootInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSuccessorInheritances",
    "inputs": [
      {
        "name": "_successorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserPositionInDatabase",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getVaultIdsLength",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "groupCounter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "inheritanceChildren",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "inheritanceCounter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "inheritances",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "successorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ipfsHash",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "tag",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileSize",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "isActive",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "isClaimed",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "parentInheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "generationLevel",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ipfsHashToInheritances",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isVaultMember",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_identityCommitment",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerInheritances",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "passDownInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_newSuccessorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeMember",
    "inputs": [
      {
        "name": "_vaultId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_identityCommitment",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_merkleProofSiblings",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeInheritance",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "semaphore",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ISemaphore"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "successorInheritances",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateSuccessor",
    "inputs": [
      {
        "name": "_inheritanceId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_newSuccessorCommitment",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userDatabase",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "vaultID",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "identityCommitment",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "merkleTreeRoot",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "vaultIds",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "vaultUsers",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ChangeAdmin",
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InheritanceClaimed",
    "inputs": [
      {
        "name": "inheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "successorCommitment",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InheritanceCreated",
    "inputs": [
      {
        "name": "inheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "successorCommitment",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "ipfsHash",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "tag",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "parentInheritanceId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "generationLevel",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InheritanceDeleted",
    "inputs": [
      {
        "name": "inheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InheritancePassedDown",
    "inputs": [
      {
        "name": "originalInheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newInheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newSuccessorCommitment",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "generationLevel",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InheritanceRevoked",
    "inputs": [
      {
        "name": "inheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SuccessorUpdated",
    "inputs": [
      {
        "name": "inheritanceId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "oldSuccessorCommitment",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newSuccessorCommitment",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CannotDeleteClaimedInheritance",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotRevokeClaimedInheritance",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotSetSelfAsSuccessor",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CannotUpdateClaimedInheritance",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyFileName",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyIpfsHash",
    "inputs": []
  },
  {
    "type": "error",
    "name": "EmptyTag",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InheritanceAlreadyClaimed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InheritanceAlreadyRevoked",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InheritanceNotActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidSuccessorCommitment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotAdmin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOwnerCanDelete",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOwnerCanRevoke",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOwnerCanUpdate",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlyOwnerOrSuccessorCanPassDown",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OnlySuccessorCanClaim",
    "inputs": []
  }
] as const;
