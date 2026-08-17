import React, { useState, useEffect } from 'react';
import { getFallbackAssetUrl, normalizeAssetKey } from '../utils/assets';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

/**
 * Bulletproof Image component:
 * - Includes referrerPolicy="no-referrer"
 * - Automatically falls back to static / alternative path on error
 * - Ensures genuine raster/PNG assets load reliably across all CDNs and environments
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => src);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    setCurrentSrc(src);
    setAttempt(0);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (attempt === 0) {
      const fallback = fallbackSrc || getFallbackAssetUrl(src);
      if (fallback && fallback !== currentSrc) {
        setAttempt(1);
        setCurrentSrc(fallback);
        return;
      }
    }

    if (attempt === 1) {
      const cleanKey = normalizeAssetKey(src);
      const directPath = `/${cleanKey}`;
      if (directPath !== currentSrc) {
        setAttempt(2);
        setCurrentSrc(directPath);
        return;
      }
    }

    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
      loading={props.loading || "eager"}
      decoding="async"
    />
  );
};
