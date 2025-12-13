/**
 * Output channel for ContractSpec extension.
 */

import * as vscode from 'vscode';

/**
 * Create the ContractSpec output channel.
 */
export function createOutputChannel(): vscode.OutputChannel {
  return vscode.window.createOutputChannel('ContractSpec');
}

