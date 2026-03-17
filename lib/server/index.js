import { Server as HttpServer } from 'node:http'
import { createHash } from 'node:crypto'
import { readFile, access } from 'node:fs/promises'
import { join, resolve, extname,
  relative, isAbsolute } from 'node:path'

class Server extends HttpServer {
  static DEFAULTS = {
    root: import.meta.dirname,
    maxAge: 300,
    mime: {
      '.html': 'text/html',
      '.txt':  'text/plain',
      '.xml':  'application/xml',
      '.json': 'application/json',
      '.png':  'image/png',
      '.jpg':  'image/jpeg',
      '.svg':  'image/svg+xml',
      '.ico':  'image/x-icon',
      '.webp': 'image/webp'
    },
    security: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy':
        'strict-origin-when-cross-origin',
      'Permissions-Policy':
        'clipboard-write=(self)'
    }
  }

  #config
  #pages = {}
  #routes = {}
  #staticUrl
  #staticDir

  static create(config = {}) {
    return new Server({
      ...Server.DEFAULTS, ...config,
      mime: { ...Server.DEFAULTS.mime, ...config.mime },
      security: {
        ...Server.DEFAULTS.security,
        ...config.security
      }
    })
  }

  constructor(config) {
    super((req, res) => this.#handle(req, res))
    this.#config = {
      ...config,
      root: resolve(config.root)
    }
  }

  get(path, body) {
    const ext = extname(body || path)
    const mime = this.#config.mime[ext]

    if (body && ext && !mime)
      throw new Error(`${ext}: not in mime`)

    return mime
      ? this.#addPage(path, body || path.slice(1))
      : this.#addRoute(path, body || 'ok')
  }

  static(prefix, dir) {
    this.#staticUrl = prefix.startsWith('/')
      ? prefix : `/${prefix}`
    const dirPath = resolve(
      this.#config.root,
      dir || prefix.replace(/^\//, '')
    )

    if (!this.#inRoot(
      this.#config.root, dirPath
    ))
      throw new Error('static dir outside root')

    this.#staticDir = dirPath

    return this
  }

  async listen(port = 0, cb) {
    await this.#detectIndex()
    await this.#loadPages()

    return super.listen(port, cb)
  }

  #addPage(path, file) {
    const filePath = resolve(
      this.#config.root, file
    )

    if (!this.#inRoot(
      this.#config.root, filePath
    ))
      throw new Error('page file outside root')

    this.#pages[path] = { file, filePath }
    return this
  }

  #addRoute(path, body) {
    this.#routes[path] = body
    return this
  }

  async #detectIndex() {
    const index = join(this.#config.root,
      'index.html')

    if (this.#pages['/']) return

    await access(index)
      .then(() => this.#addPage('/', 'index.html'))
      .catch(() => {})
  }

  async #loadPages() {
    for (const [, page] of
      Object.entries(this.#pages)) {
      page.html = await readFile(
        page.filePath
      )
      page.etag = `"${
        createHash('sha256')
          .update(page.html)
          .digest('hex')
          .slice(0, 16)
      }"`
    }
  }

  #inRoot(base, file) {
    const rel = relative(base, file)

    return rel === '' || (
      !rel.startsWith('..')
      && !isAbsolute(rel)
    )
  }

  #path(url = '/') {
    return url.replace(/[?#].*$/, '')
      || '/'
  }

  #send(res, status, body, headers = {}) {
    return res.writeHead(status, {
      'Content-Type':
        'text/plain; charset=utf-8',
      ...this.#config.security,
      ...headers
    }).end(body)
  }

  #sendPage(req, res, page) {
    const { maxAge } = this.#config

    return req.headers['if-none-match']
      === page.etag
      ? this.#send(res, 304, null, {
          ETag: page.etag,
          'Cache-Control':
            `public, max-age=${maxAge}`
        })
      : this.#send(res, 200, page.html, {
          'Content-Type':
            `${this.#config.mime[
              extname(page.file)
            ]}; charset=utf-8`,
          'Content-Length': page.html.length,
          'Cache-Control':
            `public, max-age=${maxAge}`,
          ETag: page.etag
        })
  }

  #sendStatic(path, res) {
    const { mime, maxAge } = this.#config
    const rel = path.slice(
      this.#staticUrl.length
    )
    const file = resolve(
      this.#staticDir, `.${rel}`
    )

    return !file.startsWith(
      `${this.#staticDir}/`)
      ? this.#send(res, 403, 'Forbidden\n')
      : !mime[extname(file)]
        ? this.#send(res, 404, 'Not Found\n', {
            'Cache-Control': 'no-store'
          })
        : readFile(file)
            .then(data => this.#send(
              res, 200, data, {
                'Content-Type':
                  mime[extname(file)],
                'Content-Length': data.length,
                'Cache-Control':
                  `public, max-age=${maxAge}`
              }
            ))
            .catch(() => this.#send(
              res, 404, 'Not Found\n',
              { 'Cache-Control': 'no-store' }
            ))
  }

  #handle(req, res) {
    try {
      if (req.method !== 'GET'
        && req.method !== 'HEAD')
        return this.#send(
          res, 405, 'Method Not Allowed\n',
          { Allow: 'GET, HEAD' }
        )

      const path = this.#path(req.url)
      const page = this.#pages[path]

      if (page)
        return this.#sendPage(req, res, page)

      const route = this.#routes[path]

      if (route !== undefined)
        return this.#send(res, 200, route, {
          'Cache-Control': 'no-store'
        })

      return this.#staticUrl
        && path.startsWith(
          `${this.#staticUrl}/`)
        ? this.#sendStatic(path, res)
        : this.#send(
            res, 404, 'Not Found\n',
            { 'Cache-Control': 'no-store' }
          )
    } catch {
      if (!res.headersSent)
        this.#send(
          res, 500, 'Internal Server Error\n',
          { 'Cache-Control': 'no-store' }
        )
    }
  }
}

export { Server }
