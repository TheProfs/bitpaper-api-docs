import { test } from 'node:test'
import { join } from 'node:path'
import { Server } from '../index.js'

const ROOT = join(import.meta.dirname, 'fixtures')

test('#Server', async t => {
  await t.test('#create', async t => {
    await t.test('returns a Server', t => {
      const server = Server.create()

      t.assert.ok(server instanceof Server)
    })

  })

  await t.test('#get', async t => {
    t.beforeEach(t => {
      t.server = Server.create({ root: ROOT })
    })

    await t.test('body with known extension', async t => {
      await t.test('chains', t => {
        t.assert.strictEqual(
          t.server.get('/', 'index.html'), t.server
        )
      })
    })

    await t.test('body with no extension', async t => {
      await t.test('chains', t => {
        t.assert.strictEqual(
          t.server.get('/ping', 'pong'), t.server
        )
      })
    })

    await t.test('no body, path has known extension',
      async t => {
        await t.test('chains', t => {
          t.assert.strictEqual(
            t.server.get('/robots.txt'), t.server
          )
        })
      })

    await t.test('no body, path has no extension',
      async t => {
        await t.test('chains', t => {
          t.assert.strictEqual(
            t.server.get('/health'), t.server
          )
        })
      })

    await t.test('body with unknown extension', async t => {
      await t.test('throws', t => {
        t.assert.throws(
          () => t.server.get('/foo', 'bar.xyz'),
          { message: /not in mime/i }
        )
      })
    })

  })

  await t.test('#static', async t => {
    t.beforeEach(t => {
      t.server = Server.create({ root: ROOT })
    })

    await t.test('with prefix and dir', async t => {
      await t.test('chains', t => {
        t.assert.strictEqual(
          t.server.static('/img', 'assets'), t.server
        )
      })
    })

    await t.test('prefix only', async t => {
      await t.test('derives dir from prefix', t => {
        t.assert.strictEqual(
          t.server.static('/assets'), t.server
        )
      })
    })

  })

  await t.test('#listen', async t => {
    t.beforeEach(async t => {
      t.server = Server.create({ root: ROOT })
        .get('/health')
        .get('/ping', 'pong')
        .get('/robots.txt')
        .get('/', 'index.html')
        .static('/assets')

      await t.server.listen(0, () => {})

      t.fetch = (path, opts) => fetch(
        `http://127.0.0.1:${
          t.server.address().port
        }${path}`, opts
      )
    })

    t.afterEach(async t => {
      await new Promise(ok => t.server.close(ok))
    })

    await t.test('auto-detects index.html', async t => {
      const server = Server.create({ root: ROOT })
        .get('/health')

      await server.listen(0, () => {})

      const res = await fetch(
        `http://127.0.0.1:${server.address().port}/`
      )

      t.assert.strictEqual(res.status, 200)
      t.assert.ok(
        res.headers.get('content-type')
          .includes('text/html')
      )

      await new Promise(ok => server.close(ok))
    })

    await t.test('page route', async t => {
      await t.test('responds 200 with html', async t => {
        const res = await t.fetch('/')

        t.assert.strictEqual(res.status, 200)
        t.assert.ok(
          res.headers.get('content-type')
            .includes('text/html')
        )
      })

      await t.test('includes etag', async t => {
        const res = await t.fetch('/')

        t.assert.ok(res.headers.get('etag'))
      })

      await t.test('responds 304 on matching etag',
        async t => {
          const first = await t.fetch('/')
          const etag = first.headers.get('etag')

          const second = await t.fetch('/', {
            headers: { 'If-None-Match': etag }
          })

          t.assert.strictEqual(second.status, 304)
        })

      await t.test('includes cache-control', async t => {
        const res = await t.fetch('/')
        const cc = res.headers.get('cache-control')

        t.assert.ok(cc.includes('max-age='))
      })

      await t.test('responds 200 with query string',
        async t => {
          const res = await t.fetch('/?v=1')

          t.assert.strictEqual(res.status, 200)
        })
    })

    await t.test('text route', async t => {
      await t.test('responds 200', async t => {
        const res = await t.fetch('/health')

        t.assert.strictEqual(res.status, 200)
        t.assert.strictEqual(await res.text(), 'ok')
      })

      await t.test('responds with custom body',
        async t => {
          const res = await t.fetch('/ping')

          t.assert.strictEqual(
            await res.text(), 'pong'
          )
        })

      await t.test('responds 200 with query string',
        async t => {
          const res = await t.fetch('/health?view=full')

          t.assert.strictEqual(res.status, 200)
          t.assert.strictEqual(await res.text(), 'ok')
        })
    })

    await t.test('file route from path', async t => {
      await t.test('serves file content', async t => {
        const res = await t.fetch('/robots.txt')

        t.assert.strictEqual(res.status, 200)
        t.assert.ok(
          (await res.text()).includes('User-agent')
        )
      })
    })

    await t.test('unknown path', async t => {
      await t.test('responds 404', async t => {
        const res = await t.fetch('/nonexistent')

        t.assert.strictEqual(res.status, 404)
      })
    })

    await t.test('static files', async t => {
      await t.test('serves known mime type', async t => {
        const res = await t.fetch('/assets/pixel.png')

        t.assert.strictEqual(res.status, 200)
        t.assert.ok(
          res.headers.get('content-type')
            .includes('image/png')
        )
      })

      await t.test('responds 404 on missing file',
        async t => {
          const res = await t.fetch('/assets/nope.png')

          t.assert.strictEqual(res.status, 404)
        })

      await t.test('responds 404 on unknown extension',
        async t => {
          const res = await t.fetch('/assets/file.xyz')

          t.assert.strictEqual(res.status, 404)
        })

      await t.test('serves file with query string',
        async t => {
          const res = await t.fetch('/assets/pixel.png?v=1')

          t.assert.strictEqual(res.status, 200)
          t.assert.ok(
            res.headers.get('content-type')
              .includes('image/png')
          )
        })
    })
  })
})
