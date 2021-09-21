---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  #- shell

toc_footers:
  - <a href='https://bitpaper.io/account#api'>Get your API token</a>
  - <a href='https://bitpaper.io'>Back to Bitpaper</a>

includes:
  - status_codes
  - changelog

search: true

code_clipboard: true
---

# Introduction

Welcome to the Bitpaper API!

The following guide explain ways how you can create and manage papers
programmatically, using a REST API, and how to integrate
Bitpaper in your website.

You can view code examples in the dark area to the right.

You can get full access to our REST API by subscribing to the 'Enterprise/API'
plan on our <a href="https://bitpaper.io/pricing">Pricing</a> page

## Usage

The Bitpaper API is organized around [REST](https://en.wikipedia.org/wiki/Representational_state_transfer).

It uses predictable resource-oriented URLs, accepts
[JSON](https://en.wikipedia.org/wiki/JSON)-encoded request bodies, returns
JSON-encoded responses and uses
standard [HTTP response codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes),
authentication and verbs.

- All requests *must* be made via [HTTPS](https://en.wikipedia.org/wiki/HTTPS).
- Requests which require a request body use JSON as the request body format,
  therefore they *must* include a `Content-Type: application/json` header.

API versioning follows the [Semantic Versioning](https://semver.org/)
guidelines.

## Rate Limiting

The Bitpaper API employs a [rate limiter](https://en.wikipedia.org/wiki/Rate_limiting)
to guard against bursts of incoming traffic in order to maximise its stability.
Users who send too many requests in quick succession may see error responses
that show up as HTTP status code `429`.

All requests to the Bitpaper API are limited to **600 requests per hour**.

<a href='https://bitpaper.io/contact'>Contact us</a> if you need to increase
this limit.

## Authentication

```shell
# An example of an authorized API call
curl "<api-endpoint-here>" \
  -H "Authorization: Bearer <my-secret-api-token>"
```

> Make sure to replace `<my-secret-api-token>` with your actual API token.

Bitpaper uses API tokens to allow access to the API.

You can view your API token in your Bitpaper
[account](http://bitpaper.io/account#api).

Bitpaper requires your API token included in all API requests in a header that
looks like this:

`Authorization: Bearer <my-secret-api-token>`

<aside class="warning">
  Do not share your API tokens with anyone. The API tokens are used to uniquely
  identify you when using the Bitpaper API. If your tokens become compromised
  for any reason you can cycle them from your
  [API settings](http://bitpaper.io/account#api)
  but you would need to use the new tokens in any future API request.
</aside>

## Test Mode

The Bitpaper API allows simulating requests using your test API token so you
can test the API without incurring paper creation charges.

Bitpaper provides you with a set of 2 API tokens,
found [here](http://bitpaper.io/account#api):

- **Production API token**: Creates functioning papers and charges them to your
  account. You should use this in your production/live app.
- **Test API token**: Creates non-functioning papers which are not charged.
  You should use this token to test API requests.

<aside class="warning">
  Always remember to use your production API token for your live app.
</aside>

# Papers

Papers are the primary resource in Bitpaper.

A Paper is a collaborative whiteboard instance accessible via a unique
and permanent URL.

Creating a paper programatically will return URLs that users can visit to
join and collaborate on a whiteboard instance.

A paper (i.e URL) can have up to a maximum of 100 individual pages.
Pages can be created and switched manually using the page toolbar on the
top-right of a paper.

## API Papers

By default API created papers have the full set of whiteboard tools and
functionality including audio/video calls and screensharing.

You can control whether users have access to the paid audio/video calls and
screensharing features using the Calls toggle in your
[Call Settings](http://bitpaper.io/account#call-settings).

API created Bitpapers do not display any references to the Bitpaper brand such
as our logo or brand name.

To mask the URL you will need to follow the
[Whitelabelling](https://developers.bitpaper.io/#whitelabelling) guide below.

## Create a Paper

```shell
curl "https://api.bitpaper.io/public/api/v1/paper" \
-X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <my-secret-api-token>" \
--data '{"name":"Maths"}'
```

> Returns JSON structured like this:

```json
{
  "id_saved_paper": "ddc95912-2a81-a25e-b589-8de1d472f6e8",
  "name": "Maths",
  "created_at": "2021-01-01T01:00:00.000Z",
  "is_test_paper": false,
  "urls": {
    "admin": "https://bitpaper.io/go/Maths/xdXfoI?access-token=eyJhbGciO",
    "guest": "https://bitpaper.io/go/Maths/xdXfoI?access-token=iJIUzI9.e"
  }
}
```

Creates a paper and returns the paper information and URLs which can be used
to access the paper.

Visiting any of the URLs provided in the response would take you directly to
the created paper.

### HTTP Request

`POST https://api.bitpaper.io/public/api/v1/paper`

### Body Parameters

Parameter | Type | Description
--------- | ---- | -----------
`name` | `String`: (URL-safe, between 4-64 chars) | A name for the paper. Does not have to be unique.

### Response

Responds with `HTTP 201` if successful.

Parameter | Description
--------- | -----------
`id_saved_paper` | `String`: (36 chars)
`name`       | `String`: (URL-safe, between 4-64 chars)
`is_test_paper` | `Boolean`: `true` if paper was created using test API token
`created_at` | `String`: Timestamp of paper creation
`urls`| `Object`: Contains the URLs for accessing the papers
`urls.admin`| `Boolean`: URL which accesses the paper as an administrator/owner
`urls.guest`| `Boolean`: URL which accesses the paper as a guest

<aside class="notice">
An <code>id_saved_paper</code> is a randomly-generated, unique and permanent
identifier pointing to a paper.
You can safely store this in your system to match a paper to a user or a class.
</aside>

## Access a Paper

Created papers contain 2 URLs that can be used to join them, one for
administrators and another one for guests.

- Users who join the **administrator** URL will have full whiteboard
  privileges.
- Users who join the **guest** URL will have restricted whiteboard privileges.

A paper can have more than 1 administrator or guest. If you redirect
2 users using either the `url.admin` or `url.guest` both would have the same
whiteboard privileges.

<aside class="notice">
  At the moment the only privilege an admin has is the ability to lock a paper
  (i.e stop guests from interacting with or editing it). We will be adding
  further privileges and restrictions to papers over time.
</aside>

### Give names to your users

Papers include features which display the name of the user.
For example the chat function displays the name of each user posting a message.

To give a name to the user simply attach a `user_name=<name>` URL query
parameter to the URL like so:

`https://bitpaper.io/go/Hello%20World/xdXfoI?access-token=foo&user_name=John%20Doe`


## Delete a Paper

```shell
curl "https://api.bitpaper.io/public/api/v1/paper/ddc95912-2a81-a25e-b589-8de1d472f6e8" \
  -X DELETE \
  -H "Authorization: Bearer <my-secret-api-token>"
```

> Responds with HTTP 204 if successful or an HTTP error otherwise.

Deletes a specific paper. The content of the paper is permanently deleted and
it's URL is made permanently inaccessible.

### HTTP Request

`DELETE https://api.bitpaper.io/public/api/v1/paper/<id_saved_paper>`

### URL Parameters

Parameter | Description
--------- | -----------
`id_saved_paper` | `String`: The `id_saved_paper` of the paper to delete

### Response

Responds with `HTTP 204` if successful.

# Whitelabelling

Bitpaper allows embedding the whiteboard in your website, under your own domain
and  without any reference to the Bitpaper brand.

This allows a seamless UX for your users without any hints of using an external,
third-party whiteboard.

## Use your own domain

```html
<!--
  Embed this in your site on URL:
  https://whiteboard.yourdomain.com/Maths/xdXfoI
 -->
<iframe
  src="https://bitpaper.io/go/Maths/xdXfoI?access-token=eyJhbGciO&user_name=John%20Doe"
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
```

Bitpaper can be embedded into your website using an `<iframe>`.
This allows you to display papers to your users in a webpage that is rendered
on your own domain.

The `src` of the iframe can be set to either of the URLs returned in your
created paper.

<aside class="notice">
  <strong> Remember: </strong> Your site must be set as an origin in your
  Bitpaper account settings to allow integrating via an iframe.
</aside>
