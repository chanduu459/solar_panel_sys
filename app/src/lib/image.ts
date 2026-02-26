const UNSPLASH_HOSTS = new Set(['images.unsplash.com', 'source.unsplash.com']);

export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options?: { width?: number; quality?: number }
): string {
  if (!imageUrl) return '/placeholder-project.jpg';

  const width = options?.width ?? 1600;
  const quality = options?.quality ?? 90;

  try {
    const parsed = new URL(imageUrl);
    const host = parsed.hostname.toLowerCase();

    if (UNSPLASH_HOSTS.has(host)) {
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'max');
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('dpr', '2');
      return parsed.toString();
    }

    if (parsed.searchParams.has('w') || parsed.searchParams.has('width')) {
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('width', String(width));
    }

    if (parsed.searchParams.has('q') || parsed.searchParams.has('quality')) {
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('quality', String(quality));
    }

    return parsed.toString();
  } catch {
    return imageUrl;
  }
}
