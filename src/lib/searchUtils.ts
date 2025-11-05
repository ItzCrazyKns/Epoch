"use server"

import { encode } from '@toon-format/toon'

export const searchImage = async (query: string): Promise<string> => {
    const response = await fetch('https://google.serper.dev/images', {
        method: 'POST',
        headers: {
            'X-API-KEY': process.env.SERPER_API_KEY || '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
        throw new Error(`Image search failed for "${query}": ` + response.statusText)
    }

    const data = await response.json();

    if (data.images && data.images.length > 0) {
        const imageUrl = data.images[0].imageUrl;
        
        return imageUrl
    }

    return ''
}

export const searchWeb = async (query: string): Promise<string> => {
    const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
            'X-API-KEY': process.env.SERPER_API_KEY || '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
        throw new Error(`Web search failed for "${query}": ` + response.statusText)
    }

    const data = await response.json();

    if (data.organic && data.organic.length > 0) {
        return encode({
            results: data.organic
        });
    }

    return 'No results found.';
}