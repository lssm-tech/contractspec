# Atomic UX & Intent-Driven Interfaces

"UI is built from atomic, intent-oriented components. Visual hierarchy follows mobile-first principles. Every visual or interactive unit must express a clear user intent, scale across viewports, and be reusable."

## Design Principles

- **Atomic Design** (Atoms → Molecules → Organisms → Templates → Pages)
- **Mobile-first**: layout, tap targets, animations default to small screens
- **Co-located separation**: Related components, hooks, and logic grouped by feature/domain but separated by concern (MVC pattern)
- **Visual tokens** (spacing, color, typography) follow design system constraints
- **Accessibility first**: ARIA roles/labels, keyboard/focus order, prefers-reduced-motion honored, 4.5:1 contrast for text.
- **State completeness**: Always implement loading, empty, error, and success states with visible feedback.
- **Performance**: Minimize bundle impact; prefer suspense/streaming and memoization over ad-hoc refs; avoid unnecessary re-renders.

## File Structure Example

```
components/
├── auth/
│   ├── hooks/
│   │   └── useAuth.tsx              // Shared auth state & API calls
│   ├── molecules/
│   │   └── AuthButton/
│   │       ├── index.tsx            // Export
│           ├── types.ts
│   │       ├── AuthButton.tsx       // Pure UI component
│   │       └── useAuthButton.tsx    // Button-specific logic
│   └── organisms/
│       └── LoginForm/
│           ├── index.tsx            // Export
│           ├── types.ts
│           ├── LoginForm.tsx        // Pure UI component
│           └── useLoginForm.tsx     // Form validation & behavior
├── ui/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   ├── Button.tsx           // Pure UI
│   │   │   └── useButton.tsx        // Button states & behavior
│   │   └── Input/
│   │       ├── index.tsx
│   │       ├── types.ts
│   │       ├── Input.tsx            // Pure UI
│   │       └── useInput.tsx         // Input validation & behavior
```

## Implementation Pattern

### ✅ Good: Separated Concerns

```jsx
// LoginForm.tsx - Pure UI
const LoginForm = ({ onSubmit, isLoading, errors }) => (
  <form onSubmit={onSubmit}>
    <Input error={errors.email} />
    <Input error={errors.password} type="password" />
    <Button loading={isLoading}>Login</Button>
  </form>
);

// useLoginForm.tsx - Form logic
const useLoginForm = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error) {
      setErrors(error.fields);
    }
    setIsLoading(false);
  };

  return { handleSubmit, errors, isLoading };
};

// index.tsx - Composition
export const LoginForm = () => {
  const formProps = useLoginForm();
  return <LoginFormUI {...formProps} />;
};
```

### ❌ Avoid: Mixed Concerns

```jsx
// Everything crammed together
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    // validation logic
    // API calls
    // error handling
    // UI updates
  }

  return (
    // Complex JSX with inline handlers
  )
}
```

## Dev Heuristics

✅ Is this component renderable and testable in isolation?
✅ Does it follow the design token system?
✅ Is it flexible across screen sizes with minimal overrides and responsive tokens?
✅ Can this component be reused in another screen/flow?
✅ Are related files co-located but properly separated (UI/logic/state)?
✅ Does each file have a single, clear responsibility?
✅ Can the UI component be used with different logic hooks?
✅ Can the logic hook be tested independently of the UI?
✅ Are ARIA/keyboard/focus/motion-reduction handled?
✅ Are loading/empty/error/success states implemented?
✅ Is data flow unidirectional (stateless UI + hooks) with minimal prop drilling?
✅ Does the change respect bundle/perf budgets (lazy load, memoize, avoid extra fetches)?
