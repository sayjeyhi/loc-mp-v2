import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

// Global cache to track loaded images across route changes
const loadedImagesCache = new Set<string>()
const loadingImagesCache = new Map<string, Promise<void>>()

// Preload image using JavaScript
const preloadImage = (url: string): Promise<void> => {
  // If already loaded, return resolved promise
  if (loadedImagesCache.has(url)) {
    return Promise.resolve()
  }

  // If already loading, return existing promise
  if (loadingImagesCache.has(url)) {
    return loadingImagesCache.get(url)!
  }

  // Create new loading promise
  const promise = new Promise<void>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      loadedImagesCache.add(url)
      loadingImagesCache.delete(url)
      resolve()
    }
    img.onerror = () => {
      loadingImagesCache.delete(url)
      reject(new Error(`Failed to load image: ${url}`))
    }
    img.src = url
  })

  loadingImagesCache.set(url, promise)
  return promise
}

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  showSkeleton?: boolean
  skeletonClassName?: string
}

export function Image({
  src,
  alt = '',
  className,
  showSkeleton = true,
  skeletonClassName,
  ...props
}: ImageProps) {
  const [imageError, setImageError] = useState(false)
  const currentUrlRef = useRef<string | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Initialize loading state based on cache
  const isImageCached = src ? loadedImagesCache.has(src) : false
  const [imageLoading, setImageLoading] = useState(
    src ? !isImageCached : false
  )

  // Preload image and check cache when src changes
  useEffect(() => {
    if (!src) {
      setImageLoading(false)
      setImageError(false)
      return
    }

    // Check if image is already loaded in global cache
    if (loadedImagesCache.has(src)) {
      const timer = setTimeout(() => {
        if (currentUrlRef.current === src) {
          setImageLoading(false)
          setImageError(false)
        }
      }, 0)
      currentUrlRef.current = src
      return () => clearTimeout(timer)
    }

    // If src changed, reset state and preload
    if (src !== currentUrlRef.current) {
      currentUrlRef.current = src
      const timer = setTimeout(() => {
        if (currentUrlRef.current === src) {
          setImageLoading(true)
          setImageError(false)
        }
      }, 0)

      // Preload image using JavaScript
      preloadImage(src)
        .then(() => {
          // Only update if this is still the current src
          if (currentUrlRef.current === src) {
            setImageLoading(false)
            setImageError(false)
          }
        })
        .catch(() => {
          // Only update if this is still the current src
          if (currentUrlRef.current === src) {
            setImageLoading(false)
            setImageError(true)
          }
        })

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // Check if image is already cached when image element is created
  const handleImageRef = (img: HTMLImageElement | null) => {
    imageRef.current = img
    if (img && img.complete && img.naturalWidth > 0 && src) {
      // Image is already cached, mark as loaded and skip loading state
      loadedImagesCache.add(src)
      setImageLoading(false)
      setImageError(false)
    }
  }

  const handleImageLoad = () => {
    // Mark image as loaded in global cache
    if (src) {
      loadedImagesCache.add(src)
    }
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const shouldShowSkeleton = showSkeleton && imageLoading && src && !imageError

  if (!src) {
    return null
  }

  return (
    <div className='relative w-full h-full'>
      {shouldShowSkeleton && (
        <Skeleton
          className={cn('absolute inset-0', skeletonClassName)}
        />
      )}
      <img
        ref={handleImageRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          'transition-opacity duration-300',
          imageLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
    </div>
  )
}
