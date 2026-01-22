'use client';

import { useRouter } from 'next/navigation';
import {
  FeatureDiscovery,
  FeatureOperationDetailTemplate,
  FeatureEventDetailTemplate,
  FeaturePresentationDetailTemplate,
  FeatureDataViewDetailTemplate,
  FeatureFormDetailTemplate,
} from '@contractspec/bundle.library/presentation/features';

export function FeatureDiscoveryClient() {
  const router = useRouter();

  return (
    <FeatureDiscovery
      onSelectFeature={(feature) =>
        router.push(`/features/${feature.meta.key}`)
      }
    />
  );
}

export function FeatureOperationDetailClient({
  feature,
  operationKey,
  operation,
  spec,
}: {
  feature: any;
  operationKey: string;
  operation?: any;
  spec?: any;
}) {
  const router = useRouter();
  return (
    <FeatureOperationDetailTemplate
      feature={feature}
      operationKey={operationKey}
      operation={operation}
      spec={spec}
      onBack={() => router.back()}
    />
  );
}

export function FeatureEventDetailClient({
  feature,
  eventKey,
  event,
  spec,
}: {
  feature: any;
  eventKey: string;
  event?: any;
  spec?: any;
}) {
  const router = useRouter();
  return (
    <FeatureEventDetailTemplate
      feature={feature}
      eventKey={eventKey}
      event={event}
      spec={spec}
      onBack={() => router.back()}
    />
  );
}

export function FeaturePresentationDetailClient({
  feature,
  presentationKey,
  presentation,
  spec,
}: {
  feature: any;
  presentationKey: string;
  presentation?: any;
  spec?: any;
}) {
  const router = useRouter();
  return (
    <FeaturePresentationDetailTemplate
      feature={feature}
      presentationKey={presentationKey}
      presentation={presentation}
      spec={spec}
      onBack={() => router.back()}
    />
  );
}

export function FeatureDataViewDetailClient({
  feature,
  viewKey,
  view,
  spec,
}: {
  feature: any;
  viewKey: string;
  view?: any;
  spec?: any;
}) {
  const router = useRouter();

  return (
    <FeatureDataViewDetailTemplate
      feature={feature}
      viewKey={viewKey}
      view={view}
      spec={spec}
      onBack={() => router.back()}
    />
  );
}

export function FeatureFormDetailClient({
  feature,
  formKey,
  form,
  spec,
}: {
  feature: any;
  formKey: string;
  form?: any;
  spec?: any;
}) {
  const router = useRouter();

  return (
    <FeatureFormDetailTemplate
      feature={feature}
      formKey={formKey}
      form={form}
      spec={spec}
      onBack={() => router.back()}
    />
  );
}
