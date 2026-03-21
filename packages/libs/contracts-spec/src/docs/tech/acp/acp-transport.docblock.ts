import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { AcpTransportDocBlock } from '../../../acp/capabilities/acpTransport.capability';
import { AcpFsAccessDocBlock } from '../../../acp/commands/acpFsAccess.command';
import { AcpPromptTurnDocBlock } from '../../../acp/commands/acpPromptTurn.command';
import { AcpSessionInitDocBlock } from '../../../acp/commands/acpSessionInit.command';
import { AcpSessionResumeDocBlock } from '../../../acp/commands/acpSessionResume.command';
import { AcpSessionStopDocBlock } from '../../../acp/commands/acpSessionStop.command';
import { AcpTerminalExecDocBlock } from '../../../acp/commands/acpTerminalExec.command';
import { AcpToolCallsDocBlock } from '../../../acp/commands/acpToolCalls.command';

export const tech_acp_transport_DocBlocks: DocBlock[] = [
	AcpTransportDocBlock,
	AcpSessionInitDocBlock,
	AcpSessionResumeDocBlock,
	AcpSessionStopDocBlock,
	AcpPromptTurnDocBlock,
	AcpToolCallsDocBlock,
	AcpTerminalExecDocBlock,
	AcpFsAccessDocBlock,
];
