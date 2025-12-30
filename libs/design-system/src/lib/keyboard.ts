export type KeyboardKind =
  | 'text'
  | 'email'
  | 'password'
  | 'new-password'
  | 'username'
  | 'url'
  | 'search'
  | 'phone'
  | 'tel' // alias of phone
  | 'number'
  | 'int' // alias of number
  | 'decimal'
  | 'numbers-and-punctuation'
  | 'otp'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'address-line1'
  | 'address-line2'
  | 'postal-code'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-csc'
  | 'off'
  | 'date';

// WHATWG HTML autofill tokens (subset + extensible). See:
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
export type AutoCompleteToken =
  | 'on'
  | 'off'
  // identity
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  // organization
  | 'organization-title'
  | 'organization'
  // address
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  // credit card / payment
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-amount'
  // personal
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'photo'
  // contact
  | 'email'
  | 'impp'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-local-prefix'
  | 'tel-local-suffix'
  | 'tel-extension'
  | 'url'
  // webauthn and sections (allow prefix)
  | 'webauthn'
  | `section-${string}`
  // allow future spec additions while keeping strong hints
  | (string & {});

export interface KeyboardOptions {
  kind?: KeyboardKind;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: AutoCompleteToken;
  autoCorrect?: boolean;
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'search' | 'send';
}

function deriveKindFromAutoComplete(
  ac?: AutoCompleteToken
): KeyboardKind | undefined {
  if (!ac) return undefined;
  switch (ac) {
    // Direct mappings
    case 'email':
      return 'email';
    case 'url':
      return 'url';
    case 'username':
      return 'username';
    case 'new-password':
      return 'new-password';
    case 'current-password':
      return 'password';
    case 'one-time-code':
      return 'otp';
    case 'tel':
    case 'tel-country-code':
    case 'tel-national':
    case 'tel-area-code':
    case 'tel-local':
    case 'tel-local-prefix':
    case 'tel-local-suffix':
    case 'tel-extension':
      return 'tel';
    // Numeric leaning
    case 'postal-code':
    case 'cc-number':
    case 'cc-csc':
    case 'bday-day':
    case 'bday-month':
    case 'bday-year':
      return 'int';
    case 'cc-exp':
    case 'cc-exp-month':
    case 'cc-exp-year':
      return 'numbers-and-punctuation';
    // Date-like
    case 'bday':
      return 'date';
    // Everything else is plain text (names, organization, street-address, etc.)
    default:
      return 'text';
  }
}

function applyAutoCompleteDefaultsWeb(
  res: Record<string, unknown>,
  ac?: AutoCompleteToken
) {
  if (!ac) return;
  // Capitalization defaults for human names/org titles
  const wordsCaps: AutoCompleteToken[] = [
    'name',
    'given-name',
    'additional-name',
    'family-name',
    'honorific-prefix',
    'honorific-suffix',
    'nickname',
    'organization',
    'organization-title',
    'cc-name',
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
  ];
  if (wordsCaps.includes(ac)) {
    (res as Record<string, string>).autoCapitalize = 'words';
  }
  // Lowercase identifiers
  const noneCaps: AutoCompleteToken[] = [
    'username',
    'new-password',
    'current-password',
    'one-time-code',
    'email',
    'url',
  ];
  if (noneCaps.includes(ac)) {
    (res as Record<string, string>).autoCapitalize = 'none';
  }
}

function applyAutoCompleteDefaultsNative(
  native: Record<string, unknown>,
  ac?: AutoCompleteToken
) {
  if (!ac) return;
  // iOS textContentType hints where available (best-effort)
  const textContentMap: Partial<Record<AutoCompleteToken, string>> = {
    name: 'name',
    'given-name': 'givenName',
    'additional-name': 'middleName',
    'family-name': 'familyName',
    username: 'username',
    'current-password': 'password',
    'new-password': 'newPassword',
    email: 'emailAddress',
    url: 'URL',
    tel: 'telephoneNumber',
    'address-line1': 'streetAddressLine1',
    'address-line2': 'streetAddressLine2',
    'postal-code': 'postalCode',
    organization: 'organizationName',
    'organization-title': 'jobTitle',
    'one-time-code': 'oneTimeCode',
  };
  const tc = textContentMap[ac];
  if (tc) (native as Record<string, string>).textContentType = tc;
  // Capitalization defaults
  const wordsCaps: AutoCompleteToken[] = [
    'name',
    'given-name',
    'additional-name',
    'family-name',
    'honorific-prefix',
    'honorific-suffix',
    'nickname',
    'organization',
    'organization-title',
    'cc-name',
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
  ];
  if (wordsCaps.includes(ac)) {
    (native as Record<string, string>).autoCapitalize = 'words';
  }
  const noneCaps: AutoCompleteToken[] = [
    'username',
    'new-password',
    'current-password',
    'one-time-code',
    'email',
    'url',
  ];
  if (noneCaps.includes(ac)) {
    (native as Record<string, string>).autoCapitalize = 'none';
  }
}

