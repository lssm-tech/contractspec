export interface BlockNoteBundleAdapter {
	supportsNode(kind: string): boolean;
	createSchema(): unknown;
}
