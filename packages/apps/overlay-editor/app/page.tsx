import { OverlayEditorClient } from '../components/overlay-editor-client';

export default function Page() {
  return (
    <main>
      <header>
        <h1>Overlay Editor</h1>
        <p>Create tenant overlays, preview JSON, and sign payloads in one place.</p>
      </header>
      <OverlayEditorClient />
    </main>
  );
}





