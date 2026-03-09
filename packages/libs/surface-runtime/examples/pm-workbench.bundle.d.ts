/**
 * Example PM workbench bundle. Demonstrates defineModuleBundle usage.
 * Typechecks against @contractspec/lib.surface-runtime public API.
 */
export declare const PmWorkbenchBundle: {
    readonly meta: {
        readonly key: "pm.workbench";
        readonly version: "0.1.0";
        readonly title: "PM Workbench";
        readonly description: "AI-native PM workbench for relation-rich issues and saved views";
        readonly owners: ["team-pm-platform"];
        readonly tags: ["pm", "issues", "workbench", "ai-native"];
        readonly stability: "experimental";
    };
    readonly routes: [{
        readonly routeId: "pm-issue";
        readonly path: "/operate/pm/issues/:issueId";
        readonly defaultSurface: "issue-workbench";
    }];
    readonly surfaces: {
        readonly "issue-workbench": {
            readonly surfaceId: "issue-workbench";
            readonly kind: "workbench";
            readonly title: "Issue Workbench";
            readonly slots: [{
                readonly slotId: "header";
                readonly role: "header";
                readonly accepts: ["action-bar"];
                readonly cardinality: "many";
            }, {
                readonly slotId: "primary";
                readonly role: "primary";
                readonly accepts: ["entity-section", "table", "rich-doc"];
                readonly cardinality: "many";
                readonly mutableByAi: true;
                readonly mutableByUser: true;
            }, {
                readonly slotId: "secondary";
                readonly role: "secondary";
                readonly accepts: ["entity-section", "table", "timeline"];
                readonly cardinality: "many";
                readonly mutableByAi: true;
                readonly mutableByUser: true;
            }, {
                readonly slotId: "assistant";
                readonly role: "assistant";
                readonly accepts: ["assistant-panel", "chat-thread"];
                readonly cardinality: "many";
                readonly mutableByAi: true;
                readonly mutableByUser: true;
            }, {
                readonly slotId: "inspector";
                readonly role: "inspector";
                readonly accepts: ["entity-field", "relation-graph", "custom-widget"];
                readonly cardinality: "many";
                readonly mutableByAi: true;
                readonly mutableByUser: true;
            }];
            readonly layouts: [{
                readonly layoutId: "balanced-three-pane";
                readonly title: "Balanced 3-pane";
                readonly root: {
                    readonly type: "panel-group";
                    readonly direction: "horizontal";
                    readonly persistKey: "pm.issue.balanced-three-pane";
                    readonly children: [{
                        readonly type: "slot";
                        readonly slotId: "primary";
                    }, {
                        readonly type: "panel-group";
                        readonly direction: "vertical";
                        readonly persistKey: "pm.issue.right-stack";
                        readonly children: [{
                            readonly type: "slot";
                            readonly slotId: "secondary";
                        }, {
                            readonly type: "slot";
                            readonly slotId: "assistant";
                        }];
                    }, {
                        readonly type: "slot";
                        readonly slotId: "inspector";
                    }];
                };
            }];
            readonly data: [{
                readonly recipeId: "issue-core";
                readonly source: {
                    readonly kind: "entity";
                    readonly entityType: "pm.issue";
                };
                readonly requestedDepth: "detailed";
                readonly hydrateInto: "issue";
            }];
            readonly verification: {
                readonly dimensions: {
                    readonly guidance: "Can reveal walkthrough notes, field help, and AI explanations.";
                    readonly density: "Can select compact, balanced, or dense multi-pane layouts.";
                    readonly dataDepth: "Controls issue relation hydration, activity size, and inspector depth.";
                    readonly control: "Shows advanced commands and raw config tabs only when allowed.";
                    readonly media: "Supports text-first detail, visual graph, and hybrid assistant modes.";
                    readonly pace: "Maps to motion tokens and confirmation behavior.";
                    readonly narrative: "Can order issue summary before or after evidence/activity sections.";
                };
            };
        };
    };
};
