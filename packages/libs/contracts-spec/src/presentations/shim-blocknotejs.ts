export type PropSpec<PType extends boolean | number | string> =
	| {
			// We infer the type of the prop from the default value
			default: PType;
			// a list of possible values, for example for a string prop (this will then be used as a string union type)
			values?: readonly PType[];
	  }
	| {
			default: undefined;
			// Because there is no default value (for an optional prop, the default value is undefined),
			// we need to specify the type of the prop manually (we can't infer it from the default value)
			type: 'string' | 'number' | 'boolean';
			values?: readonly PType[];
	  };

export type PropSchema = Record<string, PropSpec<boolean | number | string>>;

/**
 * BlockConfig contains the "schema" info about a Block type
 * i.e. what props it supports, what content it supports, etc.
 */
export interface BlockConfig<
	T extends string = string,
	PS extends PropSchema = PropSchema,
	C extends 'inline' | 'none' | 'table' = 'inline' | 'none' | 'table',
> {
	/**
	 * The type of the block (unique identifier within a schema)
	 */
	type: T;
	/**
	 * The properties that the block supports
	 * @todo will be zod schema in the future
	 */
	readonly propSchema: PS;
	/**
	 * The content that the block supports
	 */
	content: C;
}
