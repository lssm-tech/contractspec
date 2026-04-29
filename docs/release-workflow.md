# Canonical Release Workflow

ContractSpec now uses release capsules and generated release artifacts as the canonical release communication pipeline.

## Contributor flow

When a change affects published packages:

1. Run `contractspec release prepare`.
2. Review the generated `.changeset/<slug>.md` and `.changeset/<slug>.release.yaml`.
3. Review the current-release generated artifacts under `generated/releases/`.
4. Commit the release metadata and generated release artifacts with the implementation change.
5. Push the branch.

`contractspec release prepare` will:

- infer the impacted published packages when possible,
- suggest release/customer/migration content,
- guide you through reviewing the release draft,
- write the paired changeset + release capsule safely,
- rebuild the current-release `generated/releases/*` bundle,
- run `contractspec release check --strict`.

## Revising an existing release

Use `contractspec release edit <slug>` to update an existing release entry.

Do not hand-edit `.release.yaml` unless you are recovering from a broken draft and know exactly what you are doing. The guided command rewrites schema-safe YAML for you.

## Canonical outputs

The default generated outputs are the compact current-release bundle:

- `generated/releases/manifest.json`
- `generated/releases/upgrade-manifest.json`
- `generated/releases/patch-notes.md`
- `generated/releases/customer-guide.md`
- `generated/releases/prompts/*.md`

Stable GitHub Release publication consumes these current-release artifacts directly.

Full historical release output is explicit:

```bash
contractspec release build --scope all --output generated/releases/history
```

Website changelog pages prefer `generated/releases/history/manifest.json` when it exists and fall back to the current-release manifest for local preview builds.
