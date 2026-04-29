import { HStack, Text } from '@contractspec/lib.design-system';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import type {
	CredentialSetupModeOption,
	IntegrationCredentialSetupModel,
} from '../helpers/credentialSetupModel';

export interface IntegrationCredentialModeTabsProps {
	modes: CredentialSetupModeOption[];
	selectedMode: IntegrationCredentialSetupModel['selectedMode'];
	onModeChange?: (
		mode: IntegrationCredentialSetupModel['selectedMode']
	) => void;
}

export function IntegrationCredentialModeTabs({
	modes,
	selectedMode,
	onModeChange,
}: IntegrationCredentialModeTabsProps) {
	return (
		<HStack wrap="wrap" gap="sm" role="tablist" aria-label="Credential mode">
			{modes.map((mode) => (
				<Button
					key={mode.mode}
					type="button"
					variant={mode.mode === selectedMode ? 'default' : 'outline'}
					disabled={!mode.available}
					onClick={() => onModeChange?.(mode.mode)}
					role="tab"
					aria-selected={mode.mode === selectedMode}
				>
					<Text>{mode.label}</Text>
					{mode.missingRequiredCount > 0 ? (
						<Badge variant="destructive">
							<Text>{`${mode.missingRequiredCount} missing`}</Text>
						</Badge>
					) : null}
				</Button>
			))}
		</HStack>
	);
}
