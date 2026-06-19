const REMOTE_SOURCE_REGEX = /^(https?:)?\/\//i

function ResponsiveImage({
  src,
  avifSrc,
  webpSrc,
  alt,
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  width,
  height,
  sizes,
}) {
  const isRemoteSource = typeof src === "string" && REMOTE_SOURCE_REGEX.test(src)

  if (isRemoteSource) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        sizes={sizes}
      />
    )
  }

  return (
    <picture>
      {avifSrc ? <source srcSet={avifSrc} type="image/avif" sizes={sizes} /> : null}
      {webpSrc ? <source srcSet={webpSrc} type="image/webp" sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        sizes={sizes}
      />
    </picture>
  )
}

export default ResponsiveImage
