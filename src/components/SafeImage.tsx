import React, { useState, useEffect } from 'react';
import { getFallbackAssetUrl, normalizeAssetKey } from '../utils/assets';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
}

/**
 * Bulletproof Image component:
 * - Includes referrerPolicy="no-referrer"
 * - Automatically falls back to static / alternative path on error
 * - Seamlessly renders SVG fallbackComponent if network/image asset fails completely
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc,
  fallbackComponent,
  className = '',
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => src);
  const [attempt, setAttempt] = useState<number>(0);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src);
    setAttempt(0);
    setHasFailedAll(false);
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

    setHasFailedAll(true);
    if (onError) {
      onError(e);
    }
  };

  if (hasFailedAll && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

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
