'use client';

import {
	type StepperProps,
	Stepper as WebStepper,
} from '@contractspec/lib.ui-kit-web/ui/stepper';

export function Stepper(props: StepperProps) {
	return <WebStepper {...props} />;
}
