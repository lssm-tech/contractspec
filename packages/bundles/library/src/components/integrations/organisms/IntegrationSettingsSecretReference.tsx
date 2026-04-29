import {
	Box,
	Input,
	Small,
	Text,
	VStack,
} from '@contractspec/lib.design-system';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import type React from 'react';
import type { IntegrationSettingsForm } from './IntegrationSettings';

export interface IntegrationSettingsSecretReferenceProps {
	values: Pick<IntegrationSettingsForm, 'secretProvider' | 'secretRef'>;
	onSecretProviderChange: (
		next: IntegrationSettingsForm['secretProvider']
	) => void;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function IntegrationSettingsSecretReference({
	values,
	onSecretProviderChange,
	onChange,
}: IntegrationSettingsSecretReferenceProps) {
	return (
		<VStack
			gap="md"
			align="stretch"
			className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"
		>
			<Small>BYOK secret reference</Small>
			<Box className="grid gap-4 md:grid-cols-2">
				<VStack gap="sm" align="stretch">
					<Label htmlFor="secretProvider">
						<Text>Secret provider</Text>
					</Label>
					<Select
						value={values.secretProvider ?? 'env'}
						onValueChange={(next) =>
							onSecretProviderChange(
								next as IntegrationSettingsForm['secretProvider']
							)
						}
					>
						<SelectTrigger id="secretProvider" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="env">
								<Text>Environment</Text>
							</SelectItem>
							<SelectItem value="gcp">
								<Text>GCP Secret Manager</Text>
							</SelectItem>
						</SelectContent>
					</Select>
				</VStack>
				<VStack gap="sm" align="stretch">
					<Label htmlFor="secretRef">
						<Text>Secret reference</Text>
					</Label>
					<Input
						id="secretRef"
						name="secretRef"
						placeholder={
							values.secretProvider === 'gcp'
								? 'gcp://projects/.../secrets/...'
								: 'env://MY_TOKEN_ENV_VAR'
						}
						value={values.secretRef ?? ''}
						onChange={onChange}
					/>
				</VStack>
			</Box>
		</VStack>
	);
}
