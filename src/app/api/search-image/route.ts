import { searchImage } from "@/lib/searchUtils";
import { NextResponse } from "next/server";

const imageCache = new Map<string, string>()

export const POST = async (req: Request) => {
    const body = await req.json();
    const query = body.query || "Eiffel Tower?";

    const exists = imageCache.get(query)

    if (exists) return NextResponse.json({ 
        imageUrl: exists
    })

    try {
        const image = await searchImage(query)
        imageCache.set(query, image)

        return NextResponse.json({ imageUrl: image });
    } catch (error) {
        console.error(`Error searching image for "${query}":`, error);
        return NextResponse.json({ error: 'Image search failed' }, { status: 500 });
    }
}