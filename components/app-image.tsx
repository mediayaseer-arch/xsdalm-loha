import type { ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export default function AppImage({
  fill,
  priority,
  sizes: _sizes,
  style,
  ...props
}: ImageProps) {
  return (
    <img
      {...props}
      loading={priority ? "eager" : "lazy"}
      style={{
        ...(fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
          : {}),
        ...style,
      }}
    />
  );
}