import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const FilesFeature = defineFeature({
	meta: {
		key: 'libs.files',
		version: '1.0.0',
		title: 'Files',
		description:
			'Files, documents and attachments module for ContractSpec applications',
		domain: 'files',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'files'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'file.upload', version: '1.0.0' },
		{ key: 'file.update', version: '1.0.0' },
		{ key: 'file.delete', version: '1.0.0' },
		{ key: 'file.get', version: '1.0.0' },
		{ key: 'file.list', version: '1.0.0' },
		{ key: 'file.downloadUrl', version: '1.0.0' },
		{ key: 'file.version.create', version: '1.0.0' },
		{ key: 'file.version.list', version: '1.0.0' },
		{ key: 'attachment.attach', version: '1.0.0' },
		{ key: 'attachment.detach', version: '1.0.0' },
		{ key: 'attachment.list', version: '1.0.0' },
		{ key: 'file.presignedUrl.create', version: '1.0.0' },
	],
	events: [
		{ key: 'file.uploaded', version: '1.0.0' },
		{ key: 'file.updated', version: '1.0.0' },
		{ key: 'file.deleted', version: '1.0.0' },
		{ key: 'file.version_created', version: '1.0.0' },
		{ key: 'attachment.attached', version: '1.0.0' },
		{ key: 'attachment.detached', version: '1.0.0' },
		{ key: 'upload.session_started', version: '1.0.0' },
		{ key: 'upload.session_completed', version: '1.0.0' },
	],
});
