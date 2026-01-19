/**
 * Fixture: Next.js App Router API
 *
 * API route handlers for testing extraction.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema
const orderSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

/**
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const _status = searchParams.get('status');

  // List orders
  return NextResponse.json([]);
}

/**
 * POST /api/orders
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = orderSchema.parse(body);

  return NextResponse.json({
    id: 'order-123',
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}
