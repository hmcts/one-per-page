# One per page 

A framework that aims to make building GOV.UK style one question per page
transactions easy.

## Documentation

All documentation is stored in the [docs] folder.

## Development

We use the [Dockerfile] and [docker-compose.yml] to create a development
container used for running tests, etc.

To start the container run:

```
make
```

Once complete you will be dropped in to a shell where you can run `yarn`.

[Dockerfile]:https://github.com/hmcts/nodejs-one-per-page/blob/master/Dockerfile
[docker-compose.yml]:https://github.com/hmcts/nodejs-one-per-page/blob/master/docker-compose.yml
