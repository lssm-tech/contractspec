#!/usr/bin/env node

/**
 * ContractSpec Bridge Server
 *
 * JSON-RPC server that provides access to ContractSpec workspace services
 * for the JetBrains plugin via stdio communication.
 */

import { createConnection, ProposedFeatures, TextDocuments } from 'vscode-languageserver/node';
import {
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
} from 'vscode-languageserver-protocol';

import { BridgeServer } from './handlers/BridgeServer';

// Create LSP connection for stdio communication
const connection = createConnection(ProposedFeatures.all);

// Create text documents manager
const documents = new TextDocuments();

// Initialize bridge server
const bridgeServer = new BridgeServer(connection);

connection.onInitialize((params: InitializeParams): InitializeResult => {
  return bridgeServer.onInitialize(params);
});

connection.onInitialized(() => {
  bridgeServer.onInitialized();
});

// Handle text document events
documents.onDidOpen((event) => {
  bridgeServer.onDidOpenTextDocument(event);
});

documents.onDidChangeContent((event) => {
  bridgeServer.onDidChangeTextDocument(event);
});

documents.onDidClose((event) => {
  bridgeServer.onDidCloseTextDocument(event);
});

// Listen on the connection
documents.listen(connection);
connection.listen();


