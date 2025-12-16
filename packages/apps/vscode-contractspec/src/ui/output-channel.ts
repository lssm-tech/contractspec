/**
 * Output channel for ContractSpec extension.
 */

import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | undefined;

/**
 * Create the ContractSpec output channel.
 */
export function createOutputChannel(): vscode.OutputChannel {
  outputChannel = vscode.window.createOutputChannel('ContractSpec');
  return outputChannel;
}

/**
 * Get the ContractSpec output channel.
 * Must be called after createOutputChannel.
 */
export function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('ContractSpec');
  }
  return outputChannel;
}
