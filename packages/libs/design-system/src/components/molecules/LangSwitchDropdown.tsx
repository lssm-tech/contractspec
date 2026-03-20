import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import * as React from 'react';

export interface LangOption {
	code: string;
	label: React.ReactNode;
}

export function LangSwitchDropdown({
	value,
	options,
	onChange,
	className,
}: {
	value: string;
	options: LangOption[];
	onChange: (code: string) => void;
	className?: string;
}) {
	const current = options.find((o) => o.code === value);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={className}>
				<div className="inline-flex items-center gap-2 rounded-xs border px-2 py-1 text-sm hover:bg-muted/40">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">
						{current?.label ?? value.toUpperCase()}
					</span>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options.map((opt) => (
					<DropdownMenuItem key={opt.code} onSelect={() => onChange(opt.code)}>
						{opt.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
