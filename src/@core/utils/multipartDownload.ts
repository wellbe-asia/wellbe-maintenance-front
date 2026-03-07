export type MultipartPart = { filename: string; data: Uint8Array }

/**
 * Parse multipart/form-data and return file parts (for testing).
 * Expects Content-Type like: multipart/form-data; boundary=----WebKitFormBoundary...
 */
export function parseMultipart(arrayBuffer: ArrayBuffer, contentType: string): MultipartPart[] {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i)
  if (!boundaryMatch) return []

  const boundary = (boundaryMatch[1] || boundaryMatch[2] || '').trim()
  const boundaryBytes = new TextEncoder().encode(`--${boundary}`)
  const buf = new Uint8Array(arrayBuffer)

  const parts: MultipartPart[] = []
  let start = indexOf(buf, boundaryBytes, 0)
  if (start === -1) return []

  while (start !== -1) {
    const nextBoundary = indexOf(buf, boundaryBytes, start + boundaryBytes.length)
    const partEnd = nextBoundary === -1 ? buf.length : nextBoundary - 2
    const part = buf.slice(start + boundaryBytes.length, partEnd)
    start = nextBoundary

    const headerEnd = indexOfBytes(part, new Uint8Array([13, 10, 13, 10]))
    if (headerEnd === -1) continue

    const headerSection = part.slice(0, headerEnd)
    const body = part.slice(headerEnd + 4)
    const headerStr = new TextDecoder('utf-8').decode(headerSection)
    const filenameMatch = headerStr.match(/filename=(?:"([^"]+)"|([^\s;]+))/i)
    if (!filenameMatch || body.length === 0) continue

    const filename = (filenameMatch[1] || filenameMatch[2] || 'download').trim()
    parts.push({ filename, data: body })
  }

  return parts
}

/**
 * Parse multipart/form-data response and trigger download for each file part.
 */
export function parseMultipartAndDownload(arrayBuffer: ArrayBuffer, contentType: string): void {
  const parts = parseMultipart(arrayBuffer, contentType)

  parts.forEach(({ filename, data }) => {
    const slice = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    const mimeType = getMimeType(filename)
    const blob = new Blob([slice as ArrayBuffer], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (ext === 'pdf') return 'application/pdf'

  return 'application/octet-stream'
}

function indexOf(buf: Uint8Array, pattern: Uint8Array, from: number): number {
  for (let i = from; i <= buf.length - pattern.length; i++) {
    let match = true
    for (let j = 0; j < pattern.length; j++) {
      if (buf[i + j] !== pattern[j]) {
        match = false
        break
      }
    }
    if (match) return i
  }

  return -1
}

function indexOfBytes(buf: Uint8Array, pattern: Uint8Array): number {
  for (let i = 0; i <= buf.length - pattern.length; i++) {
    let match = true
    for (let j = 0; j < pattern.length; j++) {
      if (buf[i + j] !== pattern[j]) {
        match = false
        break
      }
    }
    if (match) return i
  }

  return -1
}
