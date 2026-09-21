import { useState, type ImgHTMLAttributes } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex min-h-48 items-center justify-center bg-gray-200 text-sm text-gray-500 ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        Imagem indisponível
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
