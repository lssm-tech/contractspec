'use client';

import type {
	PwaUpdateCheckInputValue,
	PwaUpdateCheckOutputValue,
} from '@contractspec/lib.contracts-spec/pwa';
import * as React from 'react';
import { parseContractResponse } from './contract-result-client';

export interface PwaUpdateClientOptions {
	appId: string;
	currentVersion: string;
	currentBuildId?: string;
	platform?: string;
	check: (input: PwaUpdateCheckInputValue) => Promise<unknown>;
	enabled?: boolean;
	checkIntervalMs?: number;
	onPrompt?: (update: PwaUpdateCheckOutputValue) => void;
	onApply?: (update: PwaUpdateCheckOutputValue) => void | Promise<void>;
}

export interface PwaUpdateClientState {
	update: PwaUpdateCheckOutputValue | null;
	updateAvailable: boolean;
	required: boolean;
	blocking: boolean;
	optional: boolean;
	loading: boolean;
	error: string | null;
	checkNow: () => Promise<PwaUpdateCheckOutputValue | null>;
	applyUpdate: () => Promise<void>;
	dismissUpdate: () => void;
}

export function isPwaUpdateBlocking(
	update: PwaUpdateCheckOutputValue | null | undefined
): boolean {
	return update?.updateAvailable === true && update.blocking;
}

export function shouldPromptForPwaUpdate(
	update: PwaUpdateCheckOutputValue | null | undefined
): boolean {
	return update?.updateAvailable === true && update.update !== 'none';
}

export function usePwaUpdateChecker(
	options: PwaUpdateClientOptions
): PwaUpdateClientState {
	const { onApply, onPrompt } = options;
	const [update, setUpdate] = React.useState<PwaUpdateCheckOutputValue | null>(
		null
	);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const promptedKey = React.useRef<string | null>(null);

	const checkNow = React.useCallback(async () => {
		if (options.enabled === false) return null;
		setLoading(true);
		setError(null);
		const input: PwaUpdateCheckInputValue = {
			appId: options.appId,
			currentVersion: options.currentVersion,
			...(options.currentBuildId
				? { currentBuildId: options.currentBuildId }
				: {}),
			...(options.platform ? { platform: options.platform } : {}),
		};
		try {
			const result = parseContractResponse<PwaUpdateCheckOutputValue>(
				await options.check(input)
			);
			if (!result.ok) {
				setError(result.problem.detail ?? result.problem.title);
				setUpdate(null);
				return null;
			}
			setUpdate(result.data);
			return result.data;
		} catch (caught) {
			const message = caught instanceof Error ? caught.message : String(caught);
			setError(message);
			setUpdate(null);
			return null;
		} finally {
			setLoading(false);
		}
	}, [
		options.appId,
		options.check,
		options.currentBuildId,
		options.currentVersion,
		options.enabled,
		options.platform,
	]);

	React.useEffect(() => {
		void checkNow();
	}, [checkNow]);

	React.useEffect(() => {
		const intervalMs =
			options.checkIntervalMs ?? update?.policy.checkIntervalMs;
		if (options.enabled === false || !intervalMs || intervalMs <= 0) return;
		const id = window.setInterval(() => {
			void checkNow();
		}, intervalMs);
		return () => window.clearInterval(id);
	}, [
		checkNow,
		options.checkIntervalMs,
		options.enabled,
		update?.policy.checkIntervalMs,
	]);

	React.useEffect(() => {
		const currentUpdate = update;
		if (!currentUpdate || !shouldPromptForPwaUpdate(currentUpdate)) return;
		const key = `${currentUpdate.appId}:${currentUpdate.latestVersion}:${currentUpdate.update}`;
		if (promptedKey.current === key) return;
		promptedKey.current = key;
		onPrompt?.(currentUpdate);
	}, [onPrompt, update]);

	const applyUpdate = React.useCallback(async () => {
		const currentUpdate = update;
		if (!currentUpdate || !shouldPromptForPwaUpdate(currentUpdate)) return;
		await onApply?.(currentUpdate);
	}, [onApply, update]);

	const dismissUpdate = React.useCallback(() => {
		if (!isPwaUpdateBlocking(update)) setUpdate(null);
	}, [update]);

	return {
		update,
		updateAvailable: update?.updateAvailable ?? false,
		required: update?.update === 'required',
		blocking: isPwaUpdateBlocking(update),
		optional: update?.update === 'optional',
		loading,
		error,
		checkNow,
		applyUpdate,
		dismissUpdate,
	};
}
