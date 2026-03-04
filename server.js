import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const root = join(import.meta.dirname, 'build')
const port = parseInt(process.env.PORT || '4567', 10)

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

const serve = async (req, res) => {
  const url = req.url.split('?')[0]
  const path = url === '/'
    ? join(root, 'index.html')
    : join(root, url)

  try {
    const body = await readFile(path)
    const ext = extname(path)

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' })
    res.end(body)
  } catch {
    const fallback = await readFile(join(root, 'index.html'))

    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(fallback)
  }
}

createServer(serve).listen(port, () =>
  console.log(`docs: http://localhost:${port}`)
)
