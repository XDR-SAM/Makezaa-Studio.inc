import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Convert image to base64
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');

        // Upload to ImgBB
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', base64Image);

        const imgbbUrl = `${process.env.IMGBB_API_URL}?key=${process.env.IMGBB_API_KEY}`;

        const response = await fetch(imgbbUrl, {
            method: 'POST',
            body: imgbbFormData,
        });

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: data.data.url,
            displayUrl: data.data.display_url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
