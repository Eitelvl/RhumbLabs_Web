import React, { useEffect, useState } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

/**
 * Image component that preserves the exact URL supplied by the caller.
 * Static website images must use absolute paths under /images/.
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

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      setCurrentSrc(fallbackSrc);
      return;
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
      onError={handleError}
      className={className}
      loading={props.loading || 'eager'}
      decoding="async"
    />
  );
};
