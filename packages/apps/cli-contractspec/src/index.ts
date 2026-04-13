import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';
import { createProgram } from './program/create-program';
import { ContractSpecCliDocBlock } from './program/docblock';

registerDocBlocks([ContractSpecCliDocBlock]);

export async function run(argv: readonly string[] = process.argv) {
	return createProgram().parseAsync(argv);
}

export { ContractSpecCliDocBlock, createProgram };