export function mapKeyboardToWeb(opts?: KeyboardOptions) {
  const kind =
    opts?.kind ?? deriveKindFromAutoComplete(opts?.autoComplete) ?? 'text';
  const res: Record<string, unknown> = {};

  switch (kind) {
    case 'password':
      res.type = 'password';
      res.autoCapitalize = 'none';
      res.autoComplete = opts?.autoComplete ?? 'current-password';
      if (opts?.autoCorrect != null) res.autoCorrect = opts.autoCorrect;
      break;
    case 'new-password':
      res.type = 'password';
      res.autoCapitalize = 'none';
      res.autoComplete = opts?.autoComplete ?? 'new-password';
      if (opts?.autoCorrect != null) res.autoCorrect = opts.autoCorrect;
      break;
    case 'username':
      res.type = 'text';
      res.autoCapitalize = 'none';
      res.autoComplete = opts?.autoComplete ?? 'username';
      break;
    case 'email':
      res.type = 'email';
      res.inputMode = 'email';
      res.autoCapitalize = 'none';
      res.autoComplete = opts?.autoComplete ?? 'email';
      break;
    case 'url':
      res.type = 'url';
      res.inputMode = 'url';
      res.autoComplete = opts?.autoComplete ?? 'url';
      break;
    case 'search':
      res.type = 'search';
      res.inputMode = 'search';
      res.enterKeyHint = opts?.enterKeyHint ?? 'search';
      res.autoComplete = opts?.autoComplete ?? 'off';
      break;
    case 'phone':
    case 'tel':
      res.type = 'tel';
      res.inputMode = 'tel';
      res.autoComplete = opts?.autoComplete ?? 'tel';
      break;
    case 'number':
    case 'int':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.pattern = '[0-9]*';
      break;
    case 'decimal':
      res.type = 'text';
      res.inputMode = 'decimal';
      (res as Record<string, unknown>).step = 'any';
      break;
    case 'numbers-and-punctuation':
      res.type = 'text';
      res.inputMode = 'text';
      res.pattern = '[0-9.,-]*';
      break;
    case 'otp':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.autoComplete = opts?.autoComplete ?? 'one-time-code';
      res.autoCapitalize = 'none';
      break;
    case 'name':
      res.type = 'text';
      res.autoComplete = opts?.autoComplete ?? 'name';
      res.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'given-name':
      res.type = 'text';
      res.autoComplete = opts?.autoComplete ?? 'given-name';
      res.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'family-name':
      res.type = 'text';
      res.autoComplete = opts?.autoComplete ?? 'family-name';
      res.autoCapitalize = opts?.autoCapitalize ?? 'words';
      break;
    case 'address-line1':
      res.type = 'text';
      res.autoComplete = opts?.autoComplete ?? 'address-line1';
      break;
    case 'address-line2':
      res.type = 'text';
      res.autoComplete = opts?.autoComplete ?? 'address-line2';
      break;
    case 'postal-code':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.pattern = '[0-9]*';
      res.autoComplete = opts?.autoComplete ?? 'postal-code';
      break;
    case 'cc-number':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.pattern = '[0-9]*';
      res.autoComplete = opts?.autoComplete ?? 'cc-number';
      break;
    case 'cc-exp':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.pattern = '[0-9/]*';
      res.autoComplete = opts?.autoComplete ?? 'cc-exp';
      break;
    case 'cc-csc':
      res.type = 'text';
      res.inputMode = 'numeric';
      res.pattern = '[0-9]*';
      res.autoComplete = opts?.autoComplete ?? 'cc-csc';
      break;
    case 'off':
      res.type = 'text';
      res.autoComplete = 'off';
      break;
    case 'date':
      res.type = 'date';
      res.inputMode = 'date';
      res.pattern = '[0-9./-]*';
      break;
    default:
      res.type = 'text';
      break;
  }

  if (opts?.autoCapitalize) res.autoCapitalize = opts.autoCapitalize;
  if (opts?.autoComplete) res.autoComplete = opts.autoComplete;
  if (opts?.autoCorrect != null) res.autoCorrect = opts.autoCorrect;
  if (opts?.enterKeyHint) res.enterKeyHint = opts.enterKeyHint;
  // Apply additional defaults based on autofill tokens
  applyAutoCompleteDefaultsWeb(res, opts?.autoComplete);
  return res;
}

