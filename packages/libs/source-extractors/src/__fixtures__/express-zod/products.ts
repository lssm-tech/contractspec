/**
 * Fixture: Express with Zod validation
 *
 * A minimal Express app with Zod middleware for testing extraction.
 */

import express from 'express';
import { z } from 'zod';

const app = express();

// Zod schemas
const createProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  description: z.string().optional(),
});

const _productIdSchema = z.object({
  id: z.string().uuid(),
});

// Routes
app.get('/products', async (_req, res) => {
  // List products
  res.json([]);
});

app.get('/products/:id', async (req, res) => {
  // Get single product
  const { id } = req.params;
  res.json({ id, name: 'Test', price: 100 });
});

app.post('/products', async (req, res) => {
  // Create product
  const data = createProductSchema.parse(req.body);
  res.json({ id: 'new-id', ...data });
});

app.put('/products/:id', async (req, res) => {
  // Update product
  const { id } = req.params;
  const data = createProductSchema.partial().parse(req.body);
  res.json({ id, ...data });
});

app.delete('/products/:id', async (_req, res) => {
  // Delete product
  res.status(204).send();
});

export default app;
