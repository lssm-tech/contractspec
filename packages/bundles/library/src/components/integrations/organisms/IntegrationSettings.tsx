import {
	Box,
	Button,
	HStack,
	Input,
	Muted,
	Small,
	Text,
	Textarea,
	VStack,
} from '@contractspec/lib.design-system';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import { Key, ShieldCheck, TestTube2 } from 'lucide-react';
import * as React from 'react';
import { IntegrationCredentialSetupBlock } from '../blocks/IntegrationCredentialSetupBlock';
import type { BuildIntegrationCredentialSetupModelInput } from '../helpers/credentialSetupModel';
import { IntegrationSettingsSecretReference } from './IntegrationSettingsSecretReference';

export interface IntegrationSettingsForm {
	apiKey: string;
	secret?: string;
	ownershipMode?: 'managed' | 'byok';
	secretProvider?: 'env' | 'gcp';
	secretRef?: string;
	config?: string;
}

export interface IntegrationSettingsProps {
	provider: string;
	initialValues?: IntegrationSettingsForm;
	onTestConnection?: (values: IntegrationSettingsForm) => Promise<void> | void;
	onSave?: (values: IntegrationSettingsForm) => Promise<void> | void;
	isSaving?: boolean;
	isTesting?: boolean;
	credentialSetup?: Omit<
		BuildIntegrationCredentialSetupModelInput,
		'selectedMode'
	>;
}

export function IntegrationSettings({
	provider,
	initialValues,
	onTestConnection,
	onSave,
	isSaving,
	isTesting,
	credentialSetup,
}: IntegrationSettingsProps) {
	const [values, setValues] = React.useState<IntegrationSettingsForm>({
		apiKey: initialValues?.apiKey ?? '',
		secret: initialValues?.secret ?? '',
		ownershipMode: initialValues?.ownershipMode ?? 'managed',
		secretProvider: initialValues?.secretProvider ?? 'env',
		secretRef: initialValues?.secretRef ?? '',
		config: initialValues?.config ?? '{\n  "region": "eu-west-1"\n}',
	});

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<VStack
			align="stretch"
			gap="md"
			className="rounded-2xl border border-border bg-card p-4"
		>
			<HStack wrap="wrap" justify="between" gap="md">
				<VStack gap="sm" align="start">
					<Small className="uppercase tracking-wide">{`${provider} credentials`}</Small>
					<Muted>
						Store encrypted keys with BYOK and run safe connection tests.
					</Muted>
				</VStack>
				<ShieldCheck className="h-5 w-5 text-muted-foreground" />
			</HStack>

			<Box className="grid gap-4 md:grid-cols-2">
				<VStack gap="sm" align="stretch">
					<Label htmlFor="ownershipMode">
						<Text>Ownership</Text>
					</Label>
					<Select
						value={values.ownershipMode ?? 'managed'}
						onValueChange={(next) =>
							setValues((prev) => ({
								...prev,
								ownershipMode: next as IntegrationSettingsForm['ownershipMode'],
							}))
						}
					>
						<SelectTrigger id="ownershipMode" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="managed">
								<Text>Managed (store encrypted)</Text>
							</SelectItem>
							<SelectItem value="byok">
								<Text>BYOK (store secret reference)</Text>
							</SelectItem>
						</SelectContent>
					</Select>
				</VStack>
			</Box>

			{credentialSetup ? (
				<IntegrationCredentialSetupBlock
					{...credentialSetup}
					selectedMode={values.ownershipMode}
					title={`${provider} setup`}
					onModeChange={(mode) =>
						setValues((prev) => ({ ...prev, ownershipMode: mode }))
					}
				/>
			) : null}

			<Box className="grid gap-4 md:grid-cols-2">
				<VStack gap="sm" align="stretch">
					<Label htmlFor="apiKey" className="font-semibold">
						<Text>API key</Text>
					</Label>
					<Box className="relative">
						<Key className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							name="apiKey"
							id="apiKey"
							className="w-full py-2 pr-3 pl-9"
							value={values.apiKey}
							onChange={handleChange}
							required
						/>
					</Box>
				</VStack>
				<VStack gap="sm" align="stretch">
					<Label htmlFor="secret" className="font-semibold">
						<Text>Secret</Text>
					</Label>
					<Input
						type="password"
						id="secret"
						name="secret"
						className="w-full px-3 py-2"
						value={values.secret}
						onChange={handleChange}
					/>
				</VStack>
			</Box>

			{values.ownershipMode === 'byok' ? (
				<IntegrationSettingsSecretReference
					values={values}
					onChange={handleChange}
					onSecretProviderChange={(secretProvider) =>
						setValues((prev) => ({ ...prev, secretProvider }))
					}
				/>
			) : (
				<HStack
					align="center"
					gap="md"
					className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm"
				>
					<Checkbox checked onCheckedChange={() => {}} aria-label="Managed" />
					<VStack gap="sm" align="start">
						<Small>Managed encryption enabled</Small>
						<Muted>Secrets are encrypted server-side for this tenant.</Muted>
					</VStack>
				</HStack>
			)}

			<VStack gap="sm" align="stretch">
				<Label htmlFor="config" className="font-semibold">
					<Text>Configuration (JSON)</Text>
				</Label>
				<Textarea
					id="config"
					name="config"
					className="min-h-[140px] w-full font-mono text-sm"
					value={values.config}
					onChange={handleChange}
				/>
			</VStack>

			<HStack wrap="wrap" gap="md" align="center">
				<Button
					variant="ghost"
					onPress={() => onTestConnection?.(values)}
					disabled={isTesting}
				>
					<TestTube2 className="h-4 w-4" />
					<Text>Test connection</Text>
				</Button>
				<Button
					variant="default"
					onPress={() => onSave?.(values)}
					disabled={isSaving}
				>
					<Text>Save settings</Text>
				</Button>
			</HStack>
		</VStack>
	);
}
