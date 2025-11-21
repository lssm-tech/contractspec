import { Elysia } from 'elysia';
import * as Y from 'yjs';
import { prisma } from '@lssm/app.cli-database-strit';

// In-memory rooms keyed by `${contentId}:${locale}`
const rooms = new Map<string, { doc: Y.Doc; clients: Set<any> }>();

export const collabModule = new Elysia({ name: 'collab-module' })
  // Minimal server-processing endpoints used by BlockNote
  .post('/server-processing/image', ({ body }) => {
    const dataUrl = (body as any)?.dataUrl as string | undefined;
    if (!dataUrl || !/^data:image\/(png|jpeg|webp);base64,/.test(dataUrl)) {
      return new Response('Unsupported image payload', { status: 415 });
    }
    return new Response(JSON.stringify({ url: dataUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  })
  .post('/server-processing/file', async ({ body }) => {
    const dataUrl = (body as any)?.dataUrl as string | undefined;
    const filename = (body as any)?.name as string | undefined;
    if (!dataUrl || !/^data:([\w-]+\/[\w-]+);base64,/.test(dataUrl)) {
      return new Response('Unsupported file payload', { status: 415 });
    }
    // In production, persist file and return a durable URL
    return new Response(
      JSON.stringify({ url: dataUrl, name: filename || '' }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  })
  .post('/server-processing/embed', ({ body }) => {
    const url = (body as any)?.url as string | undefined;
    try {
      const u = new URL(String(url || ''));
      const allowed = ['www.youtube.com', 'youtu.be', 'vimeo.com'];
      if (!allowed.includes(u.hostname))
        return new Response('Forbidden', { status: 403 });
      return new Response(JSON.stringify({ url: u.toString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return new Response('Invalid URL', { status: 400 });
    }
  })
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
        let room = rooms.get(roomKey);
        if (!room) {
          const doc = new Y.Doc();
          const row = await prisma.contentLocale.findUnique({
            select: { yState: true },
            where: { contentId_locale: { contentId: docId, locale } },
          });
          if (row?.yState) {
            try {
              Y.applyUpdate(doc, new Uint8Array(row.yState as Uint8Array));
            } catch {}
          }
          room = { doc, clients: new Set() };
          rooms.set(roomKey, room);
        }

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
          const snapshot = Y.encodeStateAsUpdate(room.doc);
          await prisma.contentLocale.update({
            where: { contentId_locale: { contentId: docId, locale } },
            data: { yState: snapshot },
          });

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
