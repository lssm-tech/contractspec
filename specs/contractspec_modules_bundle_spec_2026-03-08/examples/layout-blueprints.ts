export const issueLayouts = [
  {
    layoutId: "minimal-summary",
    title: "Minimal Summary",
    when: (ctx) => ctx.preferences.density === "minimal",
    root: {
      type: "stack",
      direction: "vertical",
      gap: "md",
      children: [
        { type: "slot", slotId: "primary" },
        { type: "slot", slotId: "assistant" },
      ],
    },
  },
  {
    layoutId: "balanced-three-pane",
    title: "Balanced 3-pane",
    when: (ctx) => ctx.device === "desktop",
    root: {
      type: "panel-group",
      direction: "horizontal",
      persistKey: "pm.issue.balanced-three-pane",
      children: [
        { type: "slot", slotId: "primary" },
        {
          type: "panel-group",
          direction: "vertical",
          persistKey: "pm.issue.right-stack",
          children: [
            { type: "slot", slotId: "secondary" },
            { type: "slot", slotId: "assistant" }
          ]
        },
        { type: "slot", slotId: "inspector" }
      ]
    }
  }
];
