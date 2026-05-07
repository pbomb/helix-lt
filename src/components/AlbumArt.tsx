export default function AlbumArt({ thumbnail, album, size = 40 }: { thumbnail: string; album: string; size?: number }) {
  return (
    <img
      className="album-art"
      src={thumbnail}
      alt={album}
      width={size}
      height={size}
      loading="lazy"
    />
  )
}
