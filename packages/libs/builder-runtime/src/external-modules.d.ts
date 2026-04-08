declare module 'pdf-parse' {
	interface PdfParseResult {
		text: string;
		numpages?: number;
	}

	export default function pdfParse(
		buffer: Uint8Array | Buffer
	): Promise<PdfParseResult>;
}

declare module 'tesseract.js' {
	interface TesseractRecognizeResult {
		data: {
			text: string;
			confidence: number;
		};
	}

	interface TesseractWorker {
		recognize(buffer: Uint8Array | Buffer): Promise<TesseractRecognizeResult>;
		terminate(): Promise<void>;
	}

	export function createWorker(language?: string): Promise<TesseractWorker>;
}
