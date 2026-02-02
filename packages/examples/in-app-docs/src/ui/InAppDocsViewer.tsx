'use client';

import React, { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
import { inAppDocs } from '../docs/in-app-docs.docblock';
import { MarkdownRenderer } from '@contractspec/lib.example-shared-ui';

/**
 * InAppDocsViewer renders a simple navigation and content area for the example's DocBlocks.
 * Users can click titles on the left to switch between documentation pages.
 */
const InAppDocsViewer: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(inAppDocs[0]?.id ?? '');

  const activeDoc = inAppDocs.find((doc) => doc.id === activeId);

  return (
    <div style={{ display: 'flex', height: '100%', gap: '1rem' }}>
      <nav style={{ width: '220px', borderRight: '1px solid #eee' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {inAppDocs.map((doc) => (
            <li key={doc.id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setActiveId(doc.id)}
                style={{
                  background: doc.id === activeId ? '#f0f0f0' : 'transparent',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {doc.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        {activeDoc && (
          <>
            <h1>{activeDoc.title}</h1>
            <MarkdownRenderer content={activeDoc.body} />;
          </>
        )}
      </main>
    </div>
  );
};

export default InAppDocsViewer;
