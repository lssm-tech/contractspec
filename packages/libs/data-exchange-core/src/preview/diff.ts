import { flattenRecord } from '../records';
import type { InterchangeRecord, PreviewChange } from '../types';

export function diffRecords(
	before: InterchangeRecord,
	after: InterchangeRecord,
	recordIndex: number
): PreviewChange[] {
	const left = flattenRecord(before);
	const right = flattenRecord(after);
	const keys = Array.from(
		new Set([...Object.keys(left), ...Object.keys(right)])
	).sort();
	const changes: PreviewChange[] = [];

	for (const key of keys) {
		const beforeValue = left[key];
		const afterValue = right[key];
		if (JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
			continue;
		}

		changes.push({
			recordIndex,
			fieldPath: key,
			before: beforeValue,
			after: afterValue,
			changeType:
				beforeValue === undefined
					? 'added'
					: afterValue === undefined
						? 'removed'
						: 'modified',
		});
	}

	return changes;
}
