#!/usr/bin/env node
/**
 * multipart パースのテストスクリプト
 * Go の multipart.Writer と同等の形式でモックを作成し、parseMultipart で正しく抽出できるか検証
 *
 * 実行: node scripts/test-multipart-parser.mjs
 * または: node --experimental-vm-modules scripts/test-multipart-parser.mjs
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// multipartDownload.ts の parseMultipart と同じロジック（テスト用）
function createInlineParser() {
  const indexOf = (buf, pattern, from) => {
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

  return function parseMultipart(arrayBuffer, contentType) {
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i)
    if (!boundaryMatch) return []

    const boundary = (boundaryMatch[1] || boundaryMatch[2] || '').trim()
    const boundaryBytes = new TextEncoder().encode(`--${boundary}`)
    const buf = new Uint8Array(arrayBuffer)
    const parts = []
    let start = indexOf(buf, boundaryBytes, 0)
    if (start === -1) return []

    const crlf2 = new Uint8Array([13, 10, 13, 10])

    while (start !== -1) {
      const nextBoundary = indexOf(buf, boundaryBytes, start + boundaryBytes.length)
      const partEnd = nextBoundary === -1 ? buf.length : nextBoundary - 2
      const part = buf.slice(start + boundaryBytes.length, partEnd)
      start = nextBoundary

      const headerEnd = indexOf(part, crlf2, 0)
      if (headerEnd === -1) continue

      const body = part.slice(headerEnd + 4)
      const headerStr = new TextDecoder('utf-8').decode(part.slice(0, headerEnd))
      const m = headerStr.match(/filename=(?:"([^"]+)"|([^\s;]+))/i)
      if (!m || body.length === 0) continue

      const filename = (m[1] || m[2] || 'download').trim()
      parts.push({ filename, data: body })
    }

    return parts
  }
}

const parseMultipart = createInlineParser()

/**
 * Go の multipart.Writer と同等の multipart body を生成
 */
function buildMultipartBody(boundary, files) {
  const encoder = new TextEncoder()
  const chunks = [encoder.encode(`--${boundary}\r\n`)]

  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    const ct = f.contentType || (f.filename.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : f.filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream')
    const header = `Content-Disposition: form-data; name="files"; filename="${f.filename}"\r\nContent-Type: ${ct}\r\n\r\n`
    chunks.push(encoder.encode(header))
    chunks.push(new Uint8Array(f.data))
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

// xlsx は ZIP 形式。先頭は PK (0x50 0x4B)
const XLSX_SIG = new Uint8Array([0x50, 0x4b, 0x03, 0x04])
const PDF_SIG = new Uint8Array([0x25, 0x50, 0x44, 0x46])  // %PDF

function runTests() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
  const contentType = `multipart/form-data; boundary=${boundary}`

  console.log('=== multipart パース テスト ===\n')

  // Test 1: 単一 xlsx
  const xlsxData = new Uint8Array(100)
  xlsxData.set(XLSX_SIG, 0)
  for (let i = 4; i < 100; i++) xlsxData[i] = i & 0xff

  const body1 = buildMultipartBody(boundary, [{ filename: 'payout_xxx.xlsx', data: xlsxData }])
  const parts1 = parseMultipart(body1, contentType)
  if (parts1.length !== 1) {
    console.error('FAIL: 1ファイルの multipart で parts.length !== 1:', parts1.length)
    process.exit(1)
  }
  const p1 = parts1[0]
  if (p1.filename !== 'payout_xxx.xlsx') {
    console.error('FAIL: filename 不一致:', p1.filename)
    process.exit(1)
  }
  if (p1.data.length !== 100) {
    console.error('FAIL: xlsx データ長不一致. 期待 100, 実際', p1.data.length)
    process.exit(1)
  }
  if (p1.data[0] !== 0x50 || p1.data[1] !== 0x4b) {
    console.error('FAIL: xlsx シグネチャ不正. 先頭2バイト:', p1.data[0].toString(16), p1.data[1].toString(16))
    process.exit(1)
  }
  console.log('OK: 単一 xlsx の抽出')

  // Test 2: xlsx + PDF 複数
  const pdfData = new Uint8Array(50)
  pdfData.set(PDF_SIG, 0)
  const body2 = buildMultipartBody(boundary, [
    { filename: 'payout_001.xlsx', data: xlsxData },
    { filename: 'payout_001.pdf', data: pdfData }
  ])
  const parts2 = parseMultipart(body2, contentType)
  if (parts2.length !== 2) {
    console.error('FAIL: 2ファイルの multipart で parts.length !== 2:', parts2.length)
    process.exit(1)
  }
  if (parts2[0].data.length !== 100 || parts2[1].data.length !== 50) {
    console.error('FAIL: 複数ファイルのデータ長不正')
    process.exit(1)
  }
  if (parts2[0].data[0] !== 0x50 || parts2[1].data[0] !== 0x25) {
    console.error('FAIL: 複数ファイルのシグネチャ不正')
    process.exit(1)
  }
  console.log('OK: xlsx + PDF 複数ファイルの抽出')

  // Test 3: データ末尾が \r\n の場合（誤って trim しないことの確認）
  const xlsxEndingCrlf = new Uint8Array(102)
  xlsxEndingCrlf.set(XLSX_SIG, 0)
  for (let i = 4; i < 100; i++) xlsxEndingCrlf[i] = i & 0xff
  xlsxEndingCrlf[100] = 13
  xlsxEndingCrlf[101] = 10
  const body3 = buildMultipartBody(boundary, [{ filename: 'with_crlf.xlsx', data: xlsxEndingCrlf }])
  const parts3 = parseMultipart(body3, contentType)
  if (parts3.length !== 1 || parts3[0].data.length !== 102) {
    console.error('FAIL: 末尾 CRLF を含むファイルが trim されてはいけない. len=', parts3[0]?.data.length)
    process.exit(1)
  }
  if (parts3[0].data[100] !== 13 || parts3[0].data[101] !== 10) {
    console.error('FAIL: 末尾 CRLF が保持されていること')
    process.exit(1)
  }
  console.log('OK: 末尾 CRLF を保持')

  console.log('\n=== 全テスト成功 ===')
}

runTests()
