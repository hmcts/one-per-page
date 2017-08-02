# [Page]

The page type provides a way of serving templates as part of a transaction.

## Expectations

The Page type expects you to create a subclass that extends it and implement
the following methods:

- *get url()*

    The URL to route requests to this page.

        get url() { return '/petitioner/details'; }

- *handler(req, res, next)* (optional)

    The request handler that will serve requests.

    By default this will serve a page with a `200 OK` code on GET requests and
    respond `405 Method Not Allowed` for any other requests.

- *get middleware()* (optional)

    A list of middleware functions to be run before the handler.

## Example usage

Create a new class that extends Page:

```
class HelloWorld extends Page {
  get url() { return '/hello-world'; }
}
```

And create a template called `HelloWorld.html` in your views directory.

[Page]:https://github.com/hmcts/nodejs-one-per-page/blob/master/src/steps/Page.js

