# One per page 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/894b10eb663d47dda21349977c34fb11)](https://www.codacy.com/app/jenkins-reform-hmcts/one-per-page?utm_source=github.com&utm_medium=referral&utm_content=hmcts/one-per-page&utm_campaign=badger)
![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/one-per-page.svg)

A framework that aims to make building GOV.UK style one question per page
transactions easy.

## Documentation

All documentation is stored in the [docs] folder.

## Development

### Prerequisites

[Docker] 
> time of writing this version `17.09.0-ce`

### Build and enter your docker development container

We use the [Dockerfile] and [docker-compose.yml] to create a development
container used for running tests, etc.

To start the container run:

```
make
```
> to see whats happening with this command see the `Makefile`.

### Install dependencies
```yarn install```

### Build the library
Once in the docker container shell, to build the library you can run: 
```yarn```

### Example application
There is a straw man application in [examples/test-app] in this repository that you can use to manually test as you change this repository. When doing this it is recommended you use link this repository to the example using yarn link.

#### Creating a live link (one-per-page dev)
If you want to work on developing one-per-page with a test application, you can create a live link so changes to this repository by running:
```yarn link```

[Dockerfile]:https://github.com/hmcts/one-per-page/blob/master/Dockerfile
[docker-compose.yml]:https://github.com/hmcts/one-per-page/blob/master/docker-compose.yml
[examples/test-app]:https://github.com/hmcts/one-per-page/tree/master/examples/test-app
[Docker]:https://www.docker.com/