/**
 * React renderer for SaaS Project List presentation
 */
import * as React from 'react';
import type { PresentationRenderer } from '@contractspec/lib.contracts/presentations/transform-engine';
import { SaasProjectList } from '../SaasProjectList';

export const projectListReactRenderer: PresentationRenderer<React.ReactElement> =
  {
    target: 'react',
    render: async (desc, _ctx) => {
      if (desc.source.type !== 'component') {
        throw new Error('Invalid source type');
      }

      if (desc.source.componentKey !== 'SaasProjectListView') {
        throw new Error(`Unknown component: ${desc.source.componentKey}`);
      }

      return <SaasProjectList />;
    },
  };
