import { Server } from '#lib/server'

const port = Number.parseInt(process.env.PORT ?? '', 10)

if (!Number.isInteger(port))
  throw new TypeError('missing PORT')

Server.create({ root: import.meta.dirname })
  .get('/health')
  .get('/robots.txt', 'User-agent: *\nAllow: /\n')
  .static('/assets')
  .listen(port, function() {
    console.log(`listening: ${this.address().port}`)
  })
