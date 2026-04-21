import type { LandingIconKey } from '@contractspec/bundle.marketing/content';
import {
	ArrowRight,
	Blocks,
	Bot,
	Braces,
	ChartColumn,
	Database,
	GitBranch,
	ShieldCheck,
	Sparkles,
	Workflow,
} from 'lucide-react-native';

export const landingIconMap: Record<LandingIconKey, typeof ArrowRight> = {
	'arrow-right': ArrowRight,
	blocks: Blocks,
	bot: Bot,
	braces: Braces,
	'chart-column': ChartColumn,
	database: Database,
	'git-branch': GitBranch,
	'shield-check': ShieldCheck,
	sparkles: Sparkles,
	workflow: Workflow,
};
