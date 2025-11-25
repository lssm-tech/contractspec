import * as React from 'react';
import { AlertCircle, FileText, RefreshCw } from 'lucide-react';

export interface SpecPreviewArtifacts {
  validation?: string[];
  schema?: string;
  graphql?: string;
  rest?: { method: string; path: string; description?: string }[];
  components?: { name: string; description?: string }[];
}

export interface SpecPreviewProps {
  projectId: string;
  type: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  artifacts?: SpecPreviewArtifacts;
  validationErrors?: string[];
}

const FALLBACK_ARTIFACTS: SpecPreviewArtifacts = {
  validation: ['No preview generated yet. Run preview to update artifacts.'],
  schema: '/* preview pending */',
};

type TabKey = 'validation' | 'artifacts';

export function SpecPreview({
  type,
  artifacts,
  validationErrors,
}: SpecPreviewProps) {
  const data = artifacts ?? FALLBACK_ARTIFACTS;
  const [tab, setTab] = React.useState<TabKey>(
    validationErrors?.length ? 'validation' : 'artifacts'
  );

  const validationMessages = validationErrors?.length
    ? validationErrors
    : data.validation;

  return (
    <div className="border-border bg-muted/20 rounded-xl border p-3">
      <TabsHeader tab={tab} onChange={setTab} />
      {tab === 'validation' ? (
        <ValidationList messages={validationMessages} />
      ) : (
        <ArtifactsPanel type={type} artifacts={data} />
      )}
    </div>
  );
}

function TabsHeader({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (next: TabKey) => void;
}) {
  return (
    <div className="border-border bg-card mb-2 grid grid-cols-2 divide-x overflow-hidden rounded-lg border text-sm font-semibold">
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 px-3 py-2 ${
          tab === 'validation'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:bg-muted/20'
        }`}
        onClick={() => onChange('validation')}
      >
        <AlertCircle className="h-4 w-4" />
        Validation
      </button>
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 px-3 py-2 ${
          tab === 'artifacts'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:bg-muted/20'
        }`}
        onClick={() => onChange('artifacts')}
      >
        <FileText className="h-4 w-4" />
        Artifacts
      </button>
    </div>
  );
}

function ValidationList({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return (
      <p className="text-muted-foreground mt-3 text-xs">
        No validation issues detected.
      </p>
    );
  }
  return (
    <ul className="mt-3 space-y-2 text-xs">
      {messages.map((message, index) => (
        <li
          key={`${message}-${index}`}
          className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg p-2"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {message}
        </li>
      ))}
    </ul>
  );
}

function ArtifactsPanel({
  type,
  artifacts,
}: {
  type: SpecPreviewProps['type'];
  artifacts: SpecPreviewArtifacts;
}) {
  if (!artifacts) {
    return (
      <EmptyState
      >
        Run preview to generate artifacts for this spec.
      </EmptyState>
    );
  }

  switch (type) {
    case 'CAPABILITY':
    case 'POLICY':
      return <SchemaPreview schema={artifacts.schema} />;
    case 'WORKFLOW':
      return <GraphPreview graph={artifacts.graphql} />;
    case 'DATAVIEW':
      return <RestPreview endpoints={artifacts.rest} />;
    case 'COMPONENT':
      return <ComponentPreview components={artifacts.components} />;
    default:
      return <EmptyState>No artifacts available for this spec yet.</EmptyState>;
  }
}

function SchemaPreview({ schema }: { schema?: string }) {
  if (!schema) {
    return (
      <EmptyState>
        Schema will appear here after running preview.
      </EmptyState>
    );
  }
  return (
    <pre className="bg-card mt-3 max-h-60 overflow-auto rounded-lg p-3 text-xs">
      {schema}
    </pre>
  );
}

function GraphPreview({ graph }: { graph?: string }) {
  if (!graph) {
    return <EmptyState>Workflow graph preview unavailable.</EmptyState>;
  }
  return (
    <pre className="bg-card mt-3 max-h-60 overflow-auto rounded-lg p-3 text-xs">
      {graph}
    </pre>
  );
}

function RestPreview({
  endpoints,
}: {
  endpoints?: SpecPreviewArtifacts['rest'];
}) {
  if (!endpoints?.length) {
    return <EmptyState>No REST endpoints generated yet.</EmptyState>;
  }
  return (
    <div className="mt-3 space-y-2">
      {endpoints.map((endpoint) => (
        <div
          key={`${endpoint.method}-${endpoint.path}`}
          className="bg-card rounded-lg p-3 text-xs"
        >
          <p className="font-mono text-foreground">
            {endpoint.method} {endpoint.path}
          </p>
          {endpoint.description ? (
            <p className="text-muted-foreground mt-1">
              {endpoint.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ComponentPreview({
  components,
}: {
  components?: SpecPreviewArtifacts['components'];
}) {
  if (!components?.length) {
    return (
      <EmptyState>
        Run preview to hydrate component artifacts.
      </EmptyState>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      {components.map((component) => (
        <div key={component.name} className="bg-card rounded-lg p-3 text-xs">
          <p className="font-semibold">{component.name}</p>
          {component.description ? (
            <p className="text-muted-foreground">{component.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground bg-muted/30 mt-3 flex flex-col items-center gap-2 rounded-lg p-4 text-center text-xs">
      <RefreshCw className="h-4 w-4" />
      {children}
    </div>
  );
}

