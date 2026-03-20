import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import Window from "happy-dom/lib/window/Window.js";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import example from "../example";
import { DataGridShowcaseDataView } from "../contracts/data-grid-showcase.data-view";
import { DataGridShowcase } from "./DataGridShowcase";

beforeAll(() => {
	const windowInstance = new Window({
		url: "https://sandbox.contractspec.local/sandbox?template=data-grid-showcase",
	});
	Object.defineProperty(windowInstance, "SyntaxError", {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = "";
});

async function renderShowcase() {
	const container = document.createElement("div");
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(<DataGridShowcase />);
	});

	return { container, root };
}

describe("@contractspec/example.data-grid-showcase smoke", () => {
	test("publishes the focused table example metadata", () => {
		expect(example.meta.kind).toBe("ui");
		expect(example.entrypoints.packageName).toBe(
			"@contractspec/example.data-grid-showcase"
		);
		expect(example.surfaces.templates).toBe(false);
		expect(DataGridShowcaseDataView.view.kind).toBe("table");
	});

	test("renders the showcase table surfaces", async () => {
		const { container, root } = await renderShowcase();

		expect(container.textContent).toContain("Generic Client");
		expect(container.textContent).toContain("Generic Server");
		expect(container.textContent).toContain("DataView Adapter");
		expect(container.textContent).toContain("Show Notes Column");
		expect(container.textContent).toContain("Widen Account");
		expect(container.textContent).toContain("Page 1 of 2");

		await act(async () => {
			root.unmount();
		});
	}, 10000);
});
