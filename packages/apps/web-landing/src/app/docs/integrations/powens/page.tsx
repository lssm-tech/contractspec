import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Powens Open Banking: ContractSpec Docs',
  description:
    'Synchronise bank accounts, transactions, and balances with Powens in read-only mode for the Pocket Family Office vertical.',
};

export default function PowensIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Powens Open Banking</h1>
        <p className="text-muted-foreground">
          Powens provides read-only open banking connectivity for ContractSpec
          applications. The reference integration powers Pocket Family Office by
          synchronising household bank accounts, transactions, and balances
          while keeping all raw PII protected.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <p className="text-muted-foreground">
          Create a Powens BYOK project, then store the credentials in your
          secret manager. The ContractSpec integration expects the following
          fields:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`{
  "clientId": "powens-client-id",
  "clientSecret": "powens-client-secret",
  "apiKey": "optional-api-key",
  "webhookSecret": "optional-webhook-secret"
}`}</pre>
        </div>
        <p className="text-muted-foreground text-sm">
          Configure non-secret settings on the integration connection:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`environment: sandbox | production
baseUrl?: https://api-sandbox.powens.com/v2
region?: eu-west-1
pollingIntervalMs?: 300000`}</pre>
        </div>
        <p className="text-muted-foreground text-sm">
          See the{' '}
          <a
            href="https://docs.powens.com/documentation/integration-guides/quick-start/api-overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            Powens API documentation
          </a>{' '}
          for information on generating credentials and managing BYOK projects.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Capabilities</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`capabilityId: openbanking.accounts.read
provider:
  type: openbanking.powens
  operation: listAccounts

outputs:
  accounts:
    type: BankAccountRecord[]
    description: "Canonical bank account metadata (institution, currency, balances)"

---

capabilityId: openbanking.transactions.read
provider:
  type: openbanking.powens
  operation: listTransactions

inputs:
  accountId:
    type: string
  from?:
    type: string
    description: "ISO timestamp lower bound"
  to?:
    type: string

outputs:
  transactions:
    type: BankTransactionRecord[]
    description: "Canonical transaction ledger entries"

---

capabilityId: openbanking.balances.read
provider:
  type: openbanking.powens
  operation: getBalances

inputs:
  accountId:
    type: string
  balanceTypes?:
    type: string[]

outputs:
  balances:
    type: AccountBalanceRecord[]
    description: "Current/available balances with timestamps"`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Primary workflows</h2>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Account sync</h3>
          <p className="text-muted-foreground">
            The workflow{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              pfo.workflow.sync-openbanking-accounts
            </code>{' '}
            refreshes account metadata, then surfaces canonical records to other
            automations.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Transaction sync</h3>
          <p className="text-muted-foreground">
            <code className="bg-background/50 rounded px-2 py-1">
              pfo.workflow.sync-openbanking-transactions
            </code>{' '}
            ingests incremental transactions for each linked account and stores
            them in the canonical ledger.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Balance refresh</h3>
          <p className="text-muted-foreground">
            <code className="bg-background/50 rounded px-2 py-1">
              pfo.workflow.refresh-openbanking-balances
            </code>{' '}
            retrieves current and available balances to power dashboards and
            anomaly detection.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Derived financial overview</h3>
          <p className="text-muted-foreground">
            <code className="bg-background/50 rounded px-2 py-1">
              pfo.workflow.generate-openbanking-overview
            </code>{' '}
            aggregates balances, category breakdowns, and cashflow trends into
            the <code>knowledge.financial-overview</code> space. Only derived
            summaries are exposed to LLMs.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Telemetry & guardrails</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Telemetry events such as{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              openbanking.accounts.synced
            </code>{' '}
            and{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              openbanking.transactions.synced
            </code>{' '}
            are emitted automatically with tenant, slot, and config metadata.
          </li>
          <li>
            Guard helpers ensure the{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              primaryOpenBanking
            </code>{' '}
            slot is bound and healthy before workflows execute.
          </li>
          <li>
            PII fields (IBAN, counterparty names, descriptions) are redacted via{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              redactOpenBankingTelemetryPayload
            </code>{' '}
            before logging or sending telemetry.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Use BYOK credentials per tenant to avoid cross-tenant exposure.
          </li>
          <li>
            Store only canonical entities (BankAccountRecord,
            BankTransactionRecord). Never persist raw Powens payloads or
            customer PII in logs.
          </li>
          <li>
            Run the transaction sync on a schedule appropriate for banking SLAs
            (e.g. every 15 minutes for cashflow dashboards).
          </li>
          <li>
            Pair ledger updates with derived summaries to feed the knowledge
            layer instead of exposing raw transactions to agents.
          </li>
          <li>
            Monitor telemetry for{' '}
            <code className="bg-background/50 rounded px-2 py-1">
              openbanking.*.sync_failed
            </code>{' '}
            events to detect credential issues early.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations" className="btn-ghost">
          Back to Integrations
        </Link>
        <Link href="/docs/integrations/stripe" className="btn-primary">
          Next: Stripe <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
