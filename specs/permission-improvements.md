$ralplan We need to be really strong about roles and permissions system!
It should cover:
- `@contractspec/lib.contracts-spec`
  => to declare the roles and permissions (using the policy system?)
  => to use it across the many kind of contracts (operation, presentation, data-view, knowledge, etc...)
- Within The AppShell system: to allow restrict or adapt the navigation to each user.
- The personalization lib (`@contractspec/lib.personalization`) potentially need to leverage this system also

We may need to create a new package(s):
- a library to create a bunch of helpers that we can reuse within
- potentially a module to use the AppShell within the permission system + `@contractspec/lib.personalization`

Contraint we need to support two modes (combinated or isolated):
- "static" declaring everything in the codebase
- "dynamic" allowing user to configure permissions/roles within the database, allowing per workspace configurations

Note that: `@contractspec/lib.identity-rbac` is potentially higly related to this, but we just need to improve it and use it across the monorepo
- "hybrid", for example: to create template in the databae (using the "static" system) to easily configure "dynamic" permissions in app