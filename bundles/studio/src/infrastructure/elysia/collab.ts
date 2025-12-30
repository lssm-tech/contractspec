import { Elysia } from 'elysia';
import * as Y from 'yjs';
import * as z from 'zod';

// In-memory rooms keyed by `${contentId}:${locale}`
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- WebSocket client type varies by runtime and needs send() method
const rooms = new Map<string, { doc: Y.Doc; clients: Set<any> }>();

export const collabModule = () => {
  return (
    new Elysia({ name: 'collab-module' })
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
            JSON.stringify({ url: body.dataUrl, name: body.name || '' }),
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
        body: z.object({
          type: z.string(),
          docId: z.string(),
          locale: z.string().trim().default('fr'),
          update: z.base64(),
          authorId: z.string().trim().optional(),
          authorName: z.string().trim().optional(),
        }),
        message(ws, message) {
          try {
            if (!message.docId) return;

            const roomKey = `${message.docId}:${message.locale}`;
            const room =
              rooms.get(roomKey) ??
              (() => {
                const nextRoom = {
                  doc: new Y.Doc(),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- WebSocket client type requires any
                  clients: new Set<any>(),
                };
                rooms.set(roomKey, nextRoom);
                return nextRoom;
              })();

            if (message.type === 'join' || (!message.type && !message.update)) {
              room.clients.add(ws);
              const snapshot = Y.encodeStateAsUpdate(room.doc);
              const initB64 = Buffer.from(snapshot).toString('base64');
              try {
                ws.send(
                  JSON.stringify({
                    docId: message.docId,
                    locale: message.locale,
                    update: initB64,
                    initial: true,
                  })
                );
              } catch {
                // Silently ignore send failures - client may have disconnected
              }
              return;
            }

            if (message.update) {
              room.clients.add(ws);
              const incoming = Uint8Array.from(
                Buffer.from(message.update, 'base64')
              );
              Y.applyUpdate(room.doc, incoming);
              for (const client of room.clients) {
                if (client !== ws) {
                  try {
                    client.send(
                      JSON.stringify({
                        docId: message.docId,
                        update: message.update,
                        authorId: message.authorId,
                        authorName: message.authorName,
                      })
                    );
                  } catch {
                    // Silently ignore broadcast failures - client may have disconnected
                  }
                }
              }
              console.info('WS collab message', {
                docId: message.docId,
                locale: message.locale || 'no locale',
                authorId: message.authorId,
                authorName: message.authorName,
              });
              ws.send(JSON.stringify({ ok: true }));
            }
          } catch (e) {
            if (e instanceof Error) {
              console.error('WS collab error', { error: e.message });
            } else if (!!e && typeof e === 'object' && 'message' in e) {
              console.error('WS collab error', { error: e.message });
            } else {
              console.error('WS collab error', { error: String(e) });
            }
          }
        },
        close() {
          // noop
        },
      })
  );
};
