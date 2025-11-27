import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: '@lssm/lib.ui-kit: ContractSpec Docs',
  description: 'Universal UI components for React Native and Web.',
};

export default function UIKitLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.ui-kit</h1>
        <p className="text-muted-foreground">
          Universal UI components for React Native and Web, built on top of
          <code>nativewind</code> and <code>@rn-primitives</code>.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`npm install @lssm/lib.ui-kit
# or
bun add @lssm/lib.ui-kit`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Universal</strong>: Components render natively on
            iOS/Android and as standard HTML on web
          </li>
          <li>
            <strong>Styled with NativeWind</strong>: Uses Tailwind CSS classes
            for styling
          </li>
          <li>
            <strong>Accessible</strong>: Leverages <code>@rn-primitives</code>{' '}
            (Radix UI for Native)
          </li>
          <li>
            <strong>Atomic Design</strong>: Exports atoms, molecules, and
            organisms
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example Usage</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { Button } from '@lssm/lib.ui-kit/ui/button';
import { Text } from '@lssm/lib.ui-kit/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '@lssm/lib.ui-kit/ui/card';

export function MyComponent() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <Text>This works on Web and Native.</Text>
        <Button onPress={() => console.log('Clicked!')}>
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Components</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Form Controls</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>Button</li>
              <li>Input</li>
              <li>Checkbox</li>
              <li>Switch</li>
              <li>Select</li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Layout</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>Card</li>
              <li>Stack</li>
              <li>Separator</li>
              <li>Sheet</li>
            </ul>
          </div>
          <div className="card-subtle p-4">
            <h3 className="mb-2 font-semibold">Feedback</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>Alert</li>
              <li>Skeleton</li>
              <li>Progress</li>
              <li>Tooltip</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/schema" className="btn-ghost">
          Previous: Schema
        </Link>
        <Link href="/docs/libraries/design-system" className="btn-primary">
          Next: Design System <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}




















