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
import type { FeatureEventDetailTemplateProps } from './types';
import { Radio, Code, Database, BookOpen } from 'lucide-react';
import { useRelatedDocs } from '../../hooks/useRelatedDocs';
import Link from 'next/link';

export function FeatureEventDetailTemplate({
  feature,
  eventKey,
  event,
  spec,
  onBack,
  className,
}: FeatureEventDetailTemplateProps) {
  const eventRef =
    event ?? feature.events?.find((ev) => ev.key === eventKey);

  const relatedDocs = useRelatedDocs(eventRef?.key || '', spec?.meta?.tags);

  if (!eventRef) {
    return (
      <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
        <PageHeaderResponsive
          title="Event Not Found"
          subtitle={`Event ${eventKey} not found in feature ${feature.meta.key}`}
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: 'Features', href: '/features' },
                { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
                { label: 'Events' },
              ]}
            />
          }
        />
        <EmptyState
          title="Event not found"
          description={`The event '${eventKey}' could not be found in this feature.`}
          icon={<Radio className="h-12 w-12 text-muted-foreground" />}
        />
      </VStack>
    );
  }

  return (
    <VStack gap="lg" className={cn('w-full max-w-5xl mx-auto p-6', className)}>
      <PageHeaderResponsive
        title={eventRef.key}
        subtitle={`Event defined in ${feature.meta.title ?? feature.meta.key}`}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: 'Features', href: '/features' },
              { label: feature.meta.title || feature.meta.key, href: `/features/${feature.meta.key}` },
              { label: 'Events', href: `/features/${feature.meta.key}#events` },
              { label: eventRef.key },
            ]}
          />
        }
      />

      <HStack gap="sm">
        <StatusChip
          tone="neutral"
          label={eventRef.key}
          size="sm"
          icon={<Radio className="h-3 w-3" />}
        />
        <StatusChip tone="neutral" label={`v${eventRef.version}`} size="sm" />
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
                <h3 className="font-semibold text-lg">Payload Definition</h3>
              </HStack>

              {spec ? (
                <VStack gap="lg">
                  {spec.meta.description && (
                    <p className="text-muted-foreground">{spec.meta.description}</p>
                  )}
                  
                  <Box className="flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Payload Schema
                    </span>
                    <CodeBlock
                      code={JSON.stringify(spec.payload, null, 2)}
                      language="json"
                    />
                  </Box>
                </VStack>
              ) : (
                <VStack gap="md">
                   <p className="text-muted-foreground">
                    Full payload details are not available for this event reference.
                  </p>
                  <CodeBlock
                    code={JSON.stringify(eventRef, null, 2)}
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
                  <dd className="font-medium truncate">{eventRef.key}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="font-medium">{eventRef.version}</dd>
                </div>
                 {spec?.meta?.owners && (
                   <div>
                   <dt className="text-muted-foreground">Owners</dt>
                   <dd className="font-medium flex flex-wrap gap-1">
                      {spec.meta.owners.map((o: string) => <StatusChip key={o} label={o} size="sm" tone="neutral" />)}
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
