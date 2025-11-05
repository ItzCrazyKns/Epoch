"use client";

import { CardComponent } from "./types";
import { Card } from "@/components/ui/card";
import { UIRenderer } from "./UIRenderer";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CardRendererProps {
  component: CardComponent;
  onAction?: (action: string, label: string) => void;
  formValues?: Record<string, string>;
  onFormChange?: (id: string, value: string) => void;
  isInGrid?: boolean;
}

export function CardRenderer({
  component,
  onAction,
  formValues,
  onFormChange,
  isInGrid = false
}: CardRendererProps) {
  const { title, description, image, imageQuery, children = [], clickAction } = component;
  const [imageUrl, setImageUrl] = useState<string | null>(image || null);
  const [loading, setLoading] = useState(false);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!image && imageQuery && imageQuery !== loadedQuery) {
      let cancelled = false;

      const fetchImage = async () => {
        try {
          setLoading(true);
          const res = await fetch('/api/search-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: imageQuery }),
          });
          const data = await res.json();
          if (!cancelled && data.imageUrl) {
            setImageUrl(data.imageUrl);
            setLoadedQuery(imageQuery);
          }
        } catch (err) {
          console.error("Failed to fetch image:", err);
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      fetchImage();
      return () => { cancelled = true; };
    }
  }, [image, imageQuery, loadedQuery]);

  const handleClick = () => {
    if (clickAction && onAction) {
      onAction(clickAction, title || "Card clicked");
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white",
        clickAction && "cursor-pointer hover:scale-[1.01] hover:-translate-y-0.5",
        isInGrid && "h-full flex flex-col"
      )}
      onClick={handleClick}
    >
      {(imageUrl || loading) && (
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
          ) : (
            imageUrl && (
              <div className="relative h-full w-full">
                <img
                  src={imageUrl}
                  alt={title || ""}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent" />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    backdropFilter: 'blur(1px)',
                    background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 100%)'
                  }}
                />
              </div>
            )
          )}
        </div>
      )}

      <div className={cn(
        "relative flex flex-col p-4 sm:p-5",
        (imageUrl || loading) && "-mt-12 sm:-mt-16 z-10"
      )}>
        {(title || description) && (
          <div className="space-y-2 mb-4">
            {title && <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">{title}</h3>}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        )}

        {children.length > 0 && (
          <div className="space-y-2">
            {children.map((child, index) => (
              <UIRenderer
                key={index}
                component={child}
                onAction={onAction}
                formValues={formValues}
                onFormChange={onFormChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}