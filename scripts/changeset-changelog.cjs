const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

function readCapsule(changesetId, cwd) {
	const capsulePath = path.join(
		cwd,
		'.changeset',
		`${changesetId}.release.yaml`
	);
	if (!fs.existsSync(capsulePath)) {
		return null;
	}

	try {
		return yaml.load(fs.readFileSync(capsulePath, 'utf8')) || null;
	} catch {
		return null;
	}
}

async function getReleaseLine(changeset, type) {
	const capsule = readCapsule(changeset.id, process.cwd());
	const summary =
		capsule && typeof capsule.summary === 'string'
			? capsule.summary
			: changeset.summary;
	const lines = [`- ${summary}`];

	if (
		capsule &&
		Array.isArray(capsule.packages) &&
		capsule.packages.length > 0
	) {
		lines.push(
			`  - Packages: ${capsule.packages
				.map(
					(pkg) =>
						`${pkg.name}${pkg.version ? `@${pkg.version}` : ''} (${pkg.releaseType || type})`
				)
				.join(', ')}`
		);
	}

	if (
		capsule &&
		Array.isArray(capsule.migrationInstructions) &&
		capsule.migrationInstructions.length > 0
	) {
		lines.push(
			`  - Migration: ${capsule.migrationInstructions
				.map((instruction) => instruction.summary || instruction.title)
				.join('; ')}`
		);
	}

	if (
		capsule &&
		Array.isArray(capsule.deprecations) &&
		capsule.deprecations.length > 0
	) {
		lines.push(`  - Deprecations: ${capsule.deprecations.join('; ')}`);
	}

	return lines.join('\n');
}

async function getDependencyReleaseLine(changesets, dependenciesUpdated) {
	if (dependenciesUpdated.length === 0) {
		return '';
	}

	const changesetLines = changesets.map((changeset) => {
		const capsule = readCapsule(changeset.id, process.cwd());
		const label =
			capsule && typeof capsule.summary === 'string'
				? capsule.summary
				: changeset.summary;
		return `- Updated dependencies because of ${label}`;
	});
	const dependencyLines = dependenciesUpdated.map(
		(dependency) => `  - ${dependency.name}@${dependency.newVersion}`
	);

	return [...changesetLines, ...dependencyLines].join('\n');
}

module.exports = {
	getReleaseLine,
	getDependencyReleaseLine,
};
