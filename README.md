# bitpaper-api-docs

[![test](https://github.com/TheProfs/bitpaper-api-docs/actions/workflows/test.yml/badge.svg)][ci]

Static docs for the [Bitpaper REST API][site].

## Setup

```bash
npm run dev
```

Local development runs at `http://localhost:3007`.
Override the port with `PORT=3017 npm run dev`.

## Authoring

It's just a single file: `index.html`.

1. Read the [contribution guide][contrib]
2. Edit `index.html` accordingly
3. Push or merge to the default branch

Changes deploy automatically to [developers.bitpaper.io][site].

## Test

```bash
npm test
```

## Lint

Deployments also trigger [lint.yml][lint],
essentially [vale.sh][vale] prose checks.

## Structure

```
├── index.html   # documentation page
├── app.js       # entry point
├── assets/      # static files
├── lib/
│   └── server/  # HTTP server module
└── test/        # smoke tests
```

Initial structure borrowed from [Slate][gh-slate].

[MIT][mit] - Bitpaper LTD

[ci]: https://github.com/TheProfs/bitpaper-api-docs/actions/workflows/test.yml
[site]: https://developers.bitpaper.io
[contrib]: ./.github/CONTRIBUTING.md
[gh-slate]: https://github.com/slatedocs/slate
[lint]: ./.github/workflows/lint.yml
[vale]: https://vale.sh
[mit]: https://opensource.org/licenses/MIT
