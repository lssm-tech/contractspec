const origin = window.location.origin;

const config = {
  mcpServers: {
    'alpic-app': {
      url: origin,
      transport: 'http',
    },
  },
};

const originTargets = document.querySelectorAll('[data-origin]');
originTargets.forEach((node) => {
  node.textContent = origin;
});

const configNode = document.getElementById('config-json');
if (configNode) {
  configNode.textContent = JSON.stringify(config, null, 2);
}

const copyButton = document.getElementById('copy-config');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      copyButton.textContent = 'Copied';
      copyButton.classList.add('is-copied');
      setTimeout(() => {
        copyButton.textContent = 'Copy MCP config';
        copyButton.classList.remove('is-copied');
      }, 1600);
    } catch {
      copyButton.textContent = 'Copy failed';
      setTimeout(() => {
        copyButton.textContent = 'Copy MCP config';
      }, 1600);
    }
  });
}
