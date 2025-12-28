import * as React from 'react';
import { Button, type ButtonProps } from './Button';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Edit as EditIcon,
  Eye as ViewIcon,
  ToggleLeft as ToggleLeftIcon,
  ToggleRight as ToggleRightIcon,
  Trash2 as DeleteIcon,
} from 'lucide-react';
import { Box } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';

const _actionBtn = cva('', {
  variants: {
    tone: {
      neutral: 'default',
      danger: 'destructive',
      subtle: 'secondary',
      outline: 'outline',
    },
    size: {
      sm: 'sm',
      md: 'default',
      lg: 'lg',
      icon: 'icon',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

type ActionBtnProps = Omit<ButtonProps, 'size' | 'variant'> &
  VariantProps<typeof _actionBtn> & {
    label?: React.ReactNode;
    iconLeft?: React.ReactNode;
  };

function toVariant(
  tone: NonNullable<VariantProps<typeof _actionBtn>['tone']>
): ButtonProps['variant'] {
  switch (tone) {
    case 'danger':
      return 'destructive';
    case 'subtle':
      return 'secondary';
    case 'outline':
      return 'outline';
    default:
      return 'default';
  }
}

function toSize(
  size: NonNullable<VariantProps<typeof _actionBtn>['size']>
): ButtonProps['size'] {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'icon':
      return 'icon';
    default:
      return 'default';
  }
}

function ActionButtonBase({
  tone = 'neutral',
  size = 'md',
  label,
  iconLeft,
  ...props
}: ActionBtnProps) {
  return (
    <Button
      variant={toVariant(tone || 'neutral')}
      size={toSize(size || 'md')}
      {...props}
    >
      {iconLeft ? (
        <Box className="mr-2 inline-flex h-4 w-4">{iconLeft}</Box>
      ) : null}
      <Text>{label}</Text>
    </Button>
  );
}

export function EditButton(props: Omit<ActionBtnProps, 'iconLeft' | 'tone'>) {
  return (
    <ActionButtonBase iconLeft={<EditIcon className="h-4 w-4" />} {...props} />
  );
}

export function DeleteButton(props: Omit<ActionBtnProps, 'iconLeft'>) {
  return (
    <ActionButtonBase
      iconLeft={<DeleteIcon className="h-4 w-4" />}
      tone="danger"
      {...props}
    />
  );
}

export function ViewButton(props: Omit<ActionBtnProps, 'iconLeft'>) {
  return (
    <ActionButtonBase iconLeft={<ViewIcon className="h-4 w-4" />} {...props} />
  );
}

export function ToggleButton(
  props: Omit<ActionBtnProps, 'iconLeft'> & { active?: boolean }
) {
  const { active, ...rest } = props;
  return (
    <ActionButtonBase
      iconLeft={
        active ? (
          <ToggleLeftIcon className="h-4 w-4" />
        ) : (
          <ToggleRightIcon className="h-4 w-4" />
        )
      }
      {...rest}
    />
  );
}

export function ToggleLeftButton(props: Omit<ActionBtnProps, 'iconLeft'>) {
  return (
    <ActionButtonBase
      iconLeft={<ToggleLeftIcon className="h-4 w-4" />}
      {...props}
    />
  );
}

export function ToggleRightButton(props: Omit<ActionBtnProps, 'iconLeft'>) {
  return (
    <ActionButtonBase
      iconLeft={<ToggleRightIcon className="h-4 w-4" />}
      {...props}
    />
  );
}
