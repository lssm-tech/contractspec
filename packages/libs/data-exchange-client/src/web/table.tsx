import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { DataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import * as React from 'react';

function createColumns(rows: Record<string, unknown>[]) {
	const keys = Array.from(
		new Set(
			rows.flatMap((row) => Object.keys(row).filter((key) => key !== 'id'))
		)
	);

	return keys.map((key) => ({
		id: key,
		header: key,
		accessorKey: key,
		canHide: true,
		canResize: true,
		canSort: true,
	}));
}

export function WebPreviewTable({
	title,
	rows,
}: {
	title: string;
	rows: Record<string, unknown>[];
}) {
	const columns = React.useMemo(() => createColumns(rows), [rows]);
	const controller = useContractTable({
		data: rows,
		columns,
		initialState: {
			pagination: { pageIndex: 0, pageSize: 5 },
		},
	});

	return <DataTable controller={controller} toolbar={<div>{title}</div>} />;
}
