# ContractSpec VS Code Extension

## Development

```bash
# Install dependencies
bun install

# Build the extension
bun run build

# Watch mode
bun run dev

# Package for distribution
bun run package
```

## CI/CD

The extension is automatically built and tested on every PR. Publishing to the VS Code Marketplace is triggered:

- Manually via workflow dispatch
- Automatically on push to `release` branch

### Required Secrets

For publishing, the following GitHub secrets are required:

| Secret     | Description                                            |
| ---------- | ------------------------------------------------------ |
| `VSCE_PAT` | Personal Access Token for VS Code Marketplace          |
| `OVSX_PAT` | (Optional) Personal Access Token for Open VSX Registry |

### Creating a VS Code Marketplace PAT

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on User Settings → Personal Access Tokens
3. Create a new token with `Marketplace > Manage` scope
4. Copy the token and add it as `VSCE_PAT` secret in GitHub

## License

MIT
