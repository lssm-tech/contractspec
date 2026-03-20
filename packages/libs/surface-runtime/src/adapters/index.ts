/**
 * UI library adapters. No direct third-party imports outside this directory.
 */

export { aiSdkAdapterStub } from './ai-sdk-stub';
export { blocknoteAdapterStub } from './blocknote-stub';
export { dndKitAdapter } from './dnd-kit-adapter';
export { dndKitAdapterStub } from './dnd-kit-stub';
export { floatingUiAdapterStub } from './floating-ui-stub';
export type {
	AiSdkBundleAdapter,
	BlockNoteBundleAdapter,
	DragDropBundleAdapter,
	FieldRendererRegistry,
	FloatingBundleAdapter,
	MotionBundleAdapter,
	MotionTokens,
	PanelLayoutAdapter,
	RenderContext,
	RenderRegionFn,
} from './interfaces';
export { motionAdapterStub } from './motion-stub';
export { resizablePanelsAdapterStub } from './resizable-panels-stub';
