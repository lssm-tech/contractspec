import { publishPackages } from './publish-packages.js';

const isDryRun = () =>
  process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';

export default async function publishWithChangesets(
  releasePlan,
  _packages,
  _options
) {
  const releases = releasePlan.releases?.filter(
    (release) => release.type && release.type !== 'none'
  );

  if (!releases || releases.length === 0) {
    console.log('[changeset] No packages to publish.');
    return [];
  }

  const packageNames = releases.map((release) => release.name);
  const dryRun = isDryRun();
  const results = await publishPackages({ packageNames, dryRun });

  return results
    .filter((result) => result.published)
    .map((result) => ({
      name: result.name,
      version: result.version,
    }));
}




