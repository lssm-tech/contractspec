import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import { useDataExchangeController } from '../controllers';
import { WebRunAuditView, WebValidationPanel } from './panels';
import { WebPreviewTable } from './table';

export function WebMappingStudio({
	preview,
	executionResult,
}: {
	preview: PreviewResult;
	executionResult?: ExecutionResult;
}) {
	const controller = useDataExchangeController({ preview, executionResult });

	return (
		<div>
			<h2>Data Exchange Studio</h2>
			<WebValidationPanel preview={preview} />
			<WebPreviewTable
				title="Source Preview"
				rows={controller.model.sourceRows}
			/>
			<WebPreviewTable
				title="Normalized Preview"
				rows={controller.model.previewRows}
			/>
			<WebPreviewTable
				title="Reconciliation Changes"
				rows={controller.model.changeRows}
			/>
			<WebRunAuditView executionResult={executionResult} />
		</div>
	);
}

export { WebRunAuditView, WebValidationPanel } from './panels';
export { WebPreviewTable } from './table';
