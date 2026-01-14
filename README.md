# AnnexUI
AnnexUI is a MIT licensed UI library for [Typesense](https://typesense.org/).
It's designed to be a clean, UX focused library that gets developers up and
running in a few minutes. Include a link to the CDN-hosted JavaScript bundle,
set your Typesense cluster settings, and then press `⌘k` to see Annex up and
running.

It's currently in early-development.
<hr />


### Quick links
1. [Quick demos](#quick-demos)
2. [Quick preview](#quick-preview)
3. [Quick intro](#quick-intro)
4. [Quick start](#quick-start)
5. [Config](#config)
6. [Attribute-based events](#attribute-based-events)
7. [Events](#events)
8. [Methods](#methods)
9. [Templates](#templates)
9. [Additional notes](#additional-notes)
<hr />


### Quick demos
1. Inline layout: <a href="https://annexsearch.com/#inline-demo-01" target="_blank">https://annexsearch.com/#inline-demo-01</a>
2. Modal layout: <a href="https://annexsearch.com/#modal-demo-01" target="_blank">https://annexsearch.com/#modal-demo-01</a>
3. Left panel layout: <a href="https://annexsearch.com/#panel-left-demo-01" target="_blank">https://annexsearch.com/#panel-left-demo-01</a>
4. Right panel layout: <a href="https://annexsearch.com/#panel-right-demo-01" target="_blank">https://annexsearch.com/#panel-right-demo-01</a>
5. Inline layout (dark mode): <a href="https://annexsearch.com/#inline-demo-02" target="_blank">https://annexsearch.com/#inline-demo-02</a>
6. Multiple modal layouts: <a href="https://annexsearch.com/#modal-demo-03" target="_blank">https://annexsearch.com/#modal-demo-03</a>
7. Inline layout (using `sku-v0.1.0` templates): <a href="https://annexsearch.com/#inline-demo-05" target="_blank">https://annexsearch.com/#inline-demo-05</a>
<hr />


### Quick preview
![](https://416.io/ss/f/x43xuv/r)
<hr />


### Quick intro
Annex uses [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
to encapsulate and restrict JavaScript and CSS scope. The fundamental concepts
to understand are:

- The UI will be encapsulated within a `<annex-search-widget>` HTML tag
  - In docs, this will often be referenced as the `$annexSearchWidget` variable
- This web component exposes a number of methods that developers can use to
interact with it (e.g. `show`, `hide`, `focus`, etc)

💪 Out the box, Annex supports the following:
- Four (4) different layouts (`'inline'`, `'modal'`, `'panel-left'` and `'panel-right'`)
- Dark mode
- Responsive layouts
- Event handling

🎨 Style considerations:
- There are currently 65+ CSS variables that can be overriden
- These control layouts, dimensions, colors, fonts and more

🔒 Privacy and data considerations:
- No data is stored in cookies or localStorage
- Queries are only sent to your Typesense cluster; no middleware is present
- Images are base64-encoded and not requested remotely
- The remote CDN used is [jsDelivr](https://www.jsdelivr.com/)

⚡️ Performance considerations:
- Annex currently employs a "Last in, first out" approach to queries
  - This means that if users type quickly, previous searches will be aborted to lower server and bandwidth burden
- Analytics can be facilitate through Events
<hr />


### Quick start
Below you'll find a few lines to get up and running quickly (remember to swap in
your Typesense cluster settings).

``` html
<script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/gh/onassar/AnnexUI@0.1.17-stable/dist/bundle.min.js"
    defer></script>
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function() {
        let $annexSearchWidget = document.createElement('annex-search-widget');
        $annexSearchWidget.setMutator('typesenseSearchResponse', function(typesenseSearchRequest) {
            let hits = typesenseSearchRequest.getResponse().hits;
            for (let hit of hits) {
                hit.document.uri = 'https://' + (hit.document.hostname) + (hit.document.relativeURL);
                hit.document.imageUrl = hit.document.thumbnailURL;
            }
        });
        $annexSearchWidget.setConfig({
            chips: {
                idle: ['aws', 'fotos', 'layers', 'google', 'figma']
            },
            cluster: {
                apiKey: 'ZYVykB8YEkUbydvPANbQGUWgezfINr9U',
                collectionName: 'prod:::tpclpybteij8:::crawlerResourceSearch:::v0.1.0',
                hostname: 'b3487cx0hrdu1y6kp-1.a1.typesense.net',
                presetName: 'prod:::tcprequ7pht7:::crawlerResourceSearch:::v0.1.0',
            },
            keyboardShortcut: '⌘k',
            layout: 'modal',
        });
        $annexSearchWidget.mount();
    });
</script>
```
<hr />


### Config
Below you'll find a high-level breakdown of configuration options that can be
changed. See [Config overriding](#config-overriding) for details on how to do
so.

| Key                       | Type                          | Required      | Default value                     | Description                                                                                               |
| --------------------------| ------------------------------| --------------| ----------------------------------| ----------------------------------------------------------------------------------------------------------|
| $container                | `null` \|\| `EventTarget`     | ❌             | `null`                            | The `EventTarget` that the `$annexSearchWidget` element should be appended to.                            |
| autoFocusOnScroll         | `Boolean`                     | ❌             | `true`                            | Whether the web component should receive focus when it's scrolled into the viewport.                      |
| callbacks                 | `Object`                      | ❌             | (see [Events](#events))           | Map of callback functions that will be triggered upon certain events.                                     |
| chips                     | `Object`                      | ❌             | (n/a)                             | Map of arrays of "chip" strings.                                                                          |
| chips.idle                | `Array`                       | ❌             | `[]`                              | Array of strings which are shown as the default chips when the web component is shown.                    |
| cluster                   | `Object`                      | ✅             | (n/a)                             | Map of Typesense related cluster auth properties.                                                         |
| cluster.apiKey            | `String`                      | ✅             | `null`                            | Typesense cluster search API key.                                                                         |
| cluster.collectionName    | `String`                      | ✅             | `null`                            | Typesense cluster collection name.                                                                        |
| cluster.hostname          | `String`                      | ✅             | `null`                            | Typesense cluster hostname.                                                                               |
| cluster.presetName        | `null` \|\| `String`          | ❌             | `null`                            | Typesense cluster search preset name.                                                                     |
| colorScheme               | `String`                      | ❌             | `'auto'`                          | The color scheme for Annex. Can be: `'auto'`, `'light'` or `'dark'`.                                      |
| copy                      | `Object`                      | ❌             | `Object`                          | Map of copy used in different `templates`.                                                                |
| debug                     | `Boolean`                     | ❌             | `false`                           | Whether debugging information should be logged to console.                                                |
| env                       | `String`                      | ❌             | `'prod'`                          | String which can be set to provide insights on the env you're operating in.                               |
| highlightTagName          | `String`                      | ❌             | `'MARK'`                          | The `EventTarget` that should be rendered around query matches.                                           |
| id                        | `String`                      | ❌             | `null`                            | The id of the instance. Useful for differentiating between multiple `$annexSearchWidget` instances.       |
| keyboardShortcut          | `null` \|\| `String`          | ❌             | `'⌘k'`                            | The keyboard shortcut that should be used to toggle Annex (does not apply to `inline` instances).         |
| layout                    | `String`                      | ❌             | `'modal'`                         | The layout for Annex. Can be: `'inline'`, `'modal'`, `'panel-left'` or `'panel-right'`.                   |
| modalAlignment            | `String`                      | ❌             | `'top'`                           | Whether a modal instance of Annex should be fixed to the top, or float in the middle of the viewport.     |
| resources                 | `Object`                      | ❌             | `Object`                          | Map of `css` URLs that are loaded for an `$annexSearchWidget`.                                            |
| searchOptions             | `Object`                      | ✅             | `Object`                          | Map of search options that are passed in a Typesense search query.                                        |
| searchRequestMethod       | `String`                      | ❌             | `'lifo'`                          | The type of search handling. Currently limited to just `lifo` (last in first out)                         |
| showOverlay               | `Boolean`                     | ❌             | `true`                            | Whether the overlay `EventTarget` should be rendered.                                                     |
| templates                 | `Object`                      | ❌             | (see [Templates](#templates))     | Map of templates that should be used in Annex rendering.                                                  |

#### Config overriding
Below are examples showing how configuration options can be set. Worth noting is
the flexibility around the `key` (e.g. can contain a `.` as a delimter).

``` javascript
$('annex-search-widget').setConfig('$container', document.body);
$('annex-search-widget').setConfig('searchOptions.snippet_threshold', 20);
$('annex-search-widget').setConfig('searchOptions', {
    snippet_threshold: 20
});
```
<hr />


### Attribute-based events
Below is a list of supported attributes, which when found on an element, will
trigger behaviour against the related web component.

**Notes**:
1. When there is a single web component on the page, the `id` does not need to be specified in the attribute value
2. When there are multiple web components on the page, the `id` must be specified in the attribute value
3. Not all layouts support all interactions. For example, an `inline` `$annexSearchWidget` cannot be "shown" or "hidden"

#### Behaviour
| Behaviour name        | Example                                       | Layout Support            | Description                                                                   |
| ----------------------|-----------------------------------------------|---------------------------|-------------------------------------------------------------------------------|
| clear                 | `<a data-annex-search="clear">test</a>`       | All                       | Clears the search query input value from the `$annexSearchWidget`.            |
| disable               | `<a data-annex-search="disable">test</a>`     | All                       | Disables the `$annexSearchWidget` if it's currently enabled.                  |
| enable                | `<a data-annex-search="enable">test</a>`      | All                       | Enables the `$annexSearchWidget` if it's currently disabled.                  |
| focus                 | `<a data-annex-search="focus">test</a>`       | All                       | Focuses on `$annexSearchWidget` if it's currently showing.                    |
| hide                  | `<a data-annex-search="hide">test</a>`        | All (except `'inline'`)   | Hides the `$annexSearchWidget` if it's not currently hidden.                  |
| query                 | `<a data-annex-search-query="apple">test</a>` | All                       | Performs a query based on the attribute value.                                |
| show                  | `<a data-annex-search="show">test</a>`        | All (except `'inline'`)   | Shows the `$annexSearchWidget` if it's currently hidden.                      |
| toggle                | `<a data-annex-search="toggle">test</a>`      | All (except `'inline'`)   | Shows or hides the `$annexSearchWidget` depending on it's current state.      |


#### Examples (without `id`)
``` html
<a href="#test" data-annex-search="clear">clear the $annexSearchWidget $input</a>
<a href="#test" data-annex-search="disable">disable the $annexSearchWidget</a>
<a href="#test" data-annex-search="enable">enable the $annexSearchWidget</a>
<a href="#test" data-annex-search="focus">focus on the $annexSearchWidget</a>
<a href="#test" data-annex-search="hide">hide the $annexSearchWidget</a>
<a href="#test" data-annex-search-query="search query">show the $annexSearchWidget, insert query and search</a>
<a href="#test" data-annex-search="show">show the $annexSearchWidget</a>
<a href="#test" data-annex-search="toggle">toggle the $annexSearchWidget</a>
````

#### Examples (with `id`)
``` html
<a href="#test" data-annex-search="{id}:clear">clear the $annexSearchWidget $input</a>
<a href="#test" data-annex-search="{id}:disable">disable on the $annexSearchWidget</a>
<a href="#test" data-annex-search="{id}:enable">enable on the $annexSearchWidget</a>
<a href="#test" data-annex-search="{id}:focus">focus on the $annexSearchWidget</a>
<a href="#test" data-annex-search="{id}:hide">hide the $annexSearchWidget</a>
<a href="#test" data-annex-search-query="{id}:search query">show the $annexSearchWidget, insert query and search</a>
<a href="#test" data-annex-search="{id}:show">show the $annexSearchWidget</a>
<a href="#test" data-annex-search="{id}:toggle">toggle the $annexSearchWidget</a>
````
<hr />


### Events
Events can be processed either through the config options set via `setConfig` or
via native event listeners (e.g.
`$annexSearchWidget.addEventListener('result.click', handler)`). Below you'll
find a list of supported events.

When events are processed through native event listeners, arguments are
accessible via the `event.detail` property.

| Event Name            | Description                                                                                                               |
| ----------------------| --------------------------------------------------------------------------------------------------------------------------|
| `result.click`        | Dispatched when a result is clicked.                                                                                      |
| `result.copy`         | Dispatched when the user attempts to copy to their clipboard (e.g. via Command + C).                                      |
| `result.focus`        | Dispatched when a result is focused.                                                                                      |
| `results.empty`       | Dispatched when a search results in an empy state (no results found).                                                     |
| `results.error`       | Dispatched when a search results in an error.                                                                             |
| `results.idle`        | Dispatched when the idle state for results is shown (e.g. the user deletes a previously searched query from the input).   |
| `results.loaded`      | Dispatched when a search results in an results being shown.                                                               |
| `root.hide`           | Dispatched when the `$annexSearchWidget` is hidden.                                                                       |
| `root.show`           | Dispatched when the `$annexSearchWidget` is shown.                                                                        |
| `root.toggle`         | Dispatched when the `$annexSearchWidget` is toggled.                                                                      |

#### Example "native" event handling
``` javascript
$('annex-search-widget').addEventListener('root.show', function(customEvent) {
    console.log(customEvent);
    console.log(customEvent.detail);
});
```
<hr />


### Methods
Below you'll find methods that can be called against an `$annexSearchWidget`
reference. While you'll find other public events available when inspecting the
element, only the ones below are currently supported.

| Method name       | Return value      | Description                                                                                                       |
| ------------------| ------------------|-------------------------------------------------------------------------------------------------------------------| 
| `disable`         | `Promise`         | Disables the `$annexSearchWidget` (if enabled).                                                                   |
| `enable`          | `Promise`         | Enables the `$annexSearchWidget` (if disabled).                                                                   |
| `focus`           | `Promise`         | Focuses on the `$annexSearchWidget` search query input.                                                           |
| `getConfig`       | `Boolean`         | Returns an object representing the config options for the `$annexSearchWidget`.                                   |
| `hide`            | `Promise`         | Hides the `$annexSearchWidget` if it's currently showing.                                                         |
| `mount`           | `Promise`         | Mounts the `$annexSearchWidget` to the `$container` config option.                                                |
| `query`           | `Boolean`         | Shows the `$annexSearchWidget` if it's currently hidden, and performs a query (based on the passed in value).     |
| `ready`           | `Promise`         | Returns a promise when the `$annexSearchWidget` is ready for interaction.                                         |
| `setConfig`       | `Boolean`         | Sets `$annexSearchWidget` config options.                                                                         |
| `setMutator`      | `Boolean`         | Sets a mutator `Function` which is used to modify data. Useful for Typesense response normalization.              |
| `show`            | `Promise`         | Shows the `$annexSearchWidget` if it's currently hidden.                                                          |
| `showing`         | `Boolean`         | Returns whether or not the `$annexSearchWidget` is currently showing.                                             |
| `showToast`       | `BaseView`        | Shows a toast in the search UI, accepting `title`, `message` and `hideTimeoutDuration` params.                    |
| `toggle`          | `Promise`         | Shows or hides the `$annexSearchWidget` depending on it's currently state.                                        |
<hr />


### Templates
While Annex does it's best to work (to some degree) "out of the box", any
meaningful implementation will require developers to define their own templates.

In practice, this means passing in `String` values for the different web
component states (along with defining your own styles).

This part of Annex is a work-in-progress, and more documentation will be added
soon, however until then use the table below as a guide to the available
template keys that can be overridden.


| Config property key               | Description                                                                                       | `data` properties                         |
| ----------------------------------| --------------------------------------------------------------------------------------------------|-------------------------------------------|
| `root`                            | The "root" of the search UI. Broadly, a container for other containers.                           | `config`                                  |
| `body`                            | Contains the body of search results, including errors, idle states and empty result states.       | `config`                                  |
| `chip`                            | An anchor element that when clicked performs a query.                                             | `config`, `chip`                          |
| `errorBody`                       | Element that communicates an error took place during search.                                      | `config` ⚠️                               |
| `idleBody`                        | Element that communicates that no search has taken place yet.                                     | `config`                                  |
| `emptyResultsBody`                | Element that communicates no matching search results were found.                                  | `config` ⚠️                               |
| `foundResultsBody`                | Element that contains a list of results.                                                          | `config`                                  |
| `resultFoundResultsBody`          | The result element itself. **This is likely what you want to start with.**                        | `config`, `hit`                           |
| `resultsBody`                     | A container for the broad concept of results.                                                     | `config`                                  |
| `toast`                           | An element to communicate an alert.                                                               | `config`, `title`, `message`              |
| `brandingBarFooter`               | Element that communicates the Annex brand.                                                        | `config`                                  |
| `footer`                          | Container element for footer elements.                                                            | `config`                                  |
| `statusBarFooter`                 | Element that communicates some status around the search UX.                                       | `config`                                  |
| `fieldHeader`                     | Element that contains the keyboard shortcut, input field, hide button and spinner.                | `config`                                  |
| `timer`                           | An element that counts down from a certain number of seconds.                                     | `config`, `remaining`                     |
| `header`                          | Element that contains the `$fieldHeader` element.                                                 | `config`                                  |
| `metaBarHeader`                   | Element that communicates meta data about a search (if any).                                      | `config`, `typesenseSearchResponse`       |
<hr />


### Additional notes
Below are some additional notes that may prove useful to developers. Feel free
to open a PR on this `README.md` file with anything else you think would be
useful to others.

#### Styling (using vars)
While docs related to styling will come soon, below you'll see a quick example
of how styling can be executed against an Annex instance.

```html
<style type="text/css">
    annex-search-widget {
        --annex-search-show-panel-duration: 2000ms;
    }
    annex-search-widget::part(result-content-price) {
        background-color: rgba(0, 0, 0, 0.60);
        color: #ffffff;
    }
    @media (prefers-color-scheme: dark) {
        annex-search-widget::part(result-content-price) {
            background-color: #ffffff;
            color: rgba(0, 0, 0, 0.60);
        }
    }
</style>
```

#### Vendors / Dependencies
Currently, the only 3rd party vendor included in Annex is
[Lodash v4.17.21](https://github.com/lodash/lodash). Lodash is used to
facilitate more robust templating logic.

This minification of vendors / dependencies is by design, in large part to
lower the likelihood of supply chain attacks.

#### Preset without config options
The code below shows the simplest example of Annex. By specifying a `presetName`
value, your Typesense cluster knows how to perform the query. Along with that,
the default config options (e.g. `'⌘k'` for the keyboard shortcut, `layout` being
`'modal'`, etc.) are good enough to get going.

This does assume your Typesense collection schema is "simple enough" that Annex
can determine what the title, body and URL of the result ought to be (during
rendering).

``` html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/onassar/AnnexUI@0.1.17-stable/dist/bundle.min.js" defer></script>
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function() {
        let $annexSearchWidget = document.createElement('annex-search-widget');
        $annexSearchWidget.setConfig({
            cluster: {
                apiKey: 'ZYVykB8YEkUbydvPANbQGUWgezfINr9U',
                collectionName: 'prod:::tpclpybteij8:::crawlerResourceSearch:::v0.1.0',
                hostname: 'b3487cx0hrdu1y6kp-1.a1.typesense.net',
                presetName: 'prod:::tcprequ7pht7:::crawlerResourceSearch:::v0.1.0',
            }
        });
        $annexSearchWidget.mount();
    });
</script>
```

#### Edge cases considered
- High-resolution monitors that immediately ought to trigger a loadMore flow (because there's not scrollbar)
- Aborting Typesense cluster queries when the search input value changes
- Prevention of mobile zooming when the search input is focused on

#### Releases
Below are a command-notes that are helpful to the author during version-bumping.
Namely, to `cd` into the directory (after version strings have been changed),
building the dist-files, commit, tagging and pushing the tag.

Thereafter a release can be created via
[/releases](https://github.com/onassar/AnnexUI/releases/new).

- `cd TurtlePHP/application/vendors/submodules/AnnexUI/`
- `./scripts/dist.sh`
- `git add . && git commit -m "Version bump" && git push`
- `git tag -a 0.1.17-stable -m "Release based tag"`
- `git push origin 0.1.17-stable`
