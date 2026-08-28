import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!privateKey || !publicKey || !urlEndpoint) {
            return NextResponse.json(
                { error: 'ImageKit credentials are not configured in .env.local' },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const fileName = formData.get('fileName') || `upload_${Date.now()}`;
        const folder = formData.get('folder') || '/wayouts';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: typeof fileName === 'string' ? fileName : file.name || `upload_${Date.now()}`,
            folder,
            useUniqueFileName: true,
        });

        return NextResponse.json({
            success: true,
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            name: uploadResponse.name,
            thumbnailUrl: uploadResponse.thumbnailUrl,
        });
    } catch (error) {
        console.error('ImageKit upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Image upload failed' },
            { status: 500 }
        );
    }
}
