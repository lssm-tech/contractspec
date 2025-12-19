import path from 'node:path';
import fs from 'node:fs/promises';

const ROOT_DIR = process.cwd();
const LICENSE_PATH = path.join(ROOT_DIR, 'LICENSE');

async function main() {
    console.log('Reading root LICENSE...');
    const licenseContent = await fs.readFile(LICENSE_PATH, 'utf-8');

    console.log('Finding package.json files...');

    const glob = new Bun.Glob('packages/**/package.json');

    let count = 0;
    // Scan manually to avoid node_modules, although Bun.Glob might have options, 
    // iterating and checking path is safest and simple.
    for await (const pkgRelativePath of glob.scan({ cwd: ROOT_DIR, absolute: false })) {
        if (pkgRelativePath.includes('node_modules')) continue;

        const pkgPath = path.join(ROOT_DIR, pkgRelativePath);
        const pkgDir = path.dirname(pkgPath);

        // 1. Write LICENSE file
        const destLicensePath = path.join(pkgDir, 'LICENSE');
        await fs.writeFile(destLicensePath, licenseContent);

        // 2. Update package.json
        try {
            const pkgContent = await fs.readFile(pkgPath, 'utf-8');
            const pkg = JSON.parse(pkgContent);

            if (pkg.license !== 'MIT') {
                pkg.license = 'MIT';
                await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
                console.log(`Updated: ${pkgRelativePath}`);
            } else {
                // console.log(`Verified: ${pkgRelativePath}`);
            }
        } catch (err) {
            console.error(`Error processing ${pkgRelativePath}:`, err);
        }
        count++;
    }

    console.log(`Processed ${count} packages.`);
}

main().catch(console.error);
