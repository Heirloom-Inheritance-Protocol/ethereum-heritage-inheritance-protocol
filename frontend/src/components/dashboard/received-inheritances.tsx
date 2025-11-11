"use client";

import { JSX, useState, useEffect } from "react";

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

const ASSETS_STORAGE_KEY = "heirloom_inheritance_assets";

export function ReceivedInheritances(): JSX.Element {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, []);

  // Show all assets from storage (these are the ones the current user created)
  const receivedAssets = assets;

  // Filter by search query
  const filteredAssets = receivedAssets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    return (
      asset.file.name.toLowerCase().includes(query) ||
      asset.tag.toLowerCase().includes(query) ||
      asset.successorWallet.toLowerCase().includes(query)
    );
  });

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toISOString().split("T")[0];
  }

  function formatSize(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="relative space-y-6 overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/80 via-sky-50/60 to-cyan-50/70 p-8 shadow-xl shadow-blue-200/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-inset-1 before:-z-10 before:opacity-90 before:blur-3xl before:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.4),transparent_50%)] dark:from-blue-100/30 dark:via-sky-100/20 dark:to-cyan-100/25 dark:shadow-blue-300/30 dark:before:bg-[radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.5),transparent_55%)]">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Inheritance Vaults
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Files you&apos;ve designated for inheritance
            </p>
          </div>
          <div className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {receivedAssets.length}{" "}
            {receivedAssets.length === 1 ? "file" : "files"}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by filename, tag, or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-12 pr-4 text-sm text-neutral-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-neutral-600 dark:bg-white/10 dark:text-white dark:placeholder:text-neutral-400 dark:focus:border-blue-500 dark:focus:ring-blue-700"
          />
        </div>
      </div>

      {/* Table */}
      {filteredAssets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-white/60 p-12 text-center backdrop-blur-sm dark:border-blue-700/50 dark:bg-white/5">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
            No inheritances found
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {searchQuery
              ? "Try adjusting your search query"
              : "You haven&apos;t created any inheritances yet. Go to the Inheritance tab to create one."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div>
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-neutral-200/50 bg-white/40 dark:border-neutral-700/50 dark:bg-white/5">
                  <th className="w-[28%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    File
                  </th>
                  <th className="w-[12%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Successor
                  </th>
                  <th className="w-[10%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Created
                  </th>
                  <th className="w-[8%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Size
                  </th>
                  <th className="w-[15%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Tags
                  </th>
                  <th className="w-[12%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Status
                  </th>
                  <th className="w-[15%] px-4 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/30 dark:divide-neutral-700/30">
                {filteredAssets.map((asset, index) => (
                  <tr
                    key={index}
                    className="bg-transparent transition hover:bg-white/40 dark:hover:bg-white/10"
                  >
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <svg
                          className="h-5 w-5 shrink-0 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                          <path d="M14 2v6h6" fill="white" />
                        </svg>
                        <span className="truncate text-sm font-normal text-neutral-900 dark:text-white">
                          {asset.file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
                        {shortenAddress(asset.successorWallet)}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {formatDate(asset.file.lastModified)}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {formatSize(asset.file.size)}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-1">
                        {asset.tag.split(",").map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/30">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Available
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => window.open(asset.ipfsUrl, "_blank")}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                          aria-label="Open in new tab"
                        >
                          <svg
                            className="h-4 w-4"
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
                        </button>
                        <a
                          href={asset.ipfsUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
