import express from "express";
import {Contract, JsonRpcProvider, Wallet} from "ethers";
import {readFileSync} from "fs";
import {fileURLToPath} from "url";
import {dirname, join} from "path";
import { HERILOOM_CONTRACT_ADDRESS } from "../config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Load contract ABI
const abiPath = join(__dirname, "../../out/zkheriloom3.sol/ZkHeriloom3.json");
let HeriloomArtifact;
try {
    HeriloomArtifact = JSON.parse(readFileSync(abiPath, "utf8"));
} catch (error) {
    console.error("❌ Error loading contract ABI:", error.message);
    console.error("   Make sure to compile contracts with: forge build");
}

router.post("/", async (req, res) => {
    console.log("🔵 ========== CREATE INHERITANCE (VAULT) ROUTE CALLED ==========");

    try {
        // Validate that the ABI is loaded
        if (!HeriloomArtifact || !HeriloomArtifact.abi) {
            return res.status(500).json({
                error: "Contract ABI not loaded",
                details: 'Run "forge build" to compile contracts',
            });
        }

        // Extract parameters from request body
        const { owner, successorCommitment, ipfsHash, tag, fileName, fileSize } = req.body;

        // Validate required parameters
        if (!owner || !successorCommitment || !ipfsHash || !tag || !fileName || fileSize === undefined) {
            return res.status(400).json({
                error: "Missing required parameters",
                details: "Required: owner, successorCommitment, ipfsHash, tag, fileName, fileSize",
            });
        }

        console.log("📋 Inheritance details:");
        console.log("   Owner:", owner);
        console.log("   Successor Commitment:", successorCommitment);
        console.log("   IPFS Hash:", ipfsHash);
        console.log("   Tag:", tag);
        console.log("   File Name:", fileName);
        console.log("   File Size:", fileSize);

        // Configure provider and signer (relayer pays gas)
        const provider = new JsonRpcProvider(process.env.RPC_URL);
        const signer = new Wallet(process.env.PRIVATE_KEY, provider);
        console.log("✅ Relayer configured");
        console.log("   Relayer address:", signer.address);

        // Verify relayer balance
        const balance = await provider.getBalance(signer.address);
        console.log("   Relayer balance:", balance.toString(), "wei");

        if (balance === 0n) {
            return res.status(500).json({
                error: "Insufficient funds",
                details: "Relayer wallet has no funds to pay for gas",
            });
        }

        // Create contract instance
        const heriloomContract = new Contract(
            HERILOOM_CONTRACT_ADDRESS,
            HeriloomArtifact.abi,
            signer
        );

        console.log("🔵 Creating inheritance on blockchain (this also creates the vault)...");

        // Call createInheritance function (relayer pays gas, creates inheritance + vault)
        const transaction = await heriloomContract.createInheritance(
            successorCommitment,
            ipfsHash,
            tag,
            fileName,
            fileSize
        );

        console.log("✅ Transaction sent successfully");
        console.log("   Transaction hash:", transaction.hash);

        const receipt = await transaction.wait();
        console.log("✅ Transaction confirmed!");
        console.log("   Block number:", receipt.blockNumber);

        // Parse events to get inheritance ID and vault ID
        const { Interface } = await import("ethers");
        const InheritanceCreatedEventAbi =
            "event InheritanceCreated(uint256 indexed inheritanceId, address indexed owner, uint256 indexed successorCommitment, string ipfsHash, string tag, uint256 parentInheritanceId, uint256 generationLevel)";
        const GroupCreatedEventAbi = "event GroupCreated(uint256 indexed groupId)";

        const inheritanceIface = new Interface([InheritanceCreatedEventAbi]);
        const groupIface = new Interface([GroupCreatedEventAbi]);

        let inheritanceId = null;
        let vaultId = null;

        // Get Semaphore address for event filtering
        const semaphoreAddress = (await heriloomContract.semaphore()).toLowerCase();
        console.log("🔍 Semaphore contract address:", semaphoreAddress);

        // Parse all logs to find both InheritanceCreated and GroupCreated events
        for (const log of receipt.logs) {
            // Check for InheritanceCreated event
            if (log.address.toLowerCase() === HERILOOM_CONTRACT_ADDRESS.toLowerCase()) {
                try {
                    const parsed = inheritanceIface.parseLog({
                        topics: log.topics,
                        data: log.data,
                    });

                    if (parsed && parsed.name === "InheritanceCreated") {
                        inheritanceId = parsed.args.inheritanceId.toString();
                        console.log("✅ Inheritance created with ID:", inheritanceId);
                    }
                } catch (parseError) {
                    // Not an InheritanceCreated event, continue
                }
            }

            // Check for GroupCreated event from Semaphore
            if (log.address.toLowerCase() === semaphoreAddress) {
                try {
                    const parsed = groupIface.parseLog({
                        topics: log.topics,
                        data: log.data,
                    });

                    if (parsed && parsed.name === "GroupCreated") {
                        vaultId = parsed.args.groupId.toString();
                        console.log("✅ Vault (Semaphore group) created with ID:", vaultId);
                    }
                } catch (parseError) {
                    // Not a GroupCreated event, continue
                }
            }
        }

        if (!inheritanceId) {
            console.warn("⚠️  InheritanceCreated event not found");
        }

        if (!vaultId) {
            console.warn("⚠️  GroupCreated event not found, trying to query from contract...");
            try {
                const userData = await heriloomContract.userDatabase(signer.address);
                vaultId = userData[0].toString();
                console.log("✅ Vault ID retrieved from userDatabase:", vaultId);
            } catch (error) {
                console.error("❌ Could not retrieve vault ID:", error.message);
            }
        }

        return res.status(200).json({
            success: true,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            inheritanceId: inheritanceId,
            vaultId: vaultId,
            message: "Inheritance and vault created successfully (gasless transaction via relayer)"
        });

    } catch (error) {
        console.error("❌ ========== ERROR IN CREATE VAULT ROUTE ==========");
        console.error("❌ Error message:", error.message);
        console.error("❌ Error code:", error.code);

        return res.status(500).json({
            error: "Transaction failed",
            message: error.message,
            code: error.code,
        });
    }
});

export default router;

