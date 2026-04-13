import type {
	SharedButtonProps,
	SharedDialogProps,
	SharedFieldProps,
	SharedInputProps,
	SharedSelectProps,
	SharedTableProps,
	SharedVisualizationProps,
} from '@contractspec/lib.ui-kit-core/interfaces';
import type * as React from 'react';
import type { ButtonProps } from './button';
import { Dialog } from './dialog';
import { Field } from './field';
import type { InputProps } from './input';
import { Select } from './select';
import { Table } from './table';
import type { VisualizationProps } from './visualization/Visualization';

type Assert<T extends true> = T;
type Extends<A, B> = [A] extends [B] ? true : false;

type _ButtonContract = Assert<Extends<ButtonProps, SharedButtonProps>>;
type _InputContract = Assert<Extends<InputProps, SharedInputProps>>;
type _FieldContract = Assert<
	Extends<React.ComponentProps<typeof Field>, SharedFieldProps>
>;
type _SelectContract = Assert<
	Extends<React.ComponentProps<typeof Select>, SharedSelectProps<unknown>>
>;
type _DialogContract = Assert<
	Extends<React.ComponentProps<typeof Dialog>, SharedDialogProps>
>;
type _TableContract = Assert<
	Extends<React.ComponentProps<typeof Table>, SharedTableProps>
>;
type _VisualizationContract = Assert<
	Extends<VisualizationProps, SharedVisualizationProps>
>;

export {};
