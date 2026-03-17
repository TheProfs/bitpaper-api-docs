import { test } from 'node:test'
import { join } from 'node:path'
import { Server } from '#lib/server'

const ROOT = join(import.meta.dirname, '..')

test('smoke', async t => {
  t.beforeEach(async t => {
    t.server = Server.create({ root: ROOT })
      .get('/health')
      .get('/robots.txt', 'User-agent: *\nAllow: /\n')
      .static('/assets')

    await t.server.listen(0, () => {})

    t.fetch = path => fetch(
      `http://127.0.0.1:${t.server.address().port}${path}`
    )
  })

  t.afterEach(async t => {
    await new Promise(ok => t.server.close(ok))
  })

  await t.test('GET / responds 200', async t => {
    const res = await t.fetch('/')

    t.assert.strictEqual(res.status, 200)
  })

  await t.test('GET /health responds 200', async t => {
    const res = await t.fetch('/health')

    t.assert.strictEqual(res.status, 200)
  })

  await t.test('GET /robots.txt responds 200', async t => {
    const res = await t.fetch('/robots.txt')

    t.assert.strictEqual(res.status, 200)
  })

  await t.test('GET /unknown responds 404', async t => {
    const res = await t.fetch('/nope')

    t.assert.strictEqual(res.status, 404)
  })
})
