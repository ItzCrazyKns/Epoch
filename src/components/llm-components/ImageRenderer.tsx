"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageComponent } from "./types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const searchImage = async (query: string): Promise<string> => {
  const res = await fetch('/api/search-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error('Image search failed');
  }

  const data = await res.json();
  return data.imageUrl;
}

interface ImageRendererProps {
  component: ImageComponent;
  isInFlexRow?: boolean;
}

export function ImageRenderer({ component, isInFlexRow = false }: ImageRendererProps) {
  const {
    src,
    searchQuery,
    alt = "",
    fit = "cover",
    radius = 0,
  } = component;

  const [imageSrc, setImageSrc] = useState<string | null>(src || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!src && searchQuery && searchQuery !== loadedQuery) {
      let cancelled = false;

      const loadImage = async () => {
        try {
          setLoading(true);
          const url = await searchImage(searchQuery);
          if (!cancelled) {
            setImageSrc(url);
            setLoadedQuery(searchQuery);
            setLoading(false);
          }
        } catch (err) {
          console.error("Failed to fetch image:", err);
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
        }
      };

      loadImage();

      return () => {
        cancelled = true;
      };
    }
  }, [src, searchQuery, loadedQuery]);

  const containerClass = isInFlexRow
    ? "flex-1 min-w-0"
    : "w-full";

  const fitClasses = {
    cover: isInFlexRow
      ? "object-cover w-full h-48"
      : "object-cover w-full h-auto",
    contain: "object-contain w-full h-auto max-h-96",
    fill: "object-fill w-full h-64",
    none: "object-none w-full h-auto",
    "scale-down": "object-scale-down w-full h-auto max-h-96",
  };

  const skeletonClass = isInFlexRow
    ? "w-full h-48"
    : "w-full h-64";

  if (loading) {
    return (
      <Skeleton
        className={cn(skeletonClass, "animate-pulse bg-gray-200")}
        style={{ borderRadius: `${radius}px` }}
      />
    );
  }

  if (error || !imageSrc) {
    return (
      <div
        className={cn(skeletonClass, "bg-gray-100 flex items-center justify-center text-gray-400 text-sm")}
        style={{ borderRadius: `${radius}px` }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClass)} style={{ borderRadius: `${radius}px` }}>
      <img
        src={imageSrc}
        alt={alt}
        width={1200}
        height={fit === "cover" && isInFlexRow ? 400 : 600}
        className={cn(fitClasses[fit])}
        style={{ borderRadius: `${radius}px` }}
      />
    </div>
  );
}
