"use client";

import { JSX, useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { cn } from "@/lib/utils";
import { SuccessModal } from "@/components/ui/success-modal";

interface InheritanceFormProps {
  className?: string;
}

interface Asset {
  successorWallet: string;
  file: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  tag: string;
  ipfsHash: string;
  ipfsUrl: string;
}

const TAG_TYPES = [
  "recipe",
  "handcraft",
  "legacy-knowledge",
  "legal",
  "menu",
  "recipe",
  "handcraft",
  "legacy-knowledge",
  "legal",
  "menu",
  "deed",
  "proper",
  "finance",
  "investor",
] as const;

const ASSETS_STORAGE_KEY = "heirloom_inheritance_assets";

export function InheritanceForm({
  className,
}: InheritanceFormProps): JSX.Element {
  const { user } = usePrivy();
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [successorWallet, setSuccessorWallet] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAsset, setSuccessAsset] = useState<Asset | null>(null);

  // Load assets from localStorage on mount
  useEffect(() => {
    try {
      const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
      if (storedAssets) {
        const parsedAssets = JSON.parse(storedAssets) as Asset[];
        setAssets(parsedAssets);
      }
    } catch (error) {
      console.error("Error loading assets from localStorage:", error);
    }
  }, []);

  // Save assets to localStorage whenever they change
  useEffect(() => {
    if (assets.length > 0) {
      try {
        localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
      } catch (error) {
        console.error("Error saving assets to localStorage:", error);
      }
    }
  }, [assets]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!selectedFile) return;

    setUploading(true);
    try {
      // Upload file to IPFS
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload-ipfs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Create asset object with form data and IPFS info
      const newAsset: Asset = {
        successorWallet,
        file: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
        },
        tag: selectedTag,
        ipfsHash: data.hash,
        ipfsUrl: data.url,
      };

      // Add to assets array
      setAssets((prevAssets) => [...prevAssets, newAsset]);

      console.log("Asset added successfully:", newAsset);
      console.log("All assets:", [...assets, newAsset]);

      // Show success modal
      setSuccessAsset(newAsset);
      setShowSuccessModal(true);

      // Reset form
      setSuccessorWallet("");
      setSelectedFile(null);
      setSelectedTag("");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const currentWalletAddress = user?.wallet?.address?.toLowerCase();
  const isSameAsCurrentWallet =
    currentWalletAddress &&
    successorWallet.toLowerCase() === currentWalletAddress;

  const isFormValid =
    successorWallet.trim() !== "" &&
    selectedFile !== null &&
    selectedTag !== "" &&
    !isSameAsCurrentWallet;

  return (
    <>
      <div className="flex w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative flex w-full max-w-2xl flex-col gap-8 overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/80 via-sky-50/60 to-cyan-50/70 p-8 shadow-xl shadow-blue-200/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-inset-1 before:-z-10 before:opacity-90 before:blur-3xl before:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.4),transparent_50%)] dark:from-blue-100/30 dark:via-sky-100/20 dark:to-cyan-100/25 dark:shadow-blue-300/30 dark:before:bg-[radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.5),transparent_55%)]",
            className,
          )}
        >
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Create Inheritance
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-100">
              Upload a PDF file and designate a successor wallet
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-200">
              Your PDF will be encrypted client-side before being uploaded to
              IPFS. Only the designated successor will be able to decrypt and
              download it.
            </p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-800 dark:text-white">
              Successor Wallet
            </span>
            <input
              value={successorWallet}
              onChange={(event) => setSuccessorWallet(event.target.value)}
              placeholder="0x..."
              className={cn(
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:outline-none focus:ring-2 dark:bg-white/10 dark:text-white dark:placeholder:text-neutral-400",
                isSameAsCurrentWallet
                  ? "border-red-500 focus:border-red-500 focus:ring-red-300 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-700"
                  : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-300 dark:border-neutral-600 dark:focus:border-neutral-500 dark:focus:ring-neutral-700",
              )}
              aria-label="Successor wallet address"
              name="successorWallet"
              required
            />
            {isSameAsCurrentWallet ? (
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠️ You cannot set your own wallet address as the successor.
                Please use a different address.
              </p>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-200">
                The wallet address that will inherit this data
              </p>
            )}
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium text-neutral-800 dark:text-white">
              Inheritance Document
            </span>
            <label
              htmlFor="inheritance-file"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-6 py-10 text-center transition hover:border-neutral-300 dark:border-neutral-600 dark:bg-white/10 dark:hover:border-neutral-500"
            >
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {selectedFile ? selectedFile.name : "Click to upload PDF"}
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-300">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "PDF files only, up to 50MB"}
              </span>
              <input
                id="inheritance-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                name="inheritanceFile"
                required
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-800 dark:text-white">
              Tag Type
            </span>
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-600 dark:bg-white/10 dark:text-white dark:focus:border-neutral-500 dark:focus:ring-neutral-700"
              aria-label="Select inheritance tag type"
            >
              <option value="">Select a tag type</option>
              {TAG_TYPES.map((tagType, index) => (
                <option key={tagType + index} value={tagType}>
                  {tagType.charAt(0).toUpperCase() + tagType.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-600 dark:text-neutral-200">
              Select a tag type to categorize your inheritance
            </p>
          </label>

          <button
            type="submit"
            disabled={!isFormValid || uploading}
            className="w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:disabled:hover:bg-white cursor-pointer"
          >
            {uploading ? "Uploading to IPFS..." : "Create Inheritance"}
          </button>

          {assets.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Created Inheritances ({assets.length})
              </h3>
              <div className="space-y-3">
                {assets.map((asset, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/50 p-4 shadow-sm dark:bg-white/5"
                  >
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {asset.file.name}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      Successor: {asset.successorWallet}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      Tag: {asset.tag}
                    </p>
                    <a
                      href={asset.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View on IPFS →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Inheritance Created Successfully!"
      >
        {successAsset && (
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl bg-linear-to-br from-neutral-50 to-neutral-100 p-6 dark:from-neutral-800 dark:to-neutral-900">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  File Name
                </p>
                <p className="text-base font-semibold text-neutral-900 dark:text-white">
                  {successAsset.file.name}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {(successAsset.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Successor Wallet
                </p>
                <p className="break-all font-mono text-sm text-neutral-900 dark:text-white">
                  {successAsset.successorWallet}
                </p>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Tag Type
                </p>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {successAsset.tag.charAt(0).toUpperCase() +
                    successAsset.tag.slice(1)}
                </span>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  IPFS Hash
                </p>
                <p className="break-all font-mono text-xs text-neutral-900 dark:text-white">
                  {successAsset.ipfsHash}
                </p>
              </div>
            </div>

            <a
              href={successAsset.ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View on IPFS Gateway
            </a>
          </div>
        )}
      </SuccessModal>
    </>
  );
}
