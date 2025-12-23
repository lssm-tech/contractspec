import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  ArrayFieldSpec,
  FieldSpec,
  FormOption,
  FormSpec,
  FormValuesFor,
  OptionsSource,
  RadioFieldSpec,
  SelectFieldSpec,
  TextareaFieldSpec,
  TextFieldSpec,
} from '../../forms';
import { buildZodWithRelations, evalPredicate } from '../../forms';
import type { AnySchemaModel } from '@lssm/lib.schema';

// Minimal, library-agnostic driver slots. Hosts can provide any UI lib via this interface.
export interface DriverSlots {
  Field: React.ComponentType<
    React.PropsWithChildren<{
      'data-invalid'?: boolean;
      hidden?: boolean;
      disabled?: boolean;
    }>
  >;
  FieldLabel: React.ComponentType<
    React.PropsWithChildren<{ htmlFor?: string }>
  >;
  FieldDescription: React.ComponentType<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    React.PropsWithChildren<{}>
  >;
  FieldError: React.ComponentType<{ errors: { message?: string }[] }>;
  FieldGroup?: React.ComponentType<
    React.PropsWithChildren<{ className?: string }>
  >;
  FieldSet?: React.ComponentType<
    React.PropsWithChildren<{ className?: string }>
  >;
  FieldLegend?: React.ComponentType<
    React.PropsWithChildren<{ variant?: 'label' | 'default' }>
  >;

  Input: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
  Textarea: React.ComponentType<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
  >;
  // Select receives resolved options for simplicity
  Select: React.ComponentType<
    {
      id?: string;
      name?: string;
      value?: unknown;
      onChange?: (v: unknown) => void;
      disabled?: boolean;
      'aria-invalid'?: boolean;
      options: FormOption[];
    } & Record<string, unknown>
  >;
  Checkbox: React.ComponentType<
    {
      id?: string;
      name?: string;
      checked?: boolean;
      onCheckedChange?: (v: boolean) => void;
      disabled?: boolean;
    } & Record<string, unknown>
  >;
  RadioGroup: React.ComponentType<
    {
      id?: string;
      name?: string;
      value?: unknown;
      onValueChange?: (v: unknown) => void;
      disabled?: boolean;
      options: FormOption[];
    } & Record<string, unknown>
  >;
  Switch: React.ComponentType<
    {
      id?: string;
      name?: string;
      checked?: boolean;
      onCheckedChange?: (v: boolean) => void;
      disabled?: boolean;
    } & Record<string, unknown>
  >;
  Button: React.ComponentType<
    React.PropsWithChildren<{
      type?: 'button' | 'submit' | 'reset';
      variant?: string;
      size?: string;
      onClick?: () => void;
      disabled?: boolean;
    }>
  >;
}

export type ResolverMap<TValues> = Record<
  string,
  (values: TValues, args?: unknown) => Promise<FormOption[]> | FormOption[]
>;
export type ComputationMap<TValues> = Record<
  string,
  (values: TValues) => unknown
>;

export interface CreateRendererOptions<TValues = Record<string, unknown>> {
  driver: DriverSlots;
  formOptions?: Record<string, unknown>;
  onSubmitOverride?: (
    values: TValues,
    actionKey: string
  ) => Promise<void> | void;
  activeFlags?: string[];
  resolvers?: ResolverMap<TValues>;
  computations?: ComputationMap<TValues>;
  unmountStrategy?: 'keep' | 'clear';
}

export interface RenderOptions<TValues = Record<string, unknown>> {
  defaultValues?: Partial<TValues>;
  overrides?: Partial<CreateRendererOptions<TValues>>;
}

function toOptionsArray(
  src: OptionsSource | FormOption[] | undefined
): OptionsSource | undefined {
  if (!src) return undefined;
  if (Array.isArray(src)) return { kind: 'static', options: src };
  return src;
}

