'use client';

import {
  PageHeaderResponsive,
  Button,
  StatusChip,
  CodeBlock,
  EmptyState,
  Breadcrumbs,
} from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { VStack, HStack, Box } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { FeatureOperationDetailTemplateProps } from './types';
import { Zap, Code, Database, BookOpen } from 'lucide-react';
import { useRelatedDocs } from '../../hooks/useRelatedDocs';
import Link from 'next/link';

export function FeatureOperationDetailTemplate({
  feature,
  operationKey,
  operation,
  spec,
  onBack,
  className,
}: FeatureOperationDetailTemplateProps) {
  /* Fallback if operation ref is not found passed directly, try to search in feature */
  const opRef =
    operation ?? feature.operations?.find((op) => op.key === operationKey);
  
  const relatedDocs = useRelatedDocs(opRef?.key || '', spec?.meta?.tags);

  if (!opRef) {
    return (
      <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
        <PageHeaderResponsive
          title="Operation Not Found"
          subtitle={`Operation ${operationKey} not found in feature ${feature.meta.key}`}
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: 'Features', href: '/features' },
                { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
                { label: 'Operations' },
              ]}
            />
          }
        />
        <EmptyState
          title="Operation not found"
          description={`The operation '${operationKey}' could not be found in this feature.`}
          icon={<Zap className="h-12 w-12 text-muted-foreground" />}
        />
      </VStack>
    );
  }

  return (
    <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
      <PageHeaderResponsive
        title={opRef.key}
        subtitle={`Operation defined in ${feature.meta.title ?? feature.meta.key}`}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: 'Features', href: '/features' },
              { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
              { label: 'Operations', href: `/features/${feature.meta.key}#operations` },
              { label: opRef.key },
            ]}
          />
        }
      />

      <HStack gap="sm">
        <StatusChip
          tone="neutral"
          label={opRef.key}
          size="sm"
          icon={<Zap className="h-3 w-3" />}
        />
        <StatusChip tone="neutral" label={`v${opRef.version}`} size="sm" />
        {spec?.meta?.stability ? (
          <StatusChip
            tone={spec.meta.stability === 'stable' ? 'success' : 'warning'}
            label={spec.meta.stability}
            size="sm"
          />
        ) : null}
      </HStack>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <VStack gap="md">
              <HStack className="items-center gap-2 pb-2 border-b">
                <Code className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Schema Definition</h3>
              </HStack>

              {spec ? (
                <VStack gap="lg">
                  {spec.meta.description && (
                    <p className="text-muted-foreground">{spec.meta.description}</p>
                  )}
                  
                  <Box className="flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Input Schema
                    </span>
                    <CodeBlock
                      code={JSON.stringify(spec.io.input, null, 2)}
                      language="json"
                    />
                  </Box>

                  <Box className="flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Output Schema
                    </span>
                    <CodeBlock
                      code={JSON.stringify(spec.io.output, null, 2)}
                      language="json"
                    />
                  </Box>
                </VStack>
              ) : (
                <VStack gap="md">
                   <p className="text-muted-foreground">
                    Full schema details are not available for this operation reference.
                  </p>
                  <CodeBlock
                    code={JSON.stringify(opRef, null, 2)}
                    language="json"
                  />
                </VStack>
              )}
            </VStack>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <VStack gap="md">
              <HStack className="items-center gap-2 pb-2 border-b">
                <Database className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Metadata</h3>
              </HStack>
              
              <dl className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Key</dt>
                  <dd className="font-medium truncate">{opRef.key}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="font-medium">{opRef.version}</dd>
                </div>
                {spec?.meta?.context && (
                   <div>
                   <dt className="text-muted-foreground">Context</dt>
                   <dd className="font-medium">{spec.meta.context}</dd>
                 </div>
                )}
                {spec?.meta?.owners && (
                   <div>
                   <dt className="text-muted-foreground">Owners</dt>
                   <dd className="font-medium flex flex-wrap gap-1">
                      {spec.meta.owners.map((o: string) => <StatusChip key={o} label={o} size="sm" tone="neutral" />)}
                   </dd>
                 </div>
                )}
                 {spec?.meta?.tags && (
                   <div>
                   <dt className="text-muted-foreground">Tags</dt>
                   <dd className="font-medium flex flex-wrap gap-1">
                      {spec.meta.tags.map((t: string) => <StatusChip key={t} label={`#${t}`} size="sm" tone="neutral" />)}
                   </dd>
                 </div>
                )}
              </dl>
            </VStack>
          </Card>
        </div>
        
        {/* Related Docs */}
        {relatedDocs?.length ? (
            <div className="lg:col-span-3">
               <Card className="p-6">
                <VStack gap="md">
                  <HStack className="items-center gap-2 pb-2 border-b">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">Related Documentation</h3>
                  </HStack>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedDocs.map(doc => (
                       <Link key={doc.id} href={doc.route || `/docs/${doc.id}`} className="block group">
                         <div className="border rounded-lg p-4 hover:border-primary transition-colors h-full">
                           <h4 className="font-semibold group-hover:text-primary mb-1">{doc.title}</h4>
                           {doc.summary && <p className="text-sm text-muted-foreground line-clamp-2">{doc.summary}</p>}
                         </div>
                       </Link>
                    ))}
                  </div>
                </VStack>
               </Card>
            </div>
        ) : null}
      </div>
    </VStack>
  );
}
