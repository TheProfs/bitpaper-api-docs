---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  #- shell

toc_footers:
  - <a href='https://bitpaper.io/contact'>Contact us for an API Token</a>
  - <a href='https://bitpaper.io'>Back to Bitpaper</a>

includes:
  - errors

search: true

code_clipboard: true
---

# Introduction

Welcome to the Bitpaper API!

The following guide explain ways how you can create and manage papers
programmatically, using a REST API, and how to integrate
Bitpaper in your website.

You can view code examples in the dark area to the right.

## Usage

The Bitpaper API is organized around REST. It uses predictable
resource-oriented URLs, accepts JSON-encoded request bodies,
returns JSON-encoded responses and uses standard HTTP response codes,
authentication, and verbs.

- All requests *must* be made via HTTPS.
- Requests which require a request body use JSON as the request body format,
  therefore they *must* include a `Content-Type: application/json` header.

### Rate Limiting

The Bitpaper API employs a rate limiter to guard against bursts of incoming
traffic in order to maximise its stability. Users who send many requests in
quick succession may see error responses that show up as status code `429`.
All requests to the Bitpaper API are limited to 1800 requests per hour.

<a href='https://bitpaper.io/contact'>Contact us</a> if you need to increase
this limit.

# Authentication

```shell
# An example of an authorized API call
curl "api_endpoint_here" \
  -H "Authorization: my-super-secret-api-token"
```

> Make sure to replace `my-super-secret-api-token` with your API token.

Bitpaper uses API tokens to allow access to the API.
You can view your API token in your Bitpaper
[account](http://bitpaper.io/account#developers).

Bitpaper expects for the API token to be included in all API requests to the
server in a header that looks like the following:

`Authorization: my-super-secret-api-token`

<aside class="notice">
  You must replace <code>my-super-secret-api-token</code> with your personal
  API token, found in My Account.
</aside>

<aside class="warning">
  Do not share your API token with anyone. The API token is used to uniquely
  identify you when using the Bitpaper API.
</aside>

# Papers

Papers are the primary resource in Bitpaper. They represent a collaborative
whiteboard instance accessible via a permanent URL.

Each paper in Bitpaper has 100 pages.

Creating a paper will give you a permanent URL which you can simply visit to
launch the whiteboard instance. This URL can be shared with others to
collaborate on the whiteboard.

Papers are uniquely identified by their `id_session` which is the last
part of the returned URL.

## Create a Paper

```shell
curl "https://api.bitpaper.io/api/v1/paper/maths" \
-X POST \
-H "Content-Type: application/json" \
-H "Authorization: my-super-secret-api-token" \
--data '{"can_create_call":true}'
```

> Returns JSON structured like this:

```json
{
  "id_session": "sHKrJLF7h",
  "name": "Maths",
  "url": "https://bitpaper.io/go/Maths/sHKrJLF7h",
  "created_at": "2021-06-16T01:37:11.558Z",
  "permissions": {
    "can_create_call": true
  }
}
```

Creates a paper and returns an `id_session` which uniquely
identifies the paper.

Simply visiting the `url` provided in the response would take you directly to
the created paper.

### HTTP Request

`POST https://api.bitpaper.io/api/v1/paper/<name>`

### URL Parameters

Parameter | Type | Description
--------- | ---- | -----------
name | String (URL-safe, between 6-64 chars) | A name for the paper. Does not have to be unique.

### Body Parameters

Parameter | Description
--------- | -----------
can_create_call | Boolean: Whether this paper should allow audio/video calls

<aside class="notice">
An <code>id_session</code> is a randomly-generated, unique and permanent
identifier pointing to a paper.
You can safely store this in your system to match a paper to a user or a class.
</aside>

<aside class="warning">
  Creating a paper also charges it to your account.
</aside>

## Delete a Paper

```shell
curl "https://api.bitpaper.io/api/v1/paper/sHKrJLF7h" \
  -X DELETE \
  -H "Authorization: my-super-secret-api-token"
```

> Responds with HTTP 204 if successful or an HTTP error
> otherwise.

Deletes a specific paper. The data of the paper is deleted and it's link
is made permanently inaccessible.

### HTTP Request

`DELETE https://api.bitpaper.io/api/v1/paper/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | String: The `id_session` of the paper to delete

# Whitelabelling

Bitpaper allows embedding the whiteboard in your website, under your own domain
and  without any reference to the Bitpaper brand.

This allows a seamless UX for your users without any hints of using an external,
third-party whiteboard.

## Use your own domain

```html
<!--
  Embed this in your site on URL:
  https://whiteboard.yourdomain.com/maths/sHKrJLF7h
 -->
<iframe
  allow="camera; microphone"
  style="
    position: fixed;
    top: 0px;
    bottom: 0px;
    right: 0px;
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 999999;
    height: 100%;
  ">
</iframe>
<script>
  window.onload = () => {
    const src = `https://bitpaper.io${window.location.pathname}`
    document.querySelector('frame').src = src
  }
</script>
```

You can embed Bitpaper in a page within your site by using an `<iframe>`.

The iframe `src` *must* be set to the following path to redirect to a paper:

`https://bitpaper.io/go/[paper_name]/[id_session]`

- Replace `[paper_name]` with the name of the paper.
- Replace `[id_session]` with the `id_session` returned by a `POST /paper`
  call.

Ideally you would embed the iframe on a path within your website that accepts
the `name` and the `id` of the Paper as URL parts so it can be shared easily.

A good example would be: [https://whiteboard.yourdomain.io/maths/sHKrJLF7h](https://whiteboard.yourdomain.io/maths/sHKrJLF7h).

Then using JS, replace the root domain with `https://bitpaper.io` just
like the provided example.

<aside class="warning">
  <strong> Remember: </strong> Your site must be set as an origin in your
  Bitpaper account settings to allow integrating via an iframe.
</aside>
