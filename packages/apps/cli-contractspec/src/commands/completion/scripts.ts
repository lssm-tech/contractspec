import type { CompletionShell } from './constants';

const EXECUTABLE_NAME = 'contractspec';

export function createCompletionScript(shell: CompletionShell): string {
	switch (shell) {
		case 'bash':
			return createBashCompletionScript();
		case 'zsh':
			return createZshCompletionScript();
		case 'fish':
			return createFishCompletionScript();
	}
}

function createBashCompletionScript(): string {
	return `# contractspec bash completion
_contractspec_completion() {
  local IFS=$'\\n'
  local response
  response=$(${EXECUTABLE_NAME} __complete -- "\${COMP_WORDS[@]:1}" 2>/dev/null) || return 0
  COMPREPLY=($(printf '%s\\n' "$response"))
}

complete -o default -F _contractspec_completion ${EXECUTABLE_NAME}
`;
}

function createZshCompletionScript(): string {
	return `#compdef contractspec
autoload -Uz bashcompinit
bashcompinit

_contractspec_completion() {
  local IFS=$'\\n'
  local response
  response=$(${EXECUTABLE_NAME} __complete -- "\${words[@]:2}" 2>/dev/null) || return 0
  reply=($(printf '%s\\n' "$response"))
}

complete -o default -F _contractspec_completion ${EXECUTABLE_NAME}
`;
}

function createFishCompletionScript(): string {
	return `# contractspec fish completion
function __contractspec_completion
  set -l tokens (commandline -opc)
  set -e tokens[1]
  set -l current (commandline -ct)
  ${EXECUTABLE_NAME} __complete -- $tokens $current 2>/dev/null
end

complete -c ${EXECUTABLE_NAME} -f -a "(__contractspec_completion)"
`;
}
