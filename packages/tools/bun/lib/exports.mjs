import { readFile, writeFile } from 'node:fs/promises';

const PLATFORM_SUFFIXES = ['bun', 'node', 'browser', 'web', 'native'];

function removeExtension(relativePath) {
  return relativePath.replace(/\.[^/.]+$/, '');
}

function stripPlatformSuffix(pathWithoutExtension) {
  for (const suffix of PLATFORM_SUFFIXES) {
    const suffixToken = `.${suffix}`;
    if (pathWithoutExtension.endsWith(suffixToken)) {
      return {
        pathWithoutSuffix: pathWithoutExtension.slice(0, -suffixToken.length),
        suffix,
      };
    }
  }

  return {
    pathWithoutSuffix: pathWithoutExtension,
    suffix: 'base',
  };
}

function normalizeExportPath(pathWithoutExtension) {
  if (pathWithoutExtension.startsWith('src/')) {
    return pathWithoutExtension.slice(4);
  }

  return pathWithoutExtension;
}

function toExportKey(pathWithoutExtension) {
  const normalizedPath = normalizeExportPath(pathWithoutExtension);

  if (normalizedPath === 'index') {
    return '.';
  }

  if (normalizedPath.endsWith('/index')) {
    return `./${normalizedPath.slice(0, -6)}`;
  }

  return `./${normalizedPath}`;
}

function toExactExportKey(pathWithoutExtension) {
  const normalizedPath = normalizeExportPath(pathWithoutExtension);
  if (normalizedPath === 'index') {
    return '.';
  }

  return `./${normalizedPath}`;
}

function stripBuildRoot(pathWithoutExtension, root) {
  if (!root || root === '.') {
    return pathWithoutExtension;
  }

  if (pathWithoutExtension === root) {
    return 'index';
  }

  if (pathWithoutExtension.startsWith(`${root}/`)) {
    return pathWithoutExtension.slice(root.length + 1);
  }

  return pathWithoutExtension;
}

function toOutputPath(sourceRelativePath, target, targetRoots) {
  const withoutExtension = removeExtension(sourceRelativePath);
  const outputRoot =
    target === 'types'
      ? (targetRoots.types ?? targetRoots.bun ?? '.')
      : (targetRoots[target] ?? targetRoots.bun ?? '.');
  const outputRelativePath = stripBuildRoot(withoutExtension, outputRoot);

  const extension = target === 'types' ? 'd.ts' : 'js';
  const outputBaseDir =
    target === 'bun' || target === 'types' ? 'dist' : `dist/${target}`;

  return `./${outputBaseDir}/${outputRelativePath}.${extension}`;
}

function toSourcePath(sourceRelativePath) {
  return `./${sourceRelativePath}`;
}

function pickVariant(variants, mode) {
  if (mode === 'bun') {
    return (
      variants.bun ??
      variants.node ??
      variants.browser ??
      variants.web ??
      variants.base ??
      null
    );
  }

  if (mode === 'node') {
    return variants.node ?? variants.base ?? variants.bun ?? null;
  }

  if (mode === 'browser') {
    return variants.browser ?? variants.web ?? variants.base ?? null;
  }

  return (
    variants.base ??
    variants.bun ??
    variants.node ??
    variants.browser ??
    variants.web ??
    null
  );
}

function buildPublishExportEntry(variants, targets, targetRoots) {
  const typesSource = pickVariant(variants, 'default');
  const bunSource = pickVariant(variants, 'bun');
  const nodeSource = targets.node ? pickVariant(variants, 'node') : null;
  const browserSource = targets.browser
    ? pickVariant(variants, 'browser')
    : null;
  const defaultSource = bunSource ?? nodeSource ?? browserSource ?? typesSource;

  const entry = {};

  if (typesSource) {
    entry.types = toOutputPath(typesSource, 'types', targetRoots);
  }

  if (bunSource) {
    entry.bun = toOutputPath(bunSource, 'bun', targetRoots);
  }

  if (nodeSource) {
    entry.node = toOutputPath(nodeSource, 'node', targetRoots);
  }

  if (browserSource) {
    entry.browser = toOutputPath(browserSource, 'browser', targetRoots);
  }

  if (defaultSource) {
    entry.default = toOutputPath(defaultSource, 'bun', targetRoots);
  }

  return entry;
}

function buildDevExportEntry(variants) {
  const source = pickVariant(variants, 'default');
  return source ? toSourcePath(source) : null;
}

function sortExportMap(exportMap) {
  const sorted = {};
  if (exportMap['.']) {
    sorted['.'] = exportMap['.'];
  }

  const keys = Object.keys(exportMap)
    .filter((key) => key !== '.')
    .sort((a, b) => a.localeCompare(b));
  for (const key of keys) {
    sorted[key] = exportMap[key];
  }

  return sorted;
}

function buildExportMaps(entries, targets, targetRoots) {
  const variantsByKey = new Map();

  for (const entry of entries) {
    const withoutExtension = removeExtension(entry);
    const { pathWithoutSuffix, suffix } = stripPlatformSuffix(withoutExtension);
    const canonicalKey = toExportKey(pathWithoutSuffix);
    const exactKey = toExactExportKey(withoutExtension);

    for (const key of [canonicalKey, exactKey]) {
      if (!variantsByKey.has(key)) {
        variantsByKey.set(key, {});
      }

      const variants = variantsByKey.get(key);
      if (!variants[suffix]) {
        variants[suffix] = entry;
      }
    }
  }

  if (!variantsByKey.has('.') && entries.length === 1) {
    const singleEntry = entries[0];
    const { suffix } = stripPlatformSuffix(removeExtension(singleEntry));
    variantsByKey.set('.', { [suffix]: singleEntry });
  }

  const devExports = {};
  const publishExports = {};
  for (const [key, variants] of variantsByKey.entries()) {
    const devExportEntry = buildDevExportEntry(variants);
    if (devExportEntry) {
      devExports[key] = devExportEntry;
    }

    publishExports[key] = buildPublishExportEntry(
      variants,
      targets,
      targetRoots
    );
  }

  return {
    devExports: sortExportMap(devExports),
    publishExports: sortExportMap(publishExports),
  };
}

export async function rewritePackageExports(
  packageJsonPath,
  entries,
  targets,
  targetRoots
) {
  const packageJsonContent = await readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const { devExports, publishExports } = buildExportMaps(
    entries,
    targets,
    targetRoots
  );

  packageJson.exports = devExports;
  packageJson.publishConfig = {
    ...(packageJson.publishConfig ?? {}),
    exports: publishExports,
  };

  if (publishExports['.']?.types) {
    packageJson.types = publishExports['.']?.types;
  }

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8'
  );
}
