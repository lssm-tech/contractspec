'use client';

import * as React from 'react';
import {
  Stepper as WebStepper,
  type StepperProps,
} from '@contractspec/lib.ui-kit-web/ui/stepper';

export function Stepper(props: StepperProps) {
  return <WebStepper {...props} />;
}
