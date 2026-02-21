import { initDb } from './db/client.js';
import { startServer } from './server.js';

// Initialize DB (required for async PostgreSQL driver)
await initDb();
startServer();
