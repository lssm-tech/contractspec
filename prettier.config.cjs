/**
 * Changesets formats release files with Prettier internally.
 * Keep this local config plugin-free so it does not inherit the parent
 * monorepo's Prettier plugins while ContractSpec itself uses Biome.
 */
module.exports = {
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	plugins: [],
};