export function mapKeyboardToNative(opts?: KeyboardOptions) {
  const kind =
    opts?.kind ?? deriveKindFromAutoComplete(opts?.autoComplete) ?? 'text';
  const native: Record<string, unknown> = {};

  switch (kind) {
    case 'password':
      native.secureTextEntry = true;
      native.textContentType = 'password';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'password';
      break;
    case 'new-password':
      native.secureTextEntry = true;
      native.textContentType = 'newPassword';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'new-password';
      break;
    case 'username':
      native.textContentType = 'username';
      native.keyboardType = 'default';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'username';
      break;
    case 'email':
      native.keyboardType = 'email-address';
      native.textContentType = 'emailAddress';
      native.autoCapitalize = 'none';
      native.autoComplete = opts?.autoComplete ?? 'email';
      break;
    case 'url':
      native.keyboardType = 'url';
      native.textContentType = 'URL';
      native.autoComplete = opts?.autoComplete ?? 'url';
      break;
    case 'search':
      native.keyboardType = 'default';
      native.returnKeyType = 'search';
      native.autoComplete = opts?.autoComplete ?? 'off';
      break;
    case 'phone':
    case 'tel':
      native.keyboardType = 'phone-pad';
      native.textContentType = 'telephoneNumber';
      native.autoComplete = opts?.autoComplete ?? 'tel';
      break;
    case 'number':
    case 'int':
      native.keyboardType = 'number-pad';
      break;
    case 'decimal':
      native.keyboardType = 'decimal-pad';
      break;
    case 'numbers-and-punctuation':
      native.keyboardType = 'numbers-and-punctuation';
      break;
    case 'otp':
      native.keyboardType = 'number-pad';
      native.textContentType = 'oneTimeCode';
      native.autoComplete = opts?.autoComplete ?? 'one-time-code';
      native.autoCapitalize = 'none';
      break;
    case 'name':
      native.textContentType = 'name';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'name';
      break;
    case 'given-name':
      native.textContentType = 'givenName';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'given-name';
      break;
    case 'family-name':
      native.textContentType = 'familyName';
      native.autoCapitalize = 'words';
      native.autoComplete = opts?.autoComplete ?? 'family-name';
      break;
    case 'address-line1':
      native.textContentType = 'streetAddressLine1';
      native.autoComplete = opts?.autoComplete ?? 'address-line1';
      break;
    case 'address-line2':
      native.textContentType = 'streetAddressLine2';
      native.autoComplete = opts?.autoComplete ?? 'address-line2';
      break;
    case 'postal-code':
      native.keyboardType = 'numbers-and-punctuation';
      native.textContentType = 'postalCode';
      native.autoComplete = opts?.autoComplete ?? 'postal-code';
      break;
    case 'cc-number':
      native.keyboardType = 'number-pad';
      native.textContentType = 'creditCardNumber';
      native.autoComplete = opts?.autoComplete ?? 'cc-number';
      break;
    case 'cc-exp':
      native.keyboardType = 'numbers-and-punctuation';
      native.autoComplete = opts?.autoComplete ?? 'cc-exp';
      break;
    case 'cc-csc':
      native.keyboardType = 'number-pad';
      native.autoComplete = opts?.autoComplete ?? 'cc-csc';
      break;
    case 'off':
      native.autoComplete = 'off';
      break;
    case 'date':
      native.keyboardType = 'default';
      break;
    default:
      native.keyboardType = 'default';
      break;
  }

  if (opts?.autoCapitalize) native.autoCapitalize = opts.autoCapitalize;
  if (opts?.autoCorrect != null) native.autoCorrect = opts.autoCorrect;

  if (opts?.enterKeyHint) {
    const map: Record<string, string> = {
      enter: 'default',
      done: 'done',
      go: 'go',
      next: 'next',
      search: 'search',
      send: 'send',
    };
    native.returnKeyType = map[opts.enterKeyHint] ?? 'default';
  }

  // Apply additional defaults based on autofill tokens
  applyAutoCompleteDefaultsNative(native, opts?.autoComplete);

  return native;
}
