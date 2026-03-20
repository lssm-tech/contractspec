import type { HandlerForOperationSpec } from '@contractspec/lib.contracts-spec';
import { CreateUser } from '../contracts/user';

export const userInputHandler: HandlerForOperationSpec<typeof CreateUser> = async (
	input
) => {
	return {
		email: input.email,
	};
};
