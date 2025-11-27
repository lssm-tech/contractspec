'use client';

import * as React from 'react';
import type { ApprovalRequest } from '@lssm/lib.ai-agent/approval';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@lssm/lib.ui-kit-web/ui/table';
import { Card, CardHeader, CardContent } from '@lssm/lib.ui-kit-web/ui/card';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import { Button } from '@lssm/lib.ui-kit-web/ui/button';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

export interface ApprovalQueueProps {
  title?: string;
  description?: string;
  requests: ApprovalRequest[];
  onApprove?: (request: ApprovalRequest) => void;
  onReject?: (request: ApprovalRequest) => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function ApprovalQueue({
  title = 'Approvals',
  description = 'Requests escalated by AI agents',
  requests,
  onApprove,
  onReject,
  className,
  emptyState = (
    <p className="text-muted-foreground">Nothing waiting for review.</p>
  ),
}: ApprovalQueueProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          emptyState
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.agent}</TableCell>
                  <TableCell className="max-w-sm truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>{request.tenantId ?? '—'}</TableCell>
                  <TableCell>{formatRelative(request.requestedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={request.status !== 'pending'}
                        onClick={() => onReject?.(request)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        disabled={request.status !== 'pending'}
                        onClick={() => onApprove?.(request)}
                      >
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function badgeVariant(
  status: ApprovalRequest['status']
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function formatRelative(date: Date) {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const deltaMinutes = Math.round(
    (Date.now() - new Date(date).getTime()) / 60000
  );
  if (Math.abs(deltaMinutes) < 60) {
    return formatter.format(-deltaMinutes, 'minute');
  }
  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) {
    return formatter.format(-deltaHours, 'hour');
  }
  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(-deltaDays, 'day');
}
