import { Elysia } from 'elysia';
import * as Y from 'yjs';
import { z } from 'zod';

// In-memory rooms keyed by `${contentId}:${locale}`
const rooms = new Map<string, { doc: Y.Doc; clients: Set<any> }>();

export const collabModule = new Elysia({ name: 'collab-module' })
  // Minimal server-processing endpoints used by BlockNote
  .post(
    '/server-processing/image',
    ({ body }) => {
      if (
        !body.dataUrl ||
        !/^data:image\/(png|jpeg|webp);base64,/.test(body.dataUrl)
      ) {
        return new Response('Unsupported image payload', { status: 415 });
      }
      return new Response(JSON.stringify({ url: body.dataUrl }), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
    {
      body: z.object({ dataUrl: z.string() }),
    }
  )
  .post(
    '/server-processing/file',
    async ({ body }) => {
      if (
        !body.dataUrl ||
        !/^data:([\w-]+\/[\w-]+);base64,/.test(body.dataUrl)
      ) {
        return new Response('Unsupported file payload', { status: 415 });
      }
      // In production, persist file and return a durable URL
      return new Response(
        JSON.stringify({ url: body.dataUrl, name: body.filename || '' }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    },
    {
      body: z.object({ dataUrl: z.string(), name: z.string().optional() }),
    }
  )
  .post(
    '/server-processing/embed',
    ({ body }) => {
      try {
        const embedUrl = new URL(String(body.url || ''));
        const allowed = ['www.youtube.com', 'youtu.be', 'vimeo.com'];
        if (!allowed.includes(embedUrl.hostname)) {
          return new Response('Forbidden', { status: 403 });
        }
        return new Response(JSON.stringify({ url: embedUrl.toString() }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response('Invalid URL', { status: 400 });
      }
    },
    {
      body: z.object({ url: z.string() }),
    }
  )
  // Realtime collaboration WebSocket
  .ws('/ws/collab/:docId', {
    open() {
      // session/context binding can be added here if needed
    },
    async message(ws, message) {
      try {
        const data =
          typeof message === 'string' ? JSON.parse(message) : (message as any);
        const type = String((data as any).type || '').trim();
        const docId = String((data as any).docId || '').trim();
        const locale = String((data as any).locale || 'fr');
        const b64 =
          typeof (data as any).update === 'string'
            ? String((data as any).update)
            : '';
        const authorId = String((data as any).authorId || '');
        const authorName = String((data as any).authorName || '');
        if (!docId) return;

        const roomKey = `${docId}:${locale}`;
        const room =
          rooms.get(roomKey) ??
          (() => {
            const nextRoom = { doc: new Y.Doc(), clients: new Set<any>() };
            rooms.set(roomKey, nextRoom);
            return nextRoom;
          })();

        if (type === 'join' || (!b64 && !type)) {
          room.clients.add(ws);
          const snapshot = Y.encodeStateAsUpdate(room.doc);
          const initB64 = Buffer.from(snapshot).toString('base64');
          try {
            ws.send(
              JSON.stringify({ docId, locale, update: initB64, initial: true })
            );
          } catch {}
          return;
        }

        if (b64) {
          room.clients.add(ws);
          const incoming = Uint8Array.from(Buffer.from(b64, 'base64'));
          Y.applyUpdate(room.doc, incoming);
          for (const client of room.clients) {
            if (client !== ws) {
              try {
                client.send(
                  JSON.stringify({ docId, update: b64, authorId, authorName })
                );
              } catch {}
            }
          }
          console.info('WS collab message', {
            docId,
            locale: locale || 'no locale',
            authorId,
            authorName,
          });
          ws.send(JSON.stringify({ ok: true }));
        }
      } catch (e) {
        console.error('WS collab error', { error: (e as Error).message });
      }
    },
    close() {
      // noop
    },
  });
