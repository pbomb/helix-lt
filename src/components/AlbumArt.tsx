import { useState, useEffect } from 'react'

const cache = new Map<string, string | null>()

export default function AlbumArt({ artist, album, size = 40 }: { artist: string; album: string; size?: number }) {
  const key = `${artist}|||${album}`
  const [url, setUrl] = useState<string | null | undefined>(cache.has(key) ? cache.get(key) : undefined)

  useEffect(() => {
    if (cache.has(key)) return
    const query = encodeURIComponent(`${artist} ${album}`)
    fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=5`)
      .then(r => r.json())
      .then(data => {
        const results: any[] = data.results ?? []
        const match =
          results.find(r => r.collectionName?.toLowerCase().includes(album.toLowerCase())) ??
          results[0] ??
          null
        const artUrl = match
          ? (match.artworkUrl100 as string).replace('100x100bb', `${size}x${size}bb`)
          : null
        cache.set(key, artUrl)
        setUrl(artUrl)
      })
      .catch(() => {
        cache.set(key, null)
        setUrl(null)
      })
  }, [key, size])

  if (url === undefined) return <span className="album-art-placeholder" style={{ width: size, height: size }} />
  if (!url) return null
  return (
    <img
      className="album-art"
      src={url}
      alt={album}
      width={size}
      height={size}
      loading="lazy"
    />
  )
}
