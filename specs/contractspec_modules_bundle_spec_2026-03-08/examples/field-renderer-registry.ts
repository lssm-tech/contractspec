export const issueFieldRegistry = {
  text: {
    fieldKind: "text",
    viewer: "TextFieldViewer",
    editor: "TextFieldEditor",
    summaryViewer: "CompactTextSummary",
    tableCell: "TextCell",
  },
  relation: {
    fieldKind: "relation",
    viewer: "RelationFieldViewer",
    editor: "RelationFieldEditor",
    summaryViewer: "RelationChipList",
    tableCell: "RelationCountCell",
    filters: ["contains", "not_contains", "is_empty"],
  },
  rollup: {
    fieldKind: "rollup",
    viewer: "RollupFieldViewer",
    summaryViewer: "MetricChip",
    tableCell: "MetricCell",
  },
  formula: {
    fieldKind: "formula",
    viewer: "FormulaFieldViewer",
    summaryViewer: "FormulaInline",
    tableCell: "FormulaCell",
  },
  people: {
    fieldKind: "people",
    viewer: "PeopleFieldViewer",
    editor: "PeopleFieldEditor",
    summaryViewer: "AvatarStack",
    tableCell: "PeopleCell",
  },
};
