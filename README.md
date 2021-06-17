# Bitpaper API Docs

Bitpaper's public REST API docs, built using [Slate][slate].

## Install

Ensure you have all [system dependencies installed][slate-getting-started],
clone this repository, cd into it and then:

```bash
$ gem update --system
$ gem install bundler
$ bundle install
```

## Usage

## Run development server

```bash
bundle exec middleman server
# then visit http://192.168.10.1:4567
```

## Edit documentation

Simply edit `src/index.html.md`.
More info on [Slate's][slate] homepage.

## Deploy to production

```bash
# Build docs
$ bundle exec middleman build

# Push to main branch:
$ git add --all
$ git commit -am"Added POST/ user"
$ git push origin main
```

Pushing to `main` branch automatically deploys on Heroku as
[bitpaper-api-docs][heroku-bitpaper-api-docs],
which is publicly accessible at https://developers.bitpaper.io

[slate]:https://github.com/slatedocs/slate
[slate-getting-started]:https://github.com/slatedocs/slate/wiki/Using-Slate-Natively
[heroku-bitpaper-api-docs]:https://dashboard.heroku.com/apps/bitpaper-api-docs

## Authors

Bitpaper LTD
