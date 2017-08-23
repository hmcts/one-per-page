# One per page 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/894b10eb663d47dda21349977c34fb11)](https://www.codacy.com/app/jenkins-reform-hmcts/one-per-page?utm_source=github.com&utm_medium=referral&utm_content=hmcts/one-per-page&utm_campaign=badger)
![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/one-per-page.svg)

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
