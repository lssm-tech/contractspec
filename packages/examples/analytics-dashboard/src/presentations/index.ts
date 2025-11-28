/**
 * Analytics Dashboard Presentation Descriptors
 * 
 * These presentation descriptors define how analytics dashboards
 * and widgets should be rendered across different surfaces.
 */

// ============ Dashboard List Presentation ============

export const DashboardListPresentation = {
  name: 'analytics.dashboards.list',
  type: 'list' as const,
  description: 'Dashboard listing page with search and filters',
  
  layout: {
    header: {
      title: 'Analytics Dashboards',
      actions: ['create_dashboard'],
    },
    filters: ['status', 'search'],
    list: {
      itemType: 'dashboard_card',
      pagination: true,
      itemsPerPage: 20,
    },
  },

  dataSource: {
    query: 'analytics.dashboard.list',
    defaultParams: {
      status: undefined,
      limit: 20,
      offset: 0,
    },
  },

  actions: {
    create_dashboard: {
      label: 'New Dashboard',
      icon: 'plus',
      command: 'analytics.dashboard.create',
    },
  },
};

// ============ Dashboard View Presentation ============

export const DashboardViewPresentation = {
  name: 'analytics.dashboard.view',
  type: 'dashboard' as const,
  description: 'Dashboard viewing/editing interface',

  layout: {
    header: {
      title: '{{dashboard.name}}',
      breadcrumbs: ['Dashboards', '{{dashboard.name}}'],
      actions: ['edit', 'share', 'refresh', 'export'],
    },
    toolbar: {
      dateRangePicker: true,
      filters: true,
      refreshInterval: true,
    },
    grid: {
      type: 'responsive',
      columns: 12,
      rowHeight: 100,
      margin: 16,
    },
    widgets: {
      dragEnabled: '{{isEditing}}',
      resizeEnabled: '{{isEditing}}',
    },
  },

  dataSource: {
    query: 'analytics.dashboard.get',
    params: {
      dashboardId: '{{params.dashboardId}}',
      slug: '{{params.slug}}',
    },
  },

  actions: {
    edit: {
      label: 'Edit',
      icon: 'edit',
      toggleState: 'isEditing',
      requiresPermission: 'dashboard:edit',
    },
    share: {
      label: 'Share',
      icon: 'share',
      openModal: 'share_dashboard',
    },
    refresh: {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refreshAllWidgets',
    },
    export: {
      label: 'Export',
      icon: 'download',
      openMenu: ['export_pdf', 'export_png', 'export_csv'],
    },
  },
};

// ============ Dashboard Editor Presentation ============

export const DashboardEditorPresentation = {
  name: 'analytics.dashboard.editor',
  type: 'editor' as const,
  description: 'Dashboard editing interface with widget palette',

  layout: {
    header: {
      title: 'Edit: {{dashboard.name}}',
      actions: ['save', 'preview', 'discard'],
    },
    sidebar: {
      widgetPalette: true,
      queryBuilder: true,
      settings: true,
    },
    main: {
      type: 'grid_editor',
      columns: 12,
      rowHeight: 100,
      snapToGrid: true,
    },
    footer: {
      statusBar: true,
      lastSaved: true,
    },
  },

  widgetPalette: {
    categories: [
      {
        name: 'Charts',
        widgets: ['line_chart', 'bar_chart', 'pie_chart', 'area_chart', 'scatter_plot'],
      },
      {
        name: 'Data',
        widgets: ['metric', 'table', 'funnel'],
      },
      {
        name: 'Visualization',
        widgets: ['heatmap', 'map', 'text', 'embed'],
      },
    ],
  },

  actions: {
    save: {
      label: 'Save',
      icon: 'save',
      command: 'analytics.dashboard.update',
      primary: true,
    },
    preview: {
      label: 'Preview',
      icon: 'eye',
      toggleState: 'previewMode',
    },
    discard: {
      label: 'Discard Changes',
      icon: 'x',
      confirmMessage: 'Discard unsaved changes?',
      action: 'discardChanges',
    },
  },
};

// ============ Widget Configuration Presentation ============

export const WidgetConfigurationPresentation = {
  name: 'analytics.widget.configure',
  type: 'modal' as const,
  description: 'Widget configuration panel',

  layout: {
    tabs: ['data', 'visualization', 'formatting'],
  },

  tabs: {
    data: {
      label: 'Data',
      sections: [
        {
          name: 'Query',
          fields: ['queryId', 'createNewQuery'],
        },
        {
          name: 'Filters',
          fields: ['inheritDashboardFilters', 'additionalFilters'],
        },
      ],
    },
    visualization: {
      label: 'Visualization',
      sections: [
        {
          name: 'Chart Type',
          fields: ['chartType', 'chartVariant'],
        },
        {
          name: 'Axes',
          fields: ['xAxis', 'yAxis', 'secondaryYAxis'],
        },
        {
          name: 'Legend',
          fields: ['showLegend', 'legendPosition'],
        },
      ],
    },
    formatting: {
      label: 'Formatting',
      sections: [
        {
          name: 'Title',
          fields: ['title', 'subtitle', 'titleAlignment'],
        },
        {
          name: 'Colors',
          fields: ['colorScheme', 'customColors'],
        },
        {
          name: 'Numbers',
          fields: ['numberFormat', 'decimals', 'prefix', 'suffix'],
        },
      ],
    },
  },
};

// ============ Query Builder Presentation ============

export const QueryBuilderPresentation = {
  name: 'analytics.query.builder',
  type: 'builder' as const,
  description: 'Visual query builder interface',

  layout: {
    header: {
      title: 'Query Builder',
      actions: ['run', 'save', 'clear'],
    },
    main: {
      queryTypeSelector: true,
      builderArea: true,
      preview: true,
    },
    footer: {
      executionStats: true,
    },
  },

  queryTypes: {
    metric: {
      label: 'Metric Query',
      icon: 'hash',
      description: 'Query usage metrics',
    },
    aggregation: {
      label: 'Aggregation',
      icon: 'layers',
      description: 'Aggregate data with measures and dimensions',
    },
    sql: {
      label: 'SQL',
      icon: 'code',
      description: 'Write custom SQL query',
    },
  },

  builderComponents: {
    metricSelector: {
      type: 'multi_select',
      source: 'metering.metrics.list',
    },
    measureBuilder: {
      type: 'field_list',
      fields: ['name', 'field', 'aggregation', 'format'],
    },
    dimensionBuilder: {
      type: 'field_list',
      fields: ['name', 'field', 'type', 'granularity'],
    },
    filterBuilder: {
      type: 'condition_builder',
      operators: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains', 'between'],
    },
    sqlEditor: {
      type: 'code_editor',
      language: 'sql',
      autoComplete: true,
      formatOnSave: true,
    },
  },
};

// ============ All Presentations ============

export const AnalyticsDashboardPresentations = {
  DashboardListPresentation,
  DashboardViewPresentation,
  DashboardEditorPresentation,
  WidgetConfigurationPresentation,
  QueryBuilderPresentation,
};

