"use server";

import { encode } from "@toon-format/toon";

export const searchImage = async (query: string): Promise<string> => {
  if (process.env.SEARXNG_API_URL) {
    const res = await fetch(`${process.env.SEARXNG_API_URL}/search?q=${encodeURIComponent(
      query,
    )}&engines=${encodeURIComponent('google images,bing images')}&format=json`);

    if (!res.ok) {
      throw new Error(
        `Image search failed for "${query}": ` + res.statusText,
      );
    }

    const data = await res.json()

    if (data.results && data.results.length > 0) {
      return data.results[0].img_src
    }

    return ""
  } else if (process.env.SERPER_API_KEY) {
    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query }),
    });

    if (!res.ok) {
      throw new Error(
        `Image search failed for "${query}": ` + res.statusText,
      );
    }

    const data = await res.json();

    if (data.images && data.images.length > 0) {
      return data.images[0].imageUrl
    }

    return "";
  } else {
    throw new Error("No search engine configured, please configure it via the env file.")
  }
};

export const searchWeb = async (query: string): Promise<string> => {
  if (process.env.SEARXNG_API_URL) {
    const res = await fetch(`${process.env.SEARXNG_API_URL}/search?q=${encodeURIComponent(
      query,
    )}&format=json`);

    if (!res.ok) {
      throw new Error(
        `Web search failed for "${query}": ` + res.statusText,
      );
    }

    const data = await res.json()

    if (data.results && data.results.length > 0) {
      return encode({
        results: data.results
      })
    }

    return ""
  } else if (process.env.SERPER_API_KEY) {
    const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query }),
  });

  if (!res.ok) {
    throw new Error(`Web search failed for "${query}": ` + res.statusText);
  }

  const data = await res.json();

  if (data.organic && data.organic.length > 0) {
    return encode({
      results: data.organic,
    });
  }

  return "No results found.";
  } else {
    throw new Error("No search engine configured, please configure it via the env file.")
  }
};
