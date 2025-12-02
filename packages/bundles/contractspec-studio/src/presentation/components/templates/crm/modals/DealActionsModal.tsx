'use client';

/**
 * DealActionsModal - Actions for a specific deal (Win, Lose, Move)
 *
 * Wires to WinDealContract, LoseDealContract, MoveDealContract
 * via useDealMutations hook.
 */
import { useState } from 'react';
import { Button, Input } from '@lssm/lib.design-system';

// Local type definitions for modal props
export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  stageId: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'STALE';
}

export interface WinDealInput {
  dealId: string;
  wonSource?: string;
  notes?: string;
}

export interface LoseDealInput {
  dealId: string;
  lostReason: string;
  notes?: string;
}

export interface MoveDealInput {
  dealId: string;
  stageId: string;
}

type ActionMode = 'menu' | 'win' | 'lose' | 'move';

interface DealActionsModalProps {
  isOpen: boolean;
  deal: Deal | null;
  stages: { id: string; name: string }[];
  onClose: () => void;
  onWin: (input: WinDealInput) => Promise<void>;
  onLose: (input: LoseDealInput) => Promise<void>;
  onMove: (input: MoveDealInput) => Promise<void>;
  isLoading?: boolean;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function DealActionsModal({
  isOpen,
  deal,
  stages,
  onClose,
  onWin,
  onLose,
  onMove,
  isLoading = false,
}: DealActionsModalProps) {
  const [mode, setMode] = useState<ActionMode>('menu');
  const [wonSource, setWonSource] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMode('menu');
    setWonSource('');
    setLostReason('');
    setNotes('');
    setSelectedStageId('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleWin = async () => {
    if (!deal) return;
    setError(null);

    try {
      await onWin({
        dealId: deal.id,
        wonSource: wonSource.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to mark deal as won'
      );
    }
  };

  const handleLose = async () => {
    if (!deal) return;
    setError(null);

    if (!lostReason.trim()) {
      setError('Please provide a reason for losing the deal');
      return;
    }

    try {
      await onLose({
        dealId: deal.id,
        lostReason: lostReason.trim(),
        notes: notes.trim() || undefined,
      });
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to mark deal as lost'
      );
    }
  };

  const handleMove = async () => {
    if (!deal) return;
    setError(null);

    if (!selectedStageId) {
      setError('Please select a stage');
      return;
    }

    if (selectedStageId === deal.stageId) {
      setError('Deal is already in this stage');
      return;
    }

    try {
      await onMove({
        dealId: deal.id,
        stageId: selectedStageId,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move deal');
    }
  };

  if (!isOpen || !deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl">
        {/* Deal Header */}
        <div className="border-border mb-4 border-b pb-4">
          <h2 className="text-xl font-semibold">{deal.name}</h2>
          <p className="text-primary text-lg font-medium">
            {formatCurrency(deal.value, deal.currency)}
          </p>
          <span
            className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              deal.status === 'WON'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : deal.status === 'LOST'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {deal.status}
          </span>
        </div>

        {/* Main Menu */}
        {mode === 'menu' && (
          <div className="space-y-3">
            {deal.status === 'OPEN' && (
              <>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onPress={() => setMode('win')}
                >
                  <span className="mr-2">🏆</span> Mark as Won
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onPress={() => setMode('lose')}
                >
                  <span className="mr-2">❌</span> Mark as Lost
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  onPress={() => {
                    setSelectedStageId(deal.stageId);
                    setMode('move');
                  }}
                >
                  <span className="mr-2">➡️</span> Move to Stage
                </Button>
              </>
            )}
            {deal.status !== 'OPEN' && (
              <p className="text-muted-foreground py-4 text-center">
                This deal is already {deal.status.toLowerCase()}. No actions
                available.
              </p>
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

        {/* Win Form */}
        {mode === 'win' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="won-source"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                How did you win this deal?
              </label>
              <select
                id="won-source"
                value={wonSource}
                onChange={(e) => setWonSource(e.target.value)}
                className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="">Select a source...</option>
                <option value="referral">Referral</option>
                <option value="cold_outreach">Cold Outreach</option>
                <option value="inbound">Inbound Lead</option>
                <option value="upsell">Upsell</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="win-notes"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Notes (optional)
              </label>
              <textarea
                id="win-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about the win..."
                rows={3}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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
              <Button onPress={handleWin} disabled={isLoading}>
                {isLoading ? 'Processing...' : '🏆 Confirm Win'}
              </Button>
            </div>
          </div>
        )}

        {/* Lose Form */}
        {mode === 'lose' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="lost-reason"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Why was this deal lost? *
              </label>
              <select
                id="lost-reason"
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="price">Price too high</option>
                <option value="competitor">Lost to competitor</option>
                <option value="no_budget">No budget</option>
                <option value="no_decision">No decision made</option>
                <option value="timing">Bad timing</option>
                <option value="product_fit">Product not a fit</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="lose-notes"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Notes (optional)
              </label>
              <textarea
                id="lose-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
                rows={3}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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
              <Button
                variant="destructive"
                onPress={handleLose}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : '❌ Confirm Loss'}
              </Button>
            </div>
          </div>
        )}

        {/* Move Form */}
        {mode === 'move' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="move-stage"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Move to Stage
              </label>
              <select
                id="move-stage"
                value={selectedStageId}
                onChange={(e) => setSelectedStageId(e.target.value)}
                className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                    {stage.id === deal.stageId ? ' (current)' : ''}
                  </option>
                ))}
              </select>
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
              <Button onPress={handleMove} disabled={isLoading}>
                {isLoading ? 'Moving...' : '➡️ Move Deal'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