function getAtPath(values: unknown, path: string): unknown {
  if (!path) return undefined;
  const segs = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let cur: unknown = values;
  for (const s of segs) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

function makeDepsKey(values: unknown, deps: string[] | undefined) {
  if (!deps || deps.length === 0) return '[]';
  try {
    return JSON.stringify(deps.map((d) => getAtPath(values, d)));
  } catch {
    return '[]';
  }
}

function useResolvedOptions<TValues>(
  values: TValues,
  source: OptionsSource | undefined,
  resolvers?: ResolverMap<TValues>
): FormOption[] {
  const [opts, setOpts] = useState<FormOption[]>([]);
  const depKey = useMemo(() => {
    if (!source) return 'nil';
    if (source.kind === 'static') return JSON.stringify(source.options ?? []);
    return makeDepsKey(values, source.deps);
  }, [source, values]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!source) return setOpts([]);
      if (source.kind === 'static') return setOpts([...(source.options ?? [])]);
      const fn = resolvers?.[source.resolverKey];
      if (!fn) return setOpts([]);
      const res = await fn(values, source.args);
      if (mounted) setOpts([...(res ?? [])]);
    };
    run();
    return () => {
      mounted = false;
    };
  }, [
    depKey,
    source && source.kind === 'resolver' ? source.resolverKey : undefined,
  ]);
  return opts;
}

function fieldPath(
  parent: string | undefined,
  name?: string,
  arrayIndex?: number
) {
  if (!name) return parent ?? '';
  const child =
    typeof arrayIndex === 'number'
      ? `${name.replace(/^\$index$/, String(arrayIndex))}`
      : name;
  return parent
    ? `${parent}${typeof arrayIndex === 'number' ? `.${arrayIndex}` : ''}.${child}`.replace(
        /\.+/g,
        '.'
      )
    : child;
}

