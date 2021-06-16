# Bitpaper API Docs

Bitpaper's public API docs, build using [Slate][slate].

## Install

Clone this repository, cd into it and then:

```bash
$ gem update --system
$ gem install bundler
$ bundle install
```

## Usage

Simply edit `src/index.html.md`. More info on [Slate's][slate] homepage.

## Run server

```bash
bundle exec middleman server
```

## Deploy to production

```bash
# Build docs
./deploy.sh
# push to production:
$ git add --all
$ git commit -am"Added POST/ user"
$ git push origin main
```

The app is deployed on Heroku as [bitpaper-api-docs])
(https://dashboard.heroku.com/apps/bitpaper-api-docs)

[slate]: https://github.com/slatedocs/slate
