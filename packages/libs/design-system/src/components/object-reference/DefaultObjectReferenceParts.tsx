import { cn } from '../../lib/utils';
import { ReferenceIcon, ReferenceSearchIcon } from './ReferenceIcon';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
} from './types';

export function DefaultObjectReferenceTrigger({
	context,
	iconRenderer,
	interactivityVisibility,
	className,
}: {
	context: ObjectReferenceRenderContext;
	iconRenderer?: IconRenderer;
	interactivityVisibility: NonNullable<
		ObjectReferenceHandlerProps['interactivityVisibility']
	>;
	className?: string;
}) {
	const { reference } = context;
	return (
		<span
			className={cn(
				'inline-flex min-w-0 items-center gap-1.5 text-foreground text-sm transition-colors hover:text-primary',
				interactivityVisibility === 'underline' &&
					'underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-primary',
				className
			)}
		>
			<ReferenceIcon
				context={{ iconKey: reference.iconKey ?? reference.kind, reference }}
				iconRenderer={iconRenderer}
			/>
			<span className="truncate">{reference.label}</span>
			{interactivityVisibility === 'icon' ? (
				<ReferenceSearchIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
			) : null}
		</span>
	);
}

export function DefaultActionButton({
	action,
	reference,
	iconRenderer,
	onClick,
}: {
	action: ObjectReferenceActionDescriptor;
	reference: ObjectReferenceHandlerProps['reference'];
	iconRenderer?: IconRenderer;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={cn(
				'flex min-h-11 w-full items-center gap-3 rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
				action.variant === 'primary' && 'border-primary/40 bg-primary/10',
				action.variant === 'danger' && 'border-destructive/40 text-destructive',
				action.disabled && 'cursor-not-allowed opacity-50'
			)}
			disabled={action.disabled}
			onClick={onClick}
		>
			<ReferenceIcon
				context={{
					iconKey: action.iconKey ?? action.id,
					reference,
					action,
				}}
				iconRenderer={iconRenderer}
			/>
			<span className="min-w-0 flex-1">
				<span className="block font-medium">{action.label}</span>
				{action.description ? (
					<span className="block text-muted-foreground text-xs">
						{action.description}
					</span>
				) : null}
			</span>
		</button>
	);
}

type IconRenderer = ObjectReferenceHandlerProps['iconRenderer'];
