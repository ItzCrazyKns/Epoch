"use client";

import { GalleryComponent } from "./types";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface GalleryRendererProps {
  component: GalleryComponent;
  onAction?: (action: string, label: string) => void;
}

export function GalleryRenderer({ component, onAction }: GalleryRendererProps) {
  const { images = [], columns = 3, title, aspectRatio = "16/9" } = component;
  const [loadedImages, setLoadedImages] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const [loadedQueries, setLoadedQueries] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (images.length === 0) return;

    images.forEach((img, index) => {
      if (img.imageQuery && !img.image && img.imageQuery !== loadedQueries[index] && !loading[index]) {
        setLoading(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });

        fetch('/api/search-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: img.imageQuery }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.imageUrl) {
              setLoadedImages(prev => {
                const updated = [...prev];
                updated[index] = data.imageUrl;
                return updated;
              });
              setLoadedQueries(prev => {
                const updated = [...prev];
                updated[index] = img.imageQuery!;
                return updated;
              });
            }
          })
          .catch(err => console.error("Failed to fetch image:", err))
          .finally(() => {
            setLoading(prev => {
              const updated = [...prev];
              updated[index] = false;
              return updated;
            });
          });
      }
    });
  }, [images, loadedQueries, loading]);

  if (images.length === 0) return null;

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
      )}

      <div className={cn(
        "grid gap-4",
        gridColsClass[Math.min(3, Math.max(1, columns)) as keyof typeof gridColsClass]
      )}>
        {images.map((img, index) => {
          const imageUrl = img.image || loadedImages[index];
          const isLoading = loading[index];

          return (
            <div
              key={index}
              className={cn(
                "group relative rounded-xl overflow-hidden bg-gray-50 cursor-pointer",
                img.clickAction && onAction && "hover:shadow-xl transition-all"
              )}
              style={{ aspectRatio }}
              onClick={() => {
                if (img.clickAction && onAction) {
                  onAction(img.clickAction, img.title || "Image clicked");
                }
              }}
            >
              {isLoading ? (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
              ) : imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={img.title || ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <p className="text-white font-medium">{img.title}</p>
                      {img.subtitle && (
                        <p className="text-white/80 text-sm mt-1">{img.subtitle}</p>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}