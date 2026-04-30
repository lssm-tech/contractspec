import type {
	GoogleDriveFile,
	GoogleDriveListFilesQuery,
	GoogleDriveProvider,
	ProviderDeltaSyncState,
} from '@contractspec/lib.contracts-integrations';
import { isProviderDeltaTombstoned } from '@contractspec/lib.contracts-integrations';
import type { DocumentFragment, DocumentProcessor } from './document-processor';
import type { EmbeddingService } from './embedding-service';
import type { VectorIndexer } from './vector-indexer';

export interface DriveIngestionResult {
	filesSeen: number;
	filesIndexed: number;
	filesSkipped: number;
	nextPageToken?: string;
	delta?: ProviderDeltaSyncState;
}

export class DriveIngestionAdapter {
	constructor(
		private readonly drive: GoogleDriveProvider,
		private readonly processor: DocumentProcessor,
		private readonly embeddings: EmbeddingService,
		private readonly indexer: VectorIndexer
	) {}

	async syncFiles(
		query?: GoogleDriveListFilesQuery
	): Promise<DriveIngestionResult> {
		const listed = await this.drive.listFiles(query);
		let filesIndexed = 0;
		let filesSkipped = 0;

		for (const metadata of listed.files) {
			if (isProviderDeltaTombstoned(metadata.delta)) {
				filesSkipped += 1;
				continue;
			}
			const file = await this.drive.getFile(metadata.id);
			if (!file || isProviderDeltaTombstoned(file.delta)) {
				filesSkipped += 1;
				continue;
			}
			await this.ingestFile(file);
			filesIndexed += 1;
		}

		return {
			filesSeen: listed.files.length,
			filesIndexed,
			filesSkipped,
			nextPageToken: listed.nextPageToken,
			delta: listed.delta,
		};
	}

	async ingestFile(file: GoogleDriveFile): Promise<DocumentFragment[]> {
		if (isProviderDeltaTombstoned(file.delta)) {
			return [];
		}
		const raw = {
			id: `drive:${file.id}`,
			mimeType: file.mimeType,
			data: await readDriveData(file),
			metadata: {
				provider: 'google-drive',
				fileId: file.id,
				name: file.name,
				mimeType: file.mimeType,
				modifiedTime: formatOptionalDate(file.modifiedTime),
				webViewLink: file.webViewLink ?? '',
				md5Checksum: file.md5Checksum ?? '',
			},
		};
		const fragments = await this.processor.process(raw);
		const embeddings = await this.embeddings.embedFragments(fragments);
		await this.indexer.upsert(fragments, embeddings);
		return fragments;
	}
}

async function readDriveData(file: GoogleDriveFile): Promise<Uint8Array> {
	if ('data' in file && file.data) {
		return file.data;
	}
	if (!file.stream) {
		throw new Error('Drive ingestion requires file data or stream');
	}
	const chunks: Uint8Array[] = [];
	for await (const chunk of file.stream) {
		chunks.push(chunk);
	}
	const byteLength = chunks.reduce(
		(total, chunk) => total + chunk.byteLength,
		0
	);
	const data = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		data.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return data;
}

function formatOptionalDate(value: string | Date | undefined): string {
	if (!value) return '';
	return typeof value === 'string' ? value : value.toISOString();
}
