export interface FloatingBundleAdapter {
  renderAnchoredMenu(args: {
    anchorId: string;
    items: unknown[];
  }): unknown;
}
