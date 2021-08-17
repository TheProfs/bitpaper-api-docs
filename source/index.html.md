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
Users who send many requests in quick succession may see error responses that
show up as HTTP status code `429`.

All requests to the Bitpaper API are limited to **600 requests per hour**.

<a href='https://bitpaper.io/contact'>Contact us</a> if you need to increase
this limit.

## Authentication

```shell
# An example of an authorised API call
curl "<api-endpoint-here>" \
  -H "Authorisation: Bearer <my-secret-api-token>"
```

> Make sure to replace `<my-secret-api-token>` with your actual API token.

Bitpaper uses API tokens to allow access to the API.
You can view your API token in your Bitpaper
[account](http://bitpaper.io/account#developers).

Bitpaper expects for the API token to be included in all API requests to the
server in a header that looks like the following:

`Authorisation: Bearer <my-secret-api-token>`

<aside class="warning">
  Do not share your API tokens with anyone. The API tokens are used to uniquely
  identify you when using the Bitpaper API.
</aside>

## Test Mode

The Bitpaper API allows simulating requests using your test API token so you
can test the API without incurring charges.

Bitpaper provides you with a set of 2 API tokens:

- **Production API token**: Creates working papers and charges them to your
  account. You should use this in your production/live app.
- **Test API token**: Creates non-working papers which are not charged.
  You should use this token to test API requests.

Papers created using the test mode API token are not saved nor charged to your
account.

You can find your test API token alongside your production API token
<a href='https://bitpaper.io/account#api'>here</a>.

<aside class="warning">
  Test tokens do not actually create working papers. Always remember to use
  your production API token for your live app.
</aside>

# Papers

Papers are the primary resource in Bitpaper. They represent a collaborative
whiteboard instance accessible via a permanent URL.

Each paper in Bitpaper has 100 pages.

Creating a paper will give you permanent URLs which you can simply visit to
launch the whiteboard instance. The URLs can be shared with others to
collaborate on the whiteboard.

## API Papers

Papers created via the API do not require any of the visiting users to login.

They have limited functionality (i.e the visiting user cannot save the paper in
his own account) and the paper and any calls performed on the paper are charged
to the API owner.

They also do not display any references to the Bitpaper brand such as
a logo, brand name etc.

## Create a Paper

```shell
curl "https://api.bitpaper.io/public/api/v1/paper" \
-X POST \
-H "Content-Type: application/json" \
-H "Authorisation: Bearer <my-secret-api-token>" \
--data '{"name":"Maths"}'
```

> Returns JSON structured like this:

```json
{
  "id_saved_paper": "ddc95912-2a81-a25e-b589-8de1d472f6e8",
  "id_session": "xdXfoI",
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

Responds with `HTTP 200` if successful.

Parameter | Description
--------- | -----------
`id_saved_paper` | `String`: (36 chars)
`id_session` | `String`: (URL-safe, between 8-64 chars)
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

<aside class="warning">
  Creating a paper with the production API token also charges it to your
  account.
</aside>

## Access a Paper

Created papers contain URLs which can be used to redirect to them.

### Administrator vs Guest

Each paper contains 2 URLs, one for **administrator** and one for **guest**.

- The administrator has full privileges on the paper (i.e can lock the paper).
- The guest on the other hand has limited privileges. They cannot lock the
  paper.

### Give names to your users

Papers include features which display the name of the user.
For example the chat function displays the name of each user posting a message.

To give a name to the user simply attach a `user_name=<name>` URL query
parameter to the URL like so:

`https://bitpaper.io/go/Hello%20World/xdXfoI?access-token=foo&user_name=John%20Doe`

<aside class="notice">
  A paper can have more than 1 administrator. If you redirect 2 users using the
  `url.admin` URL, both of them would be able to perform top-level admin actions
  on the paper.
</aside>

<aside class="notice">
  Test papers do not redirect to a working paper. They redirect to a page
  indicating whether you redirected to the correct URL. Papers created with
  the production API token will actually redirect to a working collaborative
  paper instance.
</aside>

## Delete a Paper

```shell
curl "https://api.bitpaper.io/public/api/v1/paper/ddc95912-2a81-a25e-b589-8de1d472f6e8" \
  -X DELETE \
  -H "Authorisation: Bearer <my-secret-api-token>"
```

> Responds with HTTP 204 if successful or an HTTP error otherwise.

Deletes a specific paper. The data of the paper is deleted and it's link
is made permanently inaccessible.

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

You can embed Bitpaper in a page within your site by using an `<iframe>`.
This allows you to display Bitpaper to your users in a page which is rendered
in your own domain.

Ideally you would embed the iframe on a path within your website that accepts
the `name` and the `id` of the Paper as URL parts so it can be shared easily.

The `src` of the iframe can be set to either of the URLs returned in your
created paper.

<aside class="notice">
  <strong> Remember: </strong> Your site must be set as an origin in your
  Bitpaper account settings to allow integrating via an iframe.
</aside>
