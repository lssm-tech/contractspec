'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Dot } from 'lucide-react';

import { cn } from '@contractspec/lib.ui-kit-core/utils';

function InputOTP({
  className,
  containerClassName,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof OTPInput> & {
  ref?: React.Ref<React.ElementRef<typeof OTPInput>>;
}) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
  );
}

function InputOTPSlot({
  index,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  index: number;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] || {};

  return (
    <div
      ref={ref}
      className={cn(
        'border-input relative flex h-10 w-10 items-center justify-center border-y border-r text-base transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'ring-ring ring-offset-background z-10 ring-2',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
