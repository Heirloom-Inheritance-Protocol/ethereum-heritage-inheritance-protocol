"use client";

import type { JSX, MouseEvent } from "react";
import { useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText, Send, Sparkles, TrendingUp } from "lucide-react";

interface RegisteredSecret {
  id: string;
  title: string;
  owner: string;
  timestamp: number;
}

interface InheritanceRecord {
  secretId: string;
  from: string;
  to: string;
  timestamp: number;
}

interface Node {
  id: string;
  address: string;
  level: number;
  type: "root" | "intermediate" | "leaf";
  x: number;
  y: number;
  title: string;
}

interface Link {
  from: string;
  to: string;
}

interface GraphSummary {
  nodes: Node[];
  links: Link[];
  nodeMap: Map<string, Node>;
  labelMap: Map<string, string>;
  maxDepth: number;
  totalNodes: number;
  totalLinks: number;
  numChains: number;
}

interface Stats {
  total: number;
  sent: number;
  received: number;
  activeChains: number;
}

const mockWalletAddress = "0xA1b2...C3d4";

const mockSecrets: RegisteredSecret[] = [
  {
    id: "secret-1",
    title: "Traditional Pottery Techniques",
    owner: "0xA1b2...C3d4",
    timestamp: Date.now() - 86400000 * 30,
  },
  {
    id: "secret-2",
    title: "Glazing Methods Manual",
    owner: "0xE5f6...G7h8",
    timestamp: Date.now() - 86400000 * 20,
  },
  {
    id: "secret-3",
    title: "Wheel Throwing Guide",
    owner: "0x1i9l0...K1l2",
    timestamp: Date.now() - 86400000 * 10,
  },
  {
    id: "secret-4",
    title: "Kiln Firing Procedures",
    owner: "0xM3n4...O5p6",
    timestamp: Date.now() - 86400000 * 15,
  },
  {
    id: "secret-5",
    title: "Celadon Glaze Recipe",
    owner: "0xQ7r8...S9t0",
    timestamp: Date.now() - 86400000 * 12,
  },
];

const mockInheritances: InheritanceRecord[] = [
  {
    secretId: "secret-1",
    from: "0xA1b2...C3d4",
    to: "0xE5f6...G7h8",
    timestamp: Date.now() - 86400000 * 25,
  },
  {
    secretId: "secret-1",
    from: "0xA1b2...C3d4",
    to: "0x1i9l0...K1l2",
    timestamp: Date.now() - 86400000 * 24,
  },
  {
    secretId: "secret-1",
    from: "0xA1b2...C3d4",
    to: "0xM3n4...O5p6",
    timestamp: Date.now() - 86400000 * 23,
  },
  {
    secretId: "secret-2",
    from: "0xE5f6...G7h8",
    to: "0xQ7r8...S9t0",
    timestamp: Date.now() - 86400000 * 20,
  },
  {
    secretId: "secret-2",
    from: "0xE5f6...G7h8",
    to: "0xU1v2...W3x4",
    timestamp: Date.now() - 86400000 * 19,
  },
  {
    secretId: "secret-3",
    from: "0x1i9l0...K1l2",
    to: "0xY6z8...A7b5",
    timestamp: Date.now() - 86400000 * 18,
  },
  {
    secretId: "secret-4",
    from: "0xM3n4...O5p6",
    to: "0xC9d0...E1f2",
    timestamp: Date.now() - 86400000 * 17,
  },
  {
    secretId: "secret-4",
    from: "0xM3n4...O5p6",
    to: "0xG3h4...I5j6",
    timestamp: Date.now() - 86400000 * 16,
  },
];

function calculateStats(
  secrets: RegisteredSecret[],
  inheritances: InheritanceRecord[],
  walletAddress: string,
): Stats {
  const sent = inheritances.filter(
    (item) => item.from === walletAddress,
  ).length;
  const received = inheritances.filter(
    (item) => item.to === walletAddress,
  ).length;
  const total = secrets.length;

  const chainIds = new Set<string>();
  inheritances.forEach((item) => chainIds.add(item.secretId));

  return {
    total,
    sent,
    received,
    activeChains: chainIds.size,
  };
}

