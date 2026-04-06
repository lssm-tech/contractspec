import { useState } from 'react';

export function useExecutionLaneConsoleState() {
	const [tab, setTab] = useState('overview');
	const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
		null
	);

	return {
		tab,
		setTab,
		selectedEvidenceId,
		setSelectedEvidenceId,
	};
}
