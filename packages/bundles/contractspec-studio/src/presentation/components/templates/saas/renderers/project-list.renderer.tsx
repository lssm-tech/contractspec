/**
 * React renderer for SaaS Project List presentation
 */
import * as React from 'react';
import type { PresentationRenderer } from '@lssm/lib.contracts';
import { SaasProjectList } from '../SaasProjectList';

export const projectListReactRenderer: PresentationRenderer<React.ReactElement> =
  {
    target: 'react',
    render: async (desc, ctx) => {
      if (desc.source.type !== 'component') {
        throw new Error('Invalid source type');
      }

      if (desc.source.componentKey !== 'SaasProjectListView') {
        throw new Error(`Unknown component: ${desc.source.componentKey}`);
      }

      return <SaasProjectList />;
    },
  };