function buildGraph(
  secrets: RegisteredSecret[],
  inheritances: InheritanceRecord[],
): GraphSummary {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const nodeMap = new Map<string, Node>();

  const allAddresses = new Set<string>();
  secrets.forEach((secret) => allAddresses.add(secret.owner));
  inheritances.forEach((record) => {
    allAddresses.add(record.from);
    allAddresses.add(record.to);
    links.push({ from: record.from, to: record.to });
  });

  const levels = new Map<string, number>();
  const children = new Map<string, Set<string>>();
  const parents = new Map<string, Set<string>>();

  inheritances.forEach((record) => {
    if (!children.has(record.from)) children.set(record.from, new Set());
    if (!parents.has(record.to)) parents.set(record.to, new Set());
    children.get(record.from)?.add(record.to);
    parents.get(record.to)?.add(record.from);
  });

  const roots: string[] = [];
  allAddresses.forEach((address) => {
    const hasParents = parents.has(address) && parents.get(address)?.size;
    if (!hasParents) {
      roots.push(address);
      levels.set(address, 0);
    }
  });

  const queue = [...roots];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) ?? 0;

    const childSet = children.get(current);
    if (!childSet) continue;

    childSet.forEach((child) => {
      const existingLevel = levels.get(child);
      if (existingLevel === undefined || existingLevel < currentLevel + 1) {
        levels.set(child, currentLevel + 1);
        queue.push(child);
      }
    });
  }

  const nodeTypes = new Map<string, "root" | "intermediate" | "leaf">();
  allAddresses.forEach((address) => {
    const hasChildren = children.get(address)?.size ?? 0;
    const hasParents = parents.get(address)?.size ?? 0;

    if (!hasParents) {
      nodeTypes.set(address, "root");
    } else if (hasChildren) {
      nodeTypes.set(address, "intermediate");
    } else {
      nodeTypes.set(address, "leaf");
    }
  });

  const levelGroups = new Map<number, string[]>();
  allAddresses.forEach((address) => {
    const level = levels.get(address) ?? 0;
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    levelGroups.get(level)?.push(address);
  });

  const width = 800;
  const height = 500;
  const maxLevel = Math.max(0, ...Array.from(levels.values()));
  const verticalSpacing = height / (maxLevel + 2);

  allAddresses.forEach((address) => {
    const level = levels.get(address) ?? 0;
    const groupAddresses = levelGroups.get(level) ?? [];
    const indexInGroup = groupAddresses.indexOf(address);
    const horizontalSpacing = width / (groupAddresses.length + 1 || 1);

    const ownedSecret = secrets.find((secret) => secret.owner === address);
    const title = ownedSecret?.title ?? "Inherited Secret";

    const node: Node = {
      id: address,
      address,
      level,
      type: nodeTypes.get(address) ?? "intermediate",
      x: horizontalSpacing * (indexInGroup + 1),
      y: verticalSpacing * (level + 1),
      title,
    };

    nodes.push(node);
    nodeMap.set(address, node);
  });

  const labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const labelMap = new Map<string, string>();
  nodes.forEach((node, index) => {
    const availableLabel =
      labels[index] ?? node.address.slice(0, 2).toUpperCase();
    labelMap.set(node.id, availableLabel);
  });

  return {
    nodes,
    links,
    nodeMap,
    labelMap,
    maxDepth: maxLevel,
    totalNodes: nodes.length,
    totalLinks: links.length,
    numChains: roots.length,
  };
}

function getNodeColor(type: "root" | "intermediate" | "leaf"): string {
  if (type === "root") return "rgb(96, 165, 250)";
  if (type === "leaf") return "rgb(52, 211, 153)";
  return "rgb(167, 139, 250)";
}

