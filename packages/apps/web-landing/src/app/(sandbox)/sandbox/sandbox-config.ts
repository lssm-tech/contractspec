import type { TemplateId } from "@contractspec/lib.example-shared-ui";

export const DEFAULT_SANDBOX_TEMPLATE_ID: TemplateId = "agent-console";

export function resolveSandboxTemplateId(
	value: string | null,
	templateIds: ReadonlySet<string>
): TemplateId {
	if (value && templateIds.has(value)) {
		return value;
	}
	return DEFAULT_SANDBOX_TEMPLATE_ID;
}

export function buildSandboxHref(templateId: TemplateId): string {
	if (templateId === DEFAULT_SANDBOX_TEMPLATE_ID) {
		return "/sandbox";
	}
	return `/sandbox?template=${encodeURIComponent(templateId)}`;
}
