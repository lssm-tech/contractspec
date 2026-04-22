export type BuildKind =
	| 'shared'
	| 'frontend-react'
	| 'backend-node'
	| 'backend-bun'
	| 'backend-both';

export type BuildPlatform = 'browser' | 'node' | 'neutral';

export interface BuildTargets {
	node?: boolean;
	browser?: boolean;
}

export interface BuildExportsOptions {
	all?: boolean;
	rewrite?: boolean;
	devExports?: boolean;
}

export type BuildStyleMode = 'build' | 'copy';

export interface BuildStylesOptions {
	entry?: string[] | false;
	mode?: BuildStyleMode;
}

export interface BuildConfig {
	kind?: BuildKind;
	platform?: BuildPlatform;
	targets?: BuildTargets;
	entry?: string[];
	styleEntry?: string[] | false;
	styleMode?: BuildStyleMode;
	styles?: BuildStylesOptions;
	external?: string[];
	exports?: BuildExportsOptions;
	noBundle?: boolean;
	tsconfigTypes?: string;
}

export interface BuildConfigOptions {
	mode?: string;
	command?: string;
}

export type BuildConfigFactory = (
	options: BuildConfigOptions
) => BuildConfig | Promise<BuildConfig>;

export type BuildConfigInput = BuildConfig | BuildConfigFactory;

export declare function defineConfig<TConfig extends BuildConfigInput>(
	config: TConfig
): TConfig;

export declare const withDevExports: Pick<BuildConfig, 'exports'>;
export declare const frontendReact: BuildConfig;
export declare const backendNode: BuildConfig;
export declare const backendBun: BuildConfig;
export declare const backendBoth: BuildConfig;
export declare const shared: BuildConfig;
export declare const reactLibrary: BuildConfig;
export declare const moduleLibrary: BuildConfig;
export declare const nodeLib: BuildConfig;
export declare const nodeDatabaseLib: BuildConfig;

declare const defaultConfig: BuildConfig;
export default defaultConfig;
