const COMMANDS = new Set(['prebuild', 'transpile', 'types', 'dev', 'build']);

const USAGE = [
  'Usage: contractspec-bun-build [command] [options]',
  '',
  'Commands:',
  '  prebuild   Regenerate exports and publishConfig.exports',
  '  transpile  Transpile source with Bun',
  '  types      Emit declaration files with tsc',
  '  dev        Start Bun watch mode',
  '  build      Run prebuild + transpile + types (default)',
  '  help       Show this help message',
  '',
  'Options:',
  '  --all-targets  Build/watch bun, node, browser, and native targets when available',
  '  --no-bundle    Use Bun no-bundle transpilation',
  '  -h, --help     Show this help message',
].join('\n');

function isHelpToken(token) {
  return token === 'help' || token === '--help' || token === '-h';
}

export function formatUsage() {
  return USAGE;
}

export function parseCliArgs(argv) {
  const args = Array.isArray(argv) ? argv : [];
  const help = args.some(isHelpToken);
  const allTargets = args.includes('--all-targets');
  const noBundle = args.includes('--no-bundle');
  const command = args.find((arg) => !arg.startsWith('-')) ?? 'build';

  if (help) {
    return {
      ok: true,
      help: true,
      command: COMMANDS.has(command) ? command : 'build',
      allTargets,
      noBundle,
      error: null,
    };
  }

  if (!COMMANDS.has(command)) {
    return {
      ok: false,
      help: false,
      command,
      allTargets,
      noBundle,
      error: `Unknown contractspec-bun-build command: ${command}`,
    };
  }

  return {
    ok: true,
    help: false,
    command,
    allTargets,
    noBundle,
    error: null,
  };
}
