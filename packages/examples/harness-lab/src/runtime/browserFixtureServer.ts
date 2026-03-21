import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

const HARNESS_LAB_BROWSER_FIXTURE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Harness Lab | Waiting</title>
  </head>
  <body>
    <main>
      <h1>Harness Lab</h1>
      <p id="status">Ready for deterministic browser assertions.</p>
      <label for="participant-name">Participant</label>
      <input id="participant-name" name="participant-name" />
      <button id="confirm" type="button">Confirm</button>
      <output id="result">Awaiting confirmation.</output>
    </main>
    <script>
      const input = document.getElementById("participant-name");
      const status = document.getElementById("status");
      const result = document.getElementById("result");
      const confirm = document.getElementById("confirm");

      confirm.addEventListener("click", () => {
        const name = input.value.trim() || "anonymous";
        status.textContent = "Browser lane completed for " + name + ".";
        result.textContent = "Welcome, " + name + ".";
        document.title = "Harness Lab | Ready for " + name;
      });
    </script>
  </body>
</html>`;

export interface HarnessLabBrowserFixtureServer {
	baseUrl: string;
	close(): Promise<void>;
}

export async function startHarnessLabBrowserFixture(): Promise<HarnessLabBrowserFixtureServer> {
	const server = createServer((request, response) => {
		if (request.url !== '/' && request.url !== '/index.html') {
			response.statusCode = 404;
			response.end('Not found');
			return;
		}

		response.statusCode = 200;
		response.setHeader('content-type', 'text/html; charset=utf-8');
		response.end(HARNESS_LAB_BROWSER_FIXTURE_HTML);
	});

	await new Promise<void>((resolve) => {
		server.listen(0, '127.0.0.1', () => resolve());
	});

	const address = server.address();
	if (!address || typeof address === 'string') {
		throw new Error('Harness lab browser fixture did not expose a TCP port.');
	}

	return {
		baseUrl: `http://127.0.0.1:${(address as AddressInfo).port}`,
		close() {
			return new Promise<void>((resolve, reject) => {
				server.close((error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				});
			});
		},
	};
}
