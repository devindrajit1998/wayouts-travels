import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            return NextResponse.json(
                { error: 'ImageKit credentials not configured in environment variables.' },
                { status: 500 }
            );
        }

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || 'Failed to generate ImageKit auth parameters' },
            { status: 500 }
        );
    }
}
