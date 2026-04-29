import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import { Text, View } from 'react-native';
import { useDataExchangeController } from '../controllers';
import {
	NativeRunAuditView,
	NativeTemplateMappingPanel,
	NativeValidationPanel,
} from './panels';
import { NativePreviewTable } from './table';

export function NativeMappingStudio({
	preview,
	executionResult,
}: {
	preview: PreviewResult;
	executionResult?: ExecutionResult;
}) {
	const controller = useDataExchangeController({ preview, executionResult });

	return (
		<View>
			<Text>Data Exchange Studio</Text>
			<NativeTemplateMappingPanel model={controller.model} />
			<NativeValidationPanel preview={preview} />
			<NativePreviewTable
				title="Source Preview"
				rows={controller.model.sourceRows}
			/>
			<NativePreviewTable
				title="Normalized Preview"
				rows={controller.model.previewRows}
			/>
			<NativeRunAuditView executionResult={executionResult} />
		</View>
	);
}

export {
	NativeRunAuditView,
	NativeTemplateMappingPanel,
	NativeValidationPanel,
} from './panels';
export { NativePreviewTable } from './table';
