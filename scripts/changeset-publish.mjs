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
  
  // _options contains the 'tag' if passed from the CLI (e.g. --tag canary)
  // But changeset publish hook API might not pass it through easily in older versions
  // We check if 'snapshot' is present in options or if tag is passed
  
  // In standard changesets usage:
  // "publish": "./scripts/changeset-publish.mjs"
  // This script receives (releasePlan, releases, config).
  // It doesn't strictly receive the CLI flags. 
  // However, we can rely on the `npmTag` logic we added to publish-packages.js
  // which checks NPM_TAG env var, OR we can infer from releasePlan.
  
  // When doing a snapshot release, the version in package.json is already updated 
  // by `changeset version --snapshot`. 
  // The `changeset publish` command then calls this script.
  // We just need to pass the tag down.
  
  // If we are running via `changeset publish --tag canary`, we want to capture that tag.
  // Unfortunately the JS API for custom publish scripts is minimal.
  // We rely on `NPM_TAG` env var which we set in the workflow or check CLI args.
  
  let npmTag = process.env.NPM_TAG || 'latest';
  
  // If not set, check if we can sniff it from argv (changeset CLI passes args)
  const tagArgIndex = process.argv.indexOf('--tag');
  if (tagArgIndex !== -1 && process.argv[tagArgIndex + 1]) {
    npmTag = process.argv[tagArgIndex + 1];
  }

  const results = await publishPackages({ packageNames, dryRun, npmTag });

  return results
    .filter((result) => result.published)
    .map((result) => ({
      name: result.name,
      version: result.version,
    }));
}




