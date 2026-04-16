/**
 * parseMultipart のユニットテスト
 * 実行: npm run test:multipart でも同等の検証が可能（scripts/test-multipart-parser.mjs）
 */
import { parseMultipart } from '../multipartDownload'

function buildMultipartBody(boundary: string, files: { filename: string; data: Uint8Array }[]) {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = [encoder.encode(`--${boundary}\r\n`)]

  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    const ct = f.filename.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : f.filename.endsWith('.pdf')
        ? 'application/pdf'
        : 'application/octet-stream'
    const header = `Content-Disposition: form-data; name="files"; filename="${f.filename}"\r\nContent-Type: ${ct}\r\n\r\n`
    chunks.push(encoder.encode(header))
    chunks.push(f.data)
    if (i < files.length - 1) {
      chunks.push(encoder.encode(`\r\n--${boundary}\r\n`))
    }
  }
  chunks.push(encoder.encode(`\r\n--${boundary}--\r\n`))

  const totalLen = chunks.reduce((s, c) => s + c.length, 0)
  const out = new Uint8Array(totalLen)
  let off = 0
  for (const c of chunks) {
    out.set(c, off)
    off += c.length
  }

  return out.buffer
}

const XLSX_SIG = new Uint8Array([0x50, 0x4b, 0x03, 0x04])
const PDF_SIG = new Uint8Array([0x25, 0x50, 0x44, 0x46])

describe('parseMultipart', () => {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
  const contentType = `multipart/form-data; boundary=${boundary}`

  it('単一 xlsx を正しく抽出する', () => {
    const xlsxData = new Uint8Array(100)
    xlsxData.set(XLSX_SIG, 0)
    for (let i = 4; i < 100; i++) xlsxData[i] = i & 0xff

    const body = buildMultipartBody(boundary, [{ filename: 'payout_xxx.xlsx', data: xlsxData }])
    const parts = parseMultipart(body, contentType)

    expect(parts).toHaveLength(1)
    expect(parts[0].filename).toBe('payout_xxx.xlsx')
    expect(parts[0].data.length).toBe(100)
    expect(parts[0].data[0]).toBe(0x50)
    expect(parts[0].data[1]).toBe(0x4b)
  })

  it('xlsx + PDF 複数ファイルを正しく抽出する', () => {
    const xlsxData = new Uint8Array(100)
    xlsxData.set(XLSX_SIG, 0)
    const pdfData = new Uint8Array(50)
    pdfData.set(PDF_SIG, 0)

    const body = buildMultipartBody(boundary, [
      { filename: 'payout_001.xlsx', data: xlsxData },
      { filename: 'payout_001.pdf', data: pdfData }
    ])
    const parts = parseMultipart(body, contentType)

    expect(parts).toHaveLength(2)
    expect(parts[0].data.length).toBe(100)
    expect(parts[1].data.length).toBe(50)
    expect(parts[0].data[0]).toBe(0x50)
    expect(parts[1].data[0]).toBe(0x25)
  })

  it('ボディ末尾の CRLF を削除しない（Excel 破損防止）', () => {
    const xlsxEndingCrlf = new Uint8Array(102)
    xlsxEndingCrlf.set(XLSX_SIG, 0)
    xlsxEndingCrlf[100] = 13
    xlsxEndingCrlf[101] = 10

    const body = buildMultipartBody(boundary, [{ filename: 'with_crlf.xlsx', data: xlsxEndingCrlf }])
    const parts = parseMultipart(body, contentType)

    expect(parts).toHaveLength(1)
    expect(parts[0].data.length).toBe(102)
    expect(parts[0].data[100]).toBe(13)
    expect(parts[0].data[101]).toBe(10)
  })
})
