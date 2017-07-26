# nodejs-one-per-page
One question per page framework

This piece of work extracts the steps framework from [divorce](https://git.reform.hmcts.net/divorce/frontend) into [src](/src).

## Restructuring thoughts for reusability so far:
1. Both [framework](/src) and demo [app](/app) are developed here for easier development. Changes made to the framework 
can easily be manually tested within the app. It's also far easier to decide whether a particular class should reside in 
the framework or app.

2. Once we're at a point the framework is stable, well tested we could leave the app here as is, or pull it out by:
   1. Moving the app out into it's own repo.
   2. Ensure the app has a dependency on the framework (the framework would be an NPM module)
   3. Require classes through a suitable consumer API, for example any application code wishing to use the framework 
   would require classes like so:
                 
          const Step = require('define an api to access specific classes such as Step');

3. I've made some comments/assumptions within these files:
    1. [Page](/app/steps/page/Page.js) 
    2. [runStepHandler](src/core/runStepHandler.js)
    3. [ValidationStep](src/steps/ValidationStep.js)
    
4. I've created some very basic [steps](/app/steps) for my understanding on how the whole Step class hierarchy, 
runStepHandler and session works. This would also be beneficial for any dev using one-per-page (OPP) for the very first 
time. We should build these steps out over time showcasing what the framework does.

5. The [test](/test) directory structure should mirror the [src](/src) directory structure as we don't want unit tests 
inside framework code.

What's next: 
1. Decide on where aforementioned classes should live e.g. framework or application code.
2. Fixup up the tests as I've run out of time for now.
3. Create more [steps](/app/steps) purely for learning/demonstrable purposes.
4. Anything specific to Divorce will need to removed from the framework.
5. Publish the framework @reform/one-per-page to npm allowing us to add it via yarn

All in all I really like what you guys have done here, we can certainly improve on it and make it reusable for other teams
to use across Government - that's the plan anyway.

## Installation
1. yarn install
2. yarn dev