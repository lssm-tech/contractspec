# @contractspec/lib.translation-coliving

Shared i18n setup for Coliving apps.

- Namespaces: `common`, `landing`, `roommate`, `seller`
- Languages: `fr` (default), `en`

Web usage:

```tsx
import { useT } from '@contractspec/lib.translation-coliving';

const { t } = useT(['landing']);
```

Native usage:

```tsx
import { I18nProviderNative } from '@contractspec/lib.translation-coliving/native';
```