export function InheritanceTree(): JSX.Element {
  const stats = useMemo(
    () => calculateStats(mockSecrets, mockInheritances, mockWalletAddress),
    [],
  );

  const graph = useMemo(() => buildGraph(mockSecrets, mockInheritances), []);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    node: Node;
    position: { left: number; top: number };
  } | null>(null);

  function handleNodeHover(node: Node, event: MouseEvent<SVGGElement>): void {
    if (!svgContainerRef.current) return;

    const rect = svgContainerRef.current.getBoundingClientRect();
    const rawLeft = event.clientX - rect.left + 16;
    const rawTop = event.clientY - rect.top + 16;
    const clampedLeft = Math.min(
      Math.max(rawLeft, 12),
      Math.max(rect.width - 220, 12),
    );
    const clampedTop = Math.min(
      Math.max(rawTop, 12),
      Math.max(rect.height - 160, 12),
    );

    setTooltip({
      node,
      position: { left: clampedLeft, top: clampedTop },
    });
  }

  function handleNodeLeave(): void {
    setTooltip(null);
  }

  const nodeRoleMap: Record<
    Node["type"],
    { title: string; description: string }
  > = {
    root: {
      title: "Originator",
      description:
        "Primary steward of the lineage. Seeds the vault handoff and initiates the chain.",
    },
    intermediate: {
      title: "Successor",
      description:
        "Active steward who inherits and reissues the vault to trusted co-stewards.",
    },
    leaf: {
      title: "Vault Recipient",
      description:
        "Latest guardian of the craft secret. Holds custodial access until new successors are nominated.",
    },
  };

  return (
    <div className="relative space-y-6 overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/80 via-sky-50/60 to-cyan-50/70 p-8 shadow-xl shadow-blue-200/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-inset-1 before:-z-10 before:opacity-90 before:blur-3xl before:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.4),transparent_50%)] dark:from-blue-100/30 dark:via-sky-100/20 dark:to-cyan-100/25 dark:shadow-blue-300/30 dark:before:bg-[radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.5),transparent_55%)]">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inheritances
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100">
                <FileText className="h-4 w-4 text-slate-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                <span className="text-green-500"> 12% </span>from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
                <Send className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Inheritances created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
                <Download className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.received}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Available to download
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Chains
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                <Sparkles className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeChains}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Inheritance chains
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inheritance Tree</CardTitle>
                <CardDescription>
                  Visualization of inheritance relationships and chain
                  dependencies
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {graph.numChains} chains
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={svgContainerRef}
              className="relative w-full rounded-lg bg-muted/20 p-8 overflow-auto md:overflow-visible"
              style={{ minHeight: "500px" }}
            >
              <svg
                className="mx-auto w-[800px] md:w-full h-[500px]"
                viewBox="0 0 800 500"
              >
                {graph.links.map((link, index) => {
                  const fromNode = graph.nodeMap.get(link.from);
                  const toNode = graph.nodeMap.get(link.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <line
                      key={index}
                      stroke="rgb(203, 213, 225)"
                      strokeWidth="2"
                      x1={fromNode.x}
                      x2={toNode.x}
                      y1={fromNode.y + 30}
                      y2={toNode.y - 30}
                    />
                  );
                })}

                {graph.nodes.map((node) => (
                  <g
                    key={node.id}
                    onMouseEnter={(event) => handleNodeHover(node, event)}
                    onMouseLeave={handleNodeLeave}
                    onMouseMove={(event) => handleNodeHover(node, event)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      fill={getNodeColor(node.type)}
                      r="30"
                    />
                    <text
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="18"
                      fontWeight="600"
                      textAnchor="middle"
                      x={node.x}
                      y={node.y}
                    >
                      {graph.labelMap.get(node.address)}
                    </text>
                  </g>
                ))}
              </svg>

              {tooltip ? (
                <div
                  className="pointer-events-none absolute z-50 max-w-xs rounded-xl border border-neutral-200 bg-white/95 p-4 text-xs shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90"
                  style={tooltip.position}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {nodeRoleMap[tooltip.node.type].title}
                    </span>
                    <span className="rounded-full bg-neutral-900/5 px-2 py-0.5 font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-200">
                      {graph.labelMap.get(tooltip.node.address)}
                    </span>
                  </div>
                  <p className="mt-3 text-neutral-600 dark:text-neutral-300">
                    {nodeRoleMap[tooltip.node.type].description}
                  </p>
                  <div className="mt-3 space-y-1 text-neutral-500 dark:text-neutral-400">
                    <p>
                      Wallet:{" "}
                      <span className="font-medium text-neutral-700 dark:text-neutral-200">
                        {tooltip.node.address}
                      </span>
                    </p>
                    <p>
                      Stewarded Secret:{" "}
                      <span className="font-medium text-neutral-700 dark:text-neutral-200">
                        {tooltip.node.title}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 hidden items-center justify-center gap-6 md:flex">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "rgb(96, 165, 250)" }}
                  />
                  <span className="text-sm">Root (Originator)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "rgb(167, 139, 250)" }}
                  />
                  <span className="text-sm">Intermediate (Re-inherited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: "rgb(52, 211, 153)" }}
                  />
                  <span className="text-sm">Leaf (Final recipient)</span>
                </div>
              </div>
            </div>

            {/* Mobile legend below the tree, centered */}
            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-3 md:hidden">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "rgb(96, 165, 250)" }}
                />
                <span className="text-xs">Root (Originator)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "rgb(167, 139, 250)" }}
                />
                <span className="text-xs">Intermediate (Re-inherited)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "rgb(52, 211, 153)" }}
                />
                <span className="text-xs">Leaf (Final recipient)</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{graph.totalNodes}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Max Depth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{graph.maxDepth + 1}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Chains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{graph.numChains}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{graph.totalLinks}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
