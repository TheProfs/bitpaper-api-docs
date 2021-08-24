# Status Codes

The Bitpaper API uses the following HTTP status codes:

Code | Meaning
---------- | -------
**200** | **OK** - Your request has succeeded and has response data.
**201** | **OK** - Your request has succeeded and has led to the creation of the resource.
**400** | **No Content** - Your request has succeeded and has no response data.
**400** | **Bad Request** - Your request is invalid.
**401** | **Unauthorised** - Bad authorisation header. The header is not formatted correctly or the API token is invalid or revoked
**403** | **Forbidden** - Your subscription is not active or doesn't have sufficient privileges to perform the request
**404** | **Not Found** - The specified entity could not be found.
**405** | **Method Not Allowed** - You tried to access an entity with an invalid method.
**406** | **Not Acceptable** - You requested a format that isn't json.
**410** | **Gone** - The entity requested has been removed from our servers.
**429** | **Too Many Requests** - You're issuing too many requests. Slow down!
**500** | **Internal Server Error** - We had a problem with our server. Try again later.
**503** | **Service Unavailable** - We're temporarily offline for maintenance. Please try again later.
