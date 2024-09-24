import {put, PutBlobResult} from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename: string = searchParams.get('filename') as string;

    if (filename != null) {
        const blob: PutBlobResult = await put(filename, request.body, {
            access: 'public',
        });
        return NextResponse.json(blob, {status: 200});
    }

    return NextResponse.json({ error: 'File provided failed!' }, { status: 500 });
}