export function createFormRenderer<M extends AnySchemaModel = AnySchemaModel>(
  base: CreateRendererOptions<FormValuesFor<M>>
) {
  const conf = base;
  const { driver } = conf;

  function InternalForm(props: {
    spec: FormSpec<M>;
    options?: RenderOptions<FormValuesFor<M>>;
    merged: CreateRendererOptions<FormValuesFor<M>>;
  }): React.ReactElement {
    const { spec, options, merged } = props;
    const baseZod = useMemo(() => buildZodWithRelations(spec), [spec]);
    const form = useForm<FormValuesFor<M>>({
      ...merged.formOptions,
      resolver: zodResolver(baseZod),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValues: options?.defaultValues as any,
    });

    const values = form.watch();

    const renderOne = (
      f: FieldSpec,
      parent?: string,
      arrayIndex?: number
    ): React.ReactElement | null => {
      const DriverField = driver.Field;
      const DriverLabel = driver.FieldLabel;
      const DriverDesc = driver.FieldDescription;
      const DriverError = driver.FieldError;
      const name = fieldPath(parent, f.name, arrayIndex);
      const visible = evalPredicate(values, f.visibleWhen);
      const enabled = evalPredicate(values, f.enabledWhen);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalid = Boolean(form.getFieldState(name as any)?.invalid);

      if (!visible) return null;

      const id = name?.replace(/\./g, '-');

      const commonWrapProps = {
        'data-invalid': invalid,
        hidden: !visible,
        disabled: !enabled,
      };
      const labelNode = f.labelI18n ? (
        <DriverLabel htmlFor={id}>{f.labelI18n}</DriverLabel>
      ) : null;
      const descNode = f.descriptionI18n ? (
        <DriverDesc>{f.descriptionI18n}</DriverDesc>
      ) : null;

      if (f.kind === 'group') {
        const children = f.fields.map((c: FieldSpec, i: number) => (
          <React.Fragment key={`${name}-${i}`}>
            {renderOne(c, name, arrayIndex)}
          </React.Fragment>
        ));
        return (
          <DriverField {...commonWrapProps}>
            {labelNode}
            {children}
            {descNode}
          </DriverField>
        );
      }

      if (f.kind === 'array') {
        return renderArray(f as ArrayFieldSpec, parent);
      }

      // Leaf controls
      return (
        <Controller
          key={name}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name={name as any}
          control={form.control}
          render={({ field, fieldState }) => {
            const err = fieldState.error ? [fieldState.error] : [];
            const ariaInvalid = fieldState.invalid || undefined;

            if (f.kind === 'text') {
              const textField = f as TextFieldSpec;
              const Input = driver.Input;
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <Input
                    id={id}
                    aria-invalid={ariaInvalid}
                    placeholder={f.placeholderI18n}
                    autoComplete={textField.autoComplete}
                    inputMode={textField.inputMode}
                    maxLength={textField.maxLength}
                    minLength={textField.minLength}
                    disabled={!enabled}
                    {...field}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            if (f.kind === 'textarea') {
              const textareaField = f as TextareaFieldSpec;
              const Textarea = driver.Textarea;
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <Textarea
                    id={id}
                    aria-invalid={ariaInvalid}
                    placeholder={f.placeholderI18n}
                    rows={textareaField.rows}
                    maxLength={textareaField.maxLength}
                    disabled={!enabled}
                    {...field}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            if (f.kind === 'select') {
              const selectField = f as SelectFieldSpec;
              const Select = driver.Select;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const src = toOptionsArray(selectField.options as any);
              const opts = useResolvedOptions(
                values,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                src as any,
                merged.resolvers
              );
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <Select
                    id={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={name as any}
                    aria-invalid={ariaInvalid}
                    disabled={!enabled}
                    value={field.value}
                    onChange={(v: unknown) => field.onChange(v)}
                    options={opts}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            if (f.kind === 'checkbox') {
              const Checkbox = driver.Checkbox;
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <Checkbox
                    id={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={name as any}
                    disabled={!enabled}
                    checked={!!field.value}
                    onCheckedChange={(v: boolean) => field.onChange(v)}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            if (f.kind === 'radio') {
              const radioField = f as RadioFieldSpec;
              const RadioGroup = driver.RadioGroup;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const src = toOptionsArray(radioField.options as any);
              const opts = useResolvedOptions(
                values,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                src as any,
                merged.resolvers
              );
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <RadioGroup
                    id={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={name as any}
                    disabled={!enabled}
                    value={field.value}
                    onValueChange={(v: unknown) => field.onChange(v)}
                    options={opts}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            if (f.kind === 'switch') {
              const Switch = driver.Switch;
              return (
                <DriverField {...commonWrapProps}>
                  {labelNode}
                  <Switch
                    id={id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={name as any}
                    disabled={!enabled}
                    checked={!!field.value}
                    onCheckedChange={(v: boolean) => field.onChange(v)}
                    {...(f.uiProps as Record<string, unknown>)}
                  />
                  {descNode}
                  {fieldState.invalid ? <DriverError errors={err} /> : null}
                </DriverField>
              );
            }
            return <></>;
          }}
        />
      );
    };

    const renderArray = (f: ArrayFieldSpec, parent?: string) => {
      const name = fieldPath(parent, f.name);
      const { fields, append, remove } = useFieldArray({
        control: form.control,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: name as any,
      });
      const canAdd = f.max == null || fields.length < f.max;
      const canRemove = (idx: number) =>
        (f.min == null ? fields.length > 0 : fields.length > f.min) && idx >= 0;
      const Button = driver.Button;
      const Label = driver.FieldLabel;
      return (
        <div key={name}>
          {f.labelI18n ? <Label>{f.labelI18n}</Label> : null}
          {fields.map((row, idx) => (
            <div key={row.id ?? idx}>
              {renderOne(f.of as FieldSpec, name, idx)}
              {canRemove(idx) ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(idx)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
          {canAdd ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => append({} as any)}
            >
              Add
            </Button>
          ) : null}
        </div>
      );
    };

    const onSubmit = async (data: FormValuesFor<M>) => {
      const actionKey = spec.actions?.[0]?.key ?? 'submit';
      if (merged.onSubmitOverride) {
        return merged.onSubmitOverride(data, actionKey);
      }
      // default: noop
    };

    const Button = driver.Button;
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {(spec.fields || []).map((f: FieldSpec, i: number) => (
          <React.Fragment key={i}>{renderOne(f)}</React.Fragment>
        ))}
        {spec.actions && spec.actions.length ? (
          <div>
            {spec.actions.map((a: { key: string; labelI18n: string }) => (
              <Button key={a.key} type="submit">
                {a.labelI18n}
              </Button>
            ))}
          </div>
        ) : null}
      </form>
    );
  }

  return {
    render: (spec: FormSpec<M>, options?: RenderOptions<FormValuesFor<M>>) => (
      <InternalForm
        spec={spec}
        options={options}
        merged={{
          ...conf,
          ...(options?.overrides ?? {}),
        }}
      />
    ),
  };
}
