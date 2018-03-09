<a name="3.3.1"></a>
## 3.3.1 (2018-03-09)

* Stop suppressing errors from the flowControls, such as infinite loops ([4d58571](https://github.com/hmcts/one-per-page/commit/4d58571))



<a name="3.3.0"></a>
# 3.3.0 (2018-03-08)

* Create new Interstitial step ([64282f7](https://github.com/hmcts/one-per-page/commit/64282f7))
* Demo using the interstitial step ([cdf053e](https://github.com/hmcts/one-per-page/commit/cdf053e))
* Demonstrate the interstitial page ([38c74a1](https://github.com/hmcts/one-per-page/commit/38c74a1))
* Document how Interstitial works ([e3ebb11](https://github.com/hmcts/one-per-page/commit/e3ebb11))
* Ensure that interstitials are visited before the step they preceed ([e7a193a](https://github.com/hmcts/one-per-page/commit/e7a193a))
* Fix linting ([bb04169](https://github.com/hmcts/one-per-page/commit/bb04169))
* Modify check your answers to get completeness and continue url from the journey ([0392752](https://github.com/hmcts/one-per-page/commit/0392752))



<a name="3.2.0"></a>
# 3.2.0 (2018-03-07)

* Add new SmartRedirector that uses the treewalking to skip complete steps ([9b21216](https://github.com/hmcts/one-per-page/commit/9b21216))
* Switch goTo to use the SmartRedirector by default ([41c7dbc](https://github.com/hmcts/one-per-page/commit/41c7dbc))



<a name="3.1.2"></a>
## 3.1.2 (2018-03-07)

* Ensure forms filled from temp values are validated on GET requests ([093509f](https://github.com/hmcts/one-per-page/commit/093509f))



<a name="3.1.1"></a>
## 3.1.1 (2018-03-07)

* Fix our usage of nodejs-logging ([386a073](https://github.com/hmcts/one-per-page/commit/386a073))



<a name="3.1.0"></a>
# 3.1.0 (2018-03-06)

* Only load resource bundles if they haven't been loaded before ([0872db9](https://github.com/hmcts/one-per-page/commit/0872db9))



<a name="3.0.0"></a>
# 3.0.0 (2018-03-06)

* Add a function to list the available languages ([ff32db7](https://github.com/hmcts/one-per-page/commit/ff32db7))
* Add debugging of step instance creation ([0105488](https://github.com/hmcts/one-per-page/commit/0105488))
* Add documentation for the language switcher ([dd8b775](https://github.com/hmcts/one-per-page/commit/dd8b775))
* Add logging to BaseStep ([f506cc4](https://github.com/hmcts/one-per-page/commit/f506cc4))
* Add logging to error pages ([013eecd](https://github.com/hmcts/one-per-page/commit/013eecd))
* Ensure refs aren't included in checking if an answer has been given ([c4f307d](https://github.com/hmcts/one-per-page/commit/c4f307d))
* Fix heroku deployments ([94bf3d6](https://github.com/hmcts/one-per-page/commit/94bf3d6))
* Fix heroku deployments ([e434590](https://github.com/hmcts/one-per-page/commit/e434590))
* Fix heroku deployments ([520243c](https://github.com/hmcts/one-per-page/commit/520243c))
* Fix heroku deployments ([4a0808b](https://github.com/hmcts/one-per-page/commit/4a0808b))
* Fix heroku deployments ([e143c28](https://github.com/hmcts/one-per-page/commit/e143c28))
* Ignore webpack built assets in example app ([b68cf0f](https://github.com/hmcts/one-per-page/commit/b68cf0f))
* Include the language switcher styles in example app ([4f3dde7](https://github.com/hmcts/one-per-page/commit/4f3dde7))
* Increase coverage over i18Next.js ([cbbe369](https://github.com/hmcts/one-per-page/commit/cbbe369))
* Make form capable of retrieving values from a temp storage ([7cea8f2](https://github.com/hmcts/one-per-page/commit/7cea8f2))
* Move currentLang / availableLangs to req.i18n ([fb2c82a](https://github.com/hmcts/one-per-page/commit/fb2c82a))
* Omit dist folders from eslint ([f489757](https://github.com/hmcts/one-per-page/commit/f489757))
* Prevent caching of questions ([8f357a4](https://github.com/hmcts/one-per-page/commit/8f357a4))
* Provide a way to temporarily store values ([b558a2f](https://github.com/hmcts/one-per-page/commit/b558a2f))
* Redirect to GET on errors ([0fa6733](https://github.com/hmcts/one-per-page/commit/0fa6733))
* Release 2.6.0 ([302e691](https://github.com/hmcts/one-per-page/commit/302e691))
* Remove old field types and underlying classes ([2f384e6](https://github.com/hmcts/one-per-page/commit/2f384e6))
* Shim over @hmcts/nodejs-logging for logging ([9b3a483](https://github.com/hmcts/one-per-page/commit/9b3a483))
* Switch action logging to new module ([28c00de](https://github.com/hmcts/one-per-page/commit/28c00de))
* Switch language based on url params ([8e19bae](https://github.com/hmcts/one-per-page/commit/8e19bae))
* Switch logging in journey to use new logging module ([e6016b0](https://github.com/hmcts/one-per-page/commit/e6016b0))
* Update tech-docs and fix issue where it couldn't see css-loader in heroku ([b01e78c](https://github.com/hmcts/one-per-page/commit/b01e78c))



<a name="2.6.0"></a>
# 2.6.0 (2018-03-06)

* Add a function to list the available languages ([ff32db7](https://github.com/hmcts/one-per-page/commit/ff32db7))
* Add debugging of step instance creation ([0105488](https://github.com/hmcts/one-per-page/commit/0105488))
* Add documentation for the language switcher ([dd8b775](https://github.com/hmcts/one-per-page/commit/dd8b775))
* Add logging to BaseStep ([f506cc4](https://github.com/hmcts/one-per-page/commit/f506cc4))
* Add logging to error pages ([013eecd](https://github.com/hmcts/one-per-page/commit/013eecd))
* Ensure refs aren't included in checking if an answer has been given ([c4f307d](https://github.com/hmcts/one-per-page/commit/c4f307d))
* Fix heroku deployments ([520243c](https://github.com/hmcts/one-per-page/commit/520243c))
* Fix heroku deployments ([94bf3d6](https://github.com/hmcts/one-per-page/commit/94bf3d6))
* Fix heroku deployments ([e434590](https://github.com/hmcts/one-per-page/commit/e434590))
* Fix heroku deployments ([4a0808b](https://github.com/hmcts/one-per-page/commit/4a0808b))
* Fix heroku deployments ([e143c28](https://github.com/hmcts/one-per-page/commit/e143c28))
* Ignore webpack built assets in example app ([b68cf0f](https://github.com/hmcts/one-per-page/commit/b68cf0f))
* Include the language switcher styles in example app ([4f3dde7](https://github.com/hmcts/one-per-page/commit/4f3dde7))
* Increase coverage over i18Next.js ([cbbe369](https://github.com/hmcts/one-per-page/commit/cbbe369))
* Make form capable of retrieving values from a temp storage ([7cea8f2](https://github.com/hmcts/one-per-page/commit/7cea8f2))
* Move currentLang / availableLangs to req.i18n ([fb2c82a](https://github.com/hmcts/one-per-page/commit/fb2c82a))
* Omit dist folders from eslint ([f489757](https://github.com/hmcts/one-per-page/commit/f489757))
* Prevent caching of questions ([8f357a4](https://github.com/hmcts/one-per-page/commit/8f357a4))
* Provide a way to temporarily store values ([b558a2f](https://github.com/hmcts/one-per-page/commit/b558a2f))
* Redirect to GET on errors ([0fa6733](https://github.com/hmcts/one-per-page/commit/0fa6733))
* Remove old field types and underlying classes ([2f384e6](https://github.com/hmcts/one-per-page/commit/2f384e6))
* Shim over @hmcts/nodejs-logging for logging ([9b3a483](https://github.com/hmcts/one-per-page/commit/9b3a483))
* Switch action logging to new module ([28c00de](https://github.com/hmcts/one-per-page/commit/28c00de))
* Switch language based on url params ([8e19bae](https://github.com/hmcts/one-per-page/commit/8e19bae))
* Switch logging in journey to use new logging module ([e6016b0](https://github.com/hmcts/one-per-page/commit/e6016b0))
* Update tech-docs and fix issue where it couldn't see css-loader in heroku ([b01e78c](https://github.com/hmcts/one-per-page/commit/b01e78c))



<a name="2.5.1"></a>
## 2.5.1 (2018-02-23)

* Collect steps after we've required a session exists ([48ecd35](https://github.com/hmcts/one-per-page/commit/48ecd35))



<a name="2.5.0"></a>
# 2.5.0 (2018-02-21)

* Attach .ref functions to basic field types ([d195670](https://github.com/hmcts/one-per-page/commit/d195670))
* Document the new ref functions ([9888f2f](https://github.com/hmcts/one-per-page/commit/9888f2f))
* Fix linting errors ([4fcd0e0](https://github.com/hmcts/one-per-page/commit/4fcd0e0))
* Switch example app to use new ref approach ([90996fb](https://github.com/hmcts/one-per-page/commit/90996fb))



<a name="2.4.0"></a>
# 2.4.0 (2018-02-20)

* Allow tests to customise the views dir ([516bc19](https://github.com/hmcts/one-per-page/commit/516bc19))
* Document CheckYourAnswers and the html answers option ([dd4d45e](https://github.com/hmcts/one-per-page/commit/dd4d45e))
* Encapsulate answer rendering, to allow for overriding ([54e316b](https://github.com/hmcts/one-per-page/commit/54e316b))
* Increase coverage over answer.js ([8893fb9](https://github.com/hmcts/one-per-page/commit/8893fb9))
* Increase coverage over CheckYourAnswers ([1053e97](https://github.com/hmcts/one-per-page/commit/1053e97))
* Nest answer inside it's module ([eed7088](https://github.com/hmcts/one-per-page/commit/eed7088))
* Release 2.4.0-1 ([64d5bf1](https://github.com/hmcts/one-per-page/commit/64d5bf1))
* Render templates from answers that have one ([60abe2a](https://github.com/hmcts/one-per-page/commit/60abe2a))
* Update example apps dependencies ([0cfbb51](https://github.com/hmcts/one-per-page/commit/0cfbb51))



<a name="2.4.0-1"></a>
# 2.4.0-1 (2018-02-09)

* Allow tests to customise the views dir ([911b2bf](https://github.com/hmcts/one-per-page/commit/911b2bf))
* Encapsulate answer rendering, to allow for overriding ([1fa7f12](https://github.com/hmcts/one-per-page/commit/1fa7f12))
* Nest answer inside it's module ([aca52d3](https://github.com/hmcts/one-per-page/commit/aca52d3))
* Render templates from answers that have one ([f0ee5a7](https://github.com/hmcts/one-per-page/commit/f0ee5a7))
* Update example apps dependencies ([b1d9312](https://github.com/hmcts/one-per-page/commit/b1d9312))



<a name="2.3.0"></a>
# 2.3.0 (2018-02-05)

* Allow developers to set custom timeouts ([0740d62](https://github.com/hmcts/one-per-page/commit/0740d62))
* Document how we develop one-per-page ([751a236](https://github.com/hmcts/one-per-page/commit/751a236))
* Improve readme to describe project and direct to documentation ([17e90d9](https://github.com/hmcts/one-per-page/commit/17e90d9))



<a name="2.2.0"></a>
# 2.2.0 (2018-02-01)

* Add a step type that allows you to capture mutliple of a complex field ([a1d8f63](https://github.com/hmcts/one-per-page/commit/a1d8f63))
* added error pages ([87948a2](https://github.com/hmcts/one-per-page/commit/87948a2))
* Allow filledForms to declare if the user has filled any field ([e3013ca](https://github.com/hmcts/one-per-page/commit/e3013ca))
* Allow serializers access to existing session values ([3f198d4](https://github.com/hmcts/one-per-page/commit/3f198d4))
* Allow steps to customise which url a questions form will post to ([ecfefda](https://github.com/hmcts/one-per-page/commit/ecfefda))
* Allow subclasses of BaseStep to customise the path to listen on ([3daf371](https://github.com/hmcts/one-per-page/commit/3daf371))
* Demo AddAnother in the example app ([511ffc6](https://github.com/hmcts/one-per-page/commit/511ffc6))
* Deploy documentation to heroku ([f54e21e](https://github.com/hmcts/one-per-page/commit/f54e21e))
* Document the AddAnother step ([8069a58](https://github.com/hmcts/one-per-page/commit/8069a58))
* Document the forms package ([e496952](https://github.com/hmcts/one-per-page/commit/e496952))
* Documenting the Question, Page and BaseStep steps ([3acc3f8](https://github.com/hmcts/one-per-page/commit/3acc3f8))
* Ensure convert returns the wrapped fields mappedErrors instead of mapping it's own errors ([3f00530](https://github.com/hmcts/one-per-page/commit/3f00530))
* Ensure correct order of locals ([375ec7a](https://github.com/hmcts/one-per-page/commit/375ec7a))
* Ensure objectFields declare themselves as filled if their children are filled ([6b7cc71](https://github.com/hmcts/one-per-page/commit/6b7cc71))
* Ensure ObjectFieldValues declare themselves as validated ([c2a233d](https://github.com/hmcts/one-per-page/commit/c2a233d))
* Ensure refs actually don't store their values in the session ([ed60a83](https://github.com/hmcts/one-per-page/commit/ed60a83))
* Ensure transformedFieldValues report that validations are run correctly ([e2e8dfe](https://github.com/hmcts/one-per-page/commit/e2e8dfe))
* extra tests for error pages and bug fixes ([3cfc4dc](https://github.com/hmcts/one-per-page/commit/3cfc4dc))
* Fix linter errors ([f8f2485](https://github.com/hmcts/one-per-page/commit/f8f2485))
* Increase coverage in forms package ([5119eee](https://github.com/hmcts/one-per-page/commit/5119eee))
* Increase coverage over AddAnother and appendToList ([784b806](https://github.com/hmcts/one-per-page/commit/784b806))
* Move the appendToList field in to forms package and test it ([1d65cae](https://github.com/hmcts/one-per-page/commit/1d65cae))
* Release 2.1.0-1 ([eddda46](https://github.com/hmcts/one-per-page/commit/eddda46))
* Release 2.1.0-2 ([4b6c34c](https://github.com/hmcts/one-per-page/commit/4b6c34c))
* Release 2.1.0-3 ([d251247](https://github.com/hmcts/one-per-page/commit/d251247))
* Remove conflicting lockfile ([782e443](https://github.com/hmcts/one-per-page/commit/782e443))
* remove duplication from tests and fix some formatting ([695c08f](https://github.com/hmcts/one-per-page/commit/695c08f))
* Rename list item to item, makes more sense from developer perspective ([80be308](https://github.com/hmcts/one-per-page/commit/80be308))
* replaced manual strings with i18n files ([9a63595](https://github.com/hmcts/one-per-page/commit/9a63595))
* Switch postInstall to use yarn ([5e38f13](https://github.com/hmcts/one-per-page/commit/5e38f13))
* Test the AddAnother step ([4832a27](https://github.com/hmcts/one-per-page/commit/4832a27))
* Update yarn.lock ([5e63085](https://github.com/hmcts/one-per-page/commit/5e63085))
* Fix: new RegExp(/) will match any url ([f5a05b0](https://github.com/hmcts/one-per-page/commit/f5a05b0))



<a name="2.1.0-3"></a>
# 2.1.0-3 (2018-01-12)

* Ensure objectFields declare themselves as filled if their children are filled ([54b1fe1](https://github.com/hmcts/one-per-page/commit/54b1fe1))
* Increase coverage in forms package ([8d907b3](https://github.com/hmcts/one-per-page/commit/8d907b3))
* Increase coverage over AddAnother and appendToList ([362c13d](https://github.com/hmcts/one-per-page/commit/362c13d))
* Move the appendToList field in to forms package and test it ([773d9f2](https://github.com/hmcts/one-per-page/commit/773d9f2))
* Test the AddAnother step ([a090720](https://github.com/hmcts/one-per-page/commit/a090720))
* Update to latest eslint config ([97f4198](https://github.com/hmcts/one-per-page/commit/97f4198))
* Fix: new RegExp(/) will match any url ([efb795b](https://github.com/hmcts/one-per-page/commit/efb795b))



<a name="2.1.0-2"></a>
# 2.1.0-2 (2018-01-09)

* Ensure convert returns the wrapped fields mappedErrors instead of mapping it's own errors ([b1cd4b4](https://github.com/hmcts/one-per-page/commit/b1cd4b4))
* Fix linter errors ([2312cd4](https://github.com/hmcts/one-per-page/commit/2312cd4))
* Update yarn.lock ([ad68985](https://github.com/hmcts/one-per-page/commit/ad68985))



<a name="2.1.0-1"></a>
# 2.1.0-1 (2017-12-22)

* Add a step type that allows you to capture mutliple of a complex field ([69f0c24](https://github.com/hmcts/one-per-page/commit/69f0c24))
* added error pages ([87948a2](https://github.com/hmcts/one-per-page/commit/87948a2))
* Allow filledForms to declare if the user has filled any field ([feec6fa](https://github.com/hmcts/one-per-page/commit/feec6fa))
* Allow serializers access to existing session values ([09462ae](https://github.com/hmcts/one-per-page/commit/09462ae))
* Allow steps to customise which url a questions form will post to ([4836d08](https://github.com/hmcts/one-per-page/commit/4836d08))
* Allow subclasses of BaseStep to customise the path to listen on ([cf6ea23](https://github.com/hmcts/one-per-page/commit/cf6ea23))
* Demo AddAnother in the example app ([096c651](https://github.com/hmcts/one-per-page/commit/096c651))
* Ensure correct order of locals ([5a3ab39](https://github.com/hmcts/one-per-page/commit/5a3ab39))
* Ensure ObjectFieldValues declare themselves as validated ([2cf4d84](https://github.com/hmcts/one-per-page/commit/2cf4d84))
* Ensure refs actually don't store their values in the session ([2429162](https://github.com/hmcts/one-per-page/commit/2429162))
* Ensure transformedFieldValues report that validations are run correctly ([6aaf52e](https://github.com/hmcts/one-per-page/commit/6aaf52e))
* extra tests for error pages and bug fixes ([3cfc4dc](https://github.com/hmcts/one-per-page/commit/3cfc4dc))
* remove duplication from tests and fix some formatting ([695c08f](https://github.com/hmcts/one-per-page/commit/695c08f))
* Rename list item to item, makes more sense from developer perspective ([2bedc61](https://github.com/hmcts/one-per-page/commit/2bedc61))
* replaced manual strings with i18n files ([9a63595](https://github.com/hmcts/one-per-page/commit/9a63595))



<a name="2.0.1"></a>
## 2.0.1 (2017-12-21)

* Add a list field that wraps other fields ([5006551](https://github.com/hmcts/one-per-page/commit/5006551))
* Add bool.default for setting the default value ([f812ef0](https://github.com/hmcts/one-per-page/commit/f812ef0))
* Add convert to map values from one form to another ([1c3f9d7](https://github.com/hmcts/one-per-page/commit/1c3f9d7))
* Allow only running specific tests (it.only) ([3f240a2](https://github.com/hmcts/one-per-page/commit/3f240a2))
* Allow users of FieldDescriptor to change what value field it produces ([36c1678](https://github.com/hmcts/one-per-page/commit/36c1678))
* Collect FieldValue classes in same module ([267e0ae](https://github.com/hmcts/one-per-page/commit/267e0ae))
* Collect some common reduce and map operations to reuse them easier ([0f01577](https://github.com/hmcts/one-per-page/commit/0f01577))
* Consume new fields for all basic fields ([7a91fff](https://github.com/hmcts/one-per-page/commit/7a91fff))
* Demo validating a fields converted value ([fa220c8](https://github.com/hmcts/one-per-page/commit/fa220c8))
* Enable object field validation and mapping errors ([3a1ec04](https://github.com/hmcts/one-per-page/commit/3a1ec04))
* Ensure that transformed object fields still expose their child fields ([8984622](https://github.com/hmcts/one-per-page/commit/8984622))
* Expose new field interfaces ([7eaaa4f](https://github.com/hmcts/one-per-page/commit/7eaaa4f))
* Fix bug caused by renaming the underlying field to wrapped ([17bc754](https://github.com/hmcts/one-per-page/commit/17bc754))
* Prevent mutating the base field descriptor ([d392918](https://github.com/hmcts/one-per-page/commit/d392918))
* Provide mappedErrors needed for summarising the errors ([8f162a3](https://github.com/hmcts/one-per-page/commit/8f162a3))
* Refactor compoundField to subclass from FieldDescriptor ([fe12091](https://github.com/hmcts/one-per-page/commit/fe12091))
* Refactor fieldDescriptor so you can return FieldValue from your functions ([4dbdb12](https://github.com/hmcts/one-per-page/commit/4dbdb12))
* Reimplement compoundField as object fieldDescriptor ([72f8004](https://github.com/hmcts/one-per-page/commit/72f8004))
* Reimplement date field using new convert and object fields ([4a942bb](https://github.com/hmcts/one-per-page/commit/4a942bb))
* Reimplement Form to support new field approach ([8521504](https://github.com/hmcts/one-per-page/commit/8521504))
* Reimplement ref field in new approach ([1c2c7fc](https://github.com/hmcts/one-per-page/commit/1c2c7fc))
* Release 2.0.0 ([e96e295](https://github.com/hmcts/one-per-page/commit/e96e295))
* Remove complexity from mapping the entries in an object ([2e86d3b](https://github.com/hmcts/one-per-page/commit/2e86d3b))
* Remove now unused formProxyHandler ([22afd4c](https://github.com/hmcts/one-per-page/commit/22afd4c))
* Remove value from answers block as its not used anymore ([c1acadd](https://github.com/hmcts/one-per-page/commit/c1acadd))
* Rename underlying field to better describe it ([7670eec](https://github.com/hmcts/one-per-page/commit/7670eec))
* Replace old form interface with our new one ([7a1e352](https://github.com/hmcts/one-per-page/commit/7a1e352))
* Rewrite fields to separate declaration of a field and the parsed value ([1d6b5d4](https://github.com/hmcts/one-per-page/commit/1d6b5d4))
* Simplify cloning a field descriptor ([da91f94](https://github.com/hmcts/one-per-page/commit/da91f94))
* Split fieldValue.test.js as it was too long ([13d7531](https://github.com/hmcts/one-per-page/commit/13d7531))
* Split FilledForm and Form in to their own packages ([c4af07f](https://github.com/hmcts/one-per-page/commit/c4af07f))
* Test date field ([4b2b8ab](https://github.com/hmcts/one-per-page/commit/4b2b8ab))
* Update list to parse from BodyParsers output ([0e66179](https://github.com/hmcts/one-per-page/commit/0e66179))
* Fix: Moment accepts months 0-indexed but parses them as you'd expect ([d8e8ec2](https://github.com/hmcts/one-per-page/commit/d8e8ec2))



<a name="2.0.0"></a>
# 2.0.0 (2017-12-21)

* Add a list field that wraps other fields ([f2a8743](https://github.com/hmcts/one-per-page/commit/f2a8743))
* Add bool.default for setting the default value ([9cf17e0](https://github.com/hmcts/one-per-page/commit/9cf17e0))
* Add convert to map values from one form to another ([e2bfa8c](https://github.com/hmcts/one-per-page/commit/e2bfa8c))
* Allow only running specific tests (it.only) ([0238b34](https://github.com/hmcts/one-per-page/commit/0238b34))
* Allow users of FieldDescriptor to change what value field it produces ([628e1df](https://github.com/hmcts/one-per-page/commit/628e1df))
* Collect FieldValue classes in same module ([e5d6efb](https://github.com/hmcts/one-per-page/commit/e5d6efb))
* Collect some common reduce and map operations to reuse them easier ([b05e394](https://github.com/hmcts/one-per-page/commit/b05e394))
* Consume new fields for all basic fields ([a47b691](https://github.com/hmcts/one-per-page/commit/a47b691))
* Demo validating a fields converted value ([c0a6eb7](https://github.com/hmcts/one-per-page/commit/c0a6eb7))
* Enable object field validation and mapping errors ([7ae9660](https://github.com/hmcts/one-per-page/commit/7ae9660))
* Ensure that transformed object fields still expose their child fields ([ad1821e](https://github.com/hmcts/one-per-page/commit/ad1821e))
* Expose new field interfaces ([2bbd1d6](https://github.com/hmcts/one-per-page/commit/2bbd1d6))
* Prevent mutating the base field descriptor ([744f7a4](https://github.com/hmcts/one-per-page/commit/744f7a4))
* Provide mappedErrors needed for summarising the errors ([f56c80a](https://github.com/hmcts/one-per-page/commit/f56c80a))
* Refactor compoundField to subclass from FieldDescriptor ([61a74a2](https://github.com/hmcts/one-per-page/commit/61a74a2))
* Refactor fieldDescriptor so you can return FieldValue from your functions ([e4fb96d](https://github.com/hmcts/one-per-page/commit/e4fb96d))
* Reimplement compoundField as object fieldDescriptor ([34e8046](https://github.com/hmcts/one-per-page/commit/34e8046))
* Reimplement date field using new convert and object fields ([0e7ec76](https://github.com/hmcts/one-per-page/commit/0e7ec76))
* Reimplement Form to support new field approach ([cc69e6b](https://github.com/hmcts/one-per-page/commit/cc69e6b))
* Reimplement ref field in new approach ([b34f89b](https://github.com/hmcts/one-per-page/commit/b34f89b))
* Remove complexity from mapping the entries in an object ([a771d17](https://github.com/hmcts/one-per-page/commit/a771d17))
* Remove now unused formProxyHandler ([854f20f](https://github.com/hmcts/one-per-page/commit/854f20f))
* Remove value from answers block as its not used anymore ([b20a352](https://github.com/hmcts/one-per-page/commit/b20a352))
* Rename underlying field to better describe it ([18d78ae](https://github.com/hmcts/one-per-page/commit/18d78ae))
* Replace old form interface with our new one ([f199ce9](https://github.com/hmcts/one-per-page/commit/f199ce9))
* Rewrite fields to separate declaration of a field and the parsed value ([0cd434e](https://github.com/hmcts/one-per-page/commit/0cd434e))
* Simplify cloning a field descriptor ([e55de7b](https://github.com/hmcts/one-per-page/commit/e55de7b))
* Split fieldValue.test.js as it was too long ([340ca08](https://github.com/hmcts/one-per-page/commit/340ca08))
* Split FilledForm and Form in to their own packages ([17888e6](https://github.com/hmcts/one-per-page/commit/17888e6))
* Test date field ([009cfec](https://github.com/hmcts/one-per-page/commit/009cfec))
* Update list to parse from BodyParsers output ([66e5e2c](https://github.com/hmcts/one-per-page/commit/66e5e2c))
* Fix: Moment accepts months 0-indexed but parses them as you'd expect ([0f91129](https://github.com/hmcts/one-per-page/commit/0f91129))



<a name="2.0.0-5"></a>
# 2.0.0-5 (2017-12-13)

* Filter ref fields out of default values ([59148a5](https://github.com/hmcts/one-per-page/commit/59148a5))



<a name="2.0.0-4"></a>
# 2.0.0-4 (2017-12-13)

* Add a basic dateField complex field ([c1d85bd](https://github.com/hmcts/one-per-page/commit/c1d85bd))
* Allow a compoundFields value to be mapped to another object ([ea87b85](https://github.com/hmcts/one-per-page/commit/ea87b85))
* Allow compound fields to target their errors ([86f3334](https://github.com/hmcts/one-per-page/commit/86f3334))
* Basic compound field type ([4d67cdd](https://github.com/hmcts/one-per-page/commit/4d67cdd))
* Clean up checks in compoundField based on review feedback ([9b81ade](https://github.com/hmcts/one-per-page/commit/9b81ade))
* Ensure empty strings are parsed as undefined by textParser ([1b415d9](https://github.com/hmcts/one-per-page/commit/1b415d9))
* Fix #77 by always waiting for a promises to complete ([a922f8a](https://github.com/hmcts/one-per-page/commit/a922f8a)), closes [#77](https://github.com/hmcts/one-per-page/issues/77)
* Move base field types in to a file that can be required by complex fields ([34fa7ba](https://github.com/hmcts/one-per-page/commit/34fa7ba))
* Move mapping of errors to FieldErrors in to FieldDescriptor ([7f86857](https://github.com/hmcts/one-per-page/commit/7f86857))
* Rename for clear understanding based on review feedback ([68079eb](https://github.com/hmcts/one-per-page/commit/68079eb))
* Use dateField to ask for the users date of marriage ([cbec718](https://github.com/hmcts/one-per-page/commit/cbec718))



<a name="2.0.0-3"></a>
# 2.0.0-3 (2017-12-07)

* Add action flow control that performs some action before redirecting ([f73ca4b](https://github.com/hmcts/one-per-page/commit/f73ca4b))
* Add function to collect the values from steps in a journey ([dc1886e](https://github.com/hmcts/one-per-page/commit/dc1886e))
* Add logic to collect the steps visited in the journey ([f6fc685](https://github.com/hmcts/one-per-page/commit/f6fc685))
* Clean up tests for the RequestBoundJourney ([7a0e6b1](https://github.com/hmcts/one-per-page/commit/7a0e6b1))
* Demo importing show-hide-content.js from govuk_frontend_toolkit ([60e8017](https://github.com/hmcts/one-per-page/commit/60e8017))
* Demo the action failing ([b5eb615](https://github.com/hmcts/one-per-page/commit/b5eb615))
* Demo using action to send values to an API after CYA ([0df3394](https://github.com/hmcts/one-per-page/commit/0df3394))
* Document what a trampoline is as it's not an obvious concept ([aa80fc6](https://github.com/hmcts/one-per-page/commit/aa80fc6))
* Ensure action will not break the chain ([bfc4beb](https://github.com/hmcts/one-per-page/commit/bfc4beb))
* Explicitly bind of function used in middleware ([4d1b267](https://github.com/hmcts/one-per-page/commit/4d1b267))
* Expose steps and flow modules ([6e97ce2](https://github.com/hmcts/one-per-page/commit/6e97ce2))
* Merge options with options given by users ([5d6b134](https://github.com/hmcts/one-per-page/commit/5d6b134))
* Provide a way to change values for a step ([9d39e37](https://github.com/hmcts/one-per-page/commit/9d39e37))
* Remove escaped quotes from strings based on review feedback ([ea11f8f](https://github.com/hmcts/one-per-page/commit/ea11f8f))
* Set up Error/Done and API for demoing actions ([ccf6c49](https://github.com/hmcts/one-per-page/commit/ccf6c49))
* Update dependencies to latest ([16be7ad](https://github.com/hmcts/one-per-page/commit/16be7ad))
* update the documentation while going through as a new starter ([34a99e6](https://github.com/hmcts/one-per-page/commit/34a99e6))
* Use globals to clean up templates ([a2356fe](https://github.com/hmcts/one-per-page/commit/a2356fe))
* Use multiple extends to use the same globals in all templates ([fb55f26](https://github.com/hmcts/one-per-page/commit/fb55f26))



<a name="2.0.0-2"></a>
# 2.0.0-2 (2017-11-29)

* Add TreeWalker for allowing steps to control what strategy is used to walk the tree ([3fd621c](https://github.com/hmcts/one-per-page/commit/3fd621c))
* Add treeWalker that validates before stopping ([c8a9e83](https://github.com/hmcts/one-per-page/commit/c8a9e83))
* Collapse other treewalkers ([63ec80b](https://github.com/hmcts/one-per-page/commit/63ec80b))
* Copy walkTree functionality in to RequestBoundJourney ([21480a3](https://github.com/hmcts/one-per-page/commit/21480a3))
* Fix linter errors ([ad80549](https://github.com/hmcts/one-per-page/commit/ad80549))
* Merge journey and flow modules as they are very related ([fe958f8](https://github.com/hmcts/one-per-page/commit/fe958f8))
* Move journey in to the new journey package ([07448c4](https://github.com/hmcts/one-per-page/commit/07448c4))
* Move RequestBoundJourney in to it's own module and test it ([d491914](https://github.com/hmcts/one-per-page/commit/d491914))
* Store step instances for the life of a request ([9f2cd01](https://github.com/hmcts/one-per-page/commit/9f2cd01))
* Switch the journeys walkTree function to use the new treeWalkers ([b0618ab](https://github.com/hmcts/one-per-page/commit/b0618ab))
* Switch to using RequestBoundJourneys walk tree ([c5af443](https://github.com/hmcts/one-per-page/commit/c5af443))
* Update example app to reflect changes to req.journey ([6d86f53](https://github.com/hmcts/one-per-page/commit/6d86f53))
* Wait for all steps, not just questions ([b80b370](https://github.com/hmcts/one-per-page/commit/b80b370))



<a name="2.0.0-1"></a>
# 2.0.0-1 (2017-11-23)

* Add a check to ensure a value is an array ([0cc40c3](https://github.com/hmcts/one-per-page/commit/0cc40c3))
* Add boolField for parsing yes/nos to boolean ([dd342c7](https://github.com/hmcts/one-per-page/commit/dd342c7))
* Add the ability for steps to wait before executing their handler ([5aa7334](https://github.com/hmcts/one-per-page/commit/5aa7334))
* Add the MIT Licenses file ([4e0c862](https://github.com/hmcts/one-per-page/commit/4e0c862))
* Allow questions to hide their answers ([fe139d7](https://github.com/hmcts/one-per-page/commit/fe139d7))
* Allow steps to declare that the user should stop here ([054b61c](https://github.com/hmcts/one-per-page/commit/054b61c))
* Allow steps to define an answer for check your answers ([0d5e498](https://github.com/hmcts/one-per-page/commit/0d5e498))
* Bind functions to the step when exposing them to locals ([a90b9cf](https://github.com/hmcts/one-per-page/commit/a90b9cf))
* Change how steps access content from their namespace ([87d8ece](https://github.com/hmcts/one-per-page/commit/87d8ece))
* Clean up cya content for example app ([74ef91d](https://github.com/hmcts/one-per-page/commit/74ef91d))
* Demo the wip check your answers ([39d4ccb](https://github.com/hmcts/one-per-page/commit/39d4ccb))
* Ensure static properties are included in locals ([26abbfb](https://github.com/hmcts/one-per-page/commit/26abbfb))
* Ensure the default list gets a title ([6cba089](https://github.com/hmcts/one-per-page/commit/6cba089))
* Ensure the i18N instance is reused across requests ([3dd966f](https://github.com/hmcts/one-per-page/commit/3dd966f))
* Expose check your answers pieces ([1b9bdfd](https://github.com/hmcts/one-per-page/commit/1b9bdfd))
* Expose the step behind the flow control ([72d79ac](https://github.com/hmcts/one-per-page/commit/72d79ac))
* Fix linting mistakes ([02a580c](https://github.com/hmcts/one-per-page/commit/02a580c))
* Fix sessions bug that meant sessions didn't persist over app restarts ([eb53f9e](https://github.com/hmcts/one-per-page/commit/eb53f9e))
* Instantiate a new instance of step for each request ([ca2d9f7](https://github.com/hmcts/one-per-page/commit/ca2d9f7))
* Loosen the requirement to set a next step ([e70aff7](https://github.com/hmcts/one-per-page/commit/e70aff7))
* Maintain ordering of answers in a section ([013eee1](https://github.com/hmcts/one-per-page/commit/013eee1))
* Make Check your Answers a question to enforce session ([dafdc5a](https://github.com/hmcts/one-per-page/commit/dafdc5a))
* Make fields respond to Object.values ([e1ea849](https://github.com/hmcts/one-per-page/commit/e1ea849))
* Move parseRequests functionality in to Question ([3075332](https://github.com/hmcts/one-per-page/commit/3075332))
* Move responsibility for setting up a Questions form in to it's constructor ([96a42a0](https://github.com/hmcts/one-per-page/commit/96a42a0))
* Move responsibility for walking the steps out of the section ([e8e2228](https://github.com/hmcts/one-per-page/commit/e8e2228))
* Move responsibility for wiring steps up in to BaseStep ([00f084c](https://github.com/hmcts/one-per-page/commit/00f084c))
* Move step instantiation in to constructor ([a3e6dc8](https://github.com/hmcts/one-per-page/commit/a3e6dc8))
* Move step namespacing out of field, in to form ([248ec1e](https://github.com/hmcts/one-per-page/commit/248ec1e))
* Move wiring up Step.req,res,journey in to BaseStep constructor ([578da09](https://github.com/hmcts/one-per-page/commit/578da09))
* Pass eslint in check your answers ([e6b41c7](https://github.com/hmcts/one-per-page/commit/e6b41c7))
* Provide a way for check your answers to declare the sections for the template ([9aa3618](https://github.com/hmcts/one-per-page/commit/9aa3618))
* Refactor loadStepContent to return a promise ([606866b](https://github.com/hmcts/one-per-page/commit/606866b))
* Refactor resolveTemplate to return a promise ([9aaa87d](https://github.com/hmcts/one-per-page/commit/9aaa87d))
* Remove res.locals from content/template rendering ([a721e58](https://github.com/hmcts/one-per-page/commit/a721e58))
* Remove unused middleware form of loadStepContent ([6687703](https://github.com/hmcts/one-per-page/commit/6687703))
* Remove unused type functions from steps ([cd7f108](https://github.com/hmcts/one-per-page/commit/cd7f108))
* Small updates to example app ([81e9a9c](https://github.com/hmcts/one-per-page/commit/81e9a9c))
* Stop respondent title from being rendered on check your answers ([a1d72f0](https://github.com/hmcts/one-per-page/commit/a1d72f0))
* Store entrypoint used by a session in the session ([91babbf](https://github.com/hmcts/one-per-page/commit/91babbf))
* Switch example app to pass Steps as classes ([46e3866](https://github.com/hmcts/one-per-page/commit/46e3866))
* Switch Page content loading to use waitFor ([84fbf89](https://github.com/hmcts/one-per-page/commit/84fbf89))
* Test check your answers doing a GET ([53c5320](https://github.com/hmcts/one-per-page/commit/53c5320))
* Update dependencies to latest ([fcf35b0](https://github.com/hmcts/one-per-page/commit/fcf35b0))
* Update ref to support changes to how a form is bound ([5b76d06](https://github.com/hmcts/one-per-page/commit/5b76d06))
* Update to latest versions ([9b3ee3c](https://github.com/hmcts/one-per-page/commit/9b3ee3c))
* Wait for steps to be ready before check your answers ([8682ed4](https://github.com/hmcts/one-per-page/commit/8682ed4))
* Walk the tree to build a list of steps the user has visited ([f562aff](https://github.com/hmcts/one-per-page/commit/f562aff))
* Walk the tree when building answers for cya ([91a271e](https://github.com/hmcts/one-per-page/commit/91a271e))
* Fix: don't force validation unless form is filled ([613aee6](https://github.com/hmcts/one-per-page/commit/613aee6))
* Fix: render error message from content file ([8cd5754](https://github.com/hmcts/one-per-page/commit/8cd5754))
* Fix: stop was broken ([507415f](https://github.com/hmcts/one-per-page/commit/507415f))
* Wip: Add check your answers step ([6880850](https://github.com/hmcts/one-per-page/commit/6880850))



<a name="1.2.0"></a>
# 1.2.0 (2017-10-19)

* Add new Reference type that is a readonly field ([0e97fa2](https://github.com/hmcts/one-per-page/commit/0e97fa2))
* Allow steps to define functions that are scoped local ([c6f4d9a](https://github.com/hmcts/one-per-page/commit/c6f4d9a))
* Expose new ref fields and demo them in the example app ([138b846](https://github.com/hmcts/one-per-page/commit/138b846))
* Fix bad value on country page (hang over from a test) ([38fd008](https://github.com/hmcts/one-per-page/commit/38fd008))
* Test the @hmcts/one-per-page/forms interface ([69987ca](https://github.com/hmcts/one-per-page/commit/69987ca))



<a name="1.1.0"></a>
# 1.1.0 (2017-10-13)

* Add new field type to handle checkboxes ([39acf03](https://github.com/hmcts/one-per-page/commit/39acf03))
* Demo the checkbox field in the example app ([db21810](https://github.com/hmcts/one-per-page/commit/db21810))
* Expose new checkboxField ([0248857](https://github.com/hmcts/one-per-page/commit/0248857))
* Expose the forms package ([52c299e](https://github.com/hmcts/one-per-page/commit/52c299e))
* Simplify checkbox type ([cc9ffa4](https://github.com/hmcts/one-per-page/commit/cc9ffa4))
* Switch example app to use textField and arrayField ([dbf7e54](https://github.com/hmcts/one-per-page/commit/dbf7e54))
* Switch field types to describe the js value, not the html control ([032736e](https://github.com/hmcts/one-per-page/commit/032736e))



<a name="1.0.0"></a>
# 1.0.0 (2017-10-12)

* fix(package): update i18next to version 10.0.1 ([3845530](https://github.com/hmcts/one-per-page/commit/3845530)), closes [#41](https://github.com/hmcts/one-per-page/issues/41)
* Add a simple tern config to enable tern prediction ([a95e164](https://github.com/hmcts/one-per-page/commit/a95e164))
* Add BaseStep.dirname ([d5fc2ec](https://github.com/hmcts/one-per-page/commit/d5fc2ec))
* Add basic field level joi validation ([72e23b3](https://github.com/hmcts/one-per-page/commit/72e23b3))
* Add fs utility to make looking for files easier ([2eabe93](https://github.com/hmcts/one-per-page/commit/2eabe93))
* Add glob function to search for file patterns ([6404628](https://github.com/hmcts/one-per-page/commit/6404628))
* Add handy functions to check for undefineds ([5264e97](https://github.com/hmcts/one-per-page/commit/5264e97))
* Add middleware to resolve templates for steps ([9512f18](https://github.com/hmcts/one-per-page/commit/9512f18))
* Add new contentProxy to handle lookups to i18Next ([48997b9](https://github.com/hmcts/one-per-page/commit/48997b9))
* Add promise fallback util ([b7a8cc5](https://github.com/hmcts/one-per-page/commit/b7a8cc5))
* Add validate and errors functions to form ([b88672b](https://github.com/hmcts/one-per-page/commit/b88672b))
* Create new flow module to provide consistent interface ([9ad9fe6](https://github.com/hmcts/one-per-page/commit/9ad9fe6))
* Enable multiple validations in fields ([a948bf7](https://github.com/hmcts/one-per-page/commit/a948bf7))
* Expose form and provide #validated for deciding whether to display errors ([98f4b17](https://github.com/hmcts/one-per-page/commit/98f4b17))
* Expose i18Next instance so that steps can add their content ([91ae3b2](https://github.com/hmcts/one-per-page/commit/91ae3b2))
* Expose locals to i18n ([08173cf](https://github.com/hmcts/one-per-page/commit/08173cf))
* Fix broken requireSession import ([cac6851](https://github.com/hmcts/one-per-page/commit/cac6851))
* Hook the contentProxy in to the journey ([a960317](https://github.com/hmcts/one-per-page/commit/a960317))
* Increase code coverage in forms package ([805342d](https://github.com/hmcts/one-per-page/commit/805342d))
* Increase coverage in i18n ([c4bfc53](https://github.com/hmcts/one-per-page/commit/c4bfc53))
* Move adding i18Next to req in to i18Next module ([2116dc9](https://github.com/hmcts/one-per-page/commit/2116dc9))
* Move field in to the new forms module ([8ec2556](https://github.com/hmcts/one-per-page/commit/8ec2556))
* Move form in to it's own file ([b2ee033](https://github.com/hmcts/one-per-page/commit/b2ee033))
* Move parseRequest in to forms ([78b5111](https://github.com/hmcts/one-per-page/commit/78b5111))
* Move session middleware in to session package ([0fe4cf7](https://github.com/hmcts/one-per-page/commit/0fe4cf7))
* Move session shims to it's own file ([faff544](https://github.com/hmcts/one-per-page/commit/faff544))
* Move sessionStore shims in to it's own file ([60656d0](https://github.com/hmcts/one-per-page/commit/60656d0))
* Proxy over form instead of exposing it ([7249ca0](https://github.com/hmcts/one-per-page/commit/7249ca0))
* Proxy over the form to make accessing fields cleaner ([aff6adc](https://github.com/hmcts/one-per-page/commit/aff6adc))
* Release 1.0.0-0 ([eb223f6](https://github.com/hmcts/one-per-page/commit/eb223f6))
* Remove FieldDescriptor and Form from forms interface ([26a64a4](https://github.com/hmcts/one-per-page/commit/26a64a4))
* Remove unnecessary #invalidFields function ([016904f](https://github.com/hmcts/one-per-page/commit/016904f))
* Remove unnecessary setting of res.locals.fields ([f5d7977](https://github.com/hmcts/one-per-page/commit/f5d7977))
* Remove unnecessary try catching ([b30bb02](https://github.com/hmcts/one-per-page/commit/b30bb02))
* Remove unused #afterMiddleware ([e921492](https://github.com/hmcts/one-per-page/commit/e921492))
* Remove unused functions in field ([e947b18](https://github.com/hmcts/one-per-page/commit/e947b18))
* Remove unused walkMap ([871375f](https://github.com/hmcts/one-per-page/commit/871375f))
* Rename isTest and add an isDev helper ([9be62f6](https://github.com/hmcts/one-per-page/commit/9be62f6))
* Reorganise example app to use content and template resolution ([d2344d0](https://github.com/hmcts/one-per-page/commit/d2344d0))
* Reorgansise session in to session module ([23f2c2c](https://github.com/hmcts/one-per-page/commit/23f2c2c))
* Replace applyContent middleware to load a steps content in to i18Next ([62fa0d6](https://github.com/hmcts/one-per-page/commit/62fa0d6))
* Replace Page.content with a proxy over i18n ([116bd27](https://github.com/hmcts/one-per-page/commit/116bd27))
* Replace repository name in links ([04b5862](https://github.com/hmcts/one-per-page/commit/04b5862))
* Set english as the default language ([6f29945](https://github.com/hmcts/one-per-page/commit/6f29945))
* Shorter coverage summary during local test runs ([308644b](https://github.com/hmcts/one-per-page/commit/308644b))
* Simplify the setting of options for session ([664934b](https://github.com/hmcts/one-per-page/commit/664934b))
* Split flow classes into their own files ([7cf5016](https://github.com/hmcts/one-per-page/commit/7cf5016))
* Support #hasOwnProperty in content proxies ([5789ac2](https://github.com/hmcts/one-per-page/commit/5789ac2))
* Switch example apps sessions step to a BaseStep as it doesn't render a template ([7f15a7c](https://github.com/hmcts/one-per-page/commit/7f15a7c))
* Switch Page to use resolveTemplate to render templates ([260e4fd](https://github.com/hmcts/one-per-page/commit/260e4fd))
* Switch the example app to use the new joi validation ([139a7b6](https://github.com/hmcts/one-per-page/commit/139a7b6))
* Test fs#glob ([1638cfb](https://github.com/hmcts/one-per-page/commit/1638cfb))
* Test fs#readFile and fs#readJson ([b41a489](https://github.com/hmcts/one-per-page/commit/b41a489))
* Update eslint-config to latest ([c4a9b2f](https://github.com/hmcts/one-per-page/commit/c4a9b2f))
* Update example app to latest dependencies ([5a01034](https://github.com/hmcts/one-per-page/commit/5a01034))
* Util for testing middleware ([cb4f266](https://github.com/hmcts/one-per-page/commit/cb4f266))
* Fix: field.errors and .valid shouldn't run validations ([bad5f19](https://github.com/hmcts/one-per-page/commit/bad5f19))
* Fix: update example app to use fields proxy ([a77a4e8](https://github.com/hmcts/one-per-page/commit/a77a4e8))
* chore(package): update sinon to version 4.0.0 ([e507c33](https://github.com/hmcts/one-per-page/commit/e507c33))



<a name="1.0.0-0"></a>
# 1.0.0-0 (2017-09-29)

* Add basic field level joi validation ([c4752b1](https://github.com/hmcts/one-per-page/commit/c4752b1))
* Add validate and errors functions to form ([e6cd404](https://github.com/hmcts/one-per-page/commit/e6cd404))
* Create new flow module to provide consistent interface ([9ad9fe6](https://github.com/hmcts/one-per-page/commit/9ad9fe6))
* Enable multiple validations in fields ([878f1c7](https://github.com/hmcts/one-per-page/commit/878f1c7))
* Expose form and provide #validated for deciding whether to display errors ([d726346](https://github.com/hmcts/one-per-page/commit/d726346))
* Fix broken requireSession import ([cac6851](https://github.com/hmcts/one-per-page/commit/cac6851))
* Increase code coverage in forms package ([d9e0aef](https://github.com/hmcts/one-per-page/commit/d9e0aef))
* Move field in to the new forms module ([8ec2556](https://github.com/hmcts/one-per-page/commit/8ec2556))
* Move form in to it's own file ([b2ee033](https://github.com/hmcts/one-per-page/commit/b2ee033))
* Move session middleware in to session package ([0fe4cf7](https://github.com/hmcts/one-per-page/commit/0fe4cf7))
* Move session shims to it's own file ([faff544](https://github.com/hmcts/one-per-page/commit/faff544))
* Move sessionStore shims in to it's own file ([60656d0](https://github.com/hmcts/one-per-page/commit/60656d0))
* Proxy over the form to make accessing fields cleaner ([1d0c11e](https://github.com/hmcts/one-per-page/commit/1d0c11e))
* Remove unnecessary #invalidFields function ([7bb3b99](https://github.com/hmcts/one-per-page/commit/7bb3b99))
* Remove unnecessary setting of res.locals.fields ([575cfe5](https://github.com/hmcts/one-per-page/commit/575cfe5))
* Remove unused functions in field ([e86350c](https://github.com/hmcts/one-per-page/commit/e86350c))
* Reorgansise session in to session module ([23f2c2c](https://github.com/hmcts/one-per-page/commit/23f2c2c))
* Replace repository name in links ([04b5862](https://github.com/hmcts/one-per-page/commit/04b5862))
* Shorter coverage summary during local test runs ([9174987](https://github.com/hmcts/one-per-page/commit/9174987))
* Simplify the setting of options for session ([664934b](https://github.com/hmcts/one-per-page/commit/664934b))
* Split flow classes into their own files ([7cf5016](https://github.com/hmcts/one-per-page/commit/7cf5016))
* Switch the example app to use the new joi validation ([f31f94a](https://github.com/hmcts/one-per-page/commit/f31f94a))
* Fix: field.errors and .valid shouldn't run validations ([98584ab](https://github.com/hmcts/one-per-page/commit/98584ab))
* Fix: update example app to use fields proxy ([416890c](https://github.com/hmcts/one-per-page/commit/416890c))
* chore(package): update sinon to version 4.0.0 ([e507c33](https://github.com/hmcts/one-per-page/commit/e507c33))



<a name="0.5.0"></a>
# 0.5.0 (2017-09-26)

* Content (#26) ([1bb9911](https://github.com/hmcts/one-per-page/commit/1bb9911))
* Exit Step and Session Destroy (#23) ([7722475](https://github.com/hmcts/one-per-page/commit/7722475))
* Fix linting issues introduced in recent PRs ([f2d143c](https://github.com/hmcts/one-per-page/commit/f2d143c))
* Question validation (#25) ([4eb7e5d](https://github.com/hmcts/one-per-page/commit/4eb7e5d))



<a name="0.3.0"></a>
# 0.3.0 (2017-08-31)

* Enable scoped packages being published to public npm ([50dcb8b](https://github.com/hmcts/one-per-page/commit/50dcb8b))



<a name="0.2.0"></a>
# 0.2.0 (2017-08-31)

* Add a simple goTo flow logic ([cc94c26](https://github.com/hmcts/one-per-page/commit/cc94c26))
* Add badges ([1d87ae2](https://github.com/hmcts/one-per-page/commit/1d87ae2))
* Add branching to flow logic ([97fda60](https://github.com/hmcts/one-per-page/commit/97fda60))
* Add chai-jq for testing steps html ([8ab9c48](https://github.com/hmcts/one-per-page/commit/8ab9c48))
* Add Codacy badge (#11) ([ad82490](https://github.com/hmcts/one-per-page/commit/ad82490))
* Add codacy-coverage package ([92223e7](https://github.com/hmcts/one-per-page/commit/92223e7))
* Add current url to render locals so questions can post to themselves ([ea203d4](https://github.com/hmcts/one-per-page/commit/ea203d4))
* Add eslint to enforce good behaviour ([0fa38a1](https://github.com/hmcts/one-per-page/commit/0fa38a1))
* Add fields to render locals so pages can access them ([8635d6d](https://github.com/hmcts/one-per-page/commit/8635d6d))
* Add Journey type to encapsulate express settings ([33e3540](https://github.com/hmcts/one-per-page/commit/33e3540))
* Add some documentation ([a570e6e](https://github.com/hmcts/one-per-page/commit/a570e6e))
* adding a README file ([40e9d74](https://github.com/hmcts/one-per-page/commit/40e9d74))
* Allow goTos to be used conditionally ([6024b79](https://github.com/hmcts/one-per-page/commit/6024b79))
* Allow users to configure express-session ([33601f9](https://github.com/hmcts/one-per-page/commit/33601f9))
* Base fields parsing framework ([0d9a0a7](https://github.com/hmcts/one-per-page/commit/0d9a0a7))
* Base Question type with little functionality ([1ef77fc](https://github.com/hmcts/one-per-page/commit/1ef77fc))
* Bind steps to req.journey and journey to the current step ([b8c23e3](https://github.com/hmcts/one-per-page/commit/b8c23e3))
* Bind the current step to req.currentStep, so middleware can access it ([3a7704d](https://github.com/hmcts/one-per-page/commit/3a7704d))
* Call the next function on successful post ([00cad51](https://github.com/hmcts/one-per-page/commit/00cad51))
* Change journey interface so we can wire up sessions later ([9b59044](https://github.com/hmcts/one-per-page/commit/9b59044))
* Code coverage (#5) ([5348a74](https://github.com/hmcts/one-per-page/commit/5348a74))
* Commit yarn lock file ([d5658ee](https://github.com/hmcts/one-per-page/commit/d5658ee))
* Configure bumped and travis for releasing ([751716b](https://github.com/hmcts/one-per-page/commit/751716b))
* Consume @hmcts/look-and-feel ([97cc3dd](https://github.com/hmcts/one-per-page/commit/97cc3dd))
* Consume one-per-page in an example app ([162b589](https://github.com/hmcts/one-per-page/commit/162b589))
* Create base step type ([a4bc9ab](https://github.com/hmcts/one-per-page/commit/a4bc9ab))
* Create EntryPoint step that creates a session and then redirects ([e8c726e](https://github.com/hmcts/one-per-page/commit/e8c726e))
* Create page type ([10af664](https://github.com/hmcts/one-per-page/commit/10af664))
* Create requireSession middleware ([e1da3f3](https://github.com/hmcts/one-per-page/commit/e1da3f3))
* Create simple createSession middleware ([da62f68](https://github.com/hmcts/one-per-page/commit/da62f68))
* Create step that redirects users to another step ([358e067](https://github.com/hmcts/one-per-page/commit/358e067))
* Demo new branching logic in example app ([1996530](https://github.com/hmcts/one-per-page/commit/1996530))
* Expect form and next functions to be implemented on Questions ([ec85674](https://github.com/hmcts/one-per-page/commit/ec85674))
* Expose a module interface ([3f5d8b7](https://github.com/hmcts/one-per-page/commit/3f5d8b7))
* Expose Question and field so that users can create questions ([ea30239](https://github.com/hmcts/one-per-page/commit/ea30239))
* Expose Redirect, EntryPoint and goTo ([492a7b9](https://github.com/hmcts/one-per-page/commit/492a7b9))
* Expose the new branch function ([3f983e2](https://github.com/hmcts/one-per-page/commit/3f983e2))
* Fix linter errors to meet @hmcts/eslint-config ([8e5831a](https://github.com/hmcts/one-per-page/commit/8e5831a))
* Fix linting error ([a71fb9f](https://github.com/hmcts/one-per-page/commit/a71fb9f))
* Ignore node_modules from example apps ([54adb00](https://github.com/hmcts/one-per-page/commit/54adb00))
* Ignore vim swap files, node modules and yarn errors ([ec22c37](https://github.com/hmcts/one-per-page/commit/ec22c37))
* Increase coverage ([6296904](https://github.com/hmcts/one-per-page/commit/6296904))
* Integrate with Codecov ([cc3ffd0](https://github.com/hmcts/one-per-page/commit/cc3ffd0))
* JSDoc the fields and form as they are complex ([641716c](https://github.com/hmcts/one-per-page/commit/641716c))
* Lint tests using the new standard as well ([db797b6](https://github.com/hmcts/one-per-page/commit/db797b6))
* Make parseRequest responsible for attaching the parsed field to req ([4b572e4](https://github.com/hmcts/one-per-page/commit/4b572e4))
* Parse fields values from the session and request body ([f02321d](https://github.com/hmcts/one-per-page/commit/f02321d))
* Pass CODACY_PROJECT_TOKEN through to container ([f49fa12](https://github.com/hmcts/one-per-page/commit/f49fa12))
* Prevent npm from expanding our glob before mocha sees it ([e17fe8f](https://github.com/hmcts/one-per-page/commit/e17fe8f))
* Prevent routes at '/' from matching all urls ([f8d772e](https://github.com/hmcts/one-per-page/commit/f8d772e))
* Prove Question renders correctly by building one in example app ([243c8be](https://github.com/hmcts/one-per-page/commit/243c8be))
* Prove sessions work by using them in the example app ([edb6232](https://github.com/hmcts/one-per-page/commit/edb6232))
* Refactor and test sessions ([10d165f](https://github.com/hmcts/one-per-page/commit/10d165f))
* Refactor goTo function to produce a Redirector object ([649eccd](https://github.com/hmcts/one-per-page/commit/649eccd))
* Release 0.1.0 ([5d78fe5](https://github.com/hmcts/one-per-page/commit/5d78fe5))
* Remove badges (wrong project) ([9c3d387](https://github.com/hmcts/one-per-page/commit/9c3d387))
* Remove object rest operator, too new (Node.JS 8.4.0+) ([97eaa66](https://github.com/hmcts/one-per-page/commit/97eaa66))
* Remove some unnecessary express settings from our supertest helper ([bf7c313](https://github.com/hmcts/one-per-page/commit/bf7c313))
* Remove the link from the greenkeeper badge ([5d7a2c4](https://github.com/hmcts/one-per-page/commit/5d7a2c4))
* Replace istanbul with nyc ([87a6dea](https://github.com/hmcts/one-per-page/commit/87a6dea))
* Rework responsibilities for the fields/parseRequest/form types ([a49233d](https://github.com/hmcts/one-per-page/commit/a49233d))
* Run codacy-coverage as part of coverage script ([f1f37d7](https://github.com/hmcts/one-per-page/commit/f1f37d7))
* Run code coverage after successful build ([d7f2c19](https://github.com/hmcts/one-per-page/commit/d7f2c19))
* Run Travis-CI (#3) ([400d67c](https://github.com/hmcts/one-per-page/commit/400d67c))
* Set up a docker based dev env ([ead7d80](https://github.com/hmcts/one-per-page/commit/ead7d80))
* Shim over express session functions to modify the session before save / after load ([e2ac2ff](https://github.com/hmcts/one-per-page/commit/e2ac2ff))
* Simple start page example ([cba37eb](https://github.com/hmcts/one-per-page/commit/cba37eb))
* Store and retrieve fields from session ([9df138c](https://github.com/hmcts/one-per-page/commit/9df138c))
* Switch to the published version of @hmcts/eslint-config ([86d7153](https://github.com/hmcts/one-per-page/commit/86d7153))
* Update dockerfile to make yarn install outside of the app folder ([55d4d07](https://github.com/hmcts/one-per-page/commit/55d4d07))
* Upgrade dependencies ([b72680b](https://github.com/hmcts/one-per-page/commit/b72680b))
* Use EntryPoint in the example app ([0f668b3](https://github.com/hmcts/one-per-page/commit/0f668b3))
* docs(readme): add Greenkeeper badge ([1a4d19e](https://github.com/hmcts/one-per-page/commit/1a4d19e))



<a name="0.1.0"></a>
# 0.1.0 (2017-08-31)

* Add a simple goTo flow logic ([cc94c26](https://github.com/hmcts/one-per-page/commit/cc94c26))
* Add badges ([1d87ae2](https://github.com/hmcts/one-per-page/commit/1d87ae2))
* Add branching to flow logic ([97fda60](https://github.com/hmcts/one-per-page/commit/97fda60))
* Add chai-jq for testing steps html ([8ab9c48](https://github.com/hmcts/one-per-page/commit/8ab9c48))
* Add Codacy badge (#11) ([ad82490](https://github.com/hmcts/one-per-page/commit/ad82490))
* Add codacy-coverage package ([92223e7](https://github.com/hmcts/one-per-page/commit/92223e7))
* Add current url to render locals so questions can post to themselves ([ea203d4](https://github.com/hmcts/one-per-page/commit/ea203d4))
* Add eslint to enforce good behaviour ([0fa38a1](https://github.com/hmcts/one-per-page/commit/0fa38a1))
* Add fields to render locals so pages can access them ([8635d6d](https://github.com/hmcts/one-per-page/commit/8635d6d))
* Add Journey type to encapsulate express settings ([33e3540](https://github.com/hmcts/one-per-page/commit/33e3540))
* Add some documentation ([a570e6e](https://github.com/hmcts/one-per-page/commit/a570e6e))
* adding a README file ([40e9d74](https://github.com/hmcts/one-per-page/commit/40e9d74))
* Allow goTos to be used conditionally ([6024b79](https://github.com/hmcts/one-per-page/commit/6024b79))
* Allow users to configure express-session ([33601f9](https://github.com/hmcts/one-per-page/commit/33601f9))
* Base fields parsing framework ([0d9a0a7](https://github.com/hmcts/one-per-page/commit/0d9a0a7))
* Base Question type with little functionality ([1ef77fc](https://github.com/hmcts/one-per-page/commit/1ef77fc))
* Bind steps to req.journey and journey to the current step ([b8c23e3](https://github.com/hmcts/one-per-page/commit/b8c23e3))
* Bind the current step to req.currentStep, so middleware can access it ([3a7704d](https://github.com/hmcts/one-per-page/commit/3a7704d))
* Call the next function on successful post ([00cad51](https://github.com/hmcts/one-per-page/commit/00cad51))
* Change journey interface so we can wire up sessions later ([9b59044](https://github.com/hmcts/one-per-page/commit/9b59044))
* Code coverage (#5) ([5348a74](https://github.com/hmcts/one-per-page/commit/5348a74))
* Commit yarn lock file ([d5658ee](https://github.com/hmcts/one-per-page/commit/d5658ee))
* Consume @hmcts/look-and-feel ([97cc3dd](https://github.com/hmcts/one-per-page/commit/97cc3dd))
* Consume one-per-page in an example app ([162b589](https://github.com/hmcts/one-per-page/commit/162b589))
* Create base step type ([a4bc9ab](https://github.com/hmcts/one-per-page/commit/a4bc9ab))
* Create EntryPoint step that creates a session and then redirects ([e8c726e](https://github.com/hmcts/one-per-page/commit/e8c726e))
* Create page type ([10af664](https://github.com/hmcts/one-per-page/commit/10af664))
* Create requireSession middleware ([e1da3f3](https://github.com/hmcts/one-per-page/commit/e1da3f3))
* Create simple createSession middleware ([da62f68](https://github.com/hmcts/one-per-page/commit/da62f68))
* Create step that redirects users to another step ([358e067](https://github.com/hmcts/one-per-page/commit/358e067))
* Demo new branching logic in example app ([1996530](https://github.com/hmcts/one-per-page/commit/1996530))
* Expect form and next functions to be implemented on Questions ([ec85674](https://github.com/hmcts/one-per-page/commit/ec85674))
* Expose a module interface ([3f5d8b7](https://github.com/hmcts/one-per-page/commit/3f5d8b7))
* Expose Question and field so that users can create questions ([ea30239](https://github.com/hmcts/one-per-page/commit/ea30239))
* Expose Redirect, EntryPoint and goTo ([492a7b9](https://github.com/hmcts/one-per-page/commit/492a7b9))
* Expose the new branch function ([3f983e2](https://github.com/hmcts/one-per-page/commit/3f983e2))
* Fix linter errors to meet @hmcts/eslint-config ([8e5831a](https://github.com/hmcts/one-per-page/commit/8e5831a))
* Ignore node_modules from example apps ([54adb00](https://github.com/hmcts/one-per-page/commit/54adb00))
* Ignore vim swap files, node modules and yarn errors ([ec22c37](https://github.com/hmcts/one-per-page/commit/ec22c37))
* Increase coverage ([6296904](https://github.com/hmcts/one-per-page/commit/6296904))
* Integrate with Codecov ([cc3ffd0](https://github.com/hmcts/one-per-page/commit/cc3ffd0))
* JSDoc the fields and form as they are complex ([641716c](https://github.com/hmcts/one-per-page/commit/641716c))
* Lint tests using the new standard as well ([db797b6](https://github.com/hmcts/one-per-page/commit/db797b6))
* Make parseRequest responsible for attaching the parsed field to req ([4b572e4](https://github.com/hmcts/one-per-page/commit/4b572e4))
* Parse fields values from the session and request body ([f02321d](https://github.com/hmcts/one-per-page/commit/f02321d))
* Pass CODACY_PROJECT_TOKEN through to container ([f49fa12](https://github.com/hmcts/one-per-page/commit/f49fa12))
* Prevent npm from expanding our glob before mocha sees it ([e17fe8f](https://github.com/hmcts/one-per-page/commit/e17fe8f))
* Prevent routes at '/' from matching all urls ([f8d772e](https://github.com/hmcts/one-per-page/commit/f8d772e))
* Prove Question renders correctly by building one in example app ([243c8be](https://github.com/hmcts/one-per-page/commit/243c8be))
* Prove sessions work by using them in the example app ([edb6232](https://github.com/hmcts/one-per-page/commit/edb6232))
* Refactor and test sessions ([10d165f](https://github.com/hmcts/one-per-page/commit/10d165f))
* Refactor goTo function to produce a Redirector object ([649eccd](https://github.com/hmcts/one-per-page/commit/649eccd))
* Remove badges (wrong project) ([9c3d387](https://github.com/hmcts/one-per-page/commit/9c3d387))
* Remove object rest operator, too new (Node.JS 8.4.0+) ([97eaa66](https://github.com/hmcts/one-per-page/commit/97eaa66))
* Remove some unnecessary express settings from our supertest helper ([bf7c313](https://github.com/hmcts/one-per-page/commit/bf7c313))
* Remove the link from the greenkeeper badge ([5d7a2c4](https://github.com/hmcts/one-per-page/commit/5d7a2c4))
* Replace istanbul with nyc ([87a6dea](https://github.com/hmcts/one-per-page/commit/87a6dea))
* Rework responsibilities for the fields/parseRequest/form types ([a49233d](https://github.com/hmcts/one-per-page/commit/a49233d))
* Run codacy-coverage as part of coverage script ([f1f37d7](https://github.com/hmcts/one-per-page/commit/f1f37d7))
* Run code coverage after successful build ([d7f2c19](https://github.com/hmcts/one-per-page/commit/d7f2c19))
* Run Travis-CI (#3) ([400d67c](https://github.com/hmcts/one-per-page/commit/400d67c))
* Set up a docker based dev env ([ead7d80](https://github.com/hmcts/one-per-page/commit/ead7d80))
* Shim over express session functions to modify the session before save / after load ([e2ac2ff](https://github.com/hmcts/one-per-page/commit/e2ac2ff))
* Simple start page example ([cba37eb](https://github.com/hmcts/one-per-page/commit/cba37eb))
* Store and retrieve fields from session ([9df138c](https://github.com/hmcts/one-per-page/commit/9df138c))
* Switch to the published version of @hmcts/eslint-config ([86d7153](https://github.com/hmcts/one-per-page/commit/86d7153))
* Update dockerfile to make yarn install outside of the app folder ([55d4d07](https://github.com/hmcts/one-per-page/commit/55d4d07))
* Upgrade dependencies ([b72680b](https://github.com/hmcts/one-per-page/commit/b72680b))
* Use EntryPoint in the example app ([0f668b3](https://github.com/hmcts/one-per-page/commit/0f668b3))
* docs(readme): add Greenkeeper badge ([1a4d19e](https://github.com/hmcts/one-per-page/commit/1a4d19e))



