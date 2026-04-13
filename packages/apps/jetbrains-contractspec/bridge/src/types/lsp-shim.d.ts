declare module 'vscode-languageserver/node' {
	export interface Connection {
		onRequest(method: string, handler: (params: any) => any): void;
		onInitialize(handler: (params: any) => any): void;
		onInitialized(handler: () => void): void;
		listen(): void;
		console: {
			log(message: string): void;
			error(message: string): void;
		};
	}

	export const ProposedFeatures: {
		all: unknown;
	};

	export class TextDocuments<T = any> {
		onDidOpen(handler: (event: T) => void): void;
		onDidChangeContent(handler: (event: T) => void): void;
		onDidClose(handler: (event: T) => void): void;
		listen(connection: Connection): void;
	}

	export function createConnection(features: unknown): Connection;
}

declare module 'vscode-languageserver-protocol' {
	export interface InitializeParams {
		rootUri?: string | null;
		rootPath?: string | null;
	}

	export interface InitializeResult {
		capabilities: Record<string, unknown>;
		serverInfo?: {
			name: string;
			version?: string;
		};
	}

	export interface TextDocumentChangeEvent {
		document: {
			uri: string;
		};
	}
}
