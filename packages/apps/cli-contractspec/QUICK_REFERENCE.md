# ContractSpec CLI Reference

## Primary onboarding commands

```bash
contractspec onboard
contractspec onboard <track...> --dry-run --json
contractspec onboard knowledge --example knowledge-canon
contractspec init --preset connect
contractspec init --preset builder-managed
```

## Authoring and verification

```bash
contractspec create --type operation
contractspec create --type theme
contractspec create --type knowledge
contractspec generate
contractspec validate
contractspec ci
```

## Reuse and adoption

```bash
contractspec connect adoption sync
contractspec connect adoption resolve --family contracts --stdin
contractspec connect adoption resolve --family ui --stdin
contractspec connect adoption resolve --family sharedLibs --stdin
contractspec connect adoption resolve --family solutions --stdin
```
