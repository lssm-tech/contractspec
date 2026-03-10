import { NextResponse } from 'next/server';
import fs from 'fs';
import { resolveReadmePath } from '@/lib/llms-package-resolver';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const readmePath = resolveReadmePath(slug);
  if (!readmePath) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  try {
    const content = fs.readFileSync(readmePath, 'utf8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to read package README' },
      { status: 500 }
    );
  }
}
