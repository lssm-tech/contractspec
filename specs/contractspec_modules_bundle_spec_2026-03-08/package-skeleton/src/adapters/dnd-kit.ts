export interface DragDropBundleAdapter {
	enableSurfaceEditing(args: {
		mutableSlots: string[];
		onPatch: (ops: unknown[]) => void;
	}): void;
}
