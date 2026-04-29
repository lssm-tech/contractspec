import { Small, Text, VStack } from '@contractspec/lib.design-system';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { IntegrationCredentialFieldList } from '../atoms/IntegrationCredentialFieldList';
import { IntegrationCredentialModeTabs } from '../atoms/IntegrationCredentialModeTabs';
import { IntegrationEnvAliasPreview } from '../atoms/IntegrationEnvAliasPreview';
import {
	type BuildIntegrationCredentialSetupModelInput,
	buildIntegrationCredentialSetupModel,
	type IntegrationCredentialSetupModel,
} from '../helpers/credentialSetupModel';

export interface IntegrationCredentialSetupBlockProps
	extends BuildIntegrationCredentialSetupModelInput {
	title?: string;
	description?: string;
	onModeChange?: (
		mode: IntegrationCredentialSetupModel['selectedMode']
	) => void;
	onTestConnection?: () => void | Promise<void>;
	onSave?: () => void | Promise<void>;
	isTesting?: boolean;
	isSaving?: boolean;
}

export function IntegrationCredentialSetupBlock({
	title = 'Credential setup',
	description = 'Configure managed credentials or BYOK secret references without exposing raw secrets.',
	onModeChange,
	onTestConnection,
	onSave,
	isTesting,
	isSaving,
	...input
}: IntegrationCredentialSetupBlockProps) {
	const model = buildIntegrationCredentialSetupModel(input);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<IntegrationCredentialModeTabs
						modes={model.modes}
						selectedMode={model.selectedMode}
						onModeChange={onModeChange}
					/>
					<VStack gap="sm" align="stretch">
						<Small>Required fields</Small>
						<IntegrationCredentialFieldList fields={model.fields} />
					</VStack>
					<VStack gap="sm" align="stretch">
						<Small>Environment aliases</Small>
						<IntegrationEnvAliasPreview
							aliases={model.aliases}
							warnings={model.warnings}
						/>
					</VStack>
				</VStack>
			</CardContent>
			{onTestConnection || onSave ? (
				<CardFooter className="flex flex-wrap justify-end gap-2">
					{onTestConnection ? (
						<Button
							type="button"
							variant="outline"
							disabled={isTesting}
							onClick={() => void onTestConnection()}
						>
							<Text>{isTesting ? 'Testing...' : 'Test connection'}</Text>
						</Button>
					) : null}
					{onSave ? (
						<Button
							type="button"
							disabled={isSaving}
							onClick={() => void onSave()}
						>
							<Text>{isSaving ? 'Saving...' : 'Save settings'}</Text>
						</Button>
					) : null}
				</CardFooter>
			) : null}
		</Card>
	);
}
