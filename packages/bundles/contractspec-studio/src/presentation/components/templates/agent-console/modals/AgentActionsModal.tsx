'use client';

/**
 * AgentActionsModal - Actions for a specific agent
 *
 * Wires to UpdateAgentCommand via useAgentMutations hook.
 */
import { useState } from 'react';
import { Button } from '@lssm/lib.design-system';
import type { Agent } from '../hooks/useAgentList';

type ActionMode = 'menu' | 'execute' | 'confirm';

interface AgentActionsModalProps {
  isOpen: boolean;
  agent: Agent | null;
  onClose: () => void;
  onActivate: (agentId: string) => Promise<void>;
  onPause: (agentId: string) => Promise<void>;
  onArchive: (agentId: string) => Promise<void>;
  onExecute: (agentId: string, message: string) => Promise<void>;
  isLoading?: boolean;
}

function getStatusColor(status: Agent['status']): string {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'DRAFT':
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    case 'PAUSED':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    case 'ARCHIVED':
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function AgentActionsModal({
  isOpen,
  agent,
  onClose,
  onActivate,
  onPause,
  onArchive,
  onExecute,
  isLoading = false,
}: AgentActionsModalProps) {
  const [mode, setMode] = useState<ActionMode>('menu');
  const [message, setMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<'archive' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMode('menu');
    setMessage('');
    setConfirmAction(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleExecute = async () => {
    if (!agent) return;
    setError(null);

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      await onExecute(agent.id, message.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute agent');
    }
  };

  const handleStatusChange = async (action: 'activate' | 'pause' | 'archive') => {
    if (!agent) return;
    setError(null);

    try {
      switch (action) {
        case 'activate':
          await onActivate(agent.id);
          break;
        case 'pause':
          await onPause(agent.id);
          break;
        case 'archive':
          await onArchive(agent.id);
          break;
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} agent`);
    }
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl">
        {/* Agent Header */}
        <div className="border-border mb-4 border-b pb-4">
          <h2 className="text-xl font-semibold">{agent.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {agent.modelProvider} / {agent.modelName}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(agent.status)}`}>
              {agent.status}
            </span>
          </div>
          {agent.description && (
            <p className="text-muted-foreground mt-2 text-sm">{agent.description}</p>
          )}
        </div>

        {/* Main Menu */}
        {mode === 'menu' && (
          <div className="space-y-3">
            {/* Execute - Only for active agents */}
            {agent.status === 'ACTIVE' && (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={() => setMode('execute')}
              >
                <span className="mr-2">▶️</span> Execute Agent
              </Button>
            )}

            {/* Status Changes */}
            {(agent.status === 'DRAFT' || agent.status === 'PAUSED') && (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={() => handleStatusChange('activate')}
                disabled={isLoading}
              >
                <span className="mr-2">🟢</span> Activate Agent
              </Button>
            )}

            {agent.status === 'ACTIVE' && (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={() => handleStatusChange('pause')}
                disabled={isLoading}
              >
                <span className="mr-2">⏸️</span> Pause Agent
              </Button>
            )}

            {agent.status !== 'ARCHIVED' && (
              <Button
                className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                variant="ghost"
                onPress={() => {
                  setConfirmAction('archive');
                  setMode('confirm');
                }}
              >
                <span className="mr-2">📦</span> Archive Agent
              </Button>
            )}

            {agent.status === 'ARCHIVED' && (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={() => handleStatusChange('activate')}
                disabled={isLoading}
              >
                <span className="mr-2">🔄</span> Restore Agent
              </Button>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="border-border border-t pt-3">
              <Button
                className="w-full"
                variant="outline"
                onPress={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Execute Form */}
        {mode === 'execute' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="execute-message"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Message *
              </label>
              <textarea
                id="execute-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message to the agent..."
                rows={4}
                disabled={isLoading}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onPress={() => setMode('menu')}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onPress={handleExecute} disabled={isLoading}>
                {isLoading ? 'Executing...' : '▶️ Execute'}
              </Button>
            </div>
          </div>
        )}

        {/* Confirm Action */}
        {mode === 'confirm' && confirmAction === 'archive' && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to archive{' '}
              <span className="text-foreground font-medium">{agent.name}</span>?
            </p>
            <p className="text-muted-foreground text-sm">
              Archived agents cannot be executed but can be restored later.
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onPress={() => setMode('menu')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onPress={() => handleStatusChange('archive')}
                disabled={isLoading}
              >
                {isLoading ? 'Archiving...' : '📦 Archive'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

