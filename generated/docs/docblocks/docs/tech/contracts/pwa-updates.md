# PWA update management

PWA manifests describe the latest frontend release and the policy a runtime should apply when a browser is running an older version.

Use `defaultUpdatePolicy` for application-wide behavior and `release.updatePolicy` when a release needs a stricter or looser policy. Host applications still own service worker registration and activation; ContractSpec standardizes the API contract, decision state, and update prompt behavior.
