# server

Tiny static-file HTTP server

- Text routes default to `ok`
- File-like `.get(...)` paths serve that file
- Static dirs default from the prefix
- `index.html` auto-serves at `/`

## usage

```js
import { Server } from '#lib/server'

Server.create({ root: import.meta.dirname })
  .get('/health')
  .get('/robots.txt', 'User-agent: *\nAllow: /\n')
  .static('/assets')
  .listen(process.env.PORT || 0, function() {
    console.log(`listening: ${this.address().port}`)
  })
```

## test

```sh
npm test
```

## gotchas

- Root bounds page files and static dirs
- Query strings are ignored for routing
- Only `GET` and `HEAD` are allowed
