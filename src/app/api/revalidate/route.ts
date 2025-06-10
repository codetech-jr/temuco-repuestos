// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // Idealmente, proteger este endpoint con un secret
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const body = await request.json();
  const tag = body.tag;
  const path = body.path;

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidatedTag: tag, now: Date.now() });
  }
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidatedPath: path, now: Date.now() });
  }
  return NextResponse.json({ message: 'Missing tag or path' }, { status: 400 });
}