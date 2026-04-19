# Canonical Release Workflow

ContractSpec now uses release capsules and generated release artifacts as the canonical release communication pipeline.

## Contributor flow

When a change affects published packages:

1. Run `contractspec release prepare`.
2. Review the generated `.changeset/<slug>.md` and `.changeset/<slug>.release.yaml`.
3. Review the generated artifacts under `generated/releases/`.
4. Commit the release metadata and generated release artifacts with the implementation change.
5. Push the branch.

`contractspec release prepare` will:

- infer the impacted published packages when possible,
- suggest release/customer/migration content,
- guide you through reviewing the release draft,
- write the paired changeset + release capsule safely,
- rebuild `generated/releases/*`,
- run `contractspec release check --strict`.

## Revising an existing release

Use `contractspec release edit <slug>` to update an existing release entry.

Do not hand-edit `.release.yaml` unless you are recovering from a broken draft and know exactly what you are doing. The guided command rewrites schema-safe YAML for you.

## Canonical outputs

The canonical generated outputs are:

- `generated/releases/manifest.json`
- `generated/releases/upgrade-manifest.json`
- `generated/releases/patch-notes.md`
- `generated/releases/customer-guide.md`
- `generated/releases/prompts/*.md`

The website changelog and stable GitHub Release publication consume these generated artifacts directly.
