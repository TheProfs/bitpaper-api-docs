import { test } from 'node:test'
import { request } from 'node:http'
import { join } from 'node:path'
import { Server } from '../index.js'

const ROOT = join(import.meta.dirname, 'fixtures')

test('#Server', async t => {
  await t.test('#get', async t => {
    t.beforeEach(t => {
      t.server = Server.create({ root: ROOT })
    })

    await t.test('body outside root', async t => {
      await t.test('throws', t => {
        t.assert.throws(
          () => t.server.get('/foo', '../secret.html'),
          { message: /outside root/i }
        )
      })
    })
  })

  await t.test('#static', async t => {
    t.beforeEach(t => {
      t.server = Server.create({ root: ROOT })
    })

    await t.test('dir outside root', async t => {
      await t.test('throws', t => {
        t.assert.throws(
          () => t.server.static('/escape', '../../..'),
          { message: /outside root/i }
        )
      })
    })

    await t.test('sibling dir sharing root prefix',
      async t => {
        await t.test('throws', t => {
          t.assert.throws(
            () => t.server.static(
              '/escape', '../fixtures2'
            ),
            { message: /outside root/i }
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

    await t.test('security headers', async t => {
      await t.test('includes all headers', async t => {
        const res = await t.fetch('/')

        t.assert.partialDeepStrictEqual(
          Object.fromEntries(res.headers), {
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
            'referrer-policy':
              'strict-origin-when-cross-origin',
            'permissions-policy':
              'clipboard-write=(self)'
          }
        )
      })
    })

    await t.test('method not allowed', async t => {
      await t.test('responds 405 on POST', async t => {
        const res = await t.fetch('/', { method: 'POST' })

        t.assert.strictEqual(res.status, 405)
        t.assert.ok(
          res.headers.get('allow').includes('GET')
        )
      })
    })

    await t.test('static files', async t => {
      await t.test('responds 403 on traversal',
        async t => {
          const { port } = t.server.address()
          const res = await new Promise(ok =>
            request({
              hostname: '127.0.0.1', port,
              path: '/assets/../../../etc/passwd'
            }, ok).end()
          )

          t.assert.strictEqual(res.statusCode, 403)
        })
    })
  })
})
