import type { LandingCta } from '@contractspec/bundle.marketing/content';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { ArrowRight } from 'lucide-react-native';
import { Pressable } from 'react-native';

export function LandingCtaButton(props: {
	cta: LandingCta;
	disabled?: boolean;
	onPress: (cta: LandingCta) => void;
}) {
	const isPrimary = props.cta.variant === 'primary';

	return (
		<Pressable
			onPress={() => props.onPress(props.cta)}
			disabled={props.disabled}
			className={`min-h-12 flex-row items-center justify-center rounded-lg px-4 py-3 ${
				isPrimary ? 'bg-primary' : 'border border-input bg-background'
			} ${props.disabled ? 'opacity-60' : ''}`}
			accessibilityRole="button"
			accessibilityLabel={props.cta.label}
			accessibilityHint="Opens this ContractSpec link in the browser"
		>
			<Text
				className={`font-semibold text-sm ${
					isPrimary ? 'text-primary-foreground' : 'text-foreground'
				}`}
			>
				{props.cta.label}
			</Text>
			<ArrowRight
				className={`ml-2 h-4 w-4 ${
					isPrimary ? 'text-primary-foreground' : 'text-foreground'
				}`}
			/>
		</Pressable>
	);
}
