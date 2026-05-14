import type { CSVEvent } from './types'
import {
  DRIVE_THUMBNAIL_SZ_CARD,
  DRIVE_THUMBNAIL_SZ_LIGHTBOX
} from './constants'

// `image-url` (sheet → Firestore): any HTTPS image URL, or a Google Drive *file* link.
// Id is taken from `/file/d/<id>/…` (e.g. …/view?usp=sharing — id stops before `/view`) or from `?id=` on drive.google.com (e.g. uc?export=view).
// Drive URLs are rewritten to `…/thumbnail?id=<id>&sz=…` so <img> avoids 403 on uc?export=view. Folder / goo.gl links are not handled.
function extractGoogleDriveFileId(url: string): string | undefined {
  const u = url.trim()
  const fromPath = u.match(/drive\.google\.com\/file\/d\/([^/=?#]+)/i)
  if (fromPath) return fromPath[1]
  try {
    const parsed = new URL(u)
    const host = parsed.hostname.toLowerCase()
    const isDriveHost =
      host === 'drive.google.com' || host === 'drive.usercontent.google.com'
    if (!isDriveHost) {
      return undefined
    }
    return parsed.searchParams.get('id') || undefined
  } catch {
    return undefined
  }
}

type DriveThumbnailSize =
  | typeof DRIVE_THUMBNAIL_SZ_CARD
  | typeof DRIVE_THUMBNAIL_SZ_LIGHTBOX

/** Sheet / Firestore raw value → URL safe for <img>. Drive → thumbnail; only sz differs for card vs lightbox. */
function imageUrlFromSheetRaw(raw: string, driveThumbnailSize: DriveThumbnailSize): string {
  const trimmed = raw.trim()
  if (/drive\.google\.com\/thumbnail\?/i.test(trimmed)) {
    if (trimmed.includes('sz=')) {
      return trimmed.replace(/([?&])sz=[^&]*/, `$1sz=${driveThumbnailSize}`)
    }
    return `${trimmed}&sz=${driveThumbnailSize}`
  }
  const id = extractGoogleDriveFileId(trimmed)
  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${driveThumbnailSize}`
  }
  return trimmed
}

function eventImageUrlFromEvent(
  event: CSVEvent,
  driveThumbnailSize: DriveThumbnailSize
): string | undefined {
  const raw = event['image-url']?.trim()
  if (!raw) return undefined
  return imageUrlFromSheetRaw(raw, driveThumbnailSize)
}

export const eventImageSrc = (event: CSVEvent): string | undefined =>
  eventImageUrlFromEvent(event, DRIVE_THUMBNAIL_SZ_CARD)

export const eventImageLightboxSrc = (event: CSVEvent): string | undefined =>
  eventImageUrlFromEvent(event, DRIVE_THUMBNAIL_SZ_LIGHTBOX)
