'use client';

import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'deprecated';
  invocations: number;
  avgLatency: string;
}

const SAMPLE_TOOLS: Tool[] = [
  {
    id: 'tool-1',
    name: 'web_search',
    description: 'Search the web for real-time information',
    category: 'Search',
    status: 'active',
    invocations: 15420,
    avgLatency: '1.2s',
  },
  {
    id: 'tool-2',
    name: 'code_interpreter',
    description: 'Execute Python code in a sandboxed environment',
    category: 'Execution',
    status: 'active',
    invocations: 8932,
    avgLatency: '3.5s',
  },
  {
    id: 'tool-3',
    name: 'file_reader',
    description: 'Read and parse file contents',
    category: 'IO',
    status: 'active',
    invocations: 12304,
    avgLatency: '0.4s',
  },
  {
    id: 'tool-4',
    name: 'database_query',
    description: 'Execute SQL queries against connected databases',
    category: 'Data',
    status: 'active',
    invocations: 5621,
    avgLatency: '0.8s',
  },
  {
    id: 'tool-5',
    name: 'image_analyzer',
    description: 'Analyze images using vision models',
    category: 'Vision',
    status: 'draft',
    invocations: 0,
    avgLatency: '-',
  },
];

export function AgentToolRegistry() {
  const [tools] = useState<Tool[]>(SAMPLE_TOOLS);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tool Registry</h3>
        <button
          type="button"
          className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
        >
          Register Tool
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Tool
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Invocations
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Avg Latency
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {tools.map((tool) => (
              <tr
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className="cursor-pointer bg-white transition hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-mono text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {tool.description}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-700">
                    {tool.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      tool.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : tool.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {tool.invocations.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {tool.avgLatency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTool && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-mono text-lg font-semibold">
                {selectedTool.name}
              </h4>
              <p className="text-zinc-500 dark:text-zinc-400">
                {selectedTool.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTool(null)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3 font-mono text-xs dark:bg-zinc-900">
            <pre>{`{
  "name": "${selectedTool.name}",
  "category": "${selectedTool.category}",
  "parameters": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    },
    "required": ["query"]
  }
}`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

