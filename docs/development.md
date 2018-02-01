# Development

This page details our development process. If you wish to contribute to One per
Page we ask that you read this page and follow this process.

We are continously iterating this process and so it is not the best it could be
yet. If you have any problems please raise an issue so we can improve the
development experience for everyone.

## Developing Features

We use Docker and Docker Compose to build a Node.JS container that we use for
testing, linting, etc. We use Make as a convenience to make interacting with
Docker and Docker Compose easier.

### Prerequisities

- [Docker][Docker] currently `v17.09.0-ce`
- Docker Compose (included in Docker)
- [Make]
- [Bumped]

### Entering the dev container

Running `make` will build a new dev container and drop you in a bash shell in
the container.

```bash
> make
# building container

/usr/src/app $
```

While building the container the Dockerfile will do a full `yarn install`,
meaning you should not have to install dependencies inside the container.

> See the [Dockerfile] and [docker-compose.yml] to 

From inside the container you can run yarn commands to test, lint or serve docs.

### Example application

There is a straw man application in [examples/test-app] where we demonstrate
features of One per Page.

If you build a new feature, please include a demo in the example app to show
users how it works.

To start up the example app you will need to install dependencies before
running `yarn start-dev`:

```bash
/usr/src/app $ cd examples/test-app
/usr/src/app/examples/test-app $ yarn install
# installing dependencies

/usr/src/app/examples/test-app $ yarn start-dev
# listening on 0.0.0.0:3000
```

Using `start-dev` will enable hot reloading of files. Our [docker-compose.yml]
maps port `3000` to your local machine so you can now open a browser and
access the demo app from http://localhost:3000

#### Linking One per Page to the Example app

When developing a feature it is useful to create a live link between your code
and the example app. This enables hot reloading on your changes as well, ensuring
that you don't need to `yarn install` after each change in One per Page.

You can link the example app to One per Page like so:

```bash
/usr/src/app $ yarn link
# creates link

/usr/src/app $ cd examples/test-app
/usr/src/app/examples/test-app $ yarn link @hmcts/one-per-page
# links to our checked out code
```

### Linting code

All code written in One per Page has to conform to our style, as enforced by
eslint.

Our eslint config is defined in `.eslintrc.json` and is shared for reuse by
other teams in [hmcts/eslint-config].

You can also add eslint to your editor for faster feedback of failures. For example,
Atom provides an eslint package that will automatically pick up our `.eslintrc.json`.

## Testing features

We test our code to a high level of coverage, usually around 96%. When building
a feature or making changes to existing features you should write sufficient
tests to prove your feature works as intended.

Tests are located in `/tests` in the repo and are organised to follow the same
structure as the `/src` folder. Test files end in `.test.js`.

### `/test/util/chai.js` helper

We use chai and sinon for our test assertions with a number of plugins enabled.
To share this test configuration we have collected it in `/test/util/chai.js`.

_/test/example/example.test.js_
```js
const { expect, sinon } = require('../util/chai.js');

describe('An example usage of chaijs helper', () => {
  it('exposes chai.expect', () => {
    expect(true).to.be.true;
  });
});
```

### `/test/util/supertest.js` helper

To make testing a step easier we have augmented supertest with a number of
extra assertions that allow us to test returned HTML, values that exist in session
and set up preconditions easily.

_/test/example/example.test.js_
```js
const { testStep } = require('../util/supertest.js');
const MyStep = require(...);

describe('MyStep', () => {
  it('renders its title', () => {
    return testStep(MyStep)
      .withSetup(req => req.session.generate()) // create a session
      .get() // issue a GET request
      .html(
        $ => expect($('#title').to.have.$text('My Steps Title'))
      ); // JQuery like HTML assertions using Zepto.JS
  });
});
```

See the other step tests for examples of using this helper.

## Merging work

When your feature is ready to merge you should start by opening a PR.

### Open a PR

A good pull request includes:

- A descriptive, short, title
- Explanation of what the feature does
- Explanation of why you have built the feature
- Links to anything relevant to the PR, such as issues that informed it
- Whether the change is a breaking change

### Get a code review

Ask one of the regular contributors to review your work. If happy they will
approve the PR.

### Ensure all checks pass

We use Codacy and Travis to run our linting, tests and coverage during PRs. If
any of these fail you will need to fix the issues before a merge.

It's a good idea to run `yarn lint` and `yarn test` regularly while developing.
`yarn test` includes a coverage report at the end so you can see what your current
coverage is.

You can also add eslint to your editor for faster feedback of failures. For example,
Atom provides an eslint package that will automatically pick up our `.eslintrc.json`.

## Releasing

We release software using [Bumped], which wil run a set of checks before pushing
a tag to github. Travis will then pick up this tag and release the code to NPM.

### Bumped

We use bumped to release versions. Bumped is configured in `.bumpedrc` and will
run our linting and tests before building a Changelog of new commits since the
last release.

To run bumped, exit the dev env and run:

```bash
> bumped release major
# bumps the version number by 1.0.0

> bumped release minor
# bumps the version number by 0.1.0

> bumped release patch
# bumps the version number by 0.0.1
```

You can also release a specific version by running `bumped release x.y.z`.

> You can't rerelease a version, NPM will complain at trying to republish a
> version.

### Version to release

We use SemVer for versioning:

- __If a release contains a breaking change__ it must be released as a major
version bump.

- If a release contains new features it should be released as a minor version bump.

- If a release contains only fixes to existing features it can be released as a
patch release.

### Travis CI

Travis watches for new tags and on a new tag will run linting, tests and coverage.
If they pass it will push the code to NPM where users can pull it from.

[Dockerfile]:https://github.com/hmcts/one-per-page/blob/master/Dockerfile
[docker-compose.yml]:https://github.com/hmcts/one-per-page/blob/master/docker-compose.yml
[examples/test-app]:https://github.com/hmcts/one-per-page/tree/master/examples/test-app
[Docker]:https://www.docker.com/
[Make]: https://www.gnu.org/software/make/
[Bumped]: https://www.npmjs.com/package/bumped
[hmcts/eslint-config]: https://github.com/hmcts/eslint-config
