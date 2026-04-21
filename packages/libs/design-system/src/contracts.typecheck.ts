import type {
	SharedButtonProps,
	SharedDataTableProps,
	SharedInputProps,
	SharedStackProps,
	SharedTextareaProps,
	SharedVisualizationProps,
} from '@contractspec/lib.ui-kit-core/interfaces';
import type { ButtonProps } from './components/atoms/Button';
import type { InputProps } from './components/atoms/Input';
import type { TextareaProps } from './components/atoms/Textarea';
import type { DataTableProps } from './components/data-table/DataTable';
import type { FormDialog as FormsFormDialog } from './components/forms';
import type { SelectProps as ControlsSelectProps } from './components/forms/controls';
import type { HStackProps as LayoutHStackProps } from './components/layout';
import type {
	BoxProps,
	HStackProps,
	VStackProps,
} from './components/layout/Stack';
import type { VisualizationRendererProps } from './components/visualization/VisualizationRenderer';
import type { ThemeCssVariables as ThemeSubpathVariables } from './theme';

type Assert<T extends true> = T;
type Extends<A, B> = [A] extends [B] ? true : false;

type _ButtonContract = Assert<Extends<ButtonProps, SharedButtonProps>>;
type _InputContract = Assert<Extends<InputProps, SharedInputProps>>;
type _TextareaContract = Assert<Extends<TextareaProps, SharedTextareaProps>>;
type _BoxContract = Assert<Extends<BoxProps, SharedStackProps>>;
type _HStackContract = Assert<Extends<HStackProps, SharedStackProps>>;
type _VStackContract = Assert<Extends<VStackProps, SharedStackProps>>;
type _DataTableContract = Assert<
	Extends<
		DataTableProps<Record<string, unknown>>,
		SharedDataTableProps<Record<string, unknown>>
	>
>;
type _VisualizationContract = Assert<
	Extends<VisualizationRendererProps, Omit<SharedVisualizationProps, 'model'>>
>;
type _ControlsSubpathContract = Assert<Extends<ControlsSelectProps, object>>;
type _FormsSubpathContract = Assert<Extends<typeof FormsFormDialog, object>>;
type _LayoutSubpathContract = Assert<Extends<LayoutHStackProps, object>>;
type _ThemeSubpathContract = Assert<Extends<ThemeSubpathVariables, object>>;

export {};
