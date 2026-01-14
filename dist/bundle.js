
// Setup
window.annexSearch = window.annexSearch || {};

/**
 * DependencyLoader
 * 
 * @abstract
 */
window.annexSearch.DependencyLoader = (function() {

    /**
     * Properties (private)
     * 
     */

    /**
     * __attemptClosures
     * 
     * @access  private
     * @var     Array (default: [])
     */
    let __attemptClosures = [];

    /**
     * __attempts
     * 
     * @access  private
     * @var     Number (default: 0)
     */
    let __attempts = 0;

    /**
     * Methods (private)
     * 
     */

    /**
     * __attempt
     * 
     * @access  private
     * @param   Array dependencies
     * @param   Function callback
     * @return  Boolean
     */
    let __attempt = function(dependencies, callback) {
        ++__attempts;
        __checkForFailure(dependencies);
        if (__dependenciesAvailable(dependencies) === true) {
            callback.apply(window.annexSearch.DependencyLoader);
            return true;
        }
        return false;
    };

    /**
     * __checkForFailure
     * 
     * @throws  Error
     * @access  private
     * @param   Array dependencies
     * @return  void
     */
    let __checkForFailure = function(dependencies) {
        if (__attempts > 10000) {
            let message = 'Could not complete an attempt: [';
            message += dependencies.join(', ') + ']';
            window.annexSearch && window.annexSearch.LoggingUtils && window.annexSearch.LoggingUtils.error(message);
            throw new Error(message);
        }
    };

    /**
     * __dependenciesAvailable
     * 
     * @access  private
     * @param   Array dependencies
     * @return  Boolean
     */
    let __dependenciesAvailable = function(dependencies) {
        let x = 0,
            l = dependencies.length;
        for (x; x < l; ++x) {
            if (__referenceExists(dependencies[x]) === false) {
                return false;
            }
        }
        return true;
    };

    /**
     * __referenceExists
     * 
     * @see     https://chatgpt.com/c/6750f75c-7cec-800f-bc86-c07201f22fcf
     * @access  private
     * @param   String path
     * @return  Boolean
     */
    let __referenceExists = function(path) {
        let parts = path.split('.'),
            current = window;
        for (var part of parts) {
            if (current[part] === undefined) {
                return false;
            }
            current = current[part];
        }
        return true;
    };

    /**
     * (public)
     * 
     */
    return {

        /**
         * load
         * 
         * @access  public
         * @param   Function callback
         * @return  void
         */
        load: function(callback) {
            callback = callback || function() {};
            let attempt;
            while (__attemptClosures.length > 0) {
                attempt = __attemptClosures.shift();
                if (attempt.apply(window.annexSearch.DependencyLoader) === false) {
                    __attemptClosures.push(attempt);
                }
            }
            callback(__attempts);
        },

        /**
         * push
         * 
         * @access  public
         * @param   String|Array dependencies
         * @param   Function callback
         * @return  Boolean
         */
        push: function(dependencies, callback) {
            if (typeof dependencies === 'string') {
                dependencies = [dependencies];
            }
            let args = [dependencies, callback],
                attempt = function() {
                    let response = __attempt.apply(window.annexSearch.DependencyLoader, args);
                    return response;
                };
            __attemptClosures.push(attempt);
            return true;
        }
    };
})();

/**
 * /src/js/core/AnnexSearch.js
 * 
 * @todo    [DONE] - dark mode
 * @todo    [DONE] - mobile
 * @todo    [DONE] - Panels: https://416.io/ss/f/50li0m
 * @todo    [DONE] - status bar content
 * @todo    [DONE] - clean up hidden class situations: https://416.io/ss/f/x7qz7h
 * @todo    [NOPE] - Missing quopte? https://416.io/ss/f/9uicm1?bp=1
 * @todo    [NOPE] -- Data submission bug
 * @todo    [DONE] - keyboard shortcut cleanup
 * @todo    [DONE] - pdf search (long body)
 * @todo    [DONE] - debouncing of requests (and/or throttling)
 * @todo    [DONE] -- TypesenseSearchRequest
 * @todo    [DONE] - bug where previous search doesn't get triggered (when changed)
 * @todo    [PUNT] - Error handling for failed XHRs
 * @todo    [PUNT] -- Tooltip class for communicating error messages
 * @todo    [PUNT] -- https://claude.ai/chat/b775bedd-d31a-464e-8e10-49c42a5a3644
 * @todo    [DONE] - thumbnails
 * @todo    [PUNT] - Look into CSV fields and commas being encoded in XHRs
 * @todo    [DONE] - loadMore bug re:adding and not clearing
 * @todo    [PUNT] - Missing truncation dots: https://416.io/ss/f/7wtusv
 * @todo    [DONE] - typesense query param (e.g. w/o preset)
 * @todo    [DONE] - config functions re:modifications
 * @todo    [DONE] - inline layout
 * @todo    [DONE] - instantiation
 * @todo    [DONE] - external trigger to show/hide/toggle
 * @todo    [DONE] - external trigger to show w/ query
 * @todo    [DONE] - clear-interaction
 * @todo    [DONE] - absolute positioning on long page
 * @todo    [DONE] - panel animations
 * @todo    [DONE] - focus-interaction
 * @todo    [PUNT] - "End of results" template
 * @todo    [PUNT] - "Loading more results" template
 * @todo    [DONE] - Deal w/ inline where 10 results doesn't trigger scroll / loadMore
 * @todo    [DONE] -- See: https://416.io/ss/f/y75fpa
 * @todo    [DONE] - Toast UI
 * @todo    [DONE] - event dispatching cleanup
 * @todo    [DONE] - ToastUtils, passing in $annexSearchWidget and tracking open toasts
 * @todo    [DONE] - Deal w/ Config role for css loading and dist script
 * @todo    [DONE] - Toast positioning...
 * @todo    [DONE] -- See getBoundingClientRect
 * @todo    [DONE] -- div.content with overflow: hidden;
 * @todo    [DONE] - Further cleanup of error handling (e.g. don't define messages in TypesenseHelper?)
 * @todo    [PUNT] - UI for customizing and storing it on a server (oh.. config settings? like Serg's demo?)
 * @todo    [DONE] - Arch cleanup to ensure object instances are directly tied to the respective $annexSearchWidget
 * @todo    [DONE] -- Right now, this is messy. Should be standardized
 * @todo    [DONE] - Error logging cleanup
 * @todo    [DONE] - Re-architect things so that config template functions receive data object(s)
 * @todo    [NOPE] - CacheUtils for /css and /templates lookups to speed things up (?)
 * @todo    [NOPE] -- Only for /templates since /css is direct linked (?)
 * @todo    [PUNT] - Hook escape key to toasts (introduce escape utils class)
 * @todo    [DONE] - Problem w/ css dist file (min.css but maybe also non-min?)
 * @todo    [DONE] -- Possible issue w/ vars not being defined at top?
 * @todo    [DONE] - custom templates
 * @todo    [DONE] - variable templating
 * @todo    [DONE] - State management for updating data while toast is showing
 * @todo    [NOPE] - ensure multiple instantiations happen sequentially (to allow for /templates caching)
 * @todo    [NOPE] -- Not required if /templates no longer used?
 * @todo    [DONE] - CSS vars re:mode
 * @todo    [DONE] - Toast bug re:destroying
 * @todo    [PUNT] - When hovering over toast, don't allow to hide
 * @todo    [PUNT] -- Don't pause timer; wait until after mouseout and then close if appropriate
 * @todo    [PUNT] - Handle $input history preservation w/ respect to keyboard shortcuts
 * @todo    [PUNT] -- https://416.io/ss/f/5vo5uq
 * @todo    [PUNT] -- https://chatgpt.com/c/689ac399-9424-8320-943f-6327140b2045
 * @todo    [PUNT] -- https://claude.ai/chat/9ae0dab1-7637-4705-879d-65d62656b64a
 * @todo    [PUNT] -- https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 * @todo    [PUNT] -- https://chatgpt.com/c/689ac1bd-644c-8321-9ee6-faa588d56ed1
 * @todo    [PUNT] - Cleanup dirty classes functions (e.g. https://416.io/ss/f/2e6vyo)
 * @todo    [DONE] - Look into event handling / foundational (e.g. toast set)
 * @todo    [DONE] - Look into config updates properly trigger attribute changes?
 * @todo    [DONE] -- Event related?
 * @todo    [DONE] -- e.g. changing color scheme should do it live
 * @todo    [DONE] - $annexSearchWidget mount/render logic
 * @todo    [PUNT] - SchemaUtils which provides template logic according to schemas?
 * @todo    [PUNT] -- Define yaml, html or tmpl files for each schema type?
 * @todo    [PUNT] - Revert to .tmpl files and include them in build script?
 * @todo    [PUNT] - Hook up all config properties with respective custom event listeners (e.g. placeholder swapping)
 * @todo    [PUNT] -- This will require re-rendering of views (which should be fine now..)
 * @todo    [DONE] - Test CSS vars (see panel-right.inc.php)
 * @todo    [DONE] - Add in logic to prevent accidental infinite XHR when scrollbar is missing but shouldn't be?
 * @todo    [DONE] - Kill logic/UX/UI
 * @todo    [DONE] -- Toast to kill UI?
 * @todo    [PUNT] - try/catch blocks
 * @todo    [DONE] - Look into copyToClipboard catch
 * @todo    [PUNT] - Cleaner error throwing? https://416.io/ss/f/njj7y3
 * @todo    [PUNT] - Throw error whenever needed (of specific type?) and catch it; then kill?
 * @todo    [PUNT] - Give users ability to hide a result (via keyboard shortcut?)
 * @todo    [DONE] - Bug with focus not coming back (related to found.results not being cleared)
 * @todo    [DONE] -- See here: https://416.io/ss/f/93p03u
 * @todo    [PUNT] - Define custom results that are always inserted (at top initially)
 * @todo    [PUNT] - setConfig on global window.annexSearch.AnnexSearch class, which trickles down (but can be overridden) to web components
 * @todo    [DONE] - Attempting to re-focus when multiple web components is limited to the $this itself; can't focus in on $result
 * @todo    [DONE] -- Would need to internally track this, and pass it down via $annexWebComponent.focus call
 * @todo    [DONE] - Bug with multiple open and query-ing
 * @todo    [DONE] - Multiple bugs (various)
 * @todo    [DONE] -- Focus/click
 * @todo    [DONE] -- z-indexing
 * @todo    [PUNT] - Error handling for multiple panel-left / panel-right instances?
 * @todo    [PUNT] -- Possible to support with offset (translateX) animations?
 * @todo    [DONE] - Prevent blur when click on $result
 * @todo    [DONE] -- Instead added .focused class
 * @todo    [PUNT] - Command + delete to clear entire input value (from non-input focused $element)
 * @todo    [PUNT] - Better logic for image/container "height flashing" re:content sibling $div
 * @todo    [DONE] - Image support for demo (see setMutator)
 * @todo    [DONE] -- Image fading in after load
 * @todo    [DONE] - When multiple open, have keyboard shortcut "bring to front" an already open web component that has a lower z-index value
 * @todo    [DONE] -- See: https://416.io/ss/f/b8x7qp
 * @todo    [DONE] - Add support for more than > 2 showing with toggling/hiding
 * @todo    [DONE] -- See: https://416.io/ss/f/zl6bct
 * @todo    [PUNT] - Allow for Command+up/down, which should go to top of scrollable area
 * @todo    [PUNT] -- It seems like I can get this to work natively by blurring the $input after a null-click / focus (e.g. click on toast)
 * @todo    [DONE] - Thumbs broken on tall images: https://416.io/ss/f/26alrd
 * @todo    [DONE] -- I thought this was fixed, but new issues with stupid flex box
 * @todo    [DONE] -- Likely better to just go back to original
 * @todo    [DONE] - Schemas (for Typesense demos)
 * @todo    [DONE] - New problem w/ clicking $result and losing focused class.. ach..
 * @todo    [DONE] -- Problem with new $webComponent click/focus handlers and propagatong up to focus on $input?
 * @todo    [DONE] - Image bug: https://416.io/ss/f/juxbd9
 * @todo    [DONE] - Typesense collection retrieval (for smart templates?)
 * @todo    [DONE] -- Settled (for now) on an 'auto' schema which looks for property keys. See here: https://416.io/ss/f/y0l1kg
 * @todo    [DONE] - Timer UI
 * @todo    [PUNT] - Have mobile modal stacking be transform/zoom based?
 * @todo    [PUNT] -- Possibly also for desktop?
 * @todo    [DONE] - What to do w/ defined/default keyboard shortcuts on touch devices?
 * @todo    [DONE] -- At least hide the label?
 * @todo    [PUNT] - Should root.{type} event be moved to $webComponent?
 * @todo    [PUNT] - Add support for $idle $chips keyboard navigation
 * @todo    [DONE] - Hide keyboard shortcut label on mobile (since can't be triggered)
 * @todo    [DONE] - Kill doesn't work
 * @todo    [DONE] - Prevent mobile "return" key from triggering init click
 * @todo    [DONE] - Sometimes clearing out input on mobile doesn't trigger idle state
 * @todo    [DONE] -- Also happening on desktop
 * @todo    [DONE] -- Required aborting when empty $input value. See: https://416.io/ss/f/t27dr4
 * @todo    [DONE] - Allow for disable messaging override
 * @todo    [DONE] - When disabled, if focus command, prevent focus
 * @todo    [DONE] - When disabled, if escape key, hide modal
 * @todo    [NOPE] - Cleaner /css loading based on hostname of JS?
 * @todo    [NOPE] -- Or update dist.sh file for more correct things?
 * @todo    [DONE] - Add in env var in Config
 * @todo    [DONE] - Update dist.sh for env var
 * @todo    [DONE] - Timer UI not working on bundled up js/css? (cdn)
 * @todo    [PUNT] - Handle layout change via setConfig transitions
 * @todo    [PUNT] -- Right now, ugly do to triggering transform changes. Fix that via no-animate class
 * @todo    [DONE] - Bug w/ cleared input and header spinner still showing
 * @todo    [PUNT] - 'affixed' or 'sticky' layout, which binds to a specific $container (using PopperJS)
 * @todo    [DONE] - Auto focus on scrolling and it becoming visible
 * @todo    [DONE] -- Or not, since it would take focus from other unrelated elements?
 * @todo    [DONE] -- For now, I'm doing a check on $activeElement; might work; added Config option
 * @todo    [DONE] -- Prevent auto focus due to page jacking..
 * @todo    [DONE] --- Resolved via InteractionUtils.#__handleWindowScrollEvent
 * @todo    [DONE] -- Handle case where user scrolls down, then back up where a $result was focused. It shouldn't go back to the $input, but rather the last $focused element?
 * @todo    [DONE] --- This will require tracking the last focused $element for each $annexSearchWidget
 * @todo    [PUNT] - Index attribute bug: https://416.io/ss/f/n0bc1a
 * @todo    [PUNT] -- This is more complicated than it seems, in that the ordering changes each time an $annexSearchWidget is focused/shown etc.
 * @todo    [PUNT] -- Since this the attribute isn't currently being used (intial intention was around multi-modal shifting), punting for now
 * @todo    [DONE] - Different icons re:hide / clearInput
 * @todo    [DONE] - [Feedback from Adam]
 * @todo    [DONE] -- Add clear option; important for mobile
 * @todo    [DONE] --- Complicated: does the X then close modal _after_ $input is cleared?)
 * @todo    [PUNT] - Dynamic view mounting
 * @todo    [PUNT] -- Upon the very first render, look for other views to render without having to do so manually
 * @todo    [PUNT] -- Single view references can be stored dynamically
 * @todo    [PUNT] -- More complicated when it comes to multiple views (e.g. results, chips)
 * @todo    [DONE] - [Feedback from Adam]
 * @todo    [DONE] -- Affix to the top?
 * @todo    [DONE] -- Modal slim version re:idle state?
 * @todo    [DONE] - SchemaUtils ????
 * @todo    [DONE] - Middle alignment: https://416.io/ss/f/f9132o
 * @todo    [DONE] - Scroll down; focus on dark mode, open panel, scroll up, close panel: focus pulls user down
 * @todo    [DONE] -- $aciveElement was actually the $button; fixed
 * @todo    [DONE] - On toggle, restore $input focus state if focused
 * @todo    [DONE] -- This is important to reinforce statefulness and UX focus
 * @todo    [DONE] - Inline min height re:empty results
 * @todo    [DONE] - [Keyboard Shortcut]
 * @todo    [DONE] -- Allow for keyboard shortcuts with inline (to focus)?
 * @todo    [DONE] --- But don't show field.label?
 * @todo    [DONE] -- Track order of "showing" modals in registered?
 * @todo    [DONE] -- Fundamentally need to get this sorted, and then revisit keyboard shortcut toggle work
 * @todo    [DONE] -- Multiple-modal stacking (w/ offsets)
 * @todo    [PUNT] - There are some complicated show/hide/toggle/focus issues when multiple web components are open
 * @todo    [PUNT] -- These only really present themselves through keyboard shortcut toggling etc; leave for now and revisit based on feedback
 * @todo    [PUNT] - When dev mode on, load unmiified css
 */
window.annexSearch.DependencyLoader.push([], function() {

    /**
     * window.annexSearch.AnnexSearch
     * 
     * @access  public
     */
    window.annexSearch.AnnexSearch = window.annexSearch.AnnexSearch || class AnnexSearch {

        /**
         * #__$focused
         * 
         * @access  private
         * @static
         * @var     null|window.annexSearch.AnnexSearchWidgetWebComponent (default: null)
         */
        static #__$focused = null;

        /**
         * #__$registered
         * 
         * @access  private
         * @static
         * @var     Array (default: [])
         */
        static #__$registered = [];

        /**
         * #__version
         * 
         * @access  private
         * @static
         * @var     String (default: '0.1.17-stable')
         */
        static #__version = '0.1.17-stable';

        /**
         * #__setupUtils
         * 
         * @see     https://chatgpt.com/c/6898260b-ca3c-8323-8df8-d8099634d658
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__setupUtils() {
            for (var propertyName in window.annexSearch) {
                if (window.annexSearch.hasOwnProperty(propertyName) === false) {
                    continue;
                }
                if (typeof window.annexSearch[propertyName] !== 'function') {
                    continue;
                }
                if (propertyName === 'BaseUtils') {
                    continue;
                }
                if (propertyName.endsWith('Utils') === false) {
                    continue;
                }
                window.annexSearch[propertyName].setup && window.annexSearch[propertyName].setup();
            }
            return true;
        }

        /**
         * clearFocused
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static clearFocused() {
            this.#__$focused = null;
            return true;
        }

        /**
         * getFocused
         * 
         * @access  public
         * @static
         * @return  null|window.annexSearch.AnnexSearchWidgetWebComponent
         */
        static getFocused() {
            let $focused = this.#__$focused;
            return $focused;
        }

        /**
         * getRegistered
         * 
         * @access  public
         * @static
         * @return  Array
         */
        static getRegistered() {
            let $registered = this.#__$registered;
            return $registered;
        }

        /**
         * getRegisteredById
         * 
         * @access  public
         * @static
         * @param   String id
         * @return  null|window.annexSearch.AnnexSearchWidgetWebComponent
         */
        static getRegisteredById(id) {
            let $registered = this.#__$registered;
            for (let $annexSearchWidget of $registered) {
                if ($annexSearchWidget.getAttribute('data-annex-search-id') === id) {
                    return $annexSearchWidget;
                }
            }
            return null;
        }

        /**
         * getShowing
         * 
         * @access  public
         * @static
         * @return  Array
         */
        static getShowing() {
            let $registered = this.#__$registered,
                $showing = [];
            for (let $annexSearchWidget of $registered) {
                if ($annexSearchWidget.showing() === true) {
                    $showing.push($annexSearchWidget);
                }
            }
            return $showing;
        }

        /**
         * getVersion
         * 
         * @access  public
         * @static
         * @return  String
         */
        static getVersion() {
            let version = this.#__version;
            return version;
        }

        /**
         * register
         * 
         * @see     https://chatgpt.com/c/689d593e-6478-8323-bf55-a6bdc876ad22
         * @access  public
         * @static
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Boolean
         */
        static register($annexSearchWidget) {
            if (this.#__$registered.includes($annexSearchWidget) === false) {
                this.#__$registered.push($annexSearchWidget);
                return true;
            }
            this.#__$registered = this.#__$registered.filter(function(item) {
                return item !== $annexSearchWidget;
            });
            this.#__$registered.push($annexSearchWidget);
            // $annexSearchWidget.getHelper('webComponentUI').setAttributes();
            return true;
        }

        /**
         * setActive
         * 
         * @access  public
         * @static
         * @param   null|window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Boolean
         */
        static setFocused($annexSearchWidget) {
            this.#__$focused = $annexSearchWidget;
            if ($annexSearchWidget === null) {
                return false;
            }
            this.register($annexSearchWidget);
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            this.#__setupUtils();
            window.customElements.define('annex-search-widget', window.annexSearch.AnnexSearchWidgetWebComponent);
            return true;
        }
    }
});

/**
 * /src/js/core/Base.js
 * 
 */
window.annexSearch.DependencyLoader.push([], function() {

    /**
     * window.annexSearch.Base
     * 
     * @access  public
     */
    window.annexSearch.Base = window.annexSearch.Base || class Base {

        /**
         * #__eventTarget
         * 
         * @see     https://chatgpt.com/c/682a6c39-abc8-800f-ac2d-9b758dfb8384
         * @access  private
         * @var     EventTarget
         */
        #__eventTarget = new EventTarget();

        /**
         * _$annexSearchWidget
         * 
         * @access  protected
         * @var     null|window.annexSearch.AnnexSearchWidgetWebComponent (defautl: null)
         */
        _$annexSearchWidget = null;

        /**
         * _data
         * 
         * @access  protected
         * @var     Object (default: {})
         */
        _data = {};

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  void
         */
        constructor($annexSearchWidget) {
            this._$annexSearchWidget = $annexSearchWidget;
        }

        /**
         * #__handleMergeCustomEvent
         * 
         * @access  private
         * @param   String pathArr
         * @param   mixed oldVal
         * @param   mixed newVal
         * @return  Boolean
         */
        #__handleMergeCustomEvent(pathArr, oldVal, newVal) {

            // Event (broad)
            let type = 'data.set',
                detail = {};
            detail.key = pathArr.join('.');
            detail.value = newVal;
            this.dispatchCustomEvent(type, detail);

            // Event (specific)
            type = 'data.set.' + (pathArr.join('.'));
            this.dispatchCustomEvent(type, detail);

            // console.log("Replaced %s:", pathArr.join("."), oldVal, "→", newVal);
            // console.log("Replaced %s:", pathArr.join("."), oldVal, "→", newVal);
            return true;
        }

        /**
         * addCustomEventListener
         * 
         * @access  public
         * @param   String type
         * @param   Function listener
         * @param   Boolean once (default: false)
         * @return  Boolean
         */
        addCustomEventListener(type, listener, once = false) {
            this.#__eventTarget.addEventListener(type, listener, {
                once: once
            });
            return true;
        }

        /**
         * dispatchCustomEvent
         * 
         * @access  public
         * @param   String type
         * @param   Object detail (default: {})
         * @return  Boolean
         */
        dispatchCustomEvent(type, detail = {}) {
            detail.$annexSearchWidget = this.getWebComponent();
            let customEvent = new CustomEvent(type, {
                detail: detail
            });
            this.#__eventTarget.dispatchEvent(customEvent);
            return true;
        }

        /**
         * error
         * 
         * @access  public
         * @return  Boolean
         */
        error() {
            let scope = window.annexSearch.LoggingUtils,
                response = window.annexSearch.LoggingUtils.error.apply(scope, arguments);
            return response;
        }

        /**
         * get
         * 
         * @access  public
         * @param   undefined|String key (default: undefined)
         * @return  Object|undefined|mixed
         */
        get(key = undefined) {
            // if (key === undefined) {
            //     let response = this._data;
            //     return response;
            // }
            // let response = this._data[key] || undefined;
            // return response;



            if (key === undefined) {
                let data = this._data;
                return data;
            }
            let value = this._data[key];
            if (value !== undefined) {
                return value;
            }
            let pieces = key.split('.');
            if (pieces.length === 1) {
// console.log(pieces, this._data);
                let message = window.annexSearch.ErrorUtils.getMessage('base.get.key.invalid', key);
                this.error(message);
                return undefined;
            }
            value = this._data;
            for (let piece of pieces) {
                value = value[piece];
                if (value === undefined) {
                    let message = window.annexSearch.ErrorUtils.getMessage('base.get.key.invalid', key);
                    this.error(message);
                    return undefined;
                }
            }
            return value;
        }

        /**
         * getHelper
         * 
         * @access  public
         * @param   String key
         * @return  window.annexSearch.BaseHelper
         */
        getHelper(key) {
            let webComponent = this.getWebComponent(),
                helper = webComponent.getHelper(key);
            return helper;
        }

        /**
         * getView
         * 
         * @access  public
         * @param   String key
         * @return  undefined|BaseView
         */
        getView(key) {
            // key = 'views.' + (key);
            // let response = this.get(key);
            // return response;
            let views = this.get('views') || {},
                view = views[key] || undefined;
            if (view !== undefined) {
                return view;
            }
            if (key === 'root') {
                view = this.getWebComponent().getView('root');
                return view;
            }
            let pieces = key.split('.');
            view = this.getWebComponent().getView('root');
            for (let piece of pieces) {
                if (piece === 'root') {
                    continue;
                }
                view = view.getView(piece);
            }
            return view;
        }

        /**
         * getWebComponent
         * 
         * @access  public
         * @return  window.annexSearch.AnnexSearchWidgetWebComponent
         */
        getWebComponent() {
            let $webComponent = this._$annexSearchWidget;
            return $webComponent;
        }

        /**
         * merge
         * 
         * @access  public
         * @param   Object data
         * @return  Boolean
         */
        merge(data) {
            let handler = this.#__handleMergeCustomEvent.bind(this);
            window.annexSearch.DataUtils.deepMerge(this._data, data, handler);
            let type = 'data.merge',
                detail = {data};
            this.dispatchCustomEvent(type, detail);
            return true;
        }

        /**
         * set
         * 
         * @access  public
         * @param   String key
         * @param   mixed value
         * @return  Boolean
         */
        set(key, value) {

            // Validation
            if (key === undefined) {
                let message = window.annexSearch.ErrorUtils.getMessage('base.set.key.undefined');
                this.error(message);
                return false;
            }
            if (value === undefined) {
                let message = window.annexSearch.ErrorUtils.getMessage('base.set.value.undefined');
                this.error(message);
                return false;
            }

            // Let's do this!
            let parent = this._data,
                reference = this._data[key],
                piece = key;
            if (reference === undefined) {
                let pieces = key.split('.');
                reference = this._data;
                for (piece of pieces) {
                    parent = reference;
                    reference = reference[piece];
                }
            }
            parent[piece] = value;

            // Events
            reference = this;
            let detail = {key, value, reference};
            this.dispatchCustomEvent('data.set', detail);
            let type = 'data.set.' + (key);
            this.dispatchCustomEvent(type, detail);
            return true;
        }

        /**
         * set
         * 
         * @access  public
         * @param   String key
         * @param   mixed value
         * @return  Boolean
         */
        // set__(key, value) {
        //     this._data[key] = value;
        //     let detail = {key, value};
        //     this.dispatchCustomEvent('data.set', detail);
        //     let type = 'data.set.' + (key);
        //     this.dispatchCustomEvent(type, detail);
        //     return true;
        // }
    }
});

/**
 * /src/js/helpers/Base.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.Base'], function() {

    /**
     * window.annexSearch.BaseHelper
     * 
     * @access  public
     * @extends window.annexSearch.Base
     */
    window.annexSearch.BaseHelper = window.annexSearch.BaseHelper || class BaseHelper extends window.annexSearch.Base {
    }
});

/**
 * /src/js/helpers/Config.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseHelper'], function() {

    /**
     * window.annexSearch.ConfigHelper
     * 
     * @access  public
     * @extends window.annexSearch.BaseHelper
     */
    window.annexSearch.ConfigHelper = window.annexSearch.ConfigHelper || class ConfigHelper extends window.annexSearch.BaseHelper {

        /**
         * _data
         * 
         * @access  protected
         * @var     Object
         */
        _data = {

            /**
             * $container
             * 
             * The container that the UI should be inserted into. If null, it'll
             * be appened to the either the $body, $head or $documentElement (in
             * that order).
             * 
             * @access  private
             * @var     null|EventTarget (default: null)
             */
            $container: null,

            /**
             * autoFocusOnScroll
             * 
             * Whether a visible, enabled, inline $annexSearchWidget should
             * automatically be focused when the user scrolls. Helpful from a UX
             * point of view, but could cause conflicts with some integrations.
             * 
             * Note that it will not automatically focus on an
             * $annexSearchWidget if the page's focus is already on a form
             * input.
             * 
             * @access  private
             * @var     Boolean (default: true)
             */
            autoFocusOnScroll: true,

            /**
             * callbacks
             * 
             * Map of callbacks that can be used for custom logic.
             * 
             * @access  private
             * @var     Object
             */
            callbacks: {
                result: {
                    click: function(customEvent) {
                        // console.log('result.click', customEvent.detail, this);
                    },
                    copy: function(customEvent) {
                        // console.log('result.copy', customEvent.detail, this);
                    },
                    focus: function(customEvent) {
                        // console.log('result.focus', customEvent.detail, this);
                    },
                },
                results: {
                    empty: function(customEvent) {
                        // console.log('results.empty', customEvent.detail, this);
                    },
                    error: function(customEvent) {
                        // console.log('results.error', customEvent.detail, this);
                    },
                    idle: function(customEvent) {
                        // console.log('results.idle', customEvent.detail, this);
                    },
                    loaded: function(customEvent) {
                        // console.log('results.loaded', customEvent.detail, this);
                    },
                },
                root: {
                    hide: function(customEvent) {
                        // console.log('root.hide', customEvent.detail, this);
                    },
                    show: function(customEvent) {
                        // console.log('root.show', customEvent.detail, this);
                    },
                    toggle: function(customEvent) {
                        // console.log('root.toggle', customEvent.detail, this);
                    }
                }
            },

            /**
             * chips
             * 
             * @access  private
             * @var     Object
             */
            chips: {
                idle: []
            },

            /**
             * cluster
             * 
             * Authentication and configuration details specifically for the
             * Typesense cluster.
             * 
             * @access  private
             * @var     Object
             */
            cluster: {
                apiKey: null,
                collectionName: null,
                hostname: null,
                presetName: null,
            },

            /**
             * colorScheme
             * 
             * Options:
             * - 'auto' detects light/dark color scheme through device
             * - 'light'
             * - 'dark'
             * 
             * @access  private
             * @var     String (default: 'auto')
             */
            colorScheme: 'auto',

            /**
             * copy
             * 
             * Series of copy variables which are dotted throughout the UI. For
             * more comprehensive updates, templates can be used.
             * 
             * Copy properties support HTML.
             * 
             * @access  private
             * @var     Object
             */
            copy: {
                disabled: {
                    title: 'Search disabled',
                    message: 'Apologies but search has been disabled for the time being.'
                },
                empty: {
                    message: 'No results found...'
                },
                error: {
                    message: 'Something went wrong...'
                },
                field: {
                    placeholder: 'Search...'
                },
                idle: {
                    chips: 'Popular searches:',
                    message: 'Start typing to begin your search...'
                },
                statusBar: {
                    message: 'Instantly search through our database'
                },
            },

            /**
             * debug
             * 
             * @access  private
             * @var     Boolean (default: false)
             */
            debug: false,

            /**
             * env
             * 
             * A config variable which is useful for tracking where Annex is
             * deployed. Specifically, whether it's running in a local, dev,
             * prod etc environment.
             * 
             * @access  private
             * @var     String (default: 'prod')
             */
            env: 'prod',

            /**
             * highlightTagName
             * 
             * @access  private
             * @var     String (default: 'MARK')
             */
            highlightTagName: 'MARK',

            /**
             * id
             * 
             * Useful for interaction attributes such that specific
             * $annexSearchWidget instances can be targeted.
             * 
             * @access  private
             * @var     String (default: window.annexSearch.StringUtils.generateUUID())
             */
            id: window.annexSearch.StringUtils.generateUUID(),

            /**
             * keyboardShortcut
             * 
             * The keyboard combination which when pressed, toggles the web
             * component to be shown or hidden. If null, no listener is created.
             * 
             * @access  private
             * @var     null|String (default: '⌘k')
             */
            keyboardShortcut: '⌘k',

            /**
             * layout
             * 
             * The UI layout for the web component. Currently supports:
             * - inline
             * - modal
             * - panel-left
             * - panel-right
             * 
             * @access  private
             * @var     String (default: 'modal')
             */
            layout: 'modal',

            /**
             * modalAlignment
             * 
             * Whether the modal should be fixed to the top (offset by a %
             * defined via CSS), or whether it should be vertically aligned in
             * the middle of the viewport.
             * 
             * When set to 'top', prevents a "jumping" within the UI before and
             * after a search takes place (due to realignment of the "middle").
             * 
             * @access  private
             * @var     String (default: 'top')
             */
            modalAlignment: 'top',
            // modalAlignment: 'middle',

            /**
             * resources
             * 
             * Map of arrays which are loaded into memory upon each page load.
             * Core to the functionality, but extensible for being able to
             * define custom styles.
             * 
             * Currently limited to CSS resources, but likely to be extended
             * later.
             * 
             * @access  private
             * @var     Object
             */
            resources: {
                css: [
                    'https://cdn.jsdelivr.net/gh/onassar/AnnexUI@0.1.17-stable/dist/bundle.min.css',
                ],
            },

            /**
             * searchOptions
             * 
             * @access  private
             * @var     Object
             */
            searchOptions: {
                highlight_full_fields: null,
                highlight_affix_num_tokens: null,
                snippet_threshold: null,
            },

            /**
             * searchRequestMethod
             * 
             * @note    noop
             * @access  private
             * @var     String (default: 'lifo')
             */
            // searchRequestMethod: 'fifo',
            searchRequestMethod: 'lifo',

            /**
             * showOverlay
             * 
             * Whether an overlay should be shown. Prevents the click event from
             * hiding a hidable-web-component.
             * 
             * @access  private
             * @var     Boolean (default: true)
             */
            showOverlay: true,

            /**
             * templates
             * 
             * Map of strings corresponding to custom templates for views.
             * 
             * @access  private
             * @var     Object (default: {})
             */
            templates: {},

            /**
             * templateSetKey
             * 
             * A key which defines the template set you want to use for your
             * Annex UI. By default, this is set to 'auto-v0.1.0' which means
             * Annex will do it's best to try and figure out what the title,
             * body and URI of your search result is (based on Typesense
             * responses).
             * 
             * If you'd like to define your own $result template, set this to
             * 'custom'.
             * 
             * If you'd like to adhere to one of our pre-defined template sets
             * (e.g. a crawler for your website via 'webResource-v0.1.0') set
             * the key value here to that.
             * 
             * Valid options currently are:
             * - auto-v0.1.0
             * - custom
             * - sku-v0.1.0
             * - webResource-v0.1.0
             * 
             * @access  private
             * @var     String (default: 'auto-v0.1.0')
             */
            // templateSetKey: 'auto-v0.1.0',
        };

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  void
         */
        constructor($annexSearchWidget) {
            super($annexSearchWidget);
            this.#__addCustomEventListeners();
            this.#__setResources();
        }

        /**
         * #__addCustomEventListeners
         * 
         * @access  private
         * @return  Boolean
         */
        #__addCustomEventListeners() {
            this.#__addDataSetCustomEventListener();
            return true;
        }

        /**
         * #__addDataSetCustomEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addDataSetCustomEventListener() {
            let handler = this.#__handleDataSetCustomEvent.bind(this);
            this.addCustomEventListener('data.set', handler);
            return true;
        }

        /**
         * #__handleChipsNormalization
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleChipsNormalization(event) {
            let type = event.type,
                chips = this._data.chips,
                idle = chips.idle || [];
            window.annexSearch.DataUtils.removeDuplicateObjects(idle);
            for (let index in idle) {
                let chip = idle[index];
                if (chip.constructor === String) {
                    idle[index] = {
                        label: chip,
                        query: chip
                    };
                }
            }
            return true;
        }

        /**
         * #__handleDataSetCustomEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleDataSetCustomEvent(event) {
            this.#__handleChipsNormalization(event);
            return true;
        }

        /**
         * #__handleStylesheetErrorLoadEvent
         * 
         * @access  private
         * @param   Function reject
         * @param   Object event
         * @return  Boolean
         */
        #__handleStylesheetErrorLoadEvent(reject, event) {
            let message = window.annexSearch.ErrorUtils.getMessage('stylesheets.failedLoading');
            window.annexSearch.LoggingUtils.error(message, event);
            reject();
            return true;
        }

        /**
         * #__handleStylesheetSuccessfulLoadEvent
         * 
         * @access  private
         * @param   Function resolve
         * @return  Boolean
         */
        #__handleStylesheetSuccessfulLoadEvent(resolve) {
            window.annexSearch.ElementUtils.waitForAnimation().then(resolve);
            return true;
        }

        /**
         * #__loadStylesheets
         * 
         * @see     https://claude.ai/chat/3683f5e2-b3b9-4cbb-846f-ac1a2d2cb64b
         * @access  private
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Promise
         */
        #__loadStylesheets($annexSearchWidget) {
            let $shadow = $annexSearchWidget.shadow,
                errorHandler = this.#__handleStylesheetErrorLoadEvent.bind(this),
                successfulHandler = this.#__handleStylesheetSuccessfulLoadEvent.bind(this),
                resources = Array.from(
                    new Set(this.get('resources').css)
                ),
                promises = resources.map(function(href) {
                    return new Promise(function(resolve, reject) {
                        let $link = document.createElement('link');
                        $link.rel = 'stylesheet';
                        $link.href = href;
                        $link.onload = resolve;
                        $link.onerror = errorHandler.bind(null, reject);
                        $shadow.appendChild($link);
                    });
                }),
                promise = Promise.all(promises).then(function() {
                    return new Promise(function(resolve) {
                        successfulHandler(resolve);
                    });
                })
            return promise;
        }

        /**
         * #__setResources
         * 
         * @note    noop
         * @access  private
         * @return  Boolean
         */
        #__setResources() {
            let env = this.get('env');
            if (env === 'prod') {
                return false;
            }
            return true;
        }

        /**
         * loadStylesheets
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Boolean
         */
        loadStylesheets($annexSearchWidget) {
            let promise = this.#__loadStylesheets($annexSearchWidget);
            return promise;
        }

        /**
         * triggerCallback
         * 
         * @access  public
         * @param   String type
         * @param   Object detail (default: {})
         * @return  Boolean
         */
        triggerCallback(type, detail = {}) {
            let reference = this._data.callbacks || {},
                pieces = type.split('.');
            for (var piece of pieces) {
                reference = reference[piece] ?? null;
                if (reference === null) {
                    return false;
                }
            }
            let $annexSearchWidget = this.getWebComponent();
            detail.$annexSearchWidget = $annexSearchWidget;
            let customEvent = new CustomEvent(type, {
                detail: detail
            });
            reference.apply($annexSearchWidget, [customEvent]);
            return true;
        }
    }
});

/**
 * /src/js/helpers/Typesense.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseHelper'], function() {

    /**
     * window.annexSearch.TypesenseHelper
     * 
     * @see     https://claude.ai/chat/47f3434d-203d-45a8-a8ac-f52ad7505b0a
     * @see     https://typesense.org/docs/29.0/api/search.html
     * @access  public
     * @extends window.annexSearch.BaseHelper
     */
    window.annexSearch.TypesenseHelper = window.annexSearch.TypesenseHelper || class TypesenseHelper extends window.annexSearch.BaseHelper {

        /**
         * #__lastRequest
         * 
         * @access  private
         * @var     null|window.annexSearch.TypesenseSearchRequest (default null)
         */
        #__lastRequest = null;

        /**
         * #__requests
         * 
         * @access  private
         * @var     Array (default [])
         */
        #__requests = [];

        /**
         * #__validSearchOptions
         * 
         * @see     https://416.io/ss/f/fm0aua
         * @access  private
         * @param   window.annexSearch.TypesenseSearchRequest request
         * @return  Boolean
         */
        #__validSearchOptions(request) {

            // Options
            let options = request.getOptions();
            if (options.q === null) {
                let key = 'option',
                    message = window.annexSearch.ErrorUtils.getMessage('typesenseHelper.options.q.null');
                request.setError(key, message);
                return false;
            }
            if (options.q === undefined) {
                let key = 'option',
                    message = window.annexSearch.ErrorUtils.getMessage('typesenseHelper.options.q.undefined');
                request.setError(key, message);
                return false;
            }
            if (options.q.trim() === '') {
                let key = 'option',
                    message = window.annexSearch.ErrorUtils.getMessage('typesenseHelper.options.q.empty');
                request.setError(key, message);
                return false;
            }

            // Search options
            let searchOptions = request.getSearchOptions();
            if (searchOptions.preset) {
                return true;
            }
            if (searchOptions.query_by === null) {
                let key = 'searchOptions',
                    message = window.annexSearch.ErrorUtils.getMessage('typesenseHelper.searchOptions.query_by.null');
                request.setError(key, message);
                return false;
            }
            if (searchOptions.query_by === undefined) {
                let key = 'searchOptions',
                    message = window.annexSearch.ErrorUtils.getMessage('typesenseHelper.searchOptions.query_by.undefined');
                request.setError(key, message);
                return false;
            }
            return true;
        }

        /**
         * abortLastRequest
         * 
         * @access  public
         * @return  Boolean
         */
        abortLastRequest() {
            if (this.#__lastRequest === null) {
                return false;
            }
            let request = this.#__lastRequest;
            this.#__lastRequest = null;
            request.abort();
            let index = this.#__requests.indexOf(request);
            if (index === -1) {
                return false;
            }
            this.#__requests.splice(index, 1);
            return true;
        }

        /**
         * getHighlightEndTag
         * 
         * @access  public
         * @return  String
         */
        getHighlightEndTag() {
            let tagName = this.getHelper('config').get('highlightTagName'),
                tagNameLowerCase = tagName.toLowerCase(),
                endTag = '</' + (tagNameLowerCase) + '>';
            return endTag;
        }

        /**
         * getHighlightStartTag
         * 
         * @access  public
         * @return  String
         */
        getHighlightStartTag() {
            let tagName = this.getHelper('config').get('highlightTagName'),
                tagNameLowerCase = tagName.toLowerCase(),
                startTag = '<' + (tagNameLowerCase) + '>';
            return startTag;
        }

        /**
         * replaceHightlightTags
         * 
         * @access  public
         * @param   String html
         * @return  String
         */
        replaceHightlightTags(html) {
            let startTag = this.getHighlightStartTag(),
                endTag = this.getHighlightEndTag(),
                escapedStartTag = startTag.replace('<', '&lt;').replace('>', '&gt;'),
                escapedEndTag = endTag.replace('<', '&lt;').replace('>', '&gt;');
            html = html.replaceAll(escapedStartTag, startTag);
            html = html.replaceAll(escapedEndTag, endTag);
            return html;
        }

        /**
         * search
         * 
         * @access  public
         * @param   String query
         * @param   Object options (default: {})
         * @return  Promise
         */
        search(query, options = {}) {
            this.abortLastRequest();
            let $annexSearchWidget = this.getWebComponent(),
                request = new window.annexSearch.TypesenseSearchRequest($annexSearchWidget);
            request.setQuery(query);
            request.setOptions(options);
            if (this.#__validSearchOptions(request) === false) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(request);
                return promise;
            }
            this.#__lastRequest = request;
            this.#__requests.push(request);
            let promise = request.fetch();
            return promise;
        }
    }
});

/**
 * /src/js/helpers/WebComponentUI.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseHelper'], function() {

    /**
     * window.annexSearch.WebComponentUIHelper
     * 
     * @see     https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
     * @access  public
     * @extends window.annexSearch.BaseHelper
     */
    window.annexSearch.WebComponentUIHelper = window.annexSearch.WebComponentUIHelper || class WebComponentUIHelper extends window.annexSearch.BaseHelper {

        /**
         * #__$lastActiveElement
         * 
         * @access  private
         * @var     null|EventTarget (default: null)
         */
        #__$lastActiveElement = null;

        /**
         * #__maxZIndex
         * 
         * @access  private
         * @var     Number (default: 2147483647)
         */
        #__maxZIndex = 2147483647;

        /**
         * #__removeInertAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__removeInertAttribute() {
            let $annexSearchWidget = this.getWebComponent();
            $annexSearchWidget.removeAttribute('inert');
            return true;
        }

        /**
         * #__setInertAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setInertAttribute() {
            let $annexSearchWidget = this.getWebComponent();
            $annexSearchWidget.setAttribute('inert', '');
            return true;
        }

        /**
         * #__setModalAlignmentAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setModalAlignmentAttribute() {
            let $annexSearchWidget = this.getWebComponent();
            $annexSearchWidget.removeAttribute('data-annex-search-modal-alignment');
            if ($annexSearchWidget.getHelper('config').get('layout') === 'modal') {
                let modalAlignment = $annexSearchWidget.getConfig('modalAlignment');
                $annexSearchWidget.setAttribute('data-annex-search-modal-alignment', modalAlignment);
                return true;
            }
            return false;
        }

        /**
         * #__setModalOrderAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setModalOrderAttribute() {
            let $registered = window.annexSearch.AnnexSearch.getRegistered();
            if ($registered.length === 0) {
                return false;
            }
            if ($registered.length === 1) {
                return false;
            }
            let $annexSearchWidget = this.getWebComponent(),
                order = 0;
            for (let index in $registered.reverse()) {
                let $webComponent = $registered[index];
                $webComponent.removeAttribute('data-annex-search-modal-order');
                // if ($webComponent === $annexSearchWidget) {
                //     continue;
                // }
                if ($webComponent.getHelper('config').get('layout') !== 'modal') {
                    continue;
                }
                if ($webComponent.showing() === false) {
                    continue;
                }
                $webComponent.setAttribute('data-annex-search-modal-order', order);
                order++;
// console.log(order);
// console.log($annexSearchWidget);
                // let zIndex = maxZIndex - index - 1;
                // $webComponent.style.zIndex = zIndex;
            }
            return true;
        }

        /**
         * #__setOverlayAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setOverlayAttribute() {
            let $annexSearchWidget = this.getWebComponent(),
                layout = this.getHelper('config').get('layout');
            if (layout === 'inline') {
                $annexSearchWidget.setAttribute('data-annex-search-overlay', '0');
                return true;
            }
            let showOverlay = this.getHelper('config').get('showOverlay');
            if (showOverlay === false) {
                $annexSearchWidget.setAttribute('data-annex-search-overlay', '0');
                return true;
            }
            $annexSearchWidget.setAttribute('data-annex-search-overlay', '1');
            return true;
        }

        /**
         * #__setShowingAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setShowingAttribute() {
            let $annexSearchWidget = this.getWebComponent(),
                showing = $annexSearchWidget.showing();
            showing = Number(showing);
            $annexSearchWidget.setAttribute('data-annex-search-showing', showing);
            return true;
        }

        /**
         * autoShow
         * 
         * @access  public
         * @return  Boolean
         */
        autoShow() {
            let layout = this.getHelper('config').get('layout');
            if (layout === 'inline') {
                let $annexSearchWidget = this.getWebComponent();
                $annexSearchWidget.show();
                return true;
            }
            return false;
        }

        /**
         * blur
         * 
         * @access  public
         * @return  Promise
         */
        blur() {
            let $annexSearchWidget = this.getWebComponent();
            $annexSearchWidget.getView('root').blur();
            let $lastActiveElement = this.#__$lastActiveElement,
                promise = window.annexSearch.ElementUtils.focus($lastActiveElement);
            return promise;
        }

        /**
         * disable
         * 
         * @access  public
         * @return  Boolean
         */
        disable() {
            let $annexSearchWidget = this.getWebComponent();
            this.getHelper('config').triggerCallback('root.disable');
            $annexSearchWidget.dispatchCustomEvent('root.disable');
            $annexSearchWidget.setAttribute('data-annex-search-disabled', '1');
            let title = this.getHelper('config').get('copy.disabled.title'),
                message = this.getHelper('config').get('copy.disabled.message'),
                toast = $annexSearchWidget.showToast(title, message, null);
            toast.setUnescapable();
            return true;
        }

        /**
         * enable
         * 
         * @access  public
         * @return  Boolean
         */
        enable() {
            let $annexSearchWidget = this.getWebComponent();
            this.getHelper('config').triggerCallback('root.enable');
            $annexSearchWidget.dispatchCustomEvent('root.enable');
            $annexSearchWidget.removeAttribute('data-annex-search-disabled');
            window.annexSearch.ToastUtils.hideAll($annexSearchWidget);
            return true;
        }

        /**
         * focus
         * 
         * @access  public
         * @return  Boolean
         */
        focus() {
            this.#__$lastActiveElement = document.activeElement || null;
            this.setZIndex();
            return true;
        }

        /**
         * hide
         * 
         * @see     https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
         * @access  public
         * @return  Promise
         */
        hide() {
            let $annexSearchWidget = this.getWebComponent();
            this.getHelper('config').triggerCallback('root.hide');
            $annexSearchWidget.dispatchCustomEvent('root.hide');
            $annexSearchWidget.getView('root').blur();
            this.#__setShowingAttribute();
            this.#__setInertAttribute();
            this.#__setModalOrderAttribute();
            let $lastActiveElement = this.#__$lastActiveElement,
                promise = new Promise(function(resolve, reject) {
                    $annexSearchWidget.addEventListener('transitionend', function() {
                        window.annexSearch.ElementUtils.focus($lastActiveElement).then(function() {
                            resolve(true);
                        });
                    }, {
                        once: true
                    });
                });
            return promise;
            // let $lastActiveElement = this.#__$lastActiveElement,
            //     promise = window.annexSearch.ElementUtils.focus($lastActiveElement);
            // return promise;
        }

        /**
         * setAttributes
         * 
         * @access  public
         * @return  Boolean
         */
        setAttributes() {
            let $annexSearchWidget = this.getWebComponent(),
                colorScheme = this.getHelper('config').get('colorScheme'),
                id = this.getHelper('config').get('id'),
                layout = this.getHelper('config').get('layout');
            $annexSearchWidget.setAttribute('data-annex-search-color-scheme', colorScheme);
            $annexSearchWidget.setAttribute('data-annex-search-id', id);
            $annexSearchWidget.setAttribute('data-annex-search-layout', layout);
            $annexSearchWidget.setAttribute('data-annex-search-ready', '1');
            this.#__setModalAlignmentAttribute();
            this.#__setOverlayAttribute();
            this.#__setShowingAttribute();
            return true;
        }

        /**
         * setQueryAttribute
         * 
         * @access  public
         * @return  Boolean
         */
        setQueryAttribute() {
            let $annexSearchWidget = this.getWebComponent(),
                field = $annexSearchWidget.getView('root').getView('header.field'),
                query = field.first('input').value;
            query = query.trim();
            $annexSearchWidget.setAttribute('data-annex-search-query', query);
            return true;
        }

        /**
         * setupConfigHelperCustomEventListeners
         * 
         * @access  public
         * @return  Boolean
         */
        setupConfigHelperCustomEventListeners() {
            let helper = this.getHelper('config');
            helper.addCustomEventListener('data.set.colorScheme', function(customEvent) {
                let detail = customEvent.detail,
                    $annexSearchWidget = detail.$annexSearchWidget;
                $annexSearchWidget.getHelper('webComponentUI').setAttributes();
                return true;
            });
            helper.addCustomEventListener('data.set.id', function(customEvent) {
                let detail = customEvent.detail,
                    $annexSearchWidget = detail.$annexSearchWidget;
                $annexSearchWidget.getHelper('webComponentUI').setAttributes();
                return true;
            });
            helper.addCustomEventListener('data.set.layout', function(customEvent) {
                let detail = customEvent.detail,
                    $annexSearchWidget = detail.$annexSearchWidget;
                $annexSearchWidget.getHelper('webComponentUI').setAttributes();
                return true;
            });
            helper.addCustomEventListener('data.set.overlay', function(customEvent) {
                let detail = customEvent.detail,
                    $annexSearchWidget = detail.$annexSearchWidget;
                $annexSearchWidget.getHelper('webComponentUI').setAttributes();
                return true;
            });
            return true;
        }

        /**
         * setZIndex
         * 
         * @access  public
         * @return  Boolean
         */
        setZIndex() {
            let $registered = window.annexSearch.AnnexSearch.getRegistered();
            if ($registered.length === 0) {
                return false;
            }
            if ($registered.length === 1) {
                return false;
            }
            let maxZIndex = this.#__maxZIndex,
                $annexSearchWidget = this.getWebComponent();
            $annexSearchWidget.style.zIndex = maxZIndex;
            for (let index in $registered) {
                let $webComponent = $registered[index];
                if ($webComponent === $annexSearchWidget) {
                    continue;
                }
                if ($webComponent.showing() === false) {
                    continue;
                }
                let zIndex = maxZIndex - index - 1;
                $webComponent.style.zIndex = zIndex;
            }
            return true;
        }

        /**
         * show
         * 
         * @access  public
         * @return  Promise
         */
        show() {
            let $annexSearchWidget = this.getWebComponent();
            this.#__setShowingAttribute();
            this.#__removeInertAttribute();
            this.#__setModalOrderAttribute();
            if ($annexSearchWidget.getConfig('layout') === 'inline') {
                let promise = $annexSearchWidget.focus().then(function(success) {
                    $annexSearchWidget.getHelper('config').triggerCallback('root.show');
                    $annexSearchWidget.dispatchCustomEvent('root.show');
                    return success;
                });
                return promise;
            }
            if ($annexSearchWidget.getConfig('layout') === 'modal') {
                let promise = $annexSearchWidget.focus().then(function(success) {
                    $annexSearchWidget.getHelper('config').triggerCallback('root.show');
                    $annexSearchWidget.dispatchCustomEvent('root.show');
                    return success;
                });
                return promise;
            }
            let promise = new Promise(function(resolve, reject) {
                var handler = $annexSearchWidget.focus.bind($annexSearchWidget);
                $annexSearchWidget.addEventListener('transitionend', function() {
                    handler().then(function(success) {
                        $annexSearchWidget.getHelper('config').triggerCallback('root.show');
                        $annexSearchWidget.dispatchCustomEvent('root.show');
                        resolve(success);
                    });
                }, {
                    once: true
                });
            });
            return promise;
        }

        /**
         * toggle
         * 
         * @access  public
         * @return  Boolean
         */
        toggle() {
            let $annexSearchWidget = this.getWebComponent();
            this.getHelper('config').triggerCallback('root.toggle');
            $annexSearchWidget.dispatchCustomEvent('root.toggle');
            return true;
        }
    }
});

/**
 * /src/js/requests/Base.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.Base'], function() {

    /**
     * window.annexSearch.BaseRequest
     * 
     * @extends window.annexSearch.Base
     */
    window.annexSearch.BaseRequest = window.annexSearch.BaseRequest || class BaseRequest extends window.annexSearch.Base {

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  void
         */
        constructor($annexSearchWidget) {
            super($annexSearchWidget);
        }
    }
});

/**
 * /src/js/requests/TypesenseSearch.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseRequest'], function() {

    /**
     * window.annexSearch.TypesenseSearchRequest
     * 
     * @extends window.annexSearch.BaseRequest
     */
    window.annexSearch.TypesenseSearchRequest = window.annexSearch.TypesenseSearchRequest || class TypesenseSearchRequest extends window.annexSearch.BaseRequest {

        /**
         * #__abortController
         * 
         * @access  private
         * @var     null|AbortController (default: null)
         */
        #__abortController = null;

        /**
         * #__aborted
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__aborted = false;

        /**
         * #__encodingExemptFields
         * 
         * @see     https://typesense.org/docs/0.20.0/api/documents.html#arguments
         * @access  private
         * @var     Array
         */
        // #__encodingExemptFields = [
        //     'include_fields',
        //     'exclude_fields',
        //     'highlight_full_fields',
        //     'pinned_hits',
        //     'hidden_hits'
        // ];

        /**
         * #__error
         * 
         * @access  private
         * @var     null|Object (default: null)
         */
        #__error = null;

        /**
         * #__options
         * 
         * @access  private
         * @var     Object
         */
        #__options = {
            page: 1,
            per_page: 10
            // per_page: 1
            // query_by: options.query_by || 'title,content',// working: title,body
            // filter_by: options.filter_by || '',// working: filter_by = score:>8
            // sort_by: options.sort_by || '_text_match:desc',// working: sort_by = score:desc
        };

        /**
         * #__query
         * 
         * @access  private
         * @var     null|String (default: null)
         */
        #__query = null;

        /**
         * #__response
         * 
         * @access  private
         * @var     null|Object (default: null)
         */
        #__response = null;

        /**
         * constructor
         * 
         * @access  public
         * @param   String query
         * @return  void
         */
//         constructor(query) {
//             super();
//             this.#__query = query;
//             this.#__options.q = query;
// // console.log(this, this.getHelper);//, this.getHelper('typesense'));
//             this.#__options.highlight_end_tag = this.getHelper('typesense').getHighlightEndTag();
//             this.#__options.highlight_start_tag = this.getHelper('typesense').getHighlightStartTag();
//         }

        /**
         * #__escapeTemplateVariableStrings
         * 
         * @see     https://claude.ai/chat/8bd18268-d28c-4006-81a1-c8c95c2ef163
         * @access  private
         * @param   Object obj
         * @return  Object
         */
        #__escapeTemplateVariableStrings(obj) {
            if (obj === null || obj === undefined) {
                return obj;
            }
            if (typeof obj === 'string') {
                return obj
                    // .replace(/\{\{/g, '\\{\\{')
                    // .replace(/\}\}/g, '\\}\\}');
                    .replace(/\{\{/g, '&#123;&#123;')
                    .replace(/\}\}/g, '&#125;&#125;');
            }
            if (Array.isArray(obj) === true) {
                let handler = this.#__escapeTemplateVariableStrings.bind(this);
                return obj.map(function(item) {
                    return handler(item);
                });
            }
            if (typeof obj === 'object') {
                const result = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) === true) {
                        result[key] = this.#__escapeTemplateVariableStrings(obj[key]);
                    }
                }
                return result;
            }
            return obj;
        }

        /**
         * #__fetch
         * 
         * @access  private
         * @param   String url
         * @param   Object options
         * @return  Promise
         */
        #__fetch(url, options) {
            let successful = this.#__handleSuccessfulRequest.bind(this),
                failed = this.#__handleFailedRequest.bind(this),
                promise = window.fetch(url, options).then(successful).catch(failed);
            return promise;
        }

        /**
         * #__getAuth
         * 
         * @access  private
         * @return  Object
         */
        #__getAuth() {
            let auth = {
                hostname: this.getHelper('config').get('cluster.hostname'),
                protocol: 'https',
                apiKey: this.getHelper('config').get('cluster.apiKey'),
                collectionName: this.getHelper('config').get('cluster.collectionName'),
                presetName: this.getHelper('config').get('cluster.presetName')
            };
            return auth;
        }

        /**
         * #__getBaseURL
         * 
         * @access  private
         * @return  String
         */
        #__getBaseURL() {
            let auth = this.#__getAuth(),
                baseURL = (auth.protocol) + '://' + (auth.hostname);
            return baseURL;
        }

        /**
         * #__getFetchHeaders
         * 
         * @access  private
         * @return  Object
         */
        #__getFetchHeaders() {
            let auth = this.#__getAuth(),
                headers = {
                    'X-TYPESENSE-API-KEY': auth.apiKey,
                    'Content-Type': 'application/json'
                };
            return headers;
        }

        /**
         * #__getFetchOptions
         * 
         * @access  private
         * @return  Object
         */
        #__getFetchOptions() {
            let controller = new AbortController(),
                headers = this.#__getFetchHeaders(),
                options = {
                    method: 'GET',
                    signal: controller.signal,
                    headers: headers
                };
            this.#__abortController = controller;
            return options;
        }

        /**
         * #__getSearchParams
         * 
         * @access  private
         * @param   String query
         * @return  Object
         */
        #__getSearchParams() {
            let searchOptions = this.getSearchOptions(),
                params = new URLSearchParams(searchOptions);
// console.log(__encodingExemptFields);
            for (const [key, value] of params.entries()) {
                // if (key === 'highlight_full_fields') {
                //     console.log('yep', key, value);
                //     // params.set(key, value.replaceAll('%2C', ','));
                // }
                if (!value) {
                    params.delete(key);
                }
            }
            return params;
        }

        /**
         * #__getSearchURL
         * 
         * @access  private
         * @return  String
         */
        #__getSearchURL() {
            let baseURL = this.#__getBaseURL(),
                auth = this.#__getAuth(),
                params = this.#__getSearchParams(),
                searchParams = new URLSearchParams(params).toString(),
                searchURL = (baseURL) + '/collections/' + (auth.collectionName) + '/documents/search?' + (searchParams);
// searchURL = searchURL.replaceAll('%2C', ',');
// console.log(searchParams);
            return searchURL;
        }

        /**
         * #__handleFailedRequest
         * 
         * @access  private
         * @param   Object error
         * @return  window.annexSearch.TypesenseSearchRequest
         */
        #__handleFailedRequest(error) {
// console.log(error);
            let key = error.name,
                message = error.message;
            this.setError(key, message);
            return this;
        }

        /**
         * #__handleSuccessfulRequestJSONDecoding
         * 
         * @throws  Error
         * @access  private
         * @param   Object json
         * @return  Promise
         */
        #__handleSuccessfulRequestJSONDecoding(json) {
            json = this.#__escapeTemplateVariableStrings(json);
            this.#__response = json;
            let message = json?.message;
            if (message !== undefined) {
                let key = 'typesenseSearchRequestResponse';
                this.setError(key, message);
                throw new Error();
            }
            if (json.ok === false) {
                alert('hmmm');
            }
            this.#__processMutator();
// console.log(json);
            // this.#__response = json;
            return this;
        }

        /**
         * #__handleSuccessfulRequest
         * 
         * @access  private
         * @param   Response response
         * @return  Promise
         */
        #__handleSuccessfulRequest(response) {
            let handler = this.#__handleSuccessfulRequestJSONDecoding.bind(this),
                promise = response.json().then(handler);
            return promise;
        }

        /**
         * #__processMutator
         * 
         * @access  private
         * @return  Boolean
         */
        #__processMutator() {
            let $annexSearchWidget = this.getWebComponent(),
                mutator = $annexSearchWidget.getMutator('typesenseSearchResponse') || null;
            if (mutator === null) {
                return false;
            }
            mutator && mutator.apply($annexSearchWidget, [this]);
            return true;
        }

        /**
         * abort
         * 
         * @access  public
         * @return  Boolean
         */
        abort() {
            if (this.#__aborted === true) {
                return false;
            }
            this.#__aborted = true;
            let key = 'abort',
                message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.abort');
            this.setError(key, message);
            this.#__abortController.abort();
            return true;
        }

        /**
         * fetch
         * 
         * @access  public
         * @return  Promise
         */
        fetch() {
            let url = this.#__getSearchURL(),
                options = this.#__getFetchOptions(),
                promise = this.#__fetch(url, options);
            // this.abort();
            return promise;
        }

        /**
         * getError
         * 
         * @access  public
         * @return  null|Object
         */
        getError() {
            let error = this.#__error;
            return error;
        }

        /**
         * getOptions
         * 
         * @access  public
         * @return  Object
         */
        getOptions() {
            let options = this.#__options;
            return options;
        }

        /**
         * getQuery
         * 
         * @access  public
         * @return  String
         */
        getQuery() {
            let query = this.#__query;
            return query;
        }

        /**
         * getResponse
         * 
         * @access  public
         * @return  null|Object
         */
        getResponse() {
            let response = this.#__response;
            return response;
        }

        /**
         * getSearchOptions
         * 
         * @access  public
         * @return  Object
         */
        getSearchOptions() {
            let auth = this.#__getAuth(),
                options = Object.assign({}, this.#__options);
            options.preset = auth.presetName || null;
            for (let key in options) {
                if (options[key] === null) {
                    delete options[key];
                }
            }
            return options;
        }

        /**
         * logFailedEvent
         * 
         * @access  public
         * @return  Boolean
         */
        logFailedEvent() {

            // Typesense failure message
            let message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.general');
            this.error(message);

            // Response received, but request not processed
            let error = this.getError(),
                key = error.key;
            if (key === 'typesenseSearchRequestResponse') {

                // Response from Typesense
                let message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.responseReceived', error.message);
                this.error(message);

                // Possible $query_by incorrect
                if (message.includes('Could not find a field named') === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.responseReceived.fieldTip');
                    this.error(message);
                    return true;
                }

                // Possible $apiKey or $collectionName incorrect
                if (message.includes('Forbidden - a valid `x-typesense-api-key` header must be sent.') === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.responseReceived.forbiddenTip');
                    this.error(message);
                    return true;
                }

                // Possible $query_by incorrect
                if (message.includes('No search fields specified') === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.responseReceived.queryTip');
                    this.error(message);
                    return true;
                }

                // Done
                return true;
            }

            // Unknown error (e.g. fetch failed)
            message = window.annexSearch.ErrorUtils.getMessage('typesenseSearchRequest.failed.unknown', error.message);
            this.error(message);

            // Possible tip to help with debugging
            if (message.includes('Failed to fetch') === true) {
                message = window.annexSearch.ErrorUtils.getMessage('loggingUtils.fetchFailed.tip');
                this.error(message);
                return true;
            }

            // Done
            return true;
        }

        /**
         * setError
         * 
         * @access  public
         * @param   String key
         * @param   String message
         * @return  Boolean
         */
        setError(key, message) {
            if (this.#__error !== null) {
                return false;
            }
            this.#__error = {};
            this.#__error.key = key;
            this.#__error.message = message;
            return true;
        }

        /**
         * setOptions
         * 
         * @access  public
         * @param   Object options
         * @return  Boolean
         */
        setOptions(options) {
            this.#__options = Object.assign(
                {},
                this.#__options,
                this.getHelper('config').get('searchOptions'),
                options,
            );
            return true;
        }

        /**
         * setQuery
         * 
         * @access  public
         * @param   String query
         * @return  Boolean
         */
        setQuery(query) {
            this.#__query = query;
            this.#__options.q = query;
// console.log(this, this.getHelper);//, this.getHelper('typesense'));
// console.log(this);
            this.#__options.highlight_end_tag = this.getHelper('typesense').getHighlightEndTag();
            this.#__options.highlight_start_tag = this.getHelper('typesense').getHighlightStartTag();
            return true;
        }
    }
});

/**
 * /src/js/utils/Base.js
 * 
 */
window.annexSearch.DependencyLoader.push([], function() {

    /**
     * window.annexSearch.BaseUtils
     * 
     * @access  public
     */
    window.annexSearch.BaseUtils = window.annexSearch.BaseUtils || class BaseUtils {

        /**
         * #__setup
         * 
         * @access  private
         * @static
         * @var     Boolean (default: false)
         */
        static #__setup = false;

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            if (document === null) {
                return false;
            }
            if (document === undefined) {
                return false;
            }
            if (document.readyState === 'complete') {
                return true;
            }
            if (document.readyState === 'interactive') {
                return true;
            }
            return false
        }
    }
});

/**
 * /src/js/utils/Client.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.ClientUtils
     * 
     * @access  public
     */
    window.annexSearch.ClientUtils = window.annexSearch.ClientUtils || class ClientUtils extends window.annexSearch.BaseUtils {

        /**
         * copyToClipboard
         * 
         * @see     https://chatgpt.com/c/6899376c-1860-832a-8a04-1e8135f98a00
         * @see     https://chatgpt.com/c/689cd2f3-acf8-8326-883a-601ac7ad320b
         * @access  public
         * @static
         * @param   String str
         * @return  Promise
         */
        static copyToClipboard(str) {
            let promise = window.navigator.clipboard.writeText(str).catch(function() {
                let message = window.annexSearch.ErrorUtils.getMessage('clientUtils.copyToClipboard.failed');
                this.error(message);
            });
            return promise;
        }

        /**
         * isMac
         *
         * @access  public
         * @static
         * @return  Boolean
         */
        static isMac() {
            let mac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            return mac;
        }

        /**
         * isTouchDevice
         *
         * @see     https://chatgpt.com/c/68a00e40-f680-8330-92bc-978befdd0db6
         * @see     https://chatgpt.com/c/68a3d3e5-12fc-8320-9ed8-94cc0262429e
         * @access  public
         * @static
         * @return  Boolean
         */
        static isTouchDevice() {
            let touchDevice = (('ontouchstart' in window)
                || (navigator.maxTouchPoints > 0)
                || (navigator.msMaxTouchPoints > 0));
            return touchDevice;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Data.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.DataUtils
     * 
     * @access  public
     */
    window.annexSearch.DataUtils = window.annexSearch.DataUtils || class DataUtils extends window.annexSearch.BaseUtils {

        /**
         * deepMerge
         * 
         * @see     https://chatgpt.com/c/689bb7c4-cd40-8332-a1bd-a585ad5eef06
         * @access  public
         * @static
         * @param   Object target
         * @param   Object source
         * @param   Function onReplace
         * @return  Object
         */
        static deepMerge(target, source, onReplace) {
            function isPlainObject(value) {
                return Object.prototype.toString.call(value) === "[object Object]";
            }
            function arraysEqualShallow(a, b) {
                if (!Array.isArray(a) || a.length !== b.length) return false;
                for (let i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) return false;
                }
                return true;
            }
            function _merge(t, s, path) {
                path = path || [];
                if (!isPlainObject(s)) return t;

                for (let key in s) {
                    if (!Object.prototype.hasOwnProperty.call(s, key)) continue;
                    let sVal = s[key];
                    if (typeof sVal === "undefined") continue;

                    let nextPath = path.concat(key);
                    let tHas = Object.prototype.hasOwnProperty.call(t, key);
                    let tVal = t[key];

                    if (Array.isArray(sVal)) {
                        if (!tHas || !arraysEqualShallow(tVal, sVal)) {
                            if (tHas) onReplace && onReplace(nextPath, tVal, sVal);
                            t[key] = sVal.slice();
                        }
                        continue;
                    }
                    if (isPlainObject(sVal)) {
                        if (!isPlainObject(tVal)) {
                            if (tHas) onReplace && onReplace(nextPath, tVal, sVal);
                            t[key] = {};
                        }
                        _merge(t[key], sVal, nextPath);
                        continue;
                    }
                    if (!tHas || tVal !== sVal) {
                        if (tHas) onReplace && onReplace(nextPath, tVal, sVal);
                        t[key] = sVal;
                    }
                }
                return t;
            }
            return _merge(target, source);
        }

        /**
         * findKeyInsensitiveValue
         * 
         * @see     https://claude.ai/chat/99737548-7130-4c08-8eee-7fc6e6c9a801
         * @access  public
         * @static
         * @return  null|String
         */
        static findKeyInsensitiveValue(obj, targetKey) {
            let keys = Object.keys(obj),
                foundKey = keys.find(function(key) {
                    return key.toLowerCase() === targetKey.toLowerCase();
                }),
                value = foundKey ? obj[foundKey] : null;
            return value;
        }

        /**
         * removeDuplicateObjects
         * 
         * @see     https://chatgpt.com/c/68a9057e-e3e8-8325-abb7-d7ca140cdeec
         * @access  public
         * @static
         * @param   Array arr
         * @return  Boolean
         */
        static removeDuplicateObjects(arr) {
            let unique = Array.from(new Set(arr));
            arr.length = 0;
            arr.push.apply(arr, unique);
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Element.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.ElementUtils
     * 
     * @see     https://claude.ai/chat/617b9369-2714-47bf-9992-60f43718d2c5
     * @see     https://github.com/advisories/GHSA-35jh-r3h4-6jhm
     * @see     https://www.npmjs.com/package/lodash.template
     * @see     https://socket.dev/npm/package/eta
     * @access  public
     */
    window.annexSearch.ElementUtils = window.annexSearch.ElementUtils || class ElementUtils extends window.annexSearch.BaseUtils {

        /**
         * #__templateOptions
         * 
         * @see     https://claude.ai/chat/617b9369-2714-47bf-9992-60f43718d2c5
         * @note    A number of the below properties appear to be the Lodash
         *          defaults.
         * @access  private
         * @var     Object
         */
        static #__templateOptions = {

            /**
             * escape
             * 
             * Add support for escaped interpolation <%- %>
             * 
             * @access  private
             * @var     RegExp
             */
            escape: /<%-([\s\S]+?)%>/g,

            /**
             * evaluate
             * 
             * Keep the default evaluate syntax for <% %>
             * 
             * @access  private
             * @var     RegExp
             */
            evaluate: /<%([\s\S]+?)%>/g,

            /**
             * interpolate
             * 
             * Keep the default interpolate syntax for <%= %>
             * 
             * @access  private
             * @var     RegExp
             */
            interpolate: /<%=([\s\S]+?)%>/g,

            /**
             * variable
             * 
             * Add custom interpolation for {{ }}
             * 
             * @access  private
             * @var     String (default: 'data')
             */
            variable: 'data'
        };

        /**
         * #__getCompilerData
         * 
         * @access  private
         * @static
         * @param   window.annexSearch.BaseView view
         * @return  Object
         */
        static #__getCompilerData(view) {
            let data = Object.assign({}, view.get());
            data.config = view.getHelper('config').get();
            return data;
        }

        /**
         * #__getConfigTemplateKey
         * 
         * @access  private
         * @static
         * @param   window.annexSearch.BaseView view
         * @return  String
         */
        static #__getConfigTemplateKey(view) {
            let key = view.constructor.name;
            key = key.replace(/View$/, '');
            key = key.charAt(0).toLowerCase() + key.slice(1);
            return key;
        }

        /**
         * #__getProcessedMarkup
         * 
         * @access  private
         * @static
         * @param   window.annexSearch.BaseView view
         * @param   null|Function mutator
         * @return  String
         */
        static #__getProcessedMarkup(view, mutator) {
            mutator = mutator || window.annexSearch.FunctionUtils.getPassThrough();
            let markup = this.#__getTemplateMarkup(view),
                compiled = window.annexSearch.libs._.template(
                    this.#__replaceMarkupVariables(markup),
                    this.#__templateOptions
                ),
                data = this.#__getCompilerData(view),
                response = compiled.apply(view, [data]),
                $mutated = mutator(response);
            return $mutated;
        }

        /**
         * #__getTemplateMarkup
         * 
         * @see     https://chatgpt.com/c/68990349-0238-832f-bf0f-3bf14d1a7377
         * @access  private
         * @static
         * @param   window.annexSearch.BaseView view
         * @param   null|Function mutator (default: null)
         * @return  null|String
         */
        static #__getTemplateMarkup(view, mutator = null) {
            let $annexSearchWidget = view.getWebComponent(),
                key = this.#__getConfigTemplateKey(view),
                markup = $annexSearchWidget.getHelper('config').get('templates')[key]
                    || window.annexSearch.TemplateUtils.getTemplate('auto-v0.1.0', key)
                    || view.getMarkup();
            if (typeof markup === 'function') {
                let data = this.#__getCompilerData(view);
                markup = markup.apply(view, [data]);
            }
            markup = markup || view.getMarkup();
            return markup;
        }

        /**
         * #__getVisibleElementsByTag
         * 
         * @see     https://chatgpt.com/c/68a61095-5688-8326-adac-5ab8e7f0fb08
         * @access  private
         * @static
         * @param   String tagName
         * @param   Boolean fullyVisible (default: true)
         * @return  Array
         */
        static #__getVisibleElementsByTag(tagName, fullyVisible = true) {
            let $elements = document.getElementsByTagName(tagName),
                $visible = [];
            for (let $element of $elements) {
                if (fullyVisible === true && this.fullyVisible($element) === false) {
                    continue;
                }
                if (fullyVisible === false && this.partiallyVisible($element) === false) {
                    continue;
                }
                $visible.push($element);
            }
            return $visible;
        }

        /**
         * #__replaceMarkupVariables
         * 
         * @note    Ordered
         * @access  private
         * @static
         * @param   String markup
         * @return  String
         */
        static #__replaceMarkupVariables(markup) {
            let response = markup;
            response = response.replace(/\{\{\{([\s\S]+?)\}\}\}/g, '<%- $1 %>');
            response = response.replace(/\{\{([\s\S]+?)\}\}/g, '<%= $1 %>');
            return response;
        }

        /**
         * focus
         * 
         * @access  public
         * @static
         * @param   mixed $eventTarget
         * @return  Promise
         */
        static focus($eventTarget) {
            if ($eventTarget === null) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            if ($eventTarget === undefined) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            if (window.annexSearch.ElementUtils.partiallyVisible($eventTarget) === false) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            if (window.annexSearch.ClientUtils.isTouchDevice() === true) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            let promise = window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $eventTarget.focus({
                    preventScroll: true
                });
                return true;
            });
            return promise;
        }

        /**
         * fullyVisible
         *
         * @see     https://chatgpt.com/c/689f96f3-20fc-8332-b530-e8693299801b
         * @access  public
         * @static
         * @param   EventTarget $eventTarget
         * @return  Boolean
         */
        static fullyVisible($eventTarget) {
            let rect = $eventTarget.getBoundingClientRect(),
                fullyVisible = (
                    rect.top >= 0
                    && rect.right <= window.innerWidth
                    && rect.bottom <= window.innerHeight
                    && rect.left >= 0
                );
            return fullyVisible;
        }

        /**
         * getVisibleWebComponents
         * 
         * @access  public
         * @static
         * @param   Boolean fullyVisible (default: true)
         * @return  Array
         */
        static getVisibleWebComponents(fullyVisible = true) {
            let tagName = 'annex-search-widget',
                $webComponents = this.#__getVisibleElementsByTag(tagName, fullyVisible),
                $visible = [];
            for (let $webComponent of $webComponents) {
                if ($webComponent.showing() === false) {
                    continue;
                }
                if ($webComponent.disabled() === true) {
                    continue;
                }
                $visible.push($webComponent);
            }
            return $visible;
        }

        /**
         * partiallyVisible
         *
         * @see     https://chatgpt.com/c/689f96f3-20fc-8332-b530-e8693299801b
         * @access  public
         * @static
         * @param   EventTarget $eventTarget
         * @return  Boolean
         */
        static partiallyVisible($eventTarget) {
            let rect = $eventTarget.getBoundingClientRect(),
                visible = (
                    rect.top < window.innerHeight
                    && rect.right > 0
                    && rect.bottom > 0
                    && rect.left < window.innerWidth
                );
            return visible;
        }

        /**
         * renderViewElement
         * 
         * @see     https://chatgpt.com/c/689a37b9-9910-8321-8138-5db0e4cbdff2
         * @see     https://chatgpt.com/c/689a5071-f5b0-8321-9bb7-ae06e22a473d
         * @see     https://claude.ai/chat/617b9369-2714-47bf-9992-60f43718d2c5
         * @access  public
         * @static
         * @param   window.annexSearch.BaseView view
         * @param   null|Function mutator (default: null)
         * @return  EventTarget
         */
        static renderViewElement(view, mutator = null) {
            let markup = this.#__getProcessedMarkup(view, mutator),
                parser = new DOMParser(),
                $document = parser.parseFromString(markup, 'text/html'),
                $element = $document.body.firstElementChild;
            $element.uuid = window.annexSearch.StringUtils.generateUUID();
            return $element;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }

        /**
         * waitForAnimation
         *
         * @see     https://chatgpt.com/c/682a39f4-d464-800f-bd7c-9793d2bf0349
         * @access  public
         * @static
         * @return  Promise
         */
        static waitForAnimation() {
            let promise = new Promise(function(resolve, reject) {
                window.requestAnimationFrame(function() {
                    window.requestAnimationFrame(function() {
                        resolve();
                    });
                });
            });
            return promise;
        }
    }
});

/**
 * /src/js/utils/Error.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.ErrorUtils
     * 
     * @access  public
     */
    window.annexSearch.ErrorUtils = window.annexSearch.ErrorUtils || class ErrorUtils extends window.annexSearch.BaseUtils {

        /**
         * #__messageMap
         * 
         * @access  private
         * @static
         * @var     Object
         */
        static #__messageMap = {
            'clientUtils.copyToClipboard.failed':                               'Could not copy string to clipboard.',
            'fieldHeaderView.loadMore.limitReached':                            'Possible infinite loop during search query fetching. Check your result view template is visible.',
            'annexSearchWidget.container.null':                                 'Inline web components must have a $container defined before mounting.',
            'annexSearchWidget.keyboardShortcut.reserved':                      'Keyboard shortcut {%0} already reserved. Setting to {null}.',
            // 'annexSearchWidget.container.notNull':                              'Web components that have a layout value not equal to \'inline\' should not have a $container defined before mounting.',
            'base.get.key.invalid':                                             'Invalid {key} value passed to {base.get}; found {%0}',
            'base.set.key.undefined':                                           'Invalid {key} value passed to {base.set}; found {undefined}',
            'base.set.value.undefined':                                         'Invalid {value} value passed to {base.set}; found {undefined}',
            'interactionUtils.disabled':                                        'Interaction not valid while $annexSearchWidget is disabled.',

            'interactionUtils.zeroRegistered':                                  'No registered $annexSearchWidget elements found',
            'interactionUtils.unknownId':                                       'Interaction attempt references an unknown $annexSearchWidget id.',
            'interactionUtils.multipleRegistered':                              'Multiple registered $annexSearchWidget elements found. Unable to determine which $annexSearchWidget is the target without a leader "id:" attribute value.',
            'loggingUtils.fetchFailed.tip':                                     'Tip: Double check that {config.cluster.hostname} is defined and correct.',
            'stylesheets.failedLoading':                                        'Could not load stylesheets.',
                'typesenseSearchRequest.abort':                                     'Abort method called against {window.annexSearch.TypesenseSearchRequest}',
            'typesenseHelper.options.q.empty':                                  'Invalid {q} value; found {empty string}',
            'typesenseHelper.options.q.null':                                   'Invalid {q} value; found {null}',
            'typesenseHelper.options.q.undefined':                              'Invalid {q} value; found {undefined}',
            'typesenseHelper.searchOptions.query_by.null':                      'Invalid {config.searchOptions.query_by} value; found {null}. Either {config.searchOptions.query_by} or {config.cluster.presetName} needs to be defined.',
            'typesenseHelper.searchOptions.query_by.undefined':                 'Invalid {config.searchOptions.query_by} value; found {undefined}. Either {config.searchOptions.query_by} or {config.cluster.presetName} needs to be defined.',
            'typesenseSearchRequest.failed.general':                            'Could not complete Typesense search request.',
            'typesenseSearchRequest.failed.responseReceived':                   'Typesense response: %0',
            'typesenseSearchRequest.failed.responseReceived.fieldTip':          'Tip: Double check that {config.searchOptions.query_by} is referencing valid collection fields.',
            'typesenseSearchRequest.failed.responseReceived.forbiddenTip':      'Tip: Double check that {config.cluster.apiKey} and {config.cluster.collectionName} are defined and correct.',
            'typesenseSearchRequest.failed.responseReceived.queryTip':          'Tip: Double check that, if defined, both {config.cluster.presetName} and/or {config.searchOptions.query_by} are correct.',
            'typesenseSearchRequest.failed.unknown':                            'Error: %0',
        };

        /**
         * getMessage
         * 
         * @see     https://chatgpt.com/c/6894309d-6e08-832f-885d-45699f8f4ee9
         * @access  public
         * @static
         * @param   String key
         * @param   ... args
         * @return  null|String
         */
        static getMessage(key, ...args) {
            let message = this.#__messageMap[key];
            if (message === undefined) {
                return null;
            }
            for (let i = 0; i < args.length; i++) {
                message = message.replace(new RegExp(`%${i}`, 'g'), args[i]);
            }
            return message;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Function.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.FunctionUtils
     * 
     * @access  public
     */
    window.annexSearch.FunctionUtils = window.annexSearch.FunctionUtils || class FunctionUtils extends window.annexSearch.BaseUtils {

        /**
         * #__callHistory
         * 
         * @access  private
         * @static
         * @var     Map
         */
        static #__callHistory = new Map();

        /**
         * debounce
         * 
         * @see     https://chatgpt.com/c/674ebab2-ff0c-800f-a44b-74e72f9e99f8
         * @access  public
         * @static
         * @param   Function func
         * @param   Number delay
         * @return  Function
         */
        static debounce(func, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(this, args);
                }, delay);
            };
        }

        /**
         * getEmptyPromise
         * 
         * @access  public
         * @static
         * @param   ... args
         * @return  Promise
         */
        static getEmptyPromise(...args) {
            let promise = new Promise(function(resolve, reject) {
                resolve.apply(window, args);
            });
            return promise;
        }

        /**
         * getPassThrough
         * 
         * @access  public
         * @static
         * @param   mixed value
         * @return  Function
         */
        static getPassThrough() {
            let fn = function(value) {
                return value;
            };
            return fn;
        }

        /**
         * limitReached
         * 
         * @see     https://claude.ai/chat/40050455-7300-4a08-bae1-7c0fe3347885
         * @access  public
         * @static
         * @param   Function fn
         * @param   Number maxCalls
         * @param   Number milliseconds
         * @return  Boolean
         */
        static limitReached(fn, maxCalls, milliseconds) {
            let now = Date.now();
            if (this.#__callHistory.has(fn) === false) {
                this.#__callHistory.set(fn, []);
            }
            let callTimes = this.#__callHistory.get(fn),
                cutoffTime = now - milliseconds;
            while (callTimes.length > 0 && callTimes[0] <= cutoffTime) {
                callTimes.shift();
            }
            if (callTimes.length >= maxCalls) {
                return true;
            }
            callTimes.push(now);
            return false;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Interaction.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.InteractionUtils
     * 
     * @access  public
     */
    window.annexSearch.InteractionUtils = window.annexSearch.InteractionUtils || class InteractionUtils extends window.annexSearch.BaseUtils {

        /**
         * #__controls
         * 
         * @access  private
         * @static
         * @var     Object
         */
        static #__controls = {

            /**
             * scrollFocus
             * 
             * Whether a scroll event on the document should attempt to focus
             * on an $annexSearchWidget.
             * 
             * It attempts to do this safely to prevent unintended behaviour.
             * This includes (not is not limited to):
             * - Not executing on touch devices
             * - Not executing when another valid $element has focus
             * - The $annexSearchWidget is visible within the viewport
             * - config.autoFocusOnScroll is set to true
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            scrollFocus: true,
        };

        /**
         * #__windowScrollDebounceDelay
         * 
         * @access  private
         * @static
         * @var     Number (default: 40)
         */
        static #__windowScrollDebounceDelay = 40;

        /**
         * #__addDocumentClickEventListener
         * 
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__addDocumentClickEventListener() {
            let $element = (document.body || document.head || document.documentElement),
                handler = this.#__handleDocumentClickEvent.bind(this);
            $element.addEventListener('click', handler);
            return true;
        }

        /**
         * #__addWindowScrollClickEventListener
         * 
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__addWindowScrollClickEventListener() {
            let $eventTarget = window,
                handler = this.#__handleWindowScrollEvent.bind(this),
                delay = this.#__windowScrollDebounceDelay,
                debounced = window.annexSearch.FunctionUtils.debounce(handler, delay);
            ['touchmove', 'wheel'].forEach(function(type) {
                $eventTarget.addEventListener(type, debounced);
            });
            return true;
        }

        /**
         * #__getAttributeDefinedId
         * 
         * @access  private
         * @static
         * @param   String attributeValue
         * @return  null|String
         */
        static #__getAttributeDefinedId(attributeValue) {
            let pieces = attributeValue.split(':');
            if (pieces.length === 0) {
                return null;
            }
            if (pieces.length === 1) {
                return null;
            }
            let id = pieces[0];
            return id;
        }

        /**
         * #__getBehaviorInteractionKey
         * 
         * @access  private
         * @static
         * @param   String attributeValue
         * @return  String
         */
        static #__getBehaviorInteractionKey(attributeValue) {
            let pieces = attributeValue.split(':'),
                interactionKey = attributeValue;
            if (pieces.length === 0) {
                return interactionKey;
            }
            if (pieces.length === 1) {
                return interactionKey;
            }
            pieces.shift();
            interactionKey = pieces.join('');
            return interactionKey;
        }

        /**
         * #__getQueryValue
         * 
         * @access  private
         * @static
         * @param   String attributeValue
         * @return  String
         */
        static #__getQueryValue(attributeValue) {
            let pieces = attributeValue.split(':'),
                query = attributeValue;
            if (pieces.length === 0) {
                return query;
            }
            if (pieces.length === 1) {
                return query;
            }
            pieces.shift();
            query = pieces.join('');
            return query;
        }

        /**
         * #__getRegisteredById
         * 
         * @access  private
         * @static
         * @param   String str
         * @return  null|window.annexSearch.AnnexSearchWidgetWebComponent
         */
        static #__getRegisteredById(str) {
            let pieces = str.split(':');
            if (pieces.length === 0) {
                return null;
            }
            if (pieces.length === 1) {
                return null;
            }
            let id = pieces[0],
                $annexSearchWidget = window.annexSearch.AnnexSearch.getRegisteredById(id);
            return $annexSearchWidget;
        }

        /**
         * #__getValidEventTarget
         * 
         * @access  private
         * @static
         * @param   mixed $target
         * @param   Object event
         * @param   String attributeName
         * @return  null|HTMLElement
         */
        static #__getValidEventTarget($target, event, attributeName) {

            // Invalid $target
            // let $target = event.target || null;
            if ($target === null) {
                return null;
            }
            let selector = '[' + (attributeName) + ']';
            if ($target.matches(selector) === false) {
                return null;
            }
            if ($target.matches('annex-search-widget') === true) {
                return null;
            }

            // Valid target; prevent event
            event.preventDefault();

            // Nothing registered
            let $registered = window.annexSearch.AnnexSearch.getRegistered();
            if ($registered.length === 0) {
                let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.zeroRegistered');
                window.annexSearch.LoggingUtils.error(message);
                return null;
            }

            // Value checks (existence)
            let value = $target.getAttribute(attributeName);
            if (value === null) {
                return null;
            }
            if (value === undefined) {
                return null;
            }
            value = value.trim();
            if (value === '') {
                return null;
            }

            // No id defined
            let id = this.#__getAttributeDefinedId(value);
            if (id === null) {

                // Valid (since only one that could be the target)
                if ($registered.length === 1) {
                    return $target;
                }

                // Invalid
                let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.multipleRegistered');
                window.annexSearch.LoggingUtils.error(message);
                return null;
            }

            // Id defined; invalid
            let $annexSearchWidget = window.annexSearch.AnnexSearch.getRegisteredById(id);
            if ($annexSearchWidget === null) {
                let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.unknownId');
                window.annexSearch.LoggingUtils.error(message);
                return null;
            }

            // Valid
            return $target;
        }

        /**
         * #__handleBehaviorInteraction
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleBehaviorInteraction(event) {

            // Broadly invalid
            let $target = this.#__getValidEventTarget(event.target, event, 'data-annex-search')
                || this.#__getValidEventTarget(event.target.closest('[data-annex-search]'), event, 'data-annex-search');
            if ($target === null) {
                return false;
            }

            // Invalid layout (clear is always supported)
            let value = $target.getAttribute('data-annex-search'),
                $annexSearchWidget = this.#__getRegisteredById(value) || window.annexSearch.AnnexSearch.getRegistered()[0],
                interactionKey = this.#__getBehaviorInteractionKey(value);
            if ($annexSearchWidget.getConfig('layout') === 'inline') {
                if (interactionKey !== 'clear' && interactionKey !== 'disable' && interactionKey !== 'enable' && interactionKey !== 'focus') {
                    return false;
                }
            }

            // Unsupported interaction key
            let validBehaviorInteractions = ['clear', 'disable', 'enable', 'focus', 'hide', 'show', 'toggle'];
            if (validBehaviorInteractions.includes(interactionKey) === false) {
                return false;
            }

            // Processing
            if (interactionKey === 'clear') {
                if ($annexSearchWidget.disabled() === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.disabled');
                    window.annexSearch.LoggingUtils.error(message);
                    return false;
                }
                let response = $annexSearchWidget.clear();
                return response;
            }
            if (interactionKey === 'disable') {
                if ($annexSearchWidget.disabled() === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.disabled');
                    window.annexSearch.LoggingUtils.error(message);
                    return false;
                }
                let response = $annexSearchWidget.disable();
                return response;
            }
            if (interactionKey === 'enable') {
                let response = $annexSearchWidget.enable();
                return response;
            }
            if (interactionKey === 'focus') {
                if ($annexSearchWidget.disabled() === true) {
                    let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.disabled');
                    window.annexSearch.LoggingUtils.error(message);
                    return false;
                }
                let response = $annexSearchWidget.focus();
                return response;
            }
            if (interactionKey === 'hide') {
                let promise = $annexSearchWidget.hide();
                return true;
            }
            if (interactionKey === 'show') {
                let promise = $annexSearchWidget.show();
                return true;
            }
            if (interactionKey === 'toggle') {
                let promise = $annexSearchWidget.toggle();
                return true;
            }
            return false;
        }

        /**
         * #__handleBlurInteraction
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleBlurInteraction(event) {
            let $target = event.target;
            if ($target.constructor === window.annexSearch.AnnexSearchWidgetWebComponent) {
                return false;
            }
            window.annexSearch.AnnexSearch.setFocused(null);
            return false;
        }

        /**
         * #__handleDocumentClickEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentClickEvent(event) {
            if (this.#__handleBehaviorInteraction(event) === true) {
                return true;
            }
            if (this.#__handleBlurInteraction(event) === true) {
                return true;
            }
            if (this.#__handleQueryInteraction(event) === true) {
                return true;
            }
            return false;
        }

        /**
         * #__handleQueryInteraction
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleQueryInteraction(event) {

            // Broadly invalid
            let $target = this.#__getValidEventTarget(event.target, event, 'data-annex-search-query');
            if ($target === null) {
                return false;
            }

            // Invalid value
            let value = $target.getAttribute('data-annex-search-query'),
                $annexSearchWidget = this.#__getRegisteredById(value) || window.annexSearch.AnnexSearch.getRegistered()[0];
            if ($annexSearchWidget.disabled() === true) {
                let message = window.annexSearch.ErrorUtils.getMessage('interactionUtils.disabled');
                window.annexSearch.LoggingUtils.error(message);
                return false;
            }
            let query = this.#__getQueryValue(value);
            $annexSearchWidget.show();
            $annexSearchWidget.query(query);
            return true;
        }

        /**
         * #__handleWindowScrollEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleWindowScrollEvent(event) {
            if (window.annexSearch.ClientUtils.isTouchDevice() === true) {
                return false;
            }
            if (this.#__controls.scrollFocus === false) {
                return false;
            }
            let $activeElement = document.activeElement || null,
                handler = function() {
                    let fullyVisible = false,
                        $visible = window.annexSearch.ElementUtils.getVisibleWebComponents(fullyVisible);
                    if ($visible.length === 0) {
                        return false;
                    }
                    let $focused = window.annexSearch.AnnexSearch.getFocused();
                    if ($focused !== null && $focused.getConfig('layout') === 'modal' && $focused.showing() === true) {
                        return false;
                    }
                    if ($focused !== null && $focused.getConfig('layout') === 'panel-left' && $focused.showing() === true) {
                        return false;
                    }
                    if ($focused !== null && $focused.getConfig('layout') === 'panel-right' && $focused.showing() === true) {
                        return false;
                    }
                    let $annexSearchWidget = $visible[0];
                    if ($annexSearchWidget.getConfig('autoFocusOnScroll') === false) {
                        return false;
                    }
                    if ($annexSearchWidget.getConfig('layout') === 'inline') {
                        $annexSearchWidget.focus();
                        return true;
                    }
                    return false;
                };
            if ($activeElement === null) {
                let response = handler();
                return response;
            }
            if ($activeElement.matches('button, input, select, textarea') === true) {
                return false;
            }
            let response = handler();
            return response;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            let response = super.setup();
            if (response === true) {
                this.#__addDocumentClickEventListener();
                this.#__addWindowScrollClickEventListener();
                return true;
            }
            let handler = window.annexSearch.InteractionUtils.setup.bind(window.annexSearch.InteractionUtils);
            document.addEventListener('DOMContentLoaded', handler);
            return true;
        }
    }
});

/**
 * /src/js/utils/KeyboardShortcut.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.KeyboardShortcutUtils
     * 
     * @access  public
     */
    window.annexSearch.KeyboardShortcutUtils = window.annexSearch.KeyboardShortcutUtils || class KeyboardShortcutUtils extends window.annexSearch.BaseUtils {

        /**
         * #__controls
         * 
         * @access  private
         * @static
         * @var     Object
         */
        static #__controls = {

            /**
             * documentCatchAll
             * 
             * Whether any keyboard keydown event against the document should be
             * "caught" and processed as if it was entered into the $input
             * field.
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentCatchAll: true,

            /**
             * documentDelete
             * 
             * Whether the delete key should be caught and processed as the user
             * wanting to delete the last entered character.
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentDelete: true,

            /**
             * documentPaste
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentPaste: true,

            /**
             * documentEscape
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentEscape: true,

            /**
             * documentKeyboardNavigation
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentKeyboardNavigation: true,

            /**
             * documentKeyboardShortcut
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentKeyboardShortcut: true,

            /**
             * documentSelectAll
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentSelectAll: true,

            /**
             * documentSlash
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            documentSlash: true,

            /**
             * fieldEnter
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            fieldEnter: true,

            /**
             * fieldEscape
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            fieldEscape: true,

            /**
             * resultCopy
             * 
             * Keyboard detection for the Command+c / Ctrl+c keyboard
             * combination, which when detected, will dispatch an event for the
             * corresponding ResultFoundResultsBodyView.
             * 
             * @static
             * @access  private
             * @var     Boolean (default: true)
             */
            resultCopy: true,
        };

        /**
         * #__addDocumentPasteEventListener
         * 
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__addDocumentPasteEventListener() {
            let $element = document,
                handler = this.#__handleDocumentPasteEvent.bind(this);
            $element.addEventListener('paste', handler);
            return true;
        }

        /**
         * #__addKeydownEventListener
         * 
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__addKeydownEventListener() {
            let $element = document,
                handler = this.#__handleKeydownEvent.bind(this);
            $element.addEventListener('keydown', handler);
            return true;
        }

        /**
         * #__getFocusedWebComponent
         * 
         * @access  private
         * @static
         * @return  null|window.annexSearch.AnnexSearchWidgetWebComponent
         */
        static #__getFocusedWebComponent() {
            let $focusedWebComponent = window.annexSearch.AnnexSearch.getFocused();
            return $focusedWebComponent;
        }

        /**
         * #__getField
         * 
         * @access  private
         * @static
         * @return  window.annexSearch.BaseView
         */
        static #__getField() {
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                field = $annexSearchWidget.getView('root').getView('header.field');
            return field;
        }

        /**
         * #__getFound
         * 
         * @access  private
         * @static
         * @return  window.annexSearch.BaseView
         */
        static #__getFound() {
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                found = $annexSearchWidget.getView('root').getView('body.results.found');
            return found;
        }

        /**
         * #__getRegisteredWebComponents
         * 
         * @access  private
         * @static
         * @return  Array
         */
        static #__getRegisteredWebComponents() {
            let $registered = window.annexSearch.AnnexSearch.getRegistered();
            return $registered;
        }

        /**
         * #__handleDocumentCatchAllKeydownEvent
         * 
         * @note    The key length check is to handle things like the "Meta" key
         *          etc.
         * @see     https://chatgpt.com/c/688abab5-f678-8330-9aff-e43c24768100
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentCatchAllKeydownEvent(event) {
            if (this.#__controls.documentCatchAll === false) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent();
            if ($annexSearchWidget === null) {
                return false;
            }
            if ($annexSearchWidget.disabled() === true) {
                return false;
            }
            if ($annexSearchWidget.showing() === false) {
                return false;
            }
            if (event.metaKey === true) {
                return false;
            }
            if (event.ctrlKey === true) {
                return false;
            }
            let key = event.key;
            if (key.length > 1) {
                return false;
            }
            if (key === ' ') {
                return false;
            }
            let $activeElement = $annexSearchWidget.shadow.activeElement,
                field = this.#__getField(),
                found = this.#__getFound(),
                handler = function() {
                    field.focus();
                    field.clear();
                    field.nullifyLastTypesenseSearchResponse();
                    field.append(key);
                    found.smoothScrollToTop();
                    found.resetFocusedIndex();
                    field.first('input').dispatchEvent(new Event('input', {
                        bubbles: true,
                        shiftKey: event.shiftKey
                    }));
                };
            if ($activeElement === null) {
                let response = handler();
                return response;
            }
            if ($activeElement.matches('input') === true) {
                return false;
            }
            let response = handler();
            return response;
        }

        /**
         * #__handleDocumentCopyKeydownEvent
         * 
         * @see     https://chatgpt.com/c/68993510-aa98-832b-bdd6-2356a4452616
         * @note    shiftKey check is to prevent impeding web inspector
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentCopyKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'resultCopy', 'c') === false) {
                return false;
            }
            if (this.#__isModifierCombo(event) === false) {
                return false;
            }
            if (event.shiftKey === true) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                $activeElement = $annexSearchWidget.shadow.activeElement;
            if ($activeElement === null) {
                return false;
            }
            let found = this.#__getFound(),
                results = found.getResults();
            for (let result of results) {
                if (result.getElement() === $activeElement) {
                    result.dispatchCopyEvent(event);
                    return true;
                }
            }
            return false;
        }

        /**
         * #__handleDocumentDeleteKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentDeleteKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'documentDelete', 'backspace') === false) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                $activeElement = $annexSearchWidget.shadow.activeElement,
                field = this.#__getField(),
                found = this.#__getFound(),
                handler = function() {
                    field.focus();
                    field.decrement();
                    field.nullifyLastTypesenseSearchResponse();
                    found.smoothScrollToTop();
                    found.resetFocusedIndex();
                    field.first('input').dispatchEvent(new Event('input', {
                        bubbles: true
                    }));
                };
            if ($activeElement === null) {
                let response = handler();
                return response;
            }
            if ($activeElement.matches('input') === true) {
                return false;
            }
            let response = handler();
            return response;
        }

        /**
         * #__handleDocumentEscapeKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentEscapeKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'documentEscape', 'escape') === false) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent();
            if ($annexSearchWidget.disabled() === true) {
                $annexSearchWidget.hide();
                return true;
            }
            let $activeElement = $annexSearchWidget.shadow.activeElement;
            if ($activeElement === null) {
                let field = this.#__getField();
                field.focus();
                return true;
            }
            if ($activeElement.matches('input') === true) {
                return false;
            }
            let field = this.#__getField();
            field.focus();
            return true;
        }

        /**
         * #__handleDocumentKeyboardNavigationKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentKeyboardNavigationKeydownEvent(event) {
            let validKeys = ['tab', 'arrowdown', 'arrowup'];
            if (this.#__validKeydownEvent(event, 'documentKeyboardNavigation', validKeys) === false) {
                return false;
            }
            if (this.#__isModifierCombo() === true) {
                return false;
            }
            let key = event.key.toLowerCase();
            event.preventDefault();
            let direction = 'previous';
            if (key === 'arrowdown') {
                direction = 'next';
            }
            if (key === 'tab') {
                if (event.shiftKey === false) {
                    direction = 'next';
                }
            }
            let found = this.#__getFound();
            if (direction === 'next') {
                found.next();
                return true;
            }
            // found.previous() || this.#__getFocusedWebComponent().getView('root').focus();
            // found.previous() || this.#__getFocusedWebComponent().focus();
            found.previous() || this.#__getFocusedWebComponent().getView('root').getView('root.header.field').focus();
            return true;
        }

        /**
         * #__handleDocumentKeyboardShortcutKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentKeyboardShortcutKeydownEvent(event) {
            if (this.#__controls.documentKeyboardShortcut === false) {
                return false;
            }
            if (event.shiftKey === true) {// Might need to smarter if/when key-case-sensitivity is considered
                return false;
            }
            let $registered = this.#__getRegisteredWebComponents();
            for (let $annexSearchWidget of $registered) {
                let keyboardShortcut = $annexSearchWidget.getHelper('config').get('keyboardShortcut');
                if (keyboardShortcut === null) {
                    continue
                }
                if (keyboardShortcut === undefined) {
                    continue
                }
                keyboardShortcut = keyboardShortcut.trim().toLowerCase();
                if (keyboardShortcut.charAt(0) !== '⌘') {
                    continue
                }
                if (this.#__isModifierCombo(event) === false) {
                    continue;
                }
                let key = event.key.toLowerCase(),
                    character = keyboardShortcut.charAt(1);
                if (key !== character) {
                    continue;
                }
                if ($annexSearchWidget.mounted() === false) {
                    continue;
                }
                event.preventDefault();
                if ($annexSearchWidget.getConfig('layout') === 'inline') {
                    if ($annexSearchWidget.focused() === true) {
                        $annexSearchWidget.blur();
                        return true;
                    }
                    $annexSearchWidget.focus();
                    return true;
                }
                if ($annexSearchWidget.showing() === false) {
                    $annexSearchWidget.toggle();
                    return true;
                }
                if ($annexSearchWidget.focused() === true) {
                    $annexSearchWidget.toggle();
                    return true;
                }
                $annexSearchWidget.focus();
                return true;
            }
            return false;
        }

        /**
         * #__handleDocumentPasteEvent
         * 
         * @see     https://chatgpt.com/c/688abab5-f678-8330-9aff-e43c24768100
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentPasteEvent(event) {
            if (this.#__getRegisteredWebComponents().length === 0) {
                return false;
            }
            if (this.#__getFocusedWebComponent() === null) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent();
            if ($annexSearchWidget.disabled() === true) {
                return false;
            }
            if ($annexSearchWidget.showing() === false) {
                return false;
            }
            let controlKey = 'documentPaste';
            if (this.#__controls[controlKey] === false) {
                return false;
            }
            let pastedText = event.clipboardData.getData('text');
            if (pastedText.length === 0) {
                return false;
            }
            pastedText = pastedText.trim();
            if (pastedText.length === 0) {
                return false;
            }
            let $activeElement = $annexSearchWidget.shadow.activeElement,
                field = this.#__getField(),
                found = this.#__getFound(),
                handler = function() {
                    field.focus();
                    field.clear();
                    field.nullifyLastTypesenseSearchResponse();
                    field.append(pastedText);
                    found.smoothScrollToTop();
                    found.resetFocusedIndex();
                    field.first('input').dispatchEvent(new Event('input', {
                        bubbles: true,
                    }));
                };
            if ($activeElement === null) {
                let response = handler();
                return response;
            }
            if ($activeElement.matches('input') === true) {
                return false;
            }
            let response = handler();
            return response;
        }

        /**
         * #__handleDocumentSelectAllKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentSelectAllKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'documentSelectAll', 'a') === false) {
                return false;
            }
            if (this.#__isModifierCombo(event) === false) {
                return false;
            }
            event.preventDefault();
            let field = this.#__getField();
            field.focus();
            field.select();
            return true;
        }

        /**
         * #__handleDocumentSlashKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleDocumentSlashKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'documentSlash', '/') === false) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                $activeElement = $annexSearchWidget.shadow.activeElement,
                field = this.#__getField();
            if ($activeElement === null) {
                field.focus();
                return true;
            }
            if ($activeElement.matches('input') === true) {
                return false;
            }
            field.focus();
            return true;
        }

        /**
         * #__handleFieldEnterKeydownEvent
         * 
         * @see     https://chatgpt.com/c/68a3d3e5-12fc-8320-9ed8-94cc0262429e
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleFieldEnterKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'fieldEnter', 'enter') === false) {
                return false;
            }
            if (window.annexSearch.ClientUtils.isTouchDevice() === true) {// Hide keyboard..
                // event.preventDefault();
                document.activeElement && document.activeElement.blur()
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                $activeElement = $annexSearchWidget.shadow.activeElement;
            if ($activeElement === null) {
                return false;
            }
            if ($activeElement.matches('input') === true) {
                let found = this.#__getFound(),
                    focusedIndex = found.getFocusedIndex();
                if (focusedIndex === null) {
                    let results = found.getResults(),
                        result = results[0];
                    if (result === undefined) {
                        return false;
                    }
                    event.stopPropagation();
                    result.focus();
                    result.simulateClick(event);
                    return true;
                }
                return false;
            }
            return false;
        }

        /**
         * #__handleFieldEscapeKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleFieldEscapeKeydownEvent(event) {
            if (this.#__validKeydownEvent(event, 'fieldEscape', 'escape') === false) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent(),
                $activeElement = $annexSearchWidget.shadow.activeElement;
            if ($activeElement === null) {
                return false;
            }
            if ($activeElement.matches('input') === true) {
                event.preventDefault();
                event.stopPropagation();
                let value = $activeElement.value.trim(),
                    found = this.#__getFound();
                if (value === '') {
                    $annexSearchWidget.hide();
                    return true;
                }
                let field = this.#__getField();
                field.clear();
                $annexSearchWidget.getHelper('webComponentUI').setQueryAttribute();
                field.nullifyLastTypesenseSearchResponse();
                found.clearResults();
                found.getView('root').setStateKey('idle');
                $annexSearchWidget.getHelper('config').triggerCallback('results.idle');
                $annexSearchWidget.dispatchCustomEvent('results.idle');
                return true;
            }
            return false;
        }

        /**
         * #__handleKeydownEvent
         * 
         * @note    Ordered
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__handleKeydownEvent(event) {
            if (this.#__getRegisteredWebComponents().length === 0) {
                return false;
            }
            if (this.#__handleDocumentCopyKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentKeyboardShortcutKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentKeyboardNavigationKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentEscapeKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleFieldEscapeKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleFieldEnterKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentSlashKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentSelectAllKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentDeleteKeydownEvent(event) === true) {
                return true;
            }
            if (this.#__handleDocumentCatchAllKeydownEvent(event) === true) {
                return true;
            }
            return true;
        }

        /**
         * #__isModifierCombo
         * 
         * @access  private
         * @static
         * @param   Object event
         * @return  Boolean
         */
        static #__isModifierCombo() {
            let mac = window.annexSearch.ClientUtils.isMac();
            if (mac === true) {
                if (event.metaKey === true) {
                    return true;
                }
                return false;
            }
            if (event.ctrlKey === true) {
                return true;
            }
            return false;
        }

        /**
         * #__validKeydownEvent
         * 
         * @access  private
         * @static
         * @param   Object event
         * @param   String controlKey
         * @param   String|Array validKeys
         * @return  Boolean
         */
        static #__validKeydownEvent(event, controlKey, validKeys) {
            if (this.#__getRegisteredWebComponents().length === 0) {
                return false;
            }
            let $annexSearchWidget = this.#__getFocusedWebComponent();
            if ($annexSearchWidget === null) {
                return false;
            }
            if ($annexSearchWidget === undefined) {
                return false;
            }
            if ($annexSearchWidget.disabled() === true) {
                return false;
            }
            if ($annexSearchWidget.showing() === false) {
                return false;
            }
            if (this.#__controls[controlKey] === false) {
                return false;
            }
            validKeys = [].concat(validKeys);
            let key = event.key.toLowerCase();
            if (validKeys.includes(key) === false) {
                return false;
            }
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            let response = super.setup();
            if (response === true) {
                this.#__addDocumentPasteEventListener();
                this.#__addKeydownEventListener();
                return true;
            }
            let handler = window.annexSearch.KeyboardShortcutUtils.setup.bind(window.annexSearch.KeyboardShortcutUtils);
            document.addEventListener('DOMContentLoaded', handler);
            return true;
        }
    }
});

/**
 * /src/js/utils/Logging.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.LoggingUtils
     * 
     * @access  public
     */
    window.annexSearch.LoggingUtils = window.annexSearch.LoggingUtils || class LoggingUtils extends window.annexSearch.BaseUtils {

        /**
         * #__labels
         * 
         * @access  private
         * @static
         * @var     String (default: 'Annex Search')
         */
        static #__labels = {
            error: 'Annex Search',
        };

        /**
         * error
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static error() {
            let message = '%c[' + (this.#__labels.error) + ']',
                styles = 'color: red; font-weight: bold; font-family: monospace;',
                args = Array.from(arguments);
            args.unshift(styles);
            args.unshift(message);
            window.console && window.console.log && window.console.log.apply(window, args);
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/String.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.StringUtils
     * 
     * @access  public
     */
    window.annexSearch.StringUtils = window.annexSearch.StringUtils || class StringUtils extends window.annexSearch.BaseUtils {

        /**
         * generateUUID
         * 
         * @see     https://chatgpt.com/c/689421e4-c708-8328-b5df-95b6028facf2
         * @access  public
         * @static
         * @return  String
         */
        static generateUUID() {
            let uuid = '', i, random;
            for (i = 0; i < 36; i++) {
                if (i === 8 || i === 13 || i === 18 || i === 23) {
                    uuid += '-';
                } else if (i === 14) {
                    uuid += '4';
                } else if (i === 19) {
                    random = Math.random() * 16 | 0;
                    uuid += (random & 0x3 | 0x8).toString(16);
                } else {
                    random = Math.random() * 16 | 0;
                    uuid += random.toString(16);
                }
            }
            return uuid;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }

        /**
         * validURL
         * 
         * @note    RegExp can't be in the template due to Lodash engine issues
         * @see     https://claude.ai/chat/3ef05620-90bd-4176-a7af-f0012ab44106
         * @access  public
         * @static
         * @param   String url
         * @return  Boolean
         */
        static validURL(str) {
            let valid = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(str);
            return valid;
        }
    }
});

/**
 * /src/js/utils/Template.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.TemplateUtils
     * 
     * @access  public
     */
    window.annexSearch.TemplateUtils = window.annexSearch.TemplateUtils || class TemplateUtils extends window.annexSearch.BaseUtils {

        /**
         * #__markup
         * 
         * @access  private
         * @static
         * @var     Object
         */
        static #__markup = {

            /**
             * auto-v0.1.0
             * 
             * @access  private
             * @static
             * @var     Object
             */
            'auto-v0.1.0': {
                templates: {
                    resultFoundResultsBody: this.#__getAutoSchemaKeyMarkup()
                }
            },

            /**
             * sku-v0.1.0
             * 
             * @access  private
             * @static
             * @var     Object
             */
            'sku-v0.1.0': {
                templates: {
                    resultFoundResultsBody: `
                        <div data-view-name="ResultFoundResultsBodyView" part="result" class="clearfix">
                            <%
                                let imageUrl = data.hit.document.imageUrl || '',
                                    validImage = window.annexSearch.StringUtils.validURL(imageUrl);
                                if (validImage === true) {
                            %>
                                <div class="image" part="result-image">
                                    <img src="<%- (imageUrl) %>" part="result-image-img" />
                                </div>
                            <%
                                }
                            %>
                            <div class="content" part="result-content">
                                <div class="title" part="result-content-title">{{{data?.hit?.highlight?.name?.snippet || data?.hit?.document?.name || '(unknown name)'}}}</div>
                                <div class="body" part="result-content-body">{{{data?.hit?.highlight?.description?.snippet || data?.hit?.document?.description || '(unknown description)'}}}</div>
                                <div class="price badge" part="result-content-price">\${{{data?.hit?.document?.price.toLocaleString() || '(unknown price)'}}}</div>
                            </div>
                        </div>`
                }
            },

            /**
             * webResource-v0.1.0
             * 
             * @access  private
             * @static
             * @var     Object
             */
            'webResource-v0.1.0': {
                templates: {
                    resultFoundResultsBody: `
                        <a data-view-name="ResultFoundResultsBodyView" href="{{data.hit.document.uri}}" part="result" class="clearfix">
                            <%
                                let imageUrl = data.hit.document.imageUrl || '',
                                    validImage = window.annexSearch.StringUtils.validURL(imageUrl);
                                if (validImage === true) {
                            %>
                                <div class="image" part="result-content-image">
                                    <img src="<%- (imageUrl) %>" part="result-content-image-img" />
                                </div>
                            <%
                                }
                            %>
                            <div class="content" part="result-content">
                                <div class="title" part="result-content-title">{{{data?.hit?.highlight?.title?.snippet || data?.hit?.document?.title || '(unknown title)'}}}</div>
                                <div class="body" part="result-content-body">{{{data?.hit?.highlight?.body?.snippet || data?.hit?.document?.body || '(unknown body)'}}}</div>
                                <div class="uri truncate" part="result-content-uri">{{data.hit.document.uri}}</div>
                            </div>
                        </a>`
                }
            }
        };

        /**
         * #__getAutoSchemaKeyMarkup
         * 
         * @see     https://chatgpt.com/c/689e966b-6b58-832d-a312-14e72ca1df28
         * @access  private
         * @static
         * @return  Function
         */
        static #__getAutoSchemaKeyMarkup() {
            return function(data) {
                let hit = data.hit,
                    imageURLKeys = [
                        'asset',
                        'assetUrl',
                        'assetUrl',

                        'image_path',
                        'imagePath',
                        'img_path',
                        'imgPath',

                        'image',
                        'imageUri',
                        'imageUrl',

                        'img',
                        'imgUri',
                        'imgUrl',

                        'openGraph',
                        'openGraphUri',
                        'openGraphUrl',

                        'openGraphThumb',
                        'openGraphThumbUri',
                        'openGraphThumbUrl',

                        'openGraphImage',
                        'openGraphImageUri',
                        'openGraphImageUrl',

                        'photo',
                        'photoUri',
                        'photoUrl',

                        'picture',
                        'pictureUri',
                        'pictureUrl',

                        'thumb',
                        'thumbUri',
                        'thumbUrl',

                        'thumbnail',
                        'thumbnailUri',
                        'thumbnailUrl',
                    ],
                    titleKeys = [
                        'articleTitle',
                        'caption',
                        'contentTitle',
                        'displayName',
                        'documentTitle',
                        'header',
                        'heading',
                        'headline',
                        'label',
                        'listingTitle',
                        'metaTitle',
                        'name',
                        'nameText',
                        'pageTitle',
                        'shortTitle',
                        'subject',
                        'term',
                        'title',
                        'titleText',
                    ],
                    bodyKeys = [
                        'article',
                        'articleBody',
                        'body',
                        'content',
                        'description',
                        'details',
                        'excerpt',
                        'mainText',
                        'message',
                        'note',
                        'paragraph',
                        'post',
                        'snippet',
                        'story',
                        'summary',
                        'text',
                    ],
                    uriKeys = [
                        'canonical',
                        'canonicalUri',
                        'canonicalUrl',

                        'endpoint',
                        'endpointUri',
                        'endpointUrl',

                        'fullUri',
                        'fullUrl',

                        'href',

                        'link',
                        'linkUri',
                        'linkUrl',

                        'pageUri',
                        'pageUrl',

                        'permalink',
                        'permalinkUri',
                        'permalinkUrl',

                        'redirectUri',
                        'redirectUrl',

                        'sourceUri',
                        'sourceUrl',

                        'targetUri',
                        'targetUrl',
                        
                        'uri',
                        'url',
                    ],
                    imageUrl,
                    title,
                    body,
                    uri;
                for (let key of imageURLKeys) {
                    imageUrl = imageUrl
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.highlight, key)?.snippet
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.document, key)
                        || null;
                }
                for (let key of titleKeys) {
                    title = title
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.highlight, key)?.snippet
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.document, key)
                        || null;
                }
                for (let key of bodyKeys) {
                    body = body
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.highlight, key)?.snippet
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.document, key)
                        || null;
                }
                for (let key of uriKeys) {
                    uri = uri
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.highlight, key)?.snippet
                        || window.annexSearch.DataUtils.findKeyInsensitiveValue(data?.hit?.document, key)
                        || null;
                }
                return `
                <%
                    let validUri = window.annexSearch.StringUtils.validURL('` + (uri) + `');
                    if (validUri === true) {
                %>
                    <a data-view-name="ResultFoundResultsBodyView" class="clearfix" part="result" href="` + (uri) + `">
                <% } else { %>
                    <div data-view-name="ResultFoundResultsBodyView" class="clearfix" part="result">
                <% } %>
                    <%
                        let validImage = window.annexSearch.StringUtils.validURL('` + (imageUrl) + `');
                        if (validImage === true) {
                    %>
                        <div class="image" part="result-image">
                            <img src="` + (imageUrl) + `" part="result-image-img" />
                        </div>
                    <% } %>
                    <div class="content" part="result-content">
                        <div class="title" part="result-content-title">` + (title || '(no title found)') + `</div>
                        <div class="body" part="result-content-body">` + (body || '(no body found)') + `</div>
                        <%
                            if (validUri === true) {
                                // let uri = 
                                // uri = uri.replace(/^https?:\/\//, '');
                                // replace(/^https?:\/\/(www\.)?/, '');
                        %>
                            <div class="uri truncate" part="result-content-uri">` + (uri) + `</div>
                        <% } %>
                    </div>
                <% if (validUri === true) { %>
                    </a>
                <% } else { %>
                    </div>
                <% } %>`;
            };
        }

        /**
         * getTemplate
         * 
         * @access  public
         * @static
         * @param   String templateSetKey
         * @param   String viewKey
         * @return  null|String
         */
        static getTemplate(templateSetKey, viewKey) {
            let template = this.#__markup[templateSetKey]?.templates?.[viewKey] || null;
            return template;
        }

        /**
         * getTemplates
         * 
         * @access  public
         * @static
         * @param   String templateSetKey
         * @param   Object templates (default: {})
         * @return  Object
         */
        static getTemplates(templateSetKey, templates = {}) {
            window.annexSearch.DataUtils.deepMerge(
                templates,
                this.#__markup[templateSetKey]?.templates || {}
            );
            return templates;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Timer.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.TimerUtils
     * 
     * @access  public
     */
    window.annexSearch.TimerUtils = window.annexSearch.TimerUtils || class TimerUtils extends window.annexSearch.BaseUtils {

        /**
         * #__timers
         * 
         * @access  private
         * @static
         * @var     Array (default: [])
         */
        static #__timers = [];

        /**
         * build
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @param   Object options
         * @return  window.annexSearch.TimerView
         */
        static build($annexSearchWidget, options) {
            let seconds = options.seconds,
                view = new window.annexSearch.TimerView($annexSearchWidget, seconds),
                $container = $annexSearchWidget.shadow.querySelector('div.content');
            this.#__timers.push(view);
            view.mount($container);
            return view;
        }

        /**
         * remove
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.TimerView timer
         * @return  Boolean
         */
        static remove(timer) {
            let index = this.#__timers.indexOf(timer);
            if (index === -1) {
                return false;
            }
            this.#__timers.splice(index, 1);
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Toast.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.ToastUtils
     * 
     * @access  public
     */
    window.annexSearch.ToastUtils = window.annexSearch.ToastUtils || class ToastUtils extends window.annexSearch.BaseUtils {

        /**
         * #__duration
         * 
         * @access  private
         * @static
         * @var     Number (default: 5000)
         */
        static #__duration = 5000;

        /**
         * #__toasts
         * 
         * @access  private
         * @static
         * @var     Array (default: [])
         */
        static #__toasts = [];

        /**
         * build
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @param   Object options
         * @return  window.annexSearch.ToastView
         */
        static build($annexSearchWidget, options) {
            let title = options.title,
                message = options.message,
                view = new window.annexSearch.ToastView($annexSearchWidget, title, message),
                $container = $annexSearchWidget.shadow.querySelector('div.content');
            this.#__toasts.push(view);
            view.mount($container);
            return view;
        }

        /**
         * get
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Array
         */
        static get($annexSearchWidget) {
            let toasts = [];
            for (let toast of this.#__toasts) {
                if (toast.getWebComponent() === $annexSearchWidget) {
                    toasts.push(toast);
                }
            }
            return toasts;
        }

        /**
         * getDuration
         * 
         * @access  public
         * @static
         * @return  Number
         */
        static getDuration() {
            let duration = this.#__duration;
            return duration;
        }

        /**
         * hideAll
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  Boolean
         */
        static hideAll($annexSearchWidget) {
            let toasts = this.get($annexSearchWidget);
            for (let toast of toasts) {
                toast.hide();
            }
            return true;
        }

        /**
         * remove
         * 
         * @access  public
         * @static
         * @param   window.annexSearch.ToastView toast
         * @return  Boolean
         */
        static remove(toast) {
            let index = this.#__toasts.indexOf(toast);
            if (index === -1) {
                return false;
            }
            this.#__toasts.splice(index, 1);
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            return true;
        }
    }
});

/**
 * /src/js/utils/Vendor.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseUtils'], function() {

    /**
     * window.annexSearch.VendorUtils
     * 
     * @access  public
     */
    window.annexSearch.VendorUtils = window.annexSearch.VendorUtils || class VendorUtils extends window.annexSearch.BaseUtils {

        /**
         * #__setupLodash
         * 
         * @access  private
         * @static
         * @return  Boolean
         */
        static #__setupLodash() {
            let lodash = _.noConflict();
            window.annexSearch.libs = window.annexSearch.libs || {};
            window.annexSearch.libs._ = lodash;
            return true;
        }

        /**
         * setup
         * 
         * @access  public
         * @static
         * @return  Boolean
         */
        static setup() {
            this.#__setupLodash();
            return true;
        }
    }
});

/**
 * /src/js/views/Base.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.Base'], function() {

    /**
     * window.annexSearch.BaseView
     * 
     * @access  public
     * @extends window.annexSearch.Base
     */
    window.annexSearch.BaseView = window.annexSearch.BaseView || class BaseView extends window.annexSearch.Base {

        /**
         * _$element
         * 
         * @access  protected
         * @var     null|EventTarget (default: null)
         */
        _$element = null;

        /**
         * _data
         * 
         * @access  protected
         * @var     Object
         */
        _data = {
            views: {}
        };

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @return  void
         */
        constructor($annexSearchWidget) {
            super($annexSearchWidget);
            this._$element = document.createElement('template');
            this._$element.view = this;
        }

        /**
         * click
         * 
         * @access  public
         * @param   Function handler
         * @return  Boolean
         */
        click(handler) {
            this.event('click', handler);
            return true;
        }

        /**
         * event
         * 
         * @access  public
         * @param   String type
         * @param   Function handler
         * @param   Boolean once (default: false)
         * @return  Boolean
         */
        event(type, handler, once = false) {
            this._$element.addEventListener(type, handler, {
                once: once
            });
            return true;
        }

        /**
         * find
         * 
         * @access  public
         * @param   String selector
         * @return  Array
         */
        find(selector) {
            let $element = this._$element,
                nodeList = $element.querySelectorAll(selector),
                $elements = Array.from(nodeList);
            return $elements;
        }

        /**
         * first
         * 
         * @access  public
         * @param   String selector
         * @return  null|EventTarget
         */
        first(selector) {
            let $element = this._$element,
                $found = $element.querySelector(selector);
            return $found;
        }

        /**
         * getElement
         * 
         * @access  public
         * @return  EventTarget
         */
        getElement() {
            let $element = this._$element;
            return $element;
        }

        /**
         * getMarkup
         * 
         * @access  public
         * @return  String
         */
        getMarkup() {
            let markup = this._markup;
            return markup;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            this.render();
            let $element = this._$element;
            $container.appendChild($element);
            return true;
        }

        /**
         * once
         * 
         * @access  public
         * @param   String type
         * @param   Function handler
         * @return  Boolean
         */
        once(type, handler) {
            this.event(type, handler, true);
            return true;
        }

        /**
         * removeAttribute
         * 
         * @access  public
         * @param   String key
         * @return  Boolean
         */
        removeAttribute(key) {
            this._$element.removeAttribute(key);
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @parma   null|Function mutator (default: null)
         * @return  Boolean
         */
        render(mutator = null) {
            let $element = window.annexSearch.ElementUtils.renderViewElement(this, mutator);
            $element.view = this;
            this._$element.replaceWith($element);
            this._$element = $element;
            return true;
        }

        /**
         * setAttribute
         * 
         * @access  public
         * @param   String key
         * @param   String value
         * @return  Boolean
         */
        setAttribute(key, value) {
            this._$element.setAttribute(key, value);
            return true;
        }

        /**
         * setView
         * 
         * @access  public
         * @param   String key
         * @param   window.annexSearch.BaseView view
         * @return  Boolean
         */
        setView(key, view) {
            let views = this.get('views') || {};
            views[key] = view;
            this.set('views', views);
            return true;
        }
    }
});

/**
 * /src/js/views/body/Body.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.BodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.BodyView = window.annexSearch.BodyView || class BodyView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="BodyView" part="body">
</div>`;

        /**
         * #__mountError
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountError() {
            let view = new window.annexSearch.ErrorBodyView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('error', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountIdle
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountIdle() {
            let view = new window.annexSearch.IdleBodyView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('idle', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountResults
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountResults() {
            let view = new window.annexSearch.ResultsBodyView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('results', view);
            view.mount($container);
            return true;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            super.mount($container);
            this.#__mountError();
            this.#__mountIdle();
            this.#__mountResults();
            return true;
        }
    }
});

/**
 * /src/js/views/body/Error.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.ErrorBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.ErrorBodyView = window.annexSearch.ErrorBodyView || class ErrorBodyView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="ErrorBodyView" part="error">
    <%
        let message = data?.config?.copy?.error?.message ?? 'Something went wrong...';
        message = message.trim();
    %>
    <div class="content" part="error-content">
        <div class="graphic" part="error-content-graphic"></div>
        <div class="message" part="error-content-message"><%= (message) %></div>
    </div>
</div>`;
    }
});

/**
 * /src/js/views/body/Idle.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.IdleBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.IdleBodyView = window.annexSearch.IdleBodyView || class IdleBodyView extends window.annexSearch.BaseView {

        /**
         * #__chips
         * 
         * @access  private
         * @var     Array (default: [])
         */
        #__chips = [];

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="IdleBodyView" part="idle">
    <%
        let message = data?.config?.copy?.idle?.message ?? 'Start typing to begin your search...';
        message = message.trim();
    %>
    <div class="chips">
        <div class="label"><%- (data?.config?.copy?.idle?.chips) %></div>
        <div class="list clearfix"></div>
    </div>
    <div class="content" part="idle-content">
        <div class="graphic" part="idle-content-graphic"></div>
        <div class="message" part="idle-content-message"><%- (message) %></div>
    </div>
</div>`;

        /**
         * #__mountChip
         * 
         * @note    Ordered
         * @access  private
         * @param   Object chip
         * @return  Boolean
         */
        #__mountChip(chip) {
            let view = new window.annexSearch.ChipView(this._$annexSearchWidget),
                $container = this.first('.chips .list');
            view.set('chip', chip);
            this.#__chips.push(view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountChips
         * 
         * @access  protected
         * @return  Boolean
         */
        #__mountChips() {
            let chips = this.getHelper('config').get('chips.idle') || [];
            if (chips.length === 0) {
                this.first('.chips').remove();
                return false;
            }
            for (var chip of chips) {
                this.#__mountChip(chip);
            }
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__mountChips();
            return true;
        }
    }
});

/**
 * /src/js/views/body/results/Empty.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.EmptyResultsBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.EmptyResultsBodyView = window.annexSearch.EmptyResultsBodyView || class EmptyResultsBodyView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="EmptyResultsBodyView" part="empty">
    <%
        let message = data?.config?.copy?.empty?.message ?? 'Something went wrong...';
        message = message.trim();
    %>
    <div class="content" part="empty-content">
        <div class="graphic" part="empty-content-graphic"></div>
        <div class="message" part="empty-content-message"><%- (message) %></div>
    </div>
</div>`;
    }
});

/**
 * /src/js/views/body/results/Found.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.FoundResultsBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.FoundResultsBodyView = window.annexSearch.FoundResultsBodyView || class FoundResultsBodyView extends window.annexSearch.BaseView {

        /**
         * #__focusedIndex
         * 
         * @access  private
         * @var     null|Number (default: null)
         */
        #__focusedIndex = null;

        /**
         * #__results
         * 
         * @access  private
         * @var     Array (default: [])
         */
        #__results = [];

        /**
         * #__scrollDebounceDelay
         * 
         * @access  private
         * @var     Number (default: 60)
         */
        #__scrollDebounceDelay = 60;

        /**
         * #__scrollRatio
         * 
         * @access  private
         * @var     Number (default: 0.65)
         */
        #__scrollRatio = 0.65;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="FoundResultsBodyView" part="found">
</div>`;

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addScrollEventListener();
            return true;
        }

        /**
         * #__addScrollEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addScrollEventListener() {
            let handler = this.#__handleScrollEvent.bind(this),
                scrollDebounceDelay = this.#__scrollDebounceDelay,
                debounced = window.annexSearch.FunctionUtils.debounce(handler, scrollDebounceDelay);
            this.event('scroll', handler)
            return true;
        }

        /**
         * #__handleScrollEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleScrollEvent(event) {
            let scrollPosition = this._$element.scrollTop + this._$element.clientHeight,
                threshold = this._$element.scrollHeight * this.#__scrollRatio;
            if (scrollPosition < threshold) {
                return false;
            }
            this.getView('root.header.field').loadMore();
            return true;
        }

        /**
         * #__mountResult
         * 
         * @note    Ordered
         * @access  private
         * @param   Object hit
         * @return  Boolean
         */
        #__mountResult(hit) {
            let view = new window.annexSearch.ResultFoundResultsBodyView(this._$annexSearchWidget),
                $container = this._$element;
            view.set('hit', hit);
            this.#__results.push(view);
            view.mount($container);
            return true;
        }

        /**
         * clearFocused
         * 
         * @access  public
         * @return  Boolean
         */
        clearFocused() {
            let $focused = this.find('.focused');
            for (let $result of $focused) {
                $result.classList.remove('focused');
            }
            return true;
        }

        /**
         * clearResults
         * 
         * @access  public
         * @return  Boolean
         */
        clearResults() {
            this.#__results = [];
            while (this._$element.firstChild) {
                this._$element.removeChild(this._$element.firstChild);
            }
            this.scrollToTop();
            return true;
        }

        /**
         * containsScrollbar
         * 
         * @see     https://chatgpt.com/c/6897db9a-a3c8-8327-a22d-e1db1187c914
         * @access  public
         * @return  Boolean
         */
        containsScrollbar() {
            let $element = this._$element,
                response = $element.scrollHeight > $element.clientHeight;
            return response;
        }

        /**
         * mountResults
         * 
         * @access  public
         * @param   Object typesenseResponse
         * @return  Boolean
         */
        mountResults(typesenseResponse) {
            let hits = typesenseResponse.hits || [];
            if (hits.length === 0) {
                return false;
            }
            for (var hit of hits) {
                this.#__mountResult(hit);
            }
            return true;
        }

        /**
         * getFocusedIndex
         * 
         * @access  public
         * @return  null|Number
         */
        getFocusedIndex() {
            let focusedIndex = this.#__focusedIndex;
            return focusedIndex;
        }

        /**
         * getResults
         * 
         * @access  public
         * @return  Array
         */
        getResults() {
            let results = this.#__results;
            return results;
        }

        /**
         * next
         * 
         * @access  public
         * @return  Boolean
         */
        next() {
            if (this.#__results.length === 0) {
                return false;
            }
            if (this.#__focusedIndex === null) {
                this.#__focusedIndex = 0;
                let result = this.#__results[this.#__focusedIndex];
                result.focus();
                return true;
            }
            if (this.#__focusedIndex === (this.#__results.length - 1)) {
                return false;
            }
            ++this.#__focusedIndex;
            let result = this.#__results[this.#__focusedIndex];
            result.focus();
            return true;
        }

        /**
         * previous
         * 
         * @access  public
         * @return  Boolean
         */
        previous() {
            if (this.#__results.length === 0) {
                return false;
            }
            if (this.#__focusedIndex === null) {
                return false;
            }
            if (this.#__focusedIndex === 0) {
                this.#__focusedIndex = null;
                return false;
            }
            --this.#__focusedIndex;
            let result = this.#__results[this.#__focusedIndex];
            result.focus();
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__addEvents();
            return true;
        }

        /**
         * resetFocusedIndex
         * 
         * @access  public
         * @return  Boolean
         */
        resetFocusedIndex() {
            let response = this.setFocusedIndex(null);
            return response;
        }

        /**
         * scrollToTop
         * 
         * @access  public
         * @return  Boolean
         */
        scrollToTop() {
            let $element = this._$element;
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $element.scrollTop = 0;
            });
            return true;
        }

        /**
         * setFocusedIndex
         * 
         * @access  public
         * @param   null|Number focusedIndex
         * @return  Boolean
         */
        setFocusedIndex(focusedIndex) {
            this.#__focusedIndex = focusedIndex;
            return true;
        }

        /**
         * setFocusedIndexByResultView
         * 
         * @access  public
         * @param   window.annexSearch.ResultFoundResultsBodyView result
         * @return  Boolean
         */
        setFocusedIndexByResultView(result) {
            let index = this.#__results.indexOf(result);
            this.setFocusedIndex(index);
            return true;
        }

        /**
         * smoothScrollToTop
         * 
         * @access  public
         * @return  Boolean
         */
        smoothScrollToTop() {
            let $element = this._$element;
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $element.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            return true;
        }
    }
});

/**
 * /src/js/views/body/results/Result.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.ResultFoundResultsBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.ResultFoundResultsBodyView = window.annexSearch.ResultFoundResultsBodyView || class ResultFoundResultsBodyView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<a data-view-name="ResultFoundResultsBodyView" part="result">
    <div class="content" part="result-content">
        <div class="title" part="result-content-title">(no valid template defined)</div>
        <div class="body" part="result-content-body">(no valid template defined)</div>
        <div class="uri truncate" part="result-content-uri">(no valid template defined)</div>
    </div>
</a>`;

        /**
         * #__addClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClickEventListener() {
            let handler = this.#__handleClickEvent.bind(this);
            this.click(handler);
            return true;
        }

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClickEventListener();
            this.#__addFocusEventListener();
            this.#__addImageLoadEventListener();
            this.#__addKeydownEventListener();
            return true;
        }

        /**
         * #__addFocusEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addFocusEventListener() {
            let handler = this.#__handleFocusEvent.bind(this);
            this.event('focus', handler);
            return true;
        }

        /**
         * #__addImageLoadEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addImageLoadEventListener() {
            let $element = this.first('img');
            if ($element === null) {
                return false;
            }
            let handler = this.#__handleImageLoadEvent.bind(this);
            $element.addEventListener('load', handler);
            return true;
        }

        /**
         * #__addKeydownEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addKeydownEventListener() {
            if (this._$element.hasAttribute('href') === true) {
                return false;
            }
            let handler = this.#__handleKeydownEvent.bind(this);
            this.event('keydown', handler);
            return true;
        }

        /**
         * #__handleClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClickEvent(event) {
            let hit = this.get('hit'),
                $result = this._$element,
                detail = {$result, event, hit};
            this._$annexSearchWidget.getHelper('config').triggerCallback('result.click', detail);
            this._$annexSearchWidget.dispatchCustomEvent('result.click', detail);
            this.getView('root.body.results.found').setFocusedIndexByResultView(this);
            return true;
        }

        /**
         * #__handleFocusEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleFocusEvent(event) {
            let hit = this.get('hit'),
                $result = this._$element,
                detail = {$result, event, hit};
            this._$annexSearchWidget.getHelper('config').triggerCallback('result.focus', detail);
            this._$annexSearchWidget.dispatchCustomEvent('result.focus', detail);
            this.getView('root.body.results.found').setFocusedIndexByResultView(this);
            this.getView('root.body.results.found').clearFocused();
            this._$element.classList.add('focused');
            return true;
        }

        /**
         * #__handleImageLoadEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleImageLoadEvent(event) {
            let $element = this.first('img');
            $element.parentNode.classList.add('loaded');
            return true;
        }

        /**
         * #__handleKeydownEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleKeydownEvent(event) {
            let key = event.key;
            key = key.toLowerCase();
            if (key === 'enter') {
                this.simulateClick(event);
                return true;
            }
            return false;
        }

        /**
         * #__replaceHightlightTags
         * 
         * @access  private
         * @param   String markup
         * @return  String
         */
        #__replaceHightlightTags(markup) {
            markup = this.getHelper('typesense').replaceHightlightTags(markup);
            return markup;
        }

        /**
         * #__setIndexAttribute
         * 
         * @access  private
         * @return  Boolean
         */
        #__setIndexAttribute() {
            let found = this.getView('root.body.results.found'),
                results = found.getResults(),
                index = results.indexOf(this);
            this.setAttribute('data-index', index);
            return true;
        }

        /**
         * #__setTabindex
         * 
         * Neccessary method to account for the case where a custom template is
         * defined, and the custom template doesn't have an [href] attribute
         * applied.
         * 
         * @see     https://chatgpt.com/c/68990038-8970-8320-acb6-a2bef11bf487
         * @access  private
         * @return  Boolean
         */
        #__setTabindex() {
            if (this._$element.hasAttribute('href') === true) {
                return false;
            }
            this.setAttribute('tabindex', 0);
            return true;
        }

        /**
         * dispatchCopyEvent
         * 
         * @access  public
         * @param   Object event
         * @return  Boolean
         */
        dispatchCopyEvent(event) {
            let hit = this.get('hit'),
                $result = this._$element,
                detail = {$result, event, hit};
            this._$annexSearchWidget.getHelper('config').triggerCallback('result.copy', detail);
            this._$annexSearchWidget.dispatchCustomEvent('result.copy', detail);
            this.getView('root.body.results.found').setFocusedIndexByResultView(this);
            return true;
        }

        /**
         * focus
         * 
         * @see     https://chatgpt.com/c/689f9790-47b8-8324-8ae6-8ac464a5e0c5
         * @access  public
         * @return  Boolean
         */
        focus() {
            this._$element.focus();
            let $element = this._$element,
                $container = this.getView('root.body.results.found').getElement();
            $container.scrollTo({
                top: $element.offsetTop - $container.offsetTop - ($container.clientHeight / 2),
                behavior: 'smooth'
            });
            return true;
        }

        /**
         * render
         * 
         * @note    Ordered
         * @access  public
         * @return  Boolean
         */
        render() {
            let mutator = this.#__replaceHightlightTags.bind(this);
            super.render(mutator);
            this.#__setIndexAttribute();
            this.#__setTabindex();
            this.#__addEvents();
            return true;
        }

        /**
         * simulateClick
         * 
         * @access  public
         * @param   Object originEvent
         * @return  Boolean
         */
        simulateClick(originEvent) {
            let event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                shiftKey: originEvent.shiftKey,
                metaKey: originEvent.metaKey,
                ctrlKey: originEvent.ctrlKey
            });
            this._$element.dispatchEvent(event);
            return true;
        }
    }
});

/**
 * /src/js/views/body/results/Results.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.ResultsBodyView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.ResultsBodyView = window.annexSearch.ResultsBodyView || class ResultsBodyView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="ResultsBodyView" part="results">
</div>`;

        /**
         * #__mountEmpty
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountEmpty() {
            let view = new window.annexSearch.EmptyResultsBodyView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('empty', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountFound
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountFound() {
            let view = new window.annexSearch.FoundResultsBodyView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('found', view);
            view.mount($container);
            return true;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            super.mount($container);
            this.#__mountEmpty();
            this.#__mountFound();
            return true;
        }
    }
});

/**
 * /src/js/views/common/Chip.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.ChipView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.ChipView = window.annexSearch.ChipView || class ChipView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<a data-view-name="ChipView" href="#" part="chip">
    <span class="label" part-chip-label"><%= (data.chip.label) %></span>
</a>`;

        /**
         * #__addClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClickEventListener() {
            let handler = this.#__handleClickEvent.bind(this);
            this.click(handler);
            return true;
        }

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClickEventListener();
            return true;
        }

        /**
         * #__handleClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClickEvent(event) {
            event.preventDefault();
            let chip = this.get('chip'),
                query = chip.query,
                $annexSearchWidget = this._$annexSearchWidget;
            $annexSearchWidget.query(query);
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__addEvents();
            return true;
        }
    }
});

/**
 * /src/js/views/common/Timer.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.TimerView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.TimerView = window.annexSearch.TimerView || class TimerView extends window.annexSearch.BaseView {

        /**
         * #__interval
         * 
         * @access  private
         * @var     null|Number (default: null)
         */
        #__interval = null;

        /**
         * #__showing
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__showing = false;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="TimerView" part="timer">
    <div class="remaining" part="timer-remaining"><%= (data.remaining) %></div>
</div>`;

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @param   Number seconds
         * @return  void
         */
        constructor($annexSearchWidget, seconds) {
            super($annexSearchWidget);
            this.set('seconds', seconds);
            this.set('remaining', seconds);
            this.#__addCustomEventListener()
        }

        /**
         * #__addCustomEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addCustomEventListener() {
            let handler = this.render.bind(this);
            this.addCustomEventListener('data.set.remaining', handler);
            return true;
        }

        /**
         * #__destroy
         * 
         * @access  private
         * @return  Boolean
         */
        #__destroy() {
            this._$element.remove();
            window.annexSearch.TimerUtils.remove(this);
            return true;
        }

        /**
         * #__handleTickEvent
         * 
         * @access  private
         * @return  Boolean
         */
        #__handleTickEvent() {
            if (this.get('remaining') === 0) {
                this.hide();
                return true;
            }
            if (this.get('remaining') === 1) {
                this.dispatchCustomEvent('complete');
            }
            let remaining = this.get('remaining');
            remaining = remaining - 1;
            this.set('remaining', remaining);
            return true;
        }

        /**
         * #__setInterval
         * 
         * @access  private
         * @return  Boolean
         */
        #__setInterval() {
            let handler = this.#__handleTickEvent.bind(this),
                duration = 1000,
                reference = setInterval(handler, duration);
            this.#__interval = reference;
            return true;
        }

        /**
         * hide
         * 
         * @access  public
         * @return  Boolean
         */
        hide() {
            this.#__showing = false;
            this._$element.classList.remove('visible');
            clearTimeout(this.#__interval);
            var handler = this.#__destroy.bind(this);
            this.once('transitionend', handler);
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            if (this.#__showing === true) {
                this._$element.classList.add('visible');
            }
            return true;
        }

        /**
         * show
         * 
         * @access  public
         * @return  Promise
         */
        show() {
            if (this.#__showing === true) {
                return false;
            }
            this.#__showing = true;
            this.#__setInterval();
            let $element = this._$element;
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $element.classList.add('visible');
            });
            let that = this,
                promise = new Promise(function(resolve, reject) {
                    that.addCustomEventListener('complete', resolve, true);
                });
            return promise;
        }
    }
});

/**
 * /src/js/views/common/Toast.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.ToastView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.ToastView = window.annexSearch.ToastView || class ToastView extends window.annexSearch.BaseView {

        /**
         * #__duration
         * 
         * @access  private
         * @var     Number (default: window.annexSearch.ToastUtils.getDuration())
         */
        #__duration = window.annexSearch.ToastUtils.getDuration();

        /**
         * #__escapable
         * 
         * @access  private
         * @var     Boolean (default: true)
         */
        #__escapable = true;

        /**
         * #__showing
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__showing = false;

        /**
         * #__timeout
         * 
         * @access  private
         * @var     null|Number (default: null)
         */
        #__timeout = null;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="ToastView" part="toast">
    <div class="title" part="toast-title"><%= (data?.title ?? '(no title)') %></div>
    <div class="message" part="toast-message"><%= (data?.message ?? '(no message)') %></div>
</div>`;

        /**
         * constructor
         * 
         * @access  public
         * @param   window.annexSearch.AnnexSearchWidgetWebComponent $annexSearchWidget
         * @param   null|String title (default: null)
         * @param   null|String message (default: null)
         * @return  void
         */
        constructor($annexSearchWidget, title = null, message = null) {
            super($annexSearchWidget);
            this.set('title', title);
            this.set('message', message);
        }

        /**
         * #__addClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClickEventListener() {
            let handler = this.#__handleClickEvent.bind(this);
            this.click(handler)
            return true;
        }

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClickEventListener();
            this.addCustomEventListener('data.set.message', this.render.bind(this));
            this.addCustomEventListener('data.set.title', this.render.bind(this));
            return true;
        }

        /**
         * #__destroy
         * 
         * @access  private
         * @return  Boolean
         */
        #__destroy() {
            this._$element.remove();
            window.annexSearch.ToastUtils.remove(this);
            return true;
        }

        /**
         * #__handleClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClickEvent(event) {
            if (this.#__escapable === false) {
                return false;
            }
            this.hide();
            return true;
        }

        /**
         * #__hideOpenToasts
         * 
         * @access  private
         * @return  Boolean
         */
        #__hideOpenToasts() {
            let $annexSearchWidget = this._$annexSearchWidget,
                toasts = window.annexSearch.ToastUtils.get($annexSearchWidget);
            for (let toast of toasts) {
                if (toast === this) {
                    continue;
                }
                toast.hide();
            }
            return true;
        }

        /**
         * #__setTimeout
         * 
         * @access  private
         * @return  Boolean
         */
        #__setTimeout() {
            if (this.#__duration === null) {
                return false;
            }
            let handler = this.hide.bind(this),
                duration = this.#__duration,
                reference = setTimeout(handler, duration);
            this.#__timeout = reference;
            return true;
        }

        /**
         * hide
         * 
         * @access  public
         * @return  Boolean
         */
        hide() {
            this.#__showing = false;
            this._$element.classList.remove('visible');
            clearTimeout(this.#__timeout);
            var handler = this.#__destroy.bind(this);
            this.once('transitionend', handler);
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            if (this.#__showing === true) {
                this._$element.classList.add('visible');
            }
            this.#__addEvents();
            return true;
        }

        /**
         * setDuration
         * 
         * @access  public
         * @param   null|Number duration (default: null)
         * @return  Boolean
         */
        setDuration(duration = null) {
            this.#__duration = duration;
            return true;
        }

        /**
         * setUnescapable
         * 
         * @access  public
         * @return  Boolean
         */
        setUnescapable() {
            this.#__escapable = false;
            return true;
        }

        /**
         * show
         * 
         * @access  public
         * @return  Boolean
         */
        show() {
            if (this.#__showing === true) {
                return false;
            }
            this.#__showing = true;
            this.#__hideOpenToasts();
            this.#__setTimeout();
            let $element = this._$element;
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $element.classList.add('visible');
            });
            return true;
        }
    }
});

/**
 * /src/js/views/footer/BrandingBar.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.BrandingBarFooterView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.BrandingBarFooterView = window.annexSearch.BrandingBarFooterView || class BrandingBarFooterView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="BrandingBarFooterView" part="brandingBar">
    Built with <a href="https://annexsearch.com/" target="_blank" part="brandingBar-anchor">Annex</a>
    <!--Powered by <a href="https://annexsearch.com/" target="_blank">Annex</a>-->
</div>`;
    }
});

/**
 * /src/js/views/footer/Footer.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.FooterView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.FooterView = window.annexSearch.FooterView || class FooterView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="FooterView" part="footer" class="clearfix">
</div>`;

        /**
         * #__mountBrandingBar
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountBrandingBar() {
            let view = new window.annexSearch.BrandingBarFooterView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('brandingBar', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountStatusBar
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountStatusBar() {
            let view = new window.annexSearch.StatusBarFooterView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('statusBar', view);
            view.mount($container);
            return true;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            super.mount($container);
            this.#__mountStatusBar();
            this.#__mountBrandingBar();
            return true;
        }
    }
});

/**
 * /src/js/views/footer/StatusBar.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.StatusBarFooterView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.StatusBarFooterView = window.annexSearch.StatusBarFooterView || class StatusBarFooterView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="StatusBarFooterView" part="statusBar">
    <%
        let val = data.config.copy.statusBar.message;
    %>
    <div class="message truncate" part="statusBar-message"><%- (val) %></div>
</div>`;
    }
});

/**
 * /src/js/views/header/Field.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.FieldHeaderView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.FieldHeaderView = window.annexSearch.FieldHeaderView || class FieldHeaderView extends window.annexSearch.BaseView {

        /**
         * #__lastTypesenseSearchResponse
         * 
         * @access  private
         * @var     null|Object (default: null)
         */
        #__lastTypesenseSearchResponse = null;

        /**
         * #__loadingMore
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__loadingMore = false;

        /**
         * #__searchDebounceDelay
         * 
         * @access  private
         * @var     Number (default: 60)
         */
        #__searchDebounceDelay = 60;

        /**
         * #__timeout
         * 
         * @access  private
         * @var     null|Number (default: null)
         */
        #__timeout = null;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="FieldHeaderView" part="field" class="clearfix">
    <%
        let label = data?.config?.keyboardShortcut ?? '';
        label = label.toUpperCase();
        let placeholder = data?.config?.copy?.field?.placeholder ?? 'Search...';
    %>
    <div class="label" part="field-label"><%- (label) %></div>
    <div class="clear icon icon-plus-circle icon-size-14" part="field-clear"></div>
    <div class="input" part="field-input">
        <input type="search" name="query" id="query" spellcheck="false" autocapitalize="off" autocorrect="off" placeholder="<%- (placeholder) %>" part="field-input-input" />
    </div>
</div>`;

        /**
         * #__addClearClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClearClickEventListener() {
            let $element = this.first('.clear'),
                handler = this.#__handleClearClickEvent.bind(this);
            $element.addEventListener('click', handler);
            return true;
        }

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClearClickEventListener();
            this.#__addInputInputEventListener();
            return true;
        }

        /**
         * #__addInputInputEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addInputInputEventListener() {
            let $element = this.first('input'),
                handler = this.#__handleInputInputEvent.bind(this);
            $element.addEventListener('input', handler);
            return true;
        }

        /**
         * #__handleClearClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClearClickEvent(event) {
            event.preventDefault();
            this.clear();
            this._$annexSearchWidget.getHelper('webComponentUI').setQueryAttribute();
            this.nullifyLastTypesenseSearchResponse();
            this.getView('root.body.results.found').clearResults();
            this.getView('root.body.results.found').getView('root').setStateKey('idle');
            this._$annexSearchWidget.getHelper('config').triggerCallback('results.idle');
            this._$annexSearchWidget.dispatchCustomEvent('results.idle');
            return true;
        }

        /**
         * #__handleFailedTypesenseSearchEvent
         * 
         * @access  private
         * @param   Object options
         * @param   window.annexSearch.TypesenseSearchRequest typesenseSearchRequest
         * @return  Boolean
         */
        #__handleFailedTypesenseSearchEvent(options, typesenseSearchRequest) {
            let error = typesenseSearchRequest.getError(),
                key = error.key;
            if (key === 'abort') {
                return false;
            }
            let detail = {error};
            this._$annexSearchWidget.getHelper('config').triggerCallback('results.error', detail);
            this._$annexSearchWidget.dispatchCustomEvent('results.error', detail);
            let header = this.getView('root.header');
            header.hideSpinner();
            let response = typesenseSearchRequest.getResponse();
            this.#__lastTypesenseSearchResponse = response;
            this.getView('root').setStateKey('error');
            typesenseSearchRequest.logFailedEvent();
            return true;
        }

        /**
         * #__handleInputInputEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleInputInputEvent(event) {
            let value = this.first('input').value.trim();
            this._$annexSearchWidget.getHelper('webComponentUI').setQueryAttribute();
            if (value === '') {
                this.getHelper('typesense').abortLastRequest();
                this.getView('root.header').hideSpinner();
                this.nullifyLastTypesenseSearchResponse();
                this.clear();
                this.getView('root').setStateKey('idle');
                this.getView('root.body.results.found').clearResults();
                this._$annexSearchWidget.getHelper('config').triggerCallback('results.idle');
                this._$annexSearchWidget.dispatchCustomEvent('results.idle');
                return false;
            }
            if (value === this.#__lastTypesenseSearchResponse?.request_params?.q) {
                return false;
            }
            this.nullifyLastTypesenseSearchResponse();
            this.#__loadingMore = false;
            let found = this.getView('root.body.results.found');
            found.scrollToTop();
            clearTimeout(this.#__timeout);
            this.#__timeout = setTimeout(this.#__searchTypesense.bind(this), this.#__searchDebounceDelay);
            return true;
        }

        /**
         * #__handleLoadMoreSuccessfulTypesenseSearchEvent
         * 
         * @access  private
         * @param   Object options
         * @param   window.annexSearch.TypesenseSearchRequest typesenseSearchRequest
         * @return  Boolean
         */
        #__handleLoadMoreSuccessfulTypesenseSearchEvent(options, typesenseSearchRequest) {
            let response = typesenseSearchRequest.getResponse(),
                detail = {response};
            this._$annexSearchWidget.getHelper('config').triggerCallback('results.loaded', detail);
            this._$annexSearchWidget.dispatchCustomEvent('results.loaded', detail);
            this.#__lastTypesenseSearchResponse = response;
            this.#__loadingMore = false;
            if (response.hits.length === 0) {
                return false;
            }
            let found = this.getView('root.body.results.found');
            found.mountResults(response);
            this.#__updateMetaBar();
            return true;
        }

        /**
         * #__handleSuccessfulTypesenseSearchEvent
         * 
         * @access  private
         * @param   Object options
         * @param   window.annexSearch.TypesenseSearchRequest typesenseSearchRequest
         * @return  Boolean
         */
        #__handleSuccessfulTypesenseSearchEvent(options, typesenseSearchRequest) {
            let response = typesenseSearchRequest.getResponse();
            if (this.#__loadingMore === true) {
                let loadMoreResponse = this.#__handleLoadMoreSuccessfulTypesenseSearchEvent(options, typesenseSearchRequest),
                    found = this.getView('root.body.results.found'),
                    containsScrollbar = found.containsScrollbar();
                if (containsScrollbar === true) {
                    return true;
                }
                this.loadMore();
                return loadMoreResponse;
            }
            this.#__lastTypesenseSearchResponse = response;
            this.getView('root.body.results.found').clearResults();
            if (response.hits.length === 0) {
                this._$annexSearchWidget.getHelper('config').triggerCallback('results.empty');
                this._$annexSearchWidget.dispatchCustomEvent('results.empty');
                this.getView('root').setStateKey('empty');
                return false;
            }
            let detail = {response};
            this._$annexSearchWidget.getHelper('config').triggerCallback('results.loaded', detail);
            this._$annexSearchWidget.dispatchCustomEvent('results.loaded', detail);
            this.getView('root').setStateKey('results');
            let found = this.getView('root.body.results.found');
            found.mountResults(response);
            found.resetFocusedIndex();
            this.#__updateMetaBar();
            let containsScrollbar = found.containsScrollbar();
            if (containsScrollbar === true) {
                return true;
            }
            this.loadMore();
            return true;
        }

        /**
         * #__handleTypesenseSearchResponse
         * 
         * @access  private
         * @param   Object options (default: {})
         * @param   window.annexSearch.TypesenseSearchRequest typesenseSearchRequest
         * @return  Boolean
         */
        #__handleTypesenseSearchResponse(options = {}, typesenseSearchRequest) {
            let error = typesenseSearchRequest.getError();
            if (error === null) {
                let header = this.getView('root.header');
                header.hideSpinner();
                let response = this.#__handleSuccessfulTypesenseSearchEvent(options, typesenseSearchRequest);
                return response;
            }
            let response = this.#__handleFailedTypesenseSearchEvent(options, typesenseSearchRequest);
            return response;
        }

        /**
         * #__searchTypesense
         * 
         * @access  private
         * @param   Object options (default: {})
         * @return  Promise
         */
        #__searchTypesense(options = {}) {
            let header = this.getView('root.header');
            header.showSpinner();
            let value = this.first('input').value.trim(),
                handler = this.#__handleTypesenseSearchResponse.bind(this, options),
                promise = this.getHelper('typesense').search(value, options).then(handler);
            return promise;
        }

        /**
         * #__showHideLabel
         * 
         * @access  private
         * @return  Boolean
         */
        #__showHideLabel() {
            let keyboardShortcut = this._$annexSearchWidget.getConfig('keyboardShortcut');
            if (keyboardShortcut === null) {
                let $label = this.first('.label');
                $label.remove();
                return true;
            }
            return false;
        }

        /**
         * #__updateMetaBar
         * 
         * @access  private
         * @return  Boolean
         */
        #__updateMetaBar() {
            let typesenseSearchResponse = this.#__lastTypesenseSearchResponse,
                metaBar = this.getView('root.header.metaBar');
            metaBar.set('typesenseSearchResponse', typesenseSearchResponse);
            metaBar.render();
            return true;
        }

        /**
         * append
         * 
         * @access  public
         * @param   String value
         * @return  Boolean
         */
        append(value) {
            let $input = this.first('input');
            $input.value = ($input.value) + (value);
            return true;
        }

        /**
         * blur
         * 
         * @access  public
         * @return  Boolean
         */
        blur() {
            let $input = this.first('input');
            $input.blur();
            return true;
        }

        /**
         * clear
         * 
         * @access  public
         * @return  Boolean
         */
        clear() {
            let $input = this.first('input');
            $input.value = '';
            return true;
        }

        /**
         * decrement
         * 
         * @access  public
         * @return  Boolean
         */
        decrement() {
            let $input = this.first('input');
            $input.value = $input.value.slice(0, -1);
            return true;
        }

        /**
         * focus
         * 
         * @access  public
         * @return  Promise
         */
        focus() {
            let found = this.getView('root.body.results.found');
            found.clearFocused();
            let $input = this.first('input'),
                promise = window.annexSearch.ElementUtils.focus($input);
            return promise;
        }

        /**
         * loadMore
         * 
         * @note    Ordered
         * @access  public
         * @return  Boolean
         */
        loadMore() {
            if (this.#__loadingMore === true) {
                return false;
            }
            if (window.annexSearch.FunctionUtils.limitReached(this.loadMore, 10, 7500) === true) {
                let message = window.annexSearch.ErrorUtils.getMessage('fieldHeaderView.loadMore.limitReached');
                this.error(message);
                this.getView('root').setStateKey('error');
                this._$annexSearchWidget.disable();
                return false;
            }
            this.#__loadingMore = true;
            let found = this.getView('root.body.results.found'),
                results = found.getResults();
            if (results.length >= this.#__lastTypesenseSearchResponse.found) {
                return false;
            }
            let page = this.#__lastTypesenseSearchResponse?.page ?? null;
            if (page === null) {
                return false;
            }
            page = parseInt(page, 10);
            ++page;
            let options = {};
            options.page = page;
            this.#__searchTypesense(options);
            return true;
        }

        /**
         * nullifyLastTypesenseSearchResponse
         * 
         * @access  public
         * @return  Boolean
         */
        nullifyLastTypesenseSearchResponse() {
            this.#__lastTypesenseSearchResponse = null;
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__addEvents();
            this.#__showHideLabel();
            return true;
        }

        /**
         * select
         * 
         * @access  public
         * @return  Boolean
         */
        select() {
            let $input = this.first('input');
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                $input.select();
            })
            return true;
        }

        /**
         * setCaret
         * 
         * Moves the caret to the end of the input.
         * 
         * @access  public
         * @return  Boolean
         */
        setCaret() {
            let $input = this.first('input'),
                value = $input.value;
            $input.setSelectionRange(value.length, value.length);
            return true;
        }
    }
});

/**
 * /src/js/views/header/Header.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.HeaderView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.HeaderView = window.annexSearch.HeaderView || class HeaderView extends window.annexSearch.BaseView {

        /**
         * #__showingSpinner
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__showingSpinner = false;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="HeaderView" part="header">
    <div class="hide icon icon-plus icon-size-14" part="header-hide"></div>
    <div class="spinner spinning icon icon-spinner" part="metaBar-spinner"></div>
</div>`;

        /**
         * #__addClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClickEventListener() {
            let handler = this.#__handleClickEvent.bind(this);
            this.click(handler);
            return true;
        }

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClickEventListener();
            this.#__addHideClickEventListener();
            return true;
        }

        /**
         * #__addHideClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addHideClickEventListener() {
            let $element = this.first('.hide'),
                handler = this.#__handleHideClickEvent.bind(this);
            $element.addEventListener('click', handler);
            return true;
        }

        /**
         * #__handleClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClickEvent(event) {
            let $target = event.target,
                $hide = this.first('.hide');
            if ($target === $hide) {
                return false;
            }
            this.focus();
            return true;
        }

        /**
         * #__handleHideClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleHideClickEvent(event) {
            this._$annexSearchWidget.hide();
            return false;
        }

        /**
         * #__mountField
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountField() {
            let view = new window.annexSearch.FieldHeaderView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('field', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountMetaBar
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountMetaBar() {
            let view = new window.annexSearch.MetaBarHeaderView(this._$annexSearchWidget),
                $container = this._$element;
            this.setView('metaBar', view);
            view.mount($container);
            return true;
        }

        /**
         * blur
         * 
         * @access  public
         * @return  Boolean
         */
        blur() {
            let response = this.getView('field').blur();
            return response;
        }

        /**
         * focus
         * 
         * @access  public
         * @return  Promise
         */
        focus() {
            let response = this.getView('field').focus();
            return response;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            super.mount($container);
            this.#__mountField();
            this.#__mountMetaBar();
            return true;
        }

        /**
         * hideSpinner
         * 
         * @access  public
         * @return  Boolean
         */
        hideSpinner() {
            if (this.#__showingSpinner === false) {
                return false;
            }
            this.#__showingSpinner = false;
            this.getView('root').setAttribute('data-searching', '0');
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__addEvents();
            return true;
        }

        /**
         * showSpinner
         * 
         * @access  public
         * @return  Boolean
         */
        showSpinner() {
            if (this.#__showingSpinner === true) {
                return false;
            }
            this.#__showingSpinner = true;
            this.getView('root').setAttribute('data-searching', '1');
            return true;
        }
    }
});

/**
 * /src/js/views/header/MetaBar.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.MetaBarHeaderView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.MetaBarHeaderView = window.annexSearch.MetaBarHeaderView || class MetaBarHeaderView extends window.annexSearch.BaseView {

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
        <%
            let showing = 0;
            if (data.typesenseSearchResponse) {
                showing = (data.typesenseSearchResponse.page - 1) * (data.typesenseSearchResponse.request_params.per_page) + data.typesenseSearchResponse.hits.length;
            }
        %>
<div data-view-name="MetaBarHeaderView" part="metaBar">
    Showing
    <span class="showing" part="metaBar-showing"><%- showing.toLocaleString() %></span> of
    <span class="found" part="metaBar-found"><%- data?.typesenseSearchResponse?.found.toLocaleString() ?? 0 %></span>
    matching results
    (<span class="duration" part="metaBar-duration"><%- data?.typesenseSearchResponse?.search_time_ms.toLocaleString() ?? 0 %>ms</span>)
</div>`;
    }
});

/**
 * /src/js/views/Root.js
 * 
 */
window.annexSearch.DependencyLoader.push(['window.annexSearch.BaseView'], function() {

    /**
     * window.annexSearch.RootView
     * 
     * @access  public
     * @extends window.annexSearch.BaseView
     */
    window.annexSearch.RootView = window.annexSearch.RootView || class RootView extends window.annexSearch.BaseView {

        /**
         * #__$focused
         * 
         * @access  private
         * @var     null|EventTarget (default: null)
         */
        #__$focused = null;

        /**
         * _markup
         * 
         * @access  protected
         * @static
         * @var     String
         */
        _markup = `
<div data-view-name="RootView" data-state-key="idle" part="root">
    <div class="overlay" part="root-overlay"></div>
    <div class="content" part="root-content">
        <div class="disabled" part="root-content-disabled"></div>
    </div>
</div>`;

        /**
         * #__addEvents
         * 
         * @access  private
         * @return  Boolean
         */
        #__addEvents() {
            this.#__addClickEventListener();
            this.#__addFocusinEventListener();
            this.#__addOverlayClickEventListener();
            return true;
        }

        /**
         * #__addClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addClickEventListener() {
            let handler = this.#__handleClickEvent.bind(this);
            this.click(handler);
            return true;
        }

        /**
         * #__addFocusinEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addFocusinEventListener() {
            let handler = this.#__handleFocusinEvent.bind(this);
            this.event('focusin', handler);
            return true;
        }

        /**
         * #__addOverlayClickEventListener
         * 
         * @access  private
         * @return  Boolean
         */
        #__addOverlayClickEventListener() {
            let handler = this.#__handleOverlayClickEvent.bind(this);
            this.click(handler);
            return true;
        }

        /**
         * #__handleClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleClickEvent(event) {
            let $annexSearchWidget = this._$annexSearchWidget;
            $annexSearchWidget.focus();
            return true;
        }

        /**
         * #__handleFocusinEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleFocusinEvent(event) {
            let $target = event.target,
                $annexSearchWidget = this._$annexSearchWidget;
            this.#__$focused = $target;
            $annexSearchWidget.focus();
            return true;
        }

        /**
         * #__handleOverlayClickEvent
         * 
         * @access  private
         * @param   Object event
         * @return  Boolean
         */
        #__handleOverlayClickEvent(event) {
            let showOverlay = this.getHelper('config').get('showOverlay');
            if (showOverlay === false) {
                return false;
            }
            let $target = event.target;
            if ($target === null) {
                return false;
            }
            if ($target === undefined) {
                return false;
            }
            if ($target.matches('.overlay') === true) {
                this._$annexSearchWidget.hide();
                return true;
            }
            return false;
        }

        /**
         * #__mountBody
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountBody() {
            let view = new window.annexSearch.BodyView(this._$annexSearchWidget),
                $container = this.first('.content');
            this.setView('body', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountFooter
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountFooter() {
            let view = new window.annexSearch.FooterView(this._$annexSearchWidget),
                $container = this.first('.content');
            this.setView('footer', view);
            view.mount($container);
            return true;
        }

        /**
         * #__mountHeader
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountHeader() {
            let view = new window.annexSearch.HeaderView(this._$annexSearchWidget),
                $container = this.first('.content');
            this.setView('header', view);
            view.mount($container);
            return true;
        }

        /**
         * blur
         * 
         * @access  public
         * @return  Boolean
         */
        blur() {
            let response = this.getView('header').blur();
            return response;
        }

        /**
         * focus
         * 
         * @see     https://chatgpt.com/c/68ac9354-94e0-8320-beba-7538d46813f4
         * @access  public
         * @return  Promise
         */
        focus() {
            if (this._$annexSearchWidget.disabled() === true) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            let $focused = this.#__$focused;
            if ($focused === null) {
                let promise = this.getView('header').focus();
                return promise;
            }
            if (this._$annexSearchWidget.shadow.contains($focused) === false) {
                let promise = this.getView('header').focus();
                return promise;
            }
            let promise = window.annexSearch.ElementUtils.focus($focused);
            return promise;
        }

        /**
         * getFocused
         * 
         * @access  public
         * @return  null|EventTarget
         */
        getFocused() {
            let $focused = this.#__$focused;
            return $focused;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   EventTarget $container
         * @return  Boolean
         */
        mount($container) {
            super.mount($container);
            this.#__mountHeader();
            this.#__mountBody();
            this.#__mountFooter();
            this._$annexSearchWidget.getHelper('config').triggerCallback('results.idle');
            this._$annexSearchWidget.dispatchCustomEvent('results.idle');
            return true;
        }

        /**
         * render
         * 
         * @access  public
         * @return  Boolean
         */
        render() {
            super.render();
            this.#__addEvents();
            return true;
        }

        /**
         * setStateKey
         * 
         * @access  public
         * @param   String stateKey
         * @return  Boolean
         */
        setStateKey(stateKey) {
            this._$element.setAttribute('data-state-key', stateKey);
            return true;
        }
    }
});

/**
 * /src/js/web-components/AnnexSearchWidget.js
 * 
 */
window.annexSearch.DependencyLoader.push([], function() {

    /**
     * window.annexSearch.AnnexSearchWidgetWebComponent
     * 
     * @see     https://chatgpt.com/c/68952fc2-4a9c-8323-9de9-8857960241d8
     * @see     https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
     * @extends HTMLElement
     */
    window.annexSearch.AnnexSearchWidgetWebComponent = window.annexSearch.AnnexSearchWidgetWebComponent || class AnnexSearchWidgetWebComponent extends HTMLElement {

        /**
         * #__disabled
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__disabled = false;

        /**
         * #__helpers
         * 
         * @access  private
         * @var     Object (default: {})
         */
        #__helpers = {};

        /**
         * #__mounted
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__mounted = false;

        /**
         * #__mutators
         * 
         * @access  private
         * @var     Object (default: {})
         */
        #__mutators = {};

        /**
         * #__ready
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__ready = false;

        /**
         * #__showing
         * 
         * @access  private
         * @var     Boolean (default: false)
         */
        #__showing = false;

        /**
         * #__views
         * 
         * @access  private
         * @var     Object (default: {})
         */
        #__views = {};

        /**
         * constructor
         * 
         * @access  public
         * @return  void
         */
        constructor() {
            super();
            this.#__register();
            this.#__setupHelpers();
            this.#__setupShadow();
        }

        /**
         * #__getContainer
         * 
         * @access  private
         * @param   null|EventTarget $container (default: null)
         * @return  null|EventTarget
         */
        #__getContainer($container = null) {
            $container = $container || this.getConfig('$container') || null;
            if (this.getConfig('layout') === 'inline') {
                if ($container === null) {
                    let message = window.annexSearch.ErrorUtils.getMessage('annexSearchWidget.container.null');
                    this.#__helpers.webComponentUI.error(message);
                    return null;
                }
                return $container;
            }
            if ($container === null) {
                $container = (document.body || document.head || document.documentElement);
                return $container;
            }
            return $container;
        }

        /**
         * #__handleReadyEvent
         * 
         * Handler which formally marks the web component as ready, including
         * dispatching a customer event. It's important for this to be it's own
         * handler, called after wiating for the next animation frame, in order
         * for smooth effects (like a panel layout sliding out properly when
         * it's set to be shown immediately upon DOM load).
         * 
         * @access  private
         * @return  window.annexSearch.AnnexSearchWidgetWebComponent
         */
        #__handleReadyEvent() {
            this.#__mounted = true;
            this.#__ready = true;
            this.dispatchCustomEvent('ready');
            return this;
        }

        /**
         * #__handleRenderEvent
         * 
         * @access  private
         * @return  Promise
         */
        #__handleRenderEvent() {
            try {
                this.#__mountRoot();
                this.#__helpers.webComponentUI.setupConfigHelperCustomEventListeners();
                this.#__helpers.webComponentUI.setAttributes();
                this.#__helpers.webComponentUI.autoShow();
            } catch (err) {
                let debug = this.#__helpers.config.get('debug');
                if (debug === true) {
                    console.log(err);
                    console.trace();
                }
            }
            let handler = this.#__handleReadyEvent.bind(this),
                promise = window.annexSearch.ElementUtils.waitForAnimation().then(handler);
            return promise;
        }

        /**
         * #__mountRoot
         * 
         * @access  private
         * @return  Boolean
         */
        #__mountRoot() {
            let view = new window.annexSearch.RootView(this),
                $container = this.shadow;
            this.#__views.root = view;
            this.#__views.root.mount($container);
            return true;
        }

        /**
         * #__register
         * 
         * @access  private
         * @return  Boolean
         */
        #__register() {
            window.annexSearch.AnnexSearch.register(this);
            return true;
        }

        /**
         * #__render
         * 
         * @access  private
         * @return  Promise
         */
        #__render() {
            let handler = this.#__handleRenderEvent.bind(this),
                $annexSearchWidget = this,
                promise = this.#__helpers.config.loadStylesheets(this).then(handler).catch(function(error) {
                    return $annexSearchWidget;
                });
            return promise;
        }

        /**
         * #__setupHelpers
         * 
         * @access  private
         * @return  Boolean
         */
        #__setupHelpers() {
            this.#__helpers.config = new window.annexSearch.ConfigHelper(this);
            this.#__helpers.typesense = new window.annexSearch.TypesenseHelper(this);
            this.#__helpers.webComponentUI = new window.annexSearch.WebComponentUIHelper(this);
            return true;
        }

        /**
         * #__mountShadow
         * 
         * @access  private
         * @return  Boolean
         */
        #__setupShadow() {
            this.shadow = this.attachShadow({
                mode: 'closed'
            });
            return true;
        }

        /**
         * #__validMountAttempt
         * 
         * @access  private
         * @return  Boolean
         */
        #__validMountAttempt() {
            let $registered = window.annexSearch.AnnexSearch.getRegistered();
            for (let $annexSearchWidget of $registered) {
                if (this === $annexSearchWidget) {
                    continue;
                }
                let keyboardShortcut = this.getConfig('keyboardShortcut');
                if (keyboardShortcut === null) {
                    continue;
                }
                if (keyboardShortcut === $annexSearchWidget.getConfig('keyboardShortcut')) {
                    this.setConfig('keyboardShortcut', null);
                    let message = window.annexSearch.ErrorUtils.getMessage('annexSearchWidget.keyboardShortcut.reserved', keyboardShortcut);
                    this.#__helpers.webComponentUI.error(message);
                    break;
                }
            }
            return true;
        }

        /**
         * blur
         * 
         * @access  public
         * @return  Promise
         */
        blur() {
            let focused = this.focused();
            if (focused === false) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(this);
                return promise;
            }
            window.annexSearch.AnnexSearch.setFocused(null);
            let $annexSearchWidget = this,
                promise = this.#__helpers.webComponentUI.blur();
            return promise;
        }

        /**
         * clear
         * 
         * @access  public
         * @return  Boolean
         */
        clear() {
            let field = this.getView('root').getView('root.header.field'),
                found = this.getView('root').getView('body.results.found');
            field.focus();
            field.clear();
            field.nullifyLastTypesenseSearchResponse();
            found.resetFocusedIndex();
            field.first('input').dispatchEvent(new Event('input', {
                bubbles: true
            }));
            return true;
        }

        /**
         * disable
         * 
         * @access  public
         * @return  Boolean
         */
        disable() {
            if (this.#__disabled === true) {
                return false;
            }
            this.#__disabled = true;
            this.#__helpers.webComponentUI.disable();
            return true;
        }

        /**
         * disabled
         * 
         * @access  public
         * @return  Boolean
         */
        disabled() {
            let response = this.#__disabled;
            return response;
        }

        /**
         * dispatchCustomEvent
         * 
         * @see     https://chatgpt.com/c/68942c36-15a0-8328-a9aa-a0a5e682af61
         * @access  public
         * @param   String type
         * @param   Object detail (default: {})
         * @return  Boolean
         */
        dispatchCustomEvent(type, detail = {}) {
            detail.$annexSearchWidget = this;
            let customEvent = new CustomEvent(type, {
                detail: detail
            });
            this.dispatchEvent(customEvent);
            return true;
        }

        /**
         * enable
         * 
         * @access  public
         * @return  Boolean
         */
        enable() {
            if (this.#__disabled === false) {
                return false;
            }
            this.#__disabled = false;
            this.#__helpers.webComponentUI.enable();
            return true;
        }

        /**
         * focus
         * 
         * @access  public
         * @return  Promise
         */
        focus() {
            let focused = this.focused();
            if (focused === true) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(this);
                return promise;
            }
            window.annexSearch.AnnexSearch.setFocused(this);
            this.#__helpers.webComponentUI.focus();
            let $annexSearchWidget = this,
                promise = this.getView('root').focus().then(function() {
                    return $annexSearchWidget;
                });
            return promise;
        }

        /**
         * focused
         * 
         * @access  public
         * @return  Boolean
         */
        focused() {
            let focused = window.annexSearch.AnnexSearch.getFocused() === this;
            return focused;
        }

        /**
         * getConfig
         * 
         * @access  public
         * @param   String key
         * @return  Boolean
         */
        getConfig(key) {
            let value = this.#__helpers.config.get(key);
            return value;
        }

        /**
         * getFocused
         * 
         * @access  public
         * @return  null|EventTarget
         */
        getFocused() {
            let root = this.getView('root'),
                $focused = root.getFocused();
            return $focused;
        }

        /**
         * getHelper
         * 
         * @access  public
         * @param   String key
         * @return  window.annexSearch.BaseView
         */
        getHelper(key) {
            let helper = this.#__helpers[key];
            return helper;
        }

        /**
         * getMutator
         * 
         * @access  public
         * @param   String key
         * @param   Function mutator
         * @return  Boolean
         */
        getMutator(key) {
            let mutator = this.#__mutators[key] || null;
            return mutator;
        }

        /**
         * getView
         * 
         * @access  public
         * @param   String viewKey
         * @return  window.annexSearch.BaseView
         */
        getView(viewKey) {
            let view = this.#__views[viewKey];
            return view;
        }

        /**
         * hide
         * 
         * @see     https://chatgpt.com/c/688faa3b-3b2c-832c-a55b-96d1ab15acbe
         * @access  public
         * @return  Promise
         */
        hide() {
            if (this.getConfig('layout') === 'inline') {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            if (this.#__showing === false) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            this.#__showing = false;
            window.annexSearch.AnnexSearch.clearFocused();
            let promise = this.#__helpers.webComponentUI.hide();
            return promise;
        }

        /**
         * mount
         * 
         * @access  public
         * @param   null|EventTarget $container (default: null)
         * @return  Promise
         */
        mount($container = null) {
            $container = this.#__getContainer($container);
            if ($container === null) {
                this.#__mounted = false;
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(this);
                return promise;
            }
            if (this.#__validMountAttempt() === false) {
                this.#__mounted = false;
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(this);
                return promise;
            }
            let promise = this.#__render();
            $container.appendChild(this);
            return promise;
        }

        /**
         * mounted
         * 
         * @access  public
         * @return  Boolean
         */
        mounted() {
            let mounted = this.#__mounted;
            return mounted;
        }

        /**
         * partiallyVisible
         * 
         * @access  public
         * @return  Boolean
         */
        partiallyVisible() {
            let $element = this,
                partiallyVisible = window.annexSearch.ElementUtils.partiallyVisible($element);
            return partiallyVisible;
        }

        /**
         * query
         * 
         * @access  public
         * @param   String query
         * @return  Boolean
         */
        query(query) {
            let field = this.getView('root').getView('root.header.field'),
                found = this.getView('root').getView('body.results.found');
            field.focus();
            field.clear();
            field.nullifyLastTypesenseSearchResponse();
            field.append(query);
            found.smoothScrollToTop();
            found.resetFocusedIndex();
            window.annexSearch.ElementUtils.waitForAnimation().then(function() {
                field.setCaret();
            });
            field.first('input').dispatchEvent(new Event('input', {
                bubbles: true
            }));
            return true;
        }

        /**
         * ready
         * 
         * @access  public
         * @return  Promise
         */
        ready() {
            if (this.#__ready === true) {
                let promise = new Promise(function(resolve, reject) {
                    resolve(this);
                });
                return promise;
            }
            let $annexSearchWidget = this,
                promise = new Promise(function(resolve, reject) {
                    let handler = function(customEvent) {
                        resolve($annexSearchWidget);
                    };
                    $annexSearchWidget.addEventListener('ready', handler, {
                        once: true
                    });
                });
            return promise;
        }

        /**
         * setConfig
         * 
         * @access  public
         * @param   Object|String key
         * @param   mixed value
         * @return  Boolean
         */
        setConfig(key, value) {
            if (typeof key === 'object') {
                let response = this.#__helpers.config.merge(key);
                return response;
            }
            let response = this.#__helpers.config.set(key, value);
            return response;
        }

        /**
         * setMutator
         * 
         * @access  public
         * @param   String key
         * @param   Function mutator
         * @return  Boolean
         */
        setMutator(key, mutator) {
            this.#__mutators[key] = mutator;
            return true;
        }

        /**
         * show
         * 
         * @access  public
         * @return  Promise
         */
        show() {
            if (this.#__showing === true) {
                let promise = window.annexSearch.FunctionUtils.getEmptyPromise(false);
                return promise;
            }
            this.#__showing = true;
            let $annexSearchWidget = this,
                promise = this.#__helpers.webComponentUI.show();
            return promise;
        }

        /**
         * showing
         * 
         * @access  public
         * @return  Boolean
         */
        showing() {
            let showing = this.#__showing;
            return showing;
        }

        /**
         * showTimer
         * 
         * @access  public
         * @param   Number seconds
         * @return  Promise
         */
        showTimer(seconds) {
            let options = {seconds},
                view = window.annexSearch.TimerUtils.build(this, options),
                promise = view.show();
            return promise;
        }

        /**
         * showToast
         * 
         * @access  public
         * @param   String title
         * @param   String message
         * @param   null|Number duration (default: window.annexSearch.ToastUtils.getDuration())
         * @return  window.annexSearch.ToastView
         */
        showToast(title, message, duration = window.annexSearch.ToastUtils.getDuration()) {
            let options = {title, message},
                view = window.annexSearch.ToastUtils.build(this, options);
            view.setDuration(duration);
            view.show();
            return view;
        }

        /**
         * toggle
         * 
         * @access  public
         * @return  Promise
         */
        toggle() {
            this.#__helpers.webComponentUI.toggle();
            if (this.#__showing === true) {
                let promise = this.hide();
                return promise;
            }
            let promise = this.show();
            return promise;
        }
    }
});
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
(function(){function n(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function t(n,t,r,e){for(var u=-1,i=null==n?0:n.length;++u<i;){var o=n[u];t(e,o,r(o),n)}return e}function r(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&t(n[r],r,n)!==!1;);return n}function e(n,t){for(var r=null==n?0:n.length;r--&&t(n[r],r,n)!==!1;);return n}function u(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return!1;
return!0}function i(n,t){for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){var o=n[r];t(o,r,n)&&(i[u++]=o)}return i}function o(n,t){return!!(null==n?0:n.length)&&y(n,t,0)>-1}function f(n,t,r){for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return!0;return!1}function c(n,t){for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function a(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n}function l(n,t,r,e){var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);
return r}function s(n,t,r,e){var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function h(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return!0;return!1}function p(n){return n.split("")}function _(n){return n.match($t)||[]}function v(n,t,r){var e;return r(n,function(n,r,u){if(t(n,r,u))return e=r,!1}),e}function g(n,t,r,e){for(var u=n.length,i=r+(e?1:-1);e?i--:++i<u;)if(t(n[i],i,n))return i;return-1}function y(n,t,r){return t===t?Z(n,t,r):g(n,b,r)}function d(n,t,r,e){
for(var u=r-1,i=n.length;++u<i;)if(e(n[u],t))return u;return-1}function b(n){return n!==n}function w(n,t){var r=null==n?0:n.length;return r?k(n,t)/r:Cn}function m(n){return function(t){return null==t?X:t[n]}}function x(n){return function(t){return null==n?X:n[t]}}function j(n,t,r,e,u){return u(n,function(n,u,i){r=e?(e=!1,n):t(r,n,u,i)}),r}function A(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].value;return n}function k(n,t){for(var r,e=-1,u=n.length;++e<u;){var i=t(n[e]);i!==X&&(r=r===X?i:r+i);
}return r}function O(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function I(n,t){return c(t,function(t){return[t,n[t]]})}function R(n){return n?n.slice(0,H(n)+1).replace(Lt,""):n}function z(n){return function(t){return n(t)}}function E(n,t){return c(t,function(t){return n[t]})}function S(n,t){return n.has(t)}function W(n,t){for(var r=-1,e=n.length;++r<e&&y(t,n[r],0)>-1;);return r}function L(n,t){for(var r=n.length;r--&&y(t,n[r],0)>-1;);return r}function C(n,t){for(var r=n.length,e=0;r--;)n[r]===t&&++e;
return e}function U(n){return"\\"+Yr[n]}function B(n,t){return null==n?X:n[t]}function T(n){return Nr.test(n)}function $(n){return Pr.test(n)}function D(n){for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}function M(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function F(n,t){return function(r){return n(t(r))}}function N(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r];o!==t&&o!==cn||(n[r]=cn,i[u++]=r)}return i}function P(n){var t=-1,r=Array(n.size);
return n.forEach(function(n){r[++t]=n}),r}function q(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=[n,n]}),r}function Z(n,t,r){for(var e=r-1,u=n.length;++e<u;)if(n[e]===t)return e;return-1}function K(n,t,r){for(var e=r+1;e--;)if(n[e]===t)return e;return e}function V(n){return T(n)?J(n):_e(n)}function G(n){return T(n)?Y(n):p(n)}function H(n){for(var t=n.length;t--&&Ct.test(n.charAt(t)););return t}function J(n){for(var t=Mr.lastIndex=0;Mr.test(n);)++t;return t}function Y(n){return n.match(Mr)||[];
}function Q(n){return n.match(Fr)||[]}var X,nn="4.17.21",tn=200,rn="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",en="Expected a function",un="Invalid `variable` option passed into `_.template`",on="__lodash_hash_undefined__",fn=500,cn="__lodash_placeholder__",an=1,ln=2,sn=4,hn=1,pn=2,_n=1,vn=2,gn=4,yn=8,dn=16,bn=32,wn=64,mn=128,xn=256,jn=512,An=30,kn="...",On=800,In=16,Rn=1,zn=2,En=3,Sn=1/0,Wn=9007199254740991,Ln=1.7976931348623157e308,Cn=NaN,Un=4294967295,Bn=Un-1,Tn=Un>>>1,$n=[["ary",mn],["bind",_n],["bindKey",vn],["curry",yn],["curryRight",dn],["flip",jn],["partial",bn],["partialRight",wn],["rearg",xn]],Dn="[object Arguments]",Mn="[object Array]",Fn="[object AsyncFunction]",Nn="[object Boolean]",Pn="[object Date]",qn="[object DOMException]",Zn="[object Error]",Kn="[object Function]",Vn="[object GeneratorFunction]",Gn="[object Map]",Hn="[object Number]",Jn="[object Null]",Yn="[object Object]",Qn="[object Promise]",Xn="[object Proxy]",nt="[object RegExp]",tt="[object Set]",rt="[object String]",et="[object Symbol]",ut="[object Undefined]",it="[object WeakMap]",ot="[object WeakSet]",ft="[object ArrayBuffer]",ct="[object DataView]",at="[object Float32Array]",lt="[object Float64Array]",st="[object Int8Array]",ht="[object Int16Array]",pt="[object Int32Array]",_t="[object Uint8Array]",vt="[object Uint8ClampedArray]",gt="[object Uint16Array]",yt="[object Uint32Array]",dt=/\b__p \+= '';/g,bt=/\b(__p \+=) '' \+/g,wt=/(__e\(.*?\)|\b__t\)) \+\n'';/g,mt=/&(?:amp|lt|gt|quot|#39);/g,xt=/[&<>"']/g,jt=RegExp(mt.source),At=RegExp(xt.source),kt=/<%-([\s\S]+?)%>/g,Ot=/<%([\s\S]+?)%>/g,It=/<%=([\s\S]+?)%>/g,Rt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,zt=/^\w*$/,Et=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,St=/[\\^$.*+?()[\]{}|]/g,Wt=RegExp(St.source),Lt=/^\s+/,Ct=/\s/,Ut=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,Bt=/\{\n\/\* \[wrapped with (.+)\] \*/,Tt=/,? & /,$t=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Dt=/[()=,{}\[\]\/\s]/,Mt=/\\(\\)?/g,Ft=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Nt=/\w*$/,Pt=/^[-+]0x[0-9a-f]+$/i,qt=/^0b[01]+$/i,Zt=/^\[object .+?Constructor\]$/,Kt=/^0o[0-7]+$/i,Vt=/^(?:0|[1-9]\d*)$/,Gt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ht=/($^)/,Jt=/['\n\r\u2028\u2029\\]/g,Yt="\\ud800-\\udfff",Qt="\\u0300-\\u036f",Xt="\\ufe20-\\ufe2f",nr="\\u20d0-\\u20ff",tr=Qt+Xt+nr,rr="\\u2700-\\u27bf",er="a-z\\xdf-\\xf6\\xf8-\\xff",ur="\\xac\\xb1\\xd7\\xf7",ir="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",or="\\u2000-\\u206f",fr=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",cr="A-Z\\xc0-\\xd6\\xd8-\\xde",ar="\\ufe0e\\ufe0f",lr=ur+ir+or+fr,sr="['\u2019]",hr="["+Yt+"]",pr="["+lr+"]",_r="["+tr+"]",vr="\\d+",gr="["+rr+"]",yr="["+er+"]",dr="[^"+Yt+lr+vr+rr+er+cr+"]",br="\\ud83c[\\udffb-\\udfff]",wr="(?:"+_r+"|"+br+")",mr="[^"+Yt+"]",xr="(?:\\ud83c[\\udde6-\\uddff]){2}",jr="[\\ud800-\\udbff][\\udc00-\\udfff]",Ar="["+cr+"]",kr="\\u200d",Or="(?:"+yr+"|"+dr+")",Ir="(?:"+Ar+"|"+dr+")",Rr="(?:"+sr+"(?:d|ll|m|re|s|t|ve))?",zr="(?:"+sr+"(?:D|LL|M|RE|S|T|VE))?",Er=wr+"?",Sr="["+ar+"]?",Wr="(?:"+kr+"(?:"+[mr,xr,jr].join("|")+")"+Sr+Er+")*",Lr="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Cr="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Ur=Sr+Er+Wr,Br="(?:"+[gr,xr,jr].join("|")+")"+Ur,Tr="(?:"+[mr+_r+"?",_r,xr,jr,hr].join("|")+")",$r=RegExp(sr,"g"),Dr=RegExp(_r,"g"),Mr=RegExp(br+"(?="+br+")|"+Tr+Ur,"g"),Fr=RegExp([Ar+"?"+yr+"+"+Rr+"(?="+[pr,Ar,"$"].join("|")+")",Ir+"+"+zr+"(?="+[pr,Ar+Or,"$"].join("|")+")",Ar+"?"+Or+"+"+Rr,Ar+"+"+zr,Cr,Lr,vr,Br].join("|"),"g"),Nr=RegExp("["+kr+Yt+tr+ar+"]"),Pr=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,qr=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Zr=-1,Kr={};
Kr[at]=Kr[lt]=Kr[st]=Kr[ht]=Kr[pt]=Kr[_t]=Kr[vt]=Kr[gt]=Kr[yt]=!0,Kr[Dn]=Kr[Mn]=Kr[ft]=Kr[Nn]=Kr[ct]=Kr[Pn]=Kr[Zn]=Kr[Kn]=Kr[Gn]=Kr[Hn]=Kr[Yn]=Kr[nt]=Kr[tt]=Kr[rt]=Kr[it]=!1;var Vr={};Vr[Dn]=Vr[Mn]=Vr[ft]=Vr[ct]=Vr[Nn]=Vr[Pn]=Vr[at]=Vr[lt]=Vr[st]=Vr[ht]=Vr[pt]=Vr[Gn]=Vr[Hn]=Vr[Yn]=Vr[nt]=Vr[tt]=Vr[rt]=Vr[et]=Vr[_t]=Vr[vt]=Vr[gt]=Vr[yt]=!0,Vr[Zn]=Vr[Kn]=Vr[it]=!1;var Gr={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a",
"\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae",
"\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss","\u0100":"A","\u0102":"A","\u0104":"A","\u0101":"a","\u0103":"a","\u0105":"a","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C","\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c","\u010e":"D","\u0110":"D","\u010f":"d","\u0111":"d","\u0112":"E","\u0114":"E","\u0116":"E","\u0118":"E","\u011a":"E","\u0113":"e","\u0115":"e","\u0117":"e","\u0119":"e","\u011b":"e","\u011c":"G","\u011e":"G","\u0120":"G","\u0122":"G","\u011d":"g","\u011f":"g","\u0121":"g",
"\u0123":"g","\u0124":"H","\u0126":"H","\u0125":"h","\u0127":"h","\u0128":"I","\u012a":"I","\u012c":"I","\u012e":"I","\u0130":"I","\u0129":"i","\u012b":"i","\u012d":"i","\u012f":"i","\u0131":"i","\u0134":"J","\u0135":"j","\u0136":"K","\u0137":"k","\u0138":"k","\u0139":"L","\u013b":"L","\u013d":"L","\u013f":"L","\u0141":"L","\u013a":"l","\u013c":"l","\u013e":"l","\u0140":"l","\u0142":"l","\u0143":"N","\u0145":"N","\u0147":"N","\u014a":"N","\u0144":"n","\u0146":"n","\u0148":"n","\u014b":"n","\u014c":"O",
"\u014e":"O","\u0150":"O","\u014d":"o","\u014f":"o","\u0151":"o","\u0154":"R","\u0156":"R","\u0158":"R","\u0155":"r","\u0157":"r","\u0159":"r","\u015a":"S","\u015c":"S","\u015e":"S","\u0160":"S","\u015b":"s","\u015d":"s","\u015f":"s","\u0161":"s","\u0162":"T","\u0164":"T","\u0166":"T","\u0163":"t","\u0165":"t","\u0167":"t","\u0168":"U","\u016a":"U","\u016c":"U","\u016e":"U","\u0170":"U","\u0172":"U","\u0169":"u","\u016b":"u","\u016d":"u","\u016f":"u","\u0171":"u","\u0173":"u","\u0174":"W","\u0175":"w",
"\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017b":"Z","\u017d":"Z","\u017a":"z","\u017c":"z","\u017e":"z","\u0132":"IJ","\u0133":"ij","\u0152":"Oe","\u0153":"oe","\u0149":"'n","\u017f":"s"},Hr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Jr={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},Yr={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Qr=parseFloat,Xr=parseInt,ne="object"==typeof global&&global&&global.Object===Object&&global,te="object"==typeof self&&self&&self.Object===Object&&self,re=ne||te||Function("return this")(),ee="object"==typeof exports&&exports&&!exports.nodeType&&exports,ue=ee&&"object"==typeof module&&module&&!module.nodeType&&module,ie=ue&&ue.exports===ee,oe=ie&&ne.process,fe=function(){
try{var n=ue&&ue.require&&ue.require("util").types;return n?n:oe&&oe.binding&&oe.binding("util")}catch(n){}}(),ce=fe&&fe.isArrayBuffer,ae=fe&&fe.isDate,le=fe&&fe.isMap,se=fe&&fe.isRegExp,he=fe&&fe.isSet,pe=fe&&fe.isTypedArray,_e=m("length"),ve=x(Gr),ge=x(Hr),ye=x(Jr),de=function p(x){function Z(n){if(cc(n)&&!bh(n)&&!(n instanceof Ct)){if(n instanceof Y)return n;if(bl.call(n,"__wrapped__"))return eo(n)}return new Y(n)}function J(){}function Y(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,
this.__index__=0,this.__values__=X}function Ct(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Un,this.__views__=[]}function $t(){var n=new Ct(this.__wrapped__);return n.__actions__=Tu(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=Tu(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=Tu(this.__views__),n}function Yt(){if(this.__filtered__){var n=new Ct(this);n.__dir__=-1,
n.__filtered__=!0}else n=this.clone(),n.__dir__*=-1;return n}function Qt(){var n=this.__wrapped__.value(),t=this.__dir__,r=bh(n),e=t<0,u=r?n.length:0,i=Oi(0,u,this.__views__),o=i.start,f=i.end,c=f-o,a=e?f:o-1,l=this.__iteratees__,s=l.length,h=0,p=Hl(c,this.__takeCount__);if(!r||!e&&u==c&&p==c)return wu(n,this.__actions__);var _=[];n:for(;c--&&h<p;){a+=t;for(var v=-1,g=n[a];++v<s;){var y=l[v],d=y.iteratee,b=y.type,w=d(g);if(b==zn)g=w;else if(!w){if(b==Rn)continue n;break n}}_[h++]=g}return _}function Xt(n){
var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function nr(){this.__data__=is?is(null):{},this.size=0}function tr(n){var t=this.has(n)&&delete this.__data__[n];return this.size-=t?1:0,t}function rr(n){var t=this.__data__;if(is){var r=t[n];return r===on?X:r}return bl.call(t,n)?t[n]:X}function er(n){var t=this.__data__;return is?t[n]!==X:bl.call(t,n)}function ur(n,t){var r=this.__data__;return this.size+=this.has(n)?0:1,r[n]=is&&t===X?on:t,this}function ir(n){
var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function or(){this.__data__=[],this.size=0}function fr(n){var t=this.__data__,r=Wr(t,n);return!(r<0)&&(r==t.length-1?t.pop():Ll.call(t,r,1),--this.size,!0)}function cr(n){var t=this.__data__,r=Wr(t,n);return r<0?X:t[r][1]}function ar(n){return Wr(this.__data__,n)>-1}function lr(n,t){var r=this.__data__,e=Wr(r,n);return e<0?(++this.size,r.push([n,t])):r[e][1]=t,this}function sr(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){
var e=n[t];this.set(e[0],e[1])}}function hr(){this.size=0,this.__data__={hash:new Xt,map:new(ts||ir),string:new Xt}}function pr(n){var t=xi(this,n).delete(n);return this.size-=t?1:0,t}function _r(n){return xi(this,n).get(n)}function vr(n){return xi(this,n).has(n)}function gr(n,t){var r=xi(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this}function yr(n){var t=-1,r=null==n?0:n.length;for(this.__data__=new sr;++t<r;)this.add(n[t])}function dr(n){return this.__data__.set(n,on),this}function br(n){
return this.__data__.has(n)}function wr(n){this.size=(this.__data__=new ir(n)).size}function mr(){this.__data__=new ir,this.size=0}function xr(n){var t=this.__data__,r=t.delete(n);return this.size=t.size,r}function jr(n){return this.__data__.get(n)}function Ar(n){return this.__data__.has(n)}function kr(n,t){var r=this.__data__;if(r instanceof ir){var e=r.__data__;if(!ts||e.length<tn-1)return e.push([n,t]),this.size=++r.size,this;r=this.__data__=new sr(e)}return r.set(n,t),this.size=r.size,this}function Or(n,t){
var r=bh(n),e=!r&&dh(n),u=!r&&!e&&mh(n),i=!r&&!e&&!u&&Oh(n),o=r||e||u||i,f=o?O(n.length,hl):[],c=f.length;for(var a in n)!t&&!bl.call(n,a)||o&&("length"==a||u&&("offset"==a||"parent"==a)||i&&("buffer"==a||"byteLength"==a||"byteOffset"==a)||Ci(a,c))||f.push(a);return f}function Ir(n){var t=n.length;return t?n[tu(0,t-1)]:X}function Rr(n,t){return Xi(Tu(n),Mr(t,0,n.length))}function zr(n){return Xi(Tu(n))}function Er(n,t,r){(r===X||Gf(n[t],r))&&(r!==X||t in n)||Br(n,t,r)}function Sr(n,t,r){var e=n[t];
bl.call(n,t)&&Gf(e,r)&&(r!==X||t in n)||Br(n,t,r)}function Wr(n,t){for(var r=n.length;r--;)if(Gf(n[r][0],t))return r;return-1}function Lr(n,t,r,e){return ys(n,function(n,u,i){t(e,n,r(n),i)}),e}function Cr(n,t){return n&&$u(t,Pc(t),n)}function Ur(n,t){return n&&$u(t,qc(t),n)}function Br(n,t,r){"__proto__"==t&&Tl?Tl(n,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):n[t]=r}function Tr(n,t){for(var r=-1,e=t.length,u=il(e),i=null==n;++r<e;)u[r]=i?X:Mc(n,t[r]);return u}function Mr(n,t,r){return n===n&&(r!==X&&(n=n<=r?n:r),
t!==X&&(n=n>=t?n:t)),n}function Fr(n,t,e,u,i,o){var f,c=t&an,a=t&ln,l=t&sn;if(e&&(f=i?e(n,u,i,o):e(n)),f!==X)return f;if(!fc(n))return n;var s=bh(n);if(s){if(f=zi(n),!c)return Tu(n,f)}else{var h=zs(n),p=h==Kn||h==Vn;if(mh(n))return Iu(n,c);if(h==Yn||h==Dn||p&&!i){if(f=a||p?{}:Ei(n),!c)return a?Mu(n,Ur(f,n)):Du(n,Cr(f,n))}else{if(!Vr[h])return i?n:{};f=Si(n,h,c)}}o||(o=new wr);var _=o.get(n);if(_)return _;o.set(n,f),kh(n)?n.forEach(function(r){f.add(Fr(r,t,e,r,n,o))}):jh(n)&&n.forEach(function(r,u){
f.set(u,Fr(r,t,e,u,n,o))});var v=l?a?di:yi:a?qc:Pc,g=s?X:v(n);return r(g||n,function(r,u){g&&(u=r,r=n[u]),Sr(f,u,Fr(r,t,e,u,n,o))}),f}function Nr(n){var t=Pc(n);return function(r){return Pr(r,n,t)}}function Pr(n,t,r){var e=r.length;if(null==n)return!e;for(n=ll(n);e--;){var u=r[e],i=t[u],o=n[u];if(o===X&&!(u in n)||!i(o))return!1}return!0}function Gr(n,t,r){if("function"!=typeof n)throw new pl(en);return Ws(function(){n.apply(X,r)},t)}function Hr(n,t,r,e){var u=-1,i=o,a=!0,l=n.length,s=[],h=t.length;
if(!l)return s;r&&(t=c(t,z(r))),e?(i=f,a=!1):t.length>=tn&&(i=S,a=!1,t=new yr(t));n:for(;++u<l;){var p=n[u],_=null==r?p:r(p);if(p=e||0!==p?p:0,a&&_===_){for(var v=h;v--;)if(t[v]===_)continue n;s.push(p)}else i(t,_,e)||s.push(p)}return s}function Jr(n,t){var r=!0;return ys(n,function(n,e,u){return r=!!t(n,e,u)}),r}function Yr(n,t,r){for(var e=-1,u=n.length;++e<u;){var i=n[e],o=t(i);if(null!=o&&(f===X?o===o&&!bc(o):r(o,f)))var f=o,c=i}return c}function ne(n,t,r,e){var u=n.length;for(r=kc(r),r<0&&(r=-r>u?0:u+r),
e=e===X||e>u?u:kc(e),e<0&&(e+=u),e=r>e?0:Oc(e);r<e;)n[r++]=t;return n}function te(n,t){var r=[];return ys(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function ee(n,t,r,e,u){var i=-1,o=n.length;for(r||(r=Li),u||(u=[]);++i<o;){var f=n[i];t>0&&r(f)?t>1?ee(f,t-1,r,e,u):a(u,f):e||(u[u.length]=f)}return u}function ue(n,t){return n&&bs(n,t,Pc)}function oe(n,t){return n&&ws(n,t,Pc)}function fe(n,t){return i(t,function(t){return uc(n[t])})}function _e(n,t){t=ku(t,n);for(var r=0,e=t.length;null!=n&&r<e;)n=n[no(t[r++])];
return r&&r==e?n:X}function de(n,t,r){var e=t(n);return bh(n)?e:a(e,r(n))}function we(n){return null==n?n===X?ut:Jn:Bl&&Bl in ll(n)?ki(n):Ki(n)}function me(n,t){return n>t}function xe(n,t){return null!=n&&bl.call(n,t)}function je(n,t){return null!=n&&t in ll(n)}function Ae(n,t,r){return n>=Hl(t,r)&&n<Gl(t,r)}function ke(n,t,r){for(var e=r?f:o,u=n[0].length,i=n.length,a=i,l=il(i),s=1/0,h=[];a--;){var p=n[a];a&&t&&(p=c(p,z(t))),s=Hl(p.length,s),l[a]=!r&&(t||u>=120&&p.length>=120)?new yr(a&&p):X}p=n[0];
var _=-1,v=l[0];n:for(;++_<u&&h.length<s;){var g=p[_],y=t?t(g):g;if(g=r||0!==g?g:0,!(v?S(v,y):e(h,y,r))){for(a=i;--a;){var d=l[a];if(!(d?S(d,y):e(n[a],y,r)))continue n}v&&v.push(y),h.push(g)}}return h}function Oe(n,t,r,e){return ue(n,function(n,u,i){t(e,r(n),u,i)}),e}function Ie(t,r,e){r=ku(r,t),t=Gi(t,r);var u=null==t?t:t[no(jo(r))];return null==u?X:n(u,t,e)}function Re(n){return cc(n)&&we(n)==Dn}function ze(n){return cc(n)&&we(n)==ft}function Ee(n){return cc(n)&&we(n)==Pn}function Se(n,t,r,e,u){
return n===t||(null==n||null==t||!cc(n)&&!cc(t)?n!==n&&t!==t:We(n,t,r,e,Se,u))}function We(n,t,r,e,u,i){var o=bh(n),f=bh(t),c=o?Mn:zs(n),a=f?Mn:zs(t);c=c==Dn?Yn:c,a=a==Dn?Yn:a;var l=c==Yn,s=a==Yn,h=c==a;if(h&&mh(n)){if(!mh(t))return!1;o=!0,l=!1}if(h&&!l)return i||(i=new wr),o||Oh(n)?pi(n,t,r,e,u,i):_i(n,t,c,r,e,u,i);if(!(r&hn)){var p=l&&bl.call(n,"__wrapped__"),_=s&&bl.call(t,"__wrapped__");if(p||_){var v=p?n.value():n,g=_?t.value():t;return i||(i=new wr),u(v,g,r,e,i)}}return!!h&&(i||(i=new wr),vi(n,t,r,e,u,i));
}function Le(n){return cc(n)&&zs(n)==Gn}function Ce(n,t,r,e){var u=r.length,i=u,o=!e;if(null==n)return!i;for(n=ll(n);u--;){var f=r[u];if(o&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return!1}for(;++u<i;){f=r[u];var c=f[0],a=n[c],l=f[1];if(o&&f[2]){if(a===X&&!(c in n))return!1}else{var s=new wr;if(e)var h=e(a,l,c,n,t,s);if(!(h===X?Se(l,a,hn|pn,e,s):h))return!1}}return!0}function Ue(n){return!(!fc(n)||Di(n))&&(uc(n)?kl:Zt).test(to(n))}function Be(n){return cc(n)&&we(n)==nt}function Te(n){return cc(n)&&zs(n)==tt;
}function $e(n){return cc(n)&&oc(n.length)&&!!Kr[we(n)]}function De(n){return"function"==typeof n?n:null==n?La:"object"==typeof n?bh(n)?Ze(n[0],n[1]):qe(n):Fa(n)}function Me(n){if(!Mi(n))return Vl(n);var t=[];for(var r in ll(n))bl.call(n,r)&&"constructor"!=r&&t.push(r);return t}function Fe(n){if(!fc(n))return Zi(n);var t=Mi(n),r=[];for(var e in n)("constructor"!=e||!t&&bl.call(n,e))&&r.push(e);return r}function Ne(n,t){return n<t}function Pe(n,t){var r=-1,e=Hf(n)?il(n.length):[];return ys(n,function(n,u,i){
e[++r]=t(n,u,i)}),e}function qe(n){var t=ji(n);return 1==t.length&&t[0][2]?Ni(t[0][0],t[0][1]):function(r){return r===n||Ce(r,n,t)}}function Ze(n,t){return Bi(n)&&Fi(t)?Ni(no(n),t):function(r){var e=Mc(r,n);return e===X&&e===t?Nc(r,n):Se(t,e,hn|pn)}}function Ke(n,t,r,e,u){n!==t&&bs(t,function(i,o){if(u||(u=new wr),fc(i))Ve(n,t,o,r,Ke,e,u);else{var f=e?e(Ji(n,o),i,o+"",n,t,u):X;f===X&&(f=i),Er(n,o,f)}},qc)}function Ve(n,t,r,e,u,i,o){var f=Ji(n,r),c=Ji(t,r),a=o.get(c);if(a)return Er(n,r,a),X;var l=i?i(f,c,r+"",n,t,o):X,s=l===X;
if(s){var h=bh(c),p=!h&&mh(c),_=!h&&!p&&Oh(c);l=c,h||p||_?bh(f)?l=f:Jf(f)?l=Tu(f):p?(s=!1,l=Iu(c,!0)):_?(s=!1,l=Wu(c,!0)):l=[]:gc(c)||dh(c)?(l=f,dh(f)?l=Rc(f):fc(f)&&!uc(f)||(l=Ei(c))):s=!1}s&&(o.set(c,l),u(l,c,e,i,o),o.delete(c)),Er(n,r,l)}function Ge(n,t){var r=n.length;if(r)return t+=t<0?r:0,Ci(t,r)?n[t]:X}function He(n,t,r){t=t.length?c(t,function(n){return bh(n)?function(t){return _e(t,1===n.length?n[0]:n)}:n}):[La];var e=-1;return t=c(t,z(mi())),A(Pe(n,function(n,r,u){return{criteria:c(t,function(t){
return t(n)}),index:++e,value:n}}),function(n,t){return Cu(n,t,r)})}function Je(n,t){return Ye(n,t,function(t,r){return Nc(n,r)})}function Ye(n,t,r){for(var e=-1,u=t.length,i={};++e<u;){var o=t[e],f=_e(n,o);r(f,o)&&fu(i,ku(o,n),f)}return i}function Qe(n){return function(t){return _e(t,n)}}function Xe(n,t,r,e){var u=e?d:y,i=-1,o=t.length,f=n;for(n===t&&(t=Tu(t)),r&&(f=c(n,z(r)));++i<o;)for(var a=0,l=t[i],s=r?r(l):l;(a=u(f,s,a,e))>-1;)f!==n&&Ll.call(f,a,1),Ll.call(n,a,1);return n}function nu(n,t){for(var r=n?t.length:0,e=r-1;r--;){
var u=t[r];if(r==e||u!==i){var i=u;Ci(u)?Ll.call(n,u,1):yu(n,u)}}return n}function tu(n,t){return n+Nl(Ql()*(t-n+1))}function ru(n,t,r,e){for(var u=-1,i=Gl(Fl((t-n)/(r||1)),0),o=il(i);i--;)o[e?i:++u]=n,n+=r;return o}function eu(n,t){var r="";if(!n||t<1||t>Wn)return r;do t%2&&(r+=n),t=Nl(t/2),t&&(n+=n);while(t);return r}function uu(n,t){return Ls(Vi(n,t,La),n+"")}function iu(n){return Ir(ra(n))}function ou(n,t){var r=ra(n);return Xi(r,Mr(t,0,r.length))}function fu(n,t,r,e){if(!fc(n))return n;t=ku(t,n);
for(var u=-1,i=t.length,o=i-1,f=n;null!=f&&++u<i;){var c=no(t[u]),a=r;if("__proto__"===c||"constructor"===c||"prototype"===c)return n;if(u!=o){var l=f[c];a=e?e(l,c,f):X,a===X&&(a=fc(l)?l:Ci(t[u+1])?[]:{})}Sr(f,c,a),f=f[c]}return n}function cu(n){return Xi(ra(n))}function au(n,t,r){var e=-1,u=n.length;t<0&&(t=-t>u?0:u+t),r=r>u?u:r,r<0&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0;for(var i=il(u);++e<u;)i[e]=n[e+t];return i}function lu(n,t){var r;return ys(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function su(n,t,r){
var e=0,u=null==n?e:n.length;if("number"==typeof t&&t===t&&u<=Tn){for(;e<u;){var i=e+u>>>1,o=n[i];null!==o&&!bc(o)&&(r?o<=t:o<t)?e=i+1:u=i}return u}return hu(n,t,La,r)}function hu(n,t,r,e){var u=0,i=null==n?0:n.length;if(0===i)return 0;t=r(t);for(var o=t!==t,f=null===t,c=bc(t),a=t===X;u<i;){var l=Nl((u+i)/2),s=r(n[l]),h=s!==X,p=null===s,_=s===s,v=bc(s);if(o)var g=e||_;else g=a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):!p&&!v&&(e?s<=t:s<t);g?u=l+1:i=l}return Hl(i,Bn)}function pu(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){
var o=n[r],f=t?t(o):o;if(!r||!Gf(f,c)){var c=f;i[u++]=0===o?0:o}}return i}function _u(n){return"number"==typeof n?n:bc(n)?Cn:+n}function vu(n){if("string"==typeof n)return n;if(bh(n))return c(n,vu)+"";if(bc(n))return vs?vs.call(n):"";var t=n+"";return"0"==t&&1/n==-Sn?"-0":t}function gu(n,t,r){var e=-1,u=o,i=n.length,c=!0,a=[],l=a;if(r)c=!1,u=f;else if(i>=tn){var s=t?null:ks(n);if(s)return P(s);c=!1,u=S,l=new yr}else l=t?[]:a;n:for(;++e<i;){var h=n[e],p=t?t(h):h;if(h=r||0!==h?h:0,c&&p===p){for(var _=l.length;_--;)if(l[_]===p)continue n;
t&&l.push(p),a.push(h)}else u(l,p,r)||(l!==a&&l.push(p),a.push(h))}return a}function yu(n,t){return t=ku(t,n),n=Gi(n,t),null==n||delete n[no(jo(t))]}function du(n,t,r,e){return fu(n,t,r(_e(n,t)),e)}function bu(n,t,r,e){for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););return r?au(n,e?0:i,e?i+1:u):au(n,e?i+1:0,e?u:i)}function wu(n,t){var r=n;return r instanceof Ct&&(r=r.value()),l(t,function(n,t){return t.func.apply(t.thisArg,a([n],t.args))},r)}function mu(n,t,r){var e=n.length;if(e<2)return e?gu(n[0]):[];
for(var u=-1,i=il(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=Hr(i[u]||o,n[f],t,r));return gu(ee(i,1),t,r)}function xu(n,t,r){for(var e=-1,u=n.length,i=t.length,o={};++e<u;){r(o,n[e],e<i?t[e]:X)}return o}function ju(n){return Jf(n)?n:[]}function Au(n){return"function"==typeof n?n:La}function ku(n,t){return bh(n)?n:Bi(n,t)?[n]:Cs(Ec(n))}function Ou(n,t,r){var e=n.length;return r=r===X?e:r,!t&&r>=e?n:au(n,t,r)}function Iu(n,t){if(t)return n.slice();var r=n.length,e=zl?zl(r):new n.constructor(r);
return n.copy(e),e}function Ru(n){var t=new n.constructor(n.byteLength);return new Rl(t).set(new Rl(n)),t}function zu(n,t){return new n.constructor(t?Ru(n.buffer):n.buffer,n.byteOffset,n.byteLength)}function Eu(n){var t=new n.constructor(n.source,Nt.exec(n));return t.lastIndex=n.lastIndex,t}function Su(n){return _s?ll(_s.call(n)):{}}function Wu(n,t){return new n.constructor(t?Ru(n.buffer):n.buffer,n.byteOffset,n.length)}function Lu(n,t){if(n!==t){var r=n!==X,e=null===n,u=n===n,i=bc(n),o=t!==X,f=null===t,c=t===t,a=bc(t);
if(!f&&!a&&!i&&n>t||i&&o&&c&&!f&&!a||e&&o&&c||!r&&c||!u)return 1;if(!e&&!i&&!a&&n<t||a&&r&&u&&!e&&!i||f&&r&&u||!o&&u||!c)return-1}return 0}function Cu(n,t,r){for(var e=-1,u=n.criteria,i=t.criteria,o=u.length,f=r.length;++e<o;){var c=Lu(u[e],i[e]);if(c){if(e>=f)return c;return c*("desc"==r[e]?-1:1)}}return n.index-t.index}function Uu(n,t,r,e){for(var u=-1,i=n.length,o=r.length,f=-1,c=t.length,a=Gl(i-o,0),l=il(c+a),s=!e;++f<c;)l[f]=t[f];for(;++u<o;)(s||u<i)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l;
}function Bu(n,t,r,e){for(var u=-1,i=n.length,o=-1,f=r.length,c=-1,a=t.length,l=Gl(i-f,0),s=il(l+a),h=!e;++u<l;)s[u]=n[u];for(var p=u;++c<a;)s[p+c]=t[c];for(;++o<f;)(h||u<i)&&(s[p+r[o]]=n[u++]);return s}function Tu(n,t){var r=-1,e=n.length;for(t||(t=il(e));++r<e;)t[r]=n[r];return t}function $u(n,t,r,e){var u=!r;r||(r={});for(var i=-1,o=t.length;++i<o;){var f=t[i],c=e?e(r[f],n[f],f,r,n):X;c===X&&(c=n[f]),u?Br(r,f,c):Sr(r,f,c)}return r}function Du(n,t){return $u(n,Is(n),t)}function Mu(n,t){return $u(n,Rs(n),t);
}function Fu(n,r){return function(e,u){var i=bh(e)?t:Lr,o=r?r():{};return i(e,n,mi(u,2),o)}}function Nu(n){return uu(function(t,r){var e=-1,u=r.length,i=u>1?r[u-1]:X,o=u>2?r[2]:X;for(i=n.length>3&&"function"==typeof i?(u--,i):X,o&&Ui(r[0],r[1],o)&&(i=u<3?X:i,u=1),t=ll(t);++e<u;){var f=r[e];f&&n(t,f,e,i)}return t})}function Pu(n,t){return function(r,e){if(null==r)return r;if(!Hf(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=ll(r);(t?i--:++i<u)&&e(o[i],i,o)!==!1;);return r}}function qu(n){return function(t,r,e){
for(var u=-1,i=ll(t),o=e(t),f=o.length;f--;){var c=o[n?f:++u];if(r(i[c],c,i)===!1)break}return t}}function Zu(n,t,r){function e(){return(this&&this!==re&&this instanceof e?i:n).apply(u?r:this,arguments)}var u=t&_n,i=Gu(n);return e}function Ku(n){return function(t){t=Ec(t);var r=T(t)?G(t):X,e=r?r[0]:t.charAt(0),u=r?Ou(r,1).join(""):t.slice(1);return e[n]()+u}}function Vu(n){return function(t){return l(Ra(ca(t).replace($r,"")),n,"")}}function Gu(n){return function(){var t=arguments;switch(t.length){
case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=gs(n.prototype),e=n.apply(r,t);return fc(e)?e:r}}function Hu(t,r,e){function u(){for(var o=arguments.length,f=il(o),c=o,a=wi(u);c--;)f[c]=arguments[c];var l=o<3&&f[0]!==a&&f[o-1]!==a?[]:N(f,a);
return o-=l.length,o<e?oi(t,r,Qu,u.placeholder,X,f,l,X,X,e-o):n(this&&this!==re&&this instanceof u?i:t,this,f)}var i=Gu(t);return u}function Ju(n){return function(t,r,e){var u=ll(t);if(!Hf(t)){var i=mi(r,3);t=Pc(t),r=function(n){return i(u[n],n,u)}}var o=n(t,r,e);return o>-1?u[i?t[o]:o]:X}}function Yu(n){return gi(function(t){var r=t.length,e=r,u=Y.prototype.thru;for(n&&t.reverse();e--;){var i=t[e];if("function"!=typeof i)throw new pl(en);if(u&&!o&&"wrapper"==bi(i))var o=new Y([],!0)}for(e=o?e:r;++e<r;){
i=t[e];var f=bi(i),c="wrapper"==f?Os(i):X;o=c&&$i(c[0])&&c[1]==(mn|yn|bn|xn)&&!c[4].length&&1==c[9]?o[bi(c[0])].apply(o,c[3]):1==i.length&&$i(i)?o[f]():o.thru(i)}return function(){var n=arguments,e=n[0];if(o&&1==n.length&&bh(e))return o.plant(e).value();for(var u=0,i=r?t[u].apply(this,n):e;++u<r;)i=t[u].call(this,i);return i}})}function Qu(n,t,r,e,u,i,o,f,c,a){function l(){for(var y=arguments.length,d=il(y),b=y;b--;)d[b]=arguments[b];if(_)var w=wi(l),m=C(d,w);if(e&&(d=Uu(d,e,u,_)),i&&(d=Bu(d,i,o,_)),
y-=m,_&&y<a){return oi(n,t,Qu,l.placeholder,r,d,N(d,w),f,c,a-y)}var x=h?r:this,j=p?x[n]:n;return y=d.length,f?d=Hi(d,f):v&&y>1&&d.reverse(),s&&c<y&&(d.length=c),this&&this!==re&&this instanceof l&&(j=g||Gu(j)),j.apply(x,d)}var s=t&mn,h=t&_n,p=t&vn,_=t&(yn|dn),v=t&jn,g=p?X:Gu(n);return l}function Xu(n,t){return function(r,e){return Oe(r,n,t(e),{})}}function ni(n,t){return function(r,e){var u;if(r===X&&e===X)return t;if(r!==X&&(u=r),e!==X){if(u===X)return e;"string"==typeof r||"string"==typeof e?(r=vu(r),
e=vu(e)):(r=_u(r),e=_u(e)),u=n(r,e)}return u}}function ti(t){return gi(function(r){return r=c(r,z(mi())),uu(function(e){var u=this;return t(r,function(t){return n(t,u,e)})})})}function ri(n,t){t=t===X?" ":vu(t);var r=t.length;if(r<2)return r?eu(t,n):t;var e=eu(t,Fl(n/V(t)));return T(t)?Ou(G(e),0,n).join(""):e.slice(0,n)}function ei(t,r,e,u){function i(){for(var r=-1,c=arguments.length,a=-1,l=u.length,s=il(l+c),h=this&&this!==re&&this instanceof i?f:t;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++r];
return n(h,o?e:this,s)}var o=r&_n,f=Gu(t);return i}function ui(n){return function(t,r,e){return e&&"number"!=typeof e&&Ui(t,r,e)&&(r=e=X),t=Ac(t),r===X?(r=t,t=0):r=Ac(r),e=e===X?t<r?1:-1:Ac(e),ru(t,r,e,n)}}function ii(n){return function(t,r){return"string"==typeof t&&"string"==typeof r||(t=Ic(t),r=Ic(r)),n(t,r)}}function oi(n,t,r,e,u,i,o,f,c,a){var l=t&yn,s=l?o:X,h=l?X:o,p=l?i:X,_=l?X:i;t|=l?bn:wn,t&=~(l?wn:bn),t&gn||(t&=~(_n|vn));var v=[n,t,u,p,s,_,h,f,c,a],g=r.apply(X,v);return $i(n)&&Ss(g,v),g.placeholder=e,
Yi(g,n,t)}function fi(n){var t=al[n];return function(n,r){if(n=Ic(n),r=null==r?0:Hl(kc(r),292),r&&Zl(n)){var e=(Ec(n)+"e").split("e");return e=(Ec(t(e[0]+"e"+(+e[1]+r)))+"e").split("e"),+(e[0]+"e"+(+e[1]-r))}return t(n)}}function ci(n){return function(t){var r=zs(t);return r==Gn?M(t):r==tt?q(t):I(t,n(t))}}function ai(n,t,r,e,u,i,o,f){var c=t&vn;if(!c&&"function"!=typeof n)throw new pl(en);var a=e?e.length:0;if(a||(t&=~(bn|wn),e=u=X),o=o===X?o:Gl(kc(o),0),f=f===X?f:kc(f),a-=u?u.length:0,t&wn){var l=e,s=u;
e=u=X}var h=c?X:Os(n),p=[n,t,r,e,u,l,s,i,o,f];if(h&&qi(p,h),n=p[0],t=p[1],r=p[2],e=p[3],u=p[4],f=p[9]=p[9]===X?c?0:n.length:Gl(p[9]-a,0),!f&&t&(yn|dn)&&(t&=~(yn|dn)),t&&t!=_n)_=t==yn||t==dn?Hu(n,t,f):t!=bn&&t!=(_n|bn)||u.length?Qu.apply(X,p):ei(n,t,r,e);else var _=Zu(n,t,r);return Yi((h?ms:Ss)(_,p),n,t)}function li(n,t,r,e){return n===X||Gf(n,gl[r])&&!bl.call(e,r)?t:n}function si(n,t,r,e,u,i){return fc(n)&&fc(t)&&(i.set(t,n),Ke(n,t,X,si,i),i.delete(t)),n}function hi(n){return gc(n)?X:n}function pi(n,t,r,e,u,i){
var o=r&hn,f=n.length,c=t.length;if(f!=c&&!(o&&c>f))return!1;var a=i.get(n),l=i.get(t);if(a&&l)return a==t&&l==n;var s=-1,p=!0,_=r&pn?new yr:X;for(i.set(n,t),i.set(t,n);++s<f;){var v=n[s],g=t[s];if(e)var y=o?e(g,v,s,t,n,i):e(v,g,s,n,t,i);if(y!==X){if(y)continue;p=!1;break}if(_){if(!h(t,function(n,t){if(!S(_,t)&&(v===n||u(v,n,r,e,i)))return _.push(t)})){p=!1;break}}else if(v!==g&&!u(v,g,r,e,i)){p=!1;break}}return i.delete(n),i.delete(t),p}function _i(n,t,r,e,u,i,o){switch(r){case ct:if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)return!1;
n=n.buffer,t=t.buffer;case ft:return!(n.byteLength!=t.byteLength||!i(new Rl(n),new Rl(t)));case Nn:case Pn:case Hn:return Gf(+n,+t);case Zn:return n.name==t.name&&n.message==t.message;case nt:case rt:return n==t+"";case Gn:var f=M;case tt:var c=e&hn;if(f||(f=P),n.size!=t.size&&!c)return!1;var a=o.get(n);if(a)return a==t;e|=pn,o.set(n,t);var l=pi(f(n),f(t),e,u,i,o);return o.delete(n),l;case et:if(_s)return _s.call(n)==_s.call(t)}return!1}function vi(n,t,r,e,u,i){var o=r&hn,f=yi(n),c=f.length;if(c!=yi(t).length&&!o)return!1;
for(var a=c;a--;){var l=f[a];if(!(o?l in t:bl.call(t,l)))return!1}var s=i.get(n),h=i.get(t);if(s&&h)return s==t&&h==n;var p=!0;i.set(n,t),i.set(t,n);for(var _=o;++a<c;){l=f[a];var v=n[l],g=t[l];if(e)var y=o?e(g,v,l,t,n,i):e(v,g,l,n,t,i);if(!(y===X?v===g||u(v,g,r,e,i):y)){p=!1;break}_||(_="constructor"==l)}if(p&&!_){var d=n.constructor,b=t.constructor;d!=b&&"constructor"in n&&"constructor"in t&&!("function"==typeof d&&d instanceof d&&"function"==typeof b&&b instanceof b)&&(p=!1)}return i.delete(n),
i.delete(t),p}function gi(n){return Ls(Vi(n,X,_o),n+"")}function yi(n){return de(n,Pc,Is)}function di(n){return de(n,qc,Rs)}function bi(n){for(var t=n.name+"",r=fs[t],e=bl.call(fs,t)?r.length:0;e--;){var u=r[e],i=u.func;if(null==i||i==n)return u.name}return t}function wi(n){return(bl.call(Z,"placeholder")?Z:n).placeholder}function mi(){var n=Z.iteratee||Ca;return n=n===Ca?De:n,arguments.length?n(arguments[0],arguments[1]):n}function xi(n,t){var r=n.__data__;return Ti(t)?r["string"==typeof t?"string":"hash"]:r.map;
}function ji(n){for(var t=Pc(n),r=t.length;r--;){var e=t[r],u=n[e];t[r]=[e,u,Fi(u)]}return t}function Ai(n,t){var r=B(n,t);return Ue(r)?r:X}function ki(n){var t=bl.call(n,Bl),r=n[Bl];try{n[Bl]=X;var e=!0}catch(n){}var u=xl.call(n);return e&&(t?n[Bl]=r:delete n[Bl]),u}function Oi(n,t,r){for(var e=-1,u=r.length;++e<u;){var i=r[e],o=i.size;switch(i.type){case"drop":n+=o;break;case"dropRight":t-=o;break;case"take":t=Hl(t,n+o);break;case"takeRight":n=Gl(n,t-o)}}return{start:n,end:t}}function Ii(n){var t=n.match(Bt);
return t?t[1].split(Tt):[]}function Ri(n,t,r){t=ku(t,n);for(var e=-1,u=t.length,i=!1;++e<u;){var o=no(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o]}return i||++e!=u?i:(u=null==n?0:n.length,!!u&&oc(u)&&Ci(o,u)&&(bh(n)||dh(n)))}function zi(n){var t=n.length,r=new n.constructor(t);return t&&"string"==typeof n[0]&&bl.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function Ei(n){return"function"!=typeof n.constructor||Mi(n)?{}:gs(El(n))}function Si(n,t,r){var e=n.constructor;switch(t){case ft:return Ru(n);
case Nn:case Pn:return new e(+n);case ct:return zu(n,r);case at:case lt:case st:case ht:case pt:case _t:case vt:case gt:case yt:return Wu(n,r);case Gn:return new e;case Hn:case rt:return new e(n);case nt:return Eu(n);case tt:return new e;case et:return Su(n)}}function Wi(n,t){var r=t.length;if(!r)return n;var e=r-1;return t[e]=(r>1?"& ":"")+t[e],t=t.join(r>2?", ":" "),n.replace(Ut,"{\n/* [wrapped with "+t+"] */\n")}function Li(n){return bh(n)||dh(n)||!!(Cl&&n&&n[Cl])}function Ci(n,t){var r=typeof n;
return t=null==t?Wn:t,!!t&&("number"==r||"symbol"!=r&&Vt.test(n))&&n>-1&&n%1==0&&n<t}function Ui(n,t,r){if(!fc(r))return!1;var e=typeof t;return!!("number"==e?Hf(r)&&Ci(t,r.length):"string"==e&&t in r)&&Gf(r[t],n)}function Bi(n,t){if(bh(n))return!1;var r=typeof n;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=n&&!bc(n))||(zt.test(n)||!Rt.test(n)||null!=t&&n in ll(t))}function Ti(n){var t=typeof n;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==n:null===n}function $i(n){
var t=bi(n),r=Z[t];if("function"!=typeof r||!(t in Ct.prototype))return!1;if(n===r)return!0;var e=Os(r);return!!e&&n===e[0]}function Di(n){return!!ml&&ml in n}function Mi(n){var t=n&&n.constructor;return n===("function"==typeof t&&t.prototype||gl)}function Fi(n){return n===n&&!fc(n)}function Ni(n,t){return function(r){return null!=r&&(r[n]===t&&(t!==X||n in ll(r)))}}function Pi(n){var t=Cf(n,function(n){return r.size===fn&&r.clear(),n}),r=t.cache;return t}function qi(n,t){var r=n[1],e=t[1],u=r|e,i=u<(_n|vn|mn),o=e==mn&&r==yn||e==mn&&r==xn&&n[7].length<=t[8]||e==(mn|xn)&&t[7].length<=t[8]&&r==yn;
if(!i&&!o)return n;e&_n&&(n[2]=t[2],u|=r&_n?0:gn);var f=t[3];if(f){var c=n[3];n[3]=c?Uu(c,f,t[4]):f,n[4]=c?N(n[3],cn):t[4]}return f=t[5],f&&(c=n[5],n[5]=c?Bu(c,f,t[6]):f,n[6]=c?N(n[5],cn):t[6]),f=t[7],f&&(n[7]=f),e&mn&&(n[8]=null==n[8]?t[8]:Hl(n[8],t[8])),null==n[9]&&(n[9]=t[9]),n[0]=t[0],n[1]=u,n}function Zi(n){var t=[];if(null!=n)for(var r in ll(n))t.push(r);return t}function Ki(n){return xl.call(n)}function Vi(t,r,e){return r=Gl(r===X?t.length-1:r,0),function(){for(var u=arguments,i=-1,o=Gl(u.length-r,0),f=il(o);++i<o;)f[i]=u[r+i];
i=-1;for(var c=il(r+1);++i<r;)c[i]=u[i];return c[r]=e(f),n(t,this,c)}}function Gi(n,t){return t.length<2?n:_e(n,au(t,0,-1))}function Hi(n,t){for(var r=n.length,e=Hl(t.length,r),u=Tu(n);e--;){var i=t[e];n[e]=Ci(i,r)?u[i]:X}return n}function Ji(n,t){if(("constructor"!==t||"function"!=typeof n[t])&&"__proto__"!=t)return n[t]}function Yi(n,t,r){var e=t+"";return Ls(n,Wi(e,ro(Ii(e),r)))}function Qi(n){var t=0,r=0;return function(){var e=Jl(),u=In-(e-r);if(r=e,u>0){if(++t>=On)return arguments[0]}else t=0;
return n.apply(X,arguments)}}function Xi(n,t){var r=-1,e=n.length,u=e-1;for(t=t===X?e:t;++r<t;){var i=tu(r,u),o=n[i];n[i]=n[r],n[r]=o}return n.length=t,n}function no(n){if("string"==typeof n||bc(n))return n;var t=n+"";return"0"==t&&1/n==-Sn?"-0":t}function to(n){if(null!=n){try{return dl.call(n)}catch(n){}try{return n+""}catch(n){}}return""}function ro(n,t){return r($n,function(r){var e="_."+r[0];t&r[1]&&!o(n,e)&&n.push(e)}),n.sort()}function eo(n){if(n instanceof Ct)return n.clone();var t=new Y(n.__wrapped__,n.__chain__);
return t.__actions__=Tu(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function uo(n,t,r){t=(r?Ui(n,t,r):t===X)?1:Gl(kc(t),0);var e=null==n?0:n.length;if(!e||t<1)return[];for(var u=0,i=0,o=il(Fl(e/t));u<e;)o[i++]=au(n,u,u+=t);return o}function io(n){for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){var i=n[t];i&&(u[e++]=i)}return u}function oo(){var n=arguments.length;if(!n)return[];for(var t=il(n-1),r=arguments[0],e=n;e--;)t[e-1]=arguments[e];return a(bh(r)?Tu(r):[r],ee(t,1));
}function fo(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===X?1:kc(t),au(n,t<0?0:t,e)):[]}function co(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===X?1:kc(t),t=e-t,au(n,0,t<0?0:t)):[]}function ao(n,t){return n&&n.length?bu(n,mi(t,3),!0,!0):[]}function lo(n,t){return n&&n.length?bu(n,mi(t,3),!0):[]}function so(n,t,r,e){var u=null==n?0:n.length;return u?(r&&"number"!=typeof r&&Ui(n,t,r)&&(r=0,e=u),ne(n,t,r,e)):[]}function ho(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:kc(r);
return u<0&&(u=Gl(e+u,0)),g(n,mi(t,3),u)}function po(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e-1;return r!==X&&(u=kc(r),u=r<0?Gl(e+u,0):Hl(u,e-1)),g(n,mi(t,3),u,!0)}function _o(n){return(null==n?0:n.length)?ee(n,1):[]}function vo(n){return(null==n?0:n.length)?ee(n,Sn):[]}function go(n,t){return(null==n?0:n.length)?(t=t===X?1:kc(t),ee(n,t)):[]}function yo(n){for(var t=-1,r=null==n?0:n.length,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e}function bo(n){return n&&n.length?n[0]:X}function wo(n,t,r){
var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:kc(r);return u<0&&(u=Gl(e+u,0)),y(n,t,u)}function mo(n){return(null==n?0:n.length)?au(n,0,-1):[]}function xo(n,t){return null==n?"":Kl.call(n,t)}function jo(n){var t=null==n?0:n.length;return t?n[t-1]:X}function Ao(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e;return r!==X&&(u=kc(r),u=u<0?Gl(e+u,0):Hl(u,e-1)),t===t?K(n,t,u):g(n,b,u,!0)}function ko(n,t){return n&&n.length?Ge(n,kc(t)):X}function Oo(n,t){return n&&n.length&&t&&t.length?Xe(n,t):n;
}function Io(n,t,r){return n&&n.length&&t&&t.length?Xe(n,t,mi(r,2)):n}function Ro(n,t,r){return n&&n.length&&t&&t.length?Xe(n,t,X,r):n}function zo(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=mi(t,3);++e<i;){var o=n[e];t(o,e,n)&&(r.push(o),u.push(e))}return nu(n,u),r}function Eo(n){return null==n?n:Xl.call(n)}function So(n,t,r){var e=null==n?0:n.length;return e?(r&&"number"!=typeof r&&Ui(n,t,r)?(t=0,r=e):(t=null==t?0:kc(t),r=r===X?e:kc(r)),au(n,t,r)):[]}function Wo(n,t){
return su(n,t)}function Lo(n,t,r){return hu(n,t,mi(r,2))}function Co(n,t){var r=null==n?0:n.length;if(r){var e=su(n,t);if(e<r&&Gf(n[e],t))return e}return-1}function Uo(n,t){return su(n,t,!0)}function Bo(n,t,r){return hu(n,t,mi(r,2),!0)}function To(n,t){if(null==n?0:n.length){var r=su(n,t,!0)-1;if(Gf(n[r],t))return r}return-1}function $o(n){return n&&n.length?pu(n):[]}function Do(n,t){return n&&n.length?pu(n,mi(t,2)):[]}function Mo(n){var t=null==n?0:n.length;return t?au(n,1,t):[]}function Fo(n,t,r){
return n&&n.length?(t=r||t===X?1:kc(t),au(n,0,t<0?0:t)):[]}function No(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===X?1:kc(t),t=e-t,au(n,t<0?0:t,e)):[]}function Po(n,t){return n&&n.length?bu(n,mi(t,3),!1,!0):[]}function qo(n,t){return n&&n.length?bu(n,mi(t,3)):[]}function Zo(n){return n&&n.length?gu(n):[]}function Ko(n,t){return n&&n.length?gu(n,mi(t,2)):[]}function Vo(n,t){return t="function"==typeof t?t:X,n&&n.length?gu(n,X,t):[]}function Go(n){if(!n||!n.length)return[];var t=0;return n=i(n,function(n){
if(Jf(n))return t=Gl(n.length,t),!0}),O(t,function(t){return c(n,m(t))})}function Ho(t,r){if(!t||!t.length)return[];var e=Go(t);return null==r?e:c(e,function(t){return n(r,X,t)})}function Jo(n,t){return xu(n||[],t||[],Sr)}function Yo(n,t){return xu(n||[],t||[],fu)}function Qo(n){var t=Z(n);return t.__chain__=!0,t}function Xo(n,t){return t(n),n}function nf(n,t){return t(n)}function tf(){return Qo(this)}function rf(){return new Y(this.value(),this.__chain__)}function ef(){this.__values__===X&&(this.__values__=jc(this.value()));
var n=this.__index__>=this.__values__.length;return{done:n,value:n?X:this.__values__[this.__index__++]}}function uf(){return this}function of(n){for(var t,r=this;r instanceof J;){var e=eo(r);e.__index__=0,e.__values__=X,t?u.__wrapped__=e:t=e;var u=e;r=r.__wrapped__}return u.__wrapped__=n,t}function ff(){var n=this.__wrapped__;if(n instanceof Ct){var t=n;return this.__actions__.length&&(t=new Ct(this)),t=t.reverse(),t.__actions__.push({func:nf,args:[Eo],thisArg:X}),new Y(t,this.__chain__)}return this.thru(Eo);
}function cf(){return wu(this.__wrapped__,this.__actions__)}function af(n,t,r){var e=bh(n)?u:Jr;return r&&Ui(n,t,r)&&(t=X),e(n,mi(t,3))}function lf(n,t){return(bh(n)?i:te)(n,mi(t,3))}function sf(n,t){return ee(yf(n,t),1)}function hf(n,t){return ee(yf(n,t),Sn)}function pf(n,t,r){return r=r===X?1:kc(r),ee(yf(n,t),r)}function _f(n,t){return(bh(n)?r:ys)(n,mi(t,3))}function vf(n,t){return(bh(n)?e:ds)(n,mi(t,3))}function gf(n,t,r,e){n=Hf(n)?n:ra(n),r=r&&!e?kc(r):0;var u=n.length;return r<0&&(r=Gl(u+r,0)),
dc(n)?r<=u&&n.indexOf(t,r)>-1:!!u&&y(n,t,r)>-1}function yf(n,t){return(bh(n)?c:Pe)(n,mi(t,3))}function df(n,t,r,e){return null==n?[]:(bh(t)||(t=null==t?[]:[t]),r=e?X:r,bh(r)||(r=null==r?[]:[r]),He(n,t,r))}function bf(n,t,r){var e=bh(n)?l:j,u=arguments.length<3;return e(n,mi(t,4),r,u,ys)}function wf(n,t,r){var e=bh(n)?s:j,u=arguments.length<3;return e(n,mi(t,4),r,u,ds)}function mf(n,t){return(bh(n)?i:te)(n,Uf(mi(t,3)))}function xf(n){return(bh(n)?Ir:iu)(n)}function jf(n,t,r){return t=(r?Ui(n,t,r):t===X)?1:kc(t),
(bh(n)?Rr:ou)(n,t)}function Af(n){return(bh(n)?zr:cu)(n)}function kf(n){if(null==n)return 0;if(Hf(n))return dc(n)?V(n):n.length;var t=zs(n);return t==Gn||t==tt?n.size:Me(n).length}function Of(n,t,r){var e=bh(n)?h:lu;return r&&Ui(n,t,r)&&(t=X),e(n,mi(t,3))}function If(n,t){if("function"!=typeof t)throw new pl(en);return n=kc(n),function(){if(--n<1)return t.apply(this,arguments)}}function Rf(n,t,r){return t=r?X:t,t=n&&null==t?n.length:t,ai(n,mn,X,X,X,X,t)}function zf(n,t){var r;if("function"!=typeof t)throw new pl(en);
return n=kc(n),function(){return--n>0&&(r=t.apply(this,arguments)),n<=1&&(t=X),r}}function Ef(n,t,r){t=r?X:t;var e=ai(n,yn,X,X,X,X,X,t);return e.placeholder=Ef.placeholder,e}function Sf(n,t,r){t=r?X:t;var e=ai(n,dn,X,X,X,X,X,t);return e.placeholder=Sf.placeholder,e}function Wf(n,t,r){function e(t){var r=h,e=p;return h=p=X,d=t,v=n.apply(e,r)}function u(n){return d=n,g=Ws(f,t),b?e(n):v}function i(n){var r=n-y,e=n-d,u=t-r;return w?Hl(u,_-e):u}function o(n){var r=n-y,e=n-d;return y===X||r>=t||r<0||w&&e>=_;
}function f(){var n=fh();return o(n)?c(n):(g=Ws(f,i(n)),X)}function c(n){return g=X,m&&h?e(n):(h=p=X,v)}function a(){g!==X&&As(g),d=0,h=y=p=g=X}function l(){return g===X?v:c(fh())}function s(){var n=fh(),r=o(n);if(h=arguments,p=this,y=n,r){if(g===X)return u(y);if(w)return As(g),g=Ws(f,t),e(y)}return g===X&&(g=Ws(f,t)),v}var h,p,_,v,g,y,d=0,b=!1,w=!1,m=!0;if("function"!=typeof n)throw new pl(en);return t=Ic(t)||0,fc(r)&&(b=!!r.leading,w="maxWait"in r,_=w?Gl(Ic(r.maxWait)||0,t):_,m="trailing"in r?!!r.trailing:m),
s.cancel=a,s.flush=l,s}function Lf(n){return ai(n,jn)}function Cf(n,t){if("function"!=typeof n||null!=t&&"function"!=typeof t)throw new pl(en);var r=function(){var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;if(i.has(u))return i.get(u);var o=n.apply(this,e);return r.cache=i.set(u,o)||i,o};return r.cache=new(Cf.Cache||sr),r}function Uf(n){if("function"!=typeof n)throw new pl(en);return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:
return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2])}return!n.apply(this,t)}}function Bf(n){return zf(2,n)}function Tf(n,t){if("function"!=typeof n)throw new pl(en);return t=t===X?t:kc(t),uu(n,t)}function $f(t,r){if("function"!=typeof t)throw new pl(en);return r=null==r?0:Gl(kc(r),0),uu(function(e){var u=e[r],i=Ou(e,0,r);return u&&a(i,u),n(t,this,i)})}function Df(n,t,r){var e=!0,u=!0;if("function"!=typeof n)throw new pl(en);return fc(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),
Wf(n,t,{leading:e,maxWait:t,trailing:u})}function Mf(n){return Rf(n,1)}function Ff(n,t){return ph(Au(t),n)}function Nf(){if(!arguments.length)return[];var n=arguments[0];return bh(n)?n:[n]}function Pf(n){return Fr(n,sn)}function qf(n,t){return t="function"==typeof t?t:X,Fr(n,sn,t)}function Zf(n){return Fr(n,an|sn)}function Kf(n,t){return t="function"==typeof t?t:X,Fr(n,an|sn,t)}function Vf(n,t){return null==t||Pr(n,t,Pc(t))}function Gf(n,t){return n===t||n!==n&&t!==t}function Hf(n){return null!=n&&oc(n.length)&&!uc(n);
}function Jf(n){return cc(n)&&Hf(n)}function Yf(n){return n===!0||n===!1||cc(n)&&we(n)==Nn}function Qf(n){return cc(n)&&1===n.nodeType&&!gc(n)}function Xf(n){if(null==n)return!0;if(Hf(n)&&(bh(n)||"string"==typeof n||"function"==typeof n.splice||mh(n)||Oh(n)||dh(n)))return!n.length;var t=zs(n);if(t==Gn||t==tt)return!n.size;if(Mi(n))return!Me(n).length;for(var r in n)if(bl.call(n,r))return!1;return!0}function nc(n,t){return Se(n,t)}function tc(n,t,r){r="function"==typeof r?r:X;var e=r?r(n,t):X;return e===X?Se(n,t,X,r):!!e;
}function rc(n){if(!cc(n))return!1;var t=we(n);return t==Zn||t==qn||"string"==typeof n.message&&"string"==typeof n.name&&!gc(n)}function ec(n){return"number"==typeof n&&Zl(n)}function uc(n){if(!fc(n))return!1;var t=we(n);return t==Kn||t==Vn||t==Fn||t==Xn}function ic(n){return"number"==typeof n&&n==kc(n)}function oc(n){return"number"==typeof n&&n>-1&&n%1==0&&n<=Wn}function fc(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}function cc(n){return null!=n&&"object"==typeof n}function ac(n,t){
return n===t||Ce(n,t,ji(t))}function lc(n,t,r){return r="function"==typeof r?r:X,Ce(n,t,ji(t),r)}function sc(n){return vc(n)&&n!=+n}function hc(n){if(Es(n))throw new fl(rn);return Ue(n)}function pc(n){return null===n}function _c(n){return null==n}function vc(n){return"number"==typeof n||cc(n)&&we(n)==Hn}function gc(n){if(!cc(n)||we(n)!=Yn)return!1;var t=El(n);if(null===t)return!0;var r=bl.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&dl.call(r)==jl}function yc(n){
return ic(n)&&n>=-Wn&&n<=Wn}function dc(n){return"string"==typeof n||!bh(n)&&cc(n)&&we(n)==rt}function bc(n){return"symbol"==typeof n||cc(n)&&we(n)==et}function wc(n){return n===X}function mc(n){return cc(n)&&zs(n)==it}function xc(n){return cc(n)&&we(n)==ot}function jc(n){if(!n)return[];if(Hf(n))return dc(n)?G(n):Tu(n);if(Ul&&n[Ul])return D(n[Ul]());var t=zs(n);return(t==Gn?M:t==tt?P:ra)(n)}function Ac(n){if(!n)return 0===n?n:0;if(n=Ic(n),n===Sn||n===-Sn){return(n<0?-1:1)*Ln}return n===n?n:0}function kc(n){
var t=Ac(n),r=t%1;return t===t?r?t-r:t:0}function Oc(n){return n?Mr(kc(n),0,Un):0}function Ic(n){if("number"==typeof n)return n;if(bc(n))return Cn;if(fc(n)){var t="function"==typeof n.valueOf?n.valueOf():n;n=fc(t)?t+"":t}if("string"!=typeof n)return 0===n?n:+n;n=R(n);var r=qt.test(n);return r||Kt.test(n)?Xr(n.slice(2),r?2:8):Pt.test(n)?Cn:+n}function Rc(n){return $u(n,qc(n))}function zc(n){return n?Mr(kc(n),-Wn,Wn):0===n?n:0}function Ec(n){return null==n?"":vu(n)}function Sc(n,t){var r=gs(n);return null==t?r:Cr(r,t);
}function Wc(n,t){return v(n,mi(t,3),ue)}function Lc(n,t){return v(n,mi(t,3),oe)}function Cc(n,t){return null==n?n:bs(n,mi(t,3),qc)}function Uc(n,t){return null==n?n:ws(n,mi(t,3),qc)}function Bc(n,t){return n&&ue(n,mi(t,3))}function Tc(n,t){return n&&oe(n,mi(t,3))}function $c(n){return null==n?[]:fe(n,Pc(n))}function Dc(n){return null==n?[]:fe(n,qc(n))}function Mc(n,t,r){var e=null==n?X:_e(n,t);return e===X?r:e}function Fc(n,t){return null!=n&&Ri(n,t,xe)}function Nc(n,t){return null!=n&&Ri(n,t,je);
}function Pc(n){return Hf(n)?Or(n):Me(n)}function qc(n){return Hf(n)?Or(n,!0):Fe(n)}function Zc(n,t){var r={};return t=mi(t,3),ue(n,function(n,e,u){Br(r,t(n,e,u),n)}),r}function Kc(n,t){var r={};return t=mi(t,3),ue(n,function(n,e,u){Br(r,e,t(n,e,u))}),r}function Vc(n,t){return Gc(n,Uf(mi(t)))}function Gc(n,t){if(null==n)return{};var r=c(di(n),function(n){return[n]});return t=mi(t),Ye(n,r,function(n,r){return t(n,r[0])})}function Hc(n,t,r){t=ku(t,n);var e=-1,u=t.length;for(u||(u=1,n=X);++e<u;){var i=null==n?X:n[no(t[e])];
i===X&&(e=u,i=r),n=uc(i)?i.call(n):i}return n}function Jc(n,t,r){return null==n?n:fu(n,t,r)}function Yc(n,t,r,e){return e="function"==typeof e?e:X,null==n?n:fu(n,t,r,e)}function Qc(n,t,e){var u=bh(n),i=u||mh(n)||Oh(n);if(t=mi(t,4),null==e){var o=n&&n.constructor;e=i?u?new o:[]:fc(n)&&uc(o)?gs(El(n)):{}}return(i?r:ue)(n,function(n,r,u){return t(e,n,r,u)}),e}function Xc(n,t){return null==n||yu(n,t)}function na(n,t,r){return null==n?n:du(n,t,Au(r))}function ta(n,t,r,e){return e="function"==typeof e?e:X,
null==n?n:du(n,t,Au(r),e)}function ra(n){return null==n?[]:E(n,Pc(n))}function ea(n){return null==n?[]:E(n,qc(n))}function ua(n,t,r){return r===X&&(r=t,t=X),r!==X&&(r=Ic(r),r=r===r?r:0),t!==X&&(t=Ic(t),t=t===t?t:0),Mr(Ic(n),t,r)}function ia(n,t,r){return t=Ac(t),r===X?(r=t,t=0):r=Ac(r),n=Ic(n),Ae(n,t,r)}function oa(n,t,r){if(r&&"boolean"!=typeof r&&Ui(n,t,r)&&(t=r=X),r===X&&("boolean"==typeof t?(r=t,t=X):"boolean"==typeof n&&(r=n,n=X)),n===X&&t===X?(n=0,t=1):(n=Ac(n),t===X?(t=n,n=0):t=Ac(t)),n>t){
var e=n;n=t,t=e}if(r||n%1||t%1){var u=Ql();return Hl(n+u*(t-n+Qr("1e-"+((u+"").length-1))),t)}return tu(n,t)}function fa(n){return Qh(Ec(n).toLowerCase())}function ca(n){return n=Ec(n),n&&n.replace(Gt,ve).replace(Dr,"")}function aa(n,t,r){n=Ec(n),t=vu(t);var e=n.length;r=r===X?e:Mr(kc(r),0,e);var u=r;return r-=t.length,r>=0&&n.slice(r,u)==t}function la(n){return n=Ec(n),n&&At.test(n)?n.replace(xt,ge):n}function sa(n){return n=Ec(n),n&&Wt.test(n)?n.replace(St,"\\$&"):n}function ha(n,t,r){n=Ec(n),t=kc(t);
var e=t?V(n):0;if(!t||e>=t)return n;var u=(t-e)/2;return ri(Nl(u),r)+n+ri(Fl(u),r)}function pa(n,t,r){n=Ec(n),t=kc(t);var e=t?V(n):0;return t&&e<t?n+ri(t-e,r):n}function _a(n,t,r){n=Ec(n),t=kc(t);var e=t?V(n):0;return t&&e<t?ri(t-e,r)+n:n}function va(n,t,r){return r||null==t?t=0:t&&(t=+t),Yl(Ec(n).replace(Lt,""),t||0)}function ga(n,t,r){return t=(r?Ui(n,t,r):t===X)?1:kc(t),eu(Ec(n),t)}function ya(){var n=arguments,t=Ec(n[0]);return n.length<3?t:t.replace(n[1],n[2])}function da(n,t,r){return r&&"number"!=typeof r&&Ui(n,t,r)&&(t=r=X),
(r=r===X?Un:r>>>0)?(n=Ec(n),n&&("string"==typeof t||null!=t&&!Ah(t))&&(t=vu(t),!t&&T(n))?Ou(G(n),0,r):n.split(t,r)):[]}function ba(n,t,r){return n=Ec(n),r=null==r?0:Mr(kc(r),0,n.length),t=vu(t),n.slice(r,r+t.length)==t}function wa(n,t,r){var e=Z.templateSettings;r&&Ui(n,t,r)&&(t=X),n=Ec(n),t=Sh({},t,e,li);var u,i,o=Sh({},t.imports,e.imports,li),f=Pc(o),c=E(o,f),a=0,l=t.interpolate||Ht,s="__p += '",h=sl((t.escape||Ht).source+"|"+l.source+"|"+(l===It?Ft:Ht).source+"|"+(t.evaluate||Ht).source+"|$","g"),p="//# sourceURL="+(bl.call(t,"sourceURL")?(t.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Zr+"]")+"\n";
n.replace(h,function(t,r,e,o,f,c){return e||(e=o),s+=n.slice(a,c).replace(Jt,U),r&&(u=!0,s+="' +\n__e("+r+") +\n'"),f&&(i=!0,s+="';\n"+f+";\n__p += '"),e&&(s+="' +\n((__t = ("+e+")) == null ? '' : __t) +\n'"),a=c+t.length,t}),s+="';\n";var _=bl.call(t,"variable")&&t.variable;if(_){if(Dt.test(_))throw new fl(un)}else s="with (obj) {\n"+s+"\n}\n";s=(i?s.replace(dt,""):s).replace(bt,"$1").replace(wt,"$1;"),s="function("+(_||"obj")+") {\n"+(_?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(u?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+s+"return __p\n}";
var v=Xh(function(){return cl(f,p+"return "+s).apply(X,c)});if(v.source=s,rc(v))throw v;return v}function ma(n){return Ec(n).toLowerCase()}function xa(n){return Ec(n).toUpperCase()}function ja(n,t,r){if(n=Ec(n),n&&(r||t===X))return R(n);if(!n||!(t=vu(t)))return n;var e=G(n),u=G(t);return Ou(e,W(e,u),L(e,u)+1).join("")}function Aa(n,t,r){if(n=Ec(n),n&&(r||t===X))return n.slice(0,H(n)+1);if(!n||!(t=vu(t)))return n;var e=G(n);return Ou(e,0,L(e,G(t))+1).join("")}function ka(n,t,r){if(n=Ec(n),n&&(r||t===X))return n.replace(Lt,"");
if(!n||!(t=vu(t)))return n;var e=G(n);return Ou(e,W(e,G(t))).join("")}function Oa(n,t){var r=An,e=kn;if(fc(t)){var u="separator"in t?t.separator:u;r="length"in t?kc(t.length):r,e="omission"in t?vu(t.omission):e}n=Ec(n);var i=n.length;if(T(n)){var o=G(n);i=o.length}if(r>=i)return n;var f=r-V(e);if(f<1)return e;var c=o?Ou(o,0,f).join(""):n.slice(0,f);if(u===X)return c+e;if(o&&(f+=c.length-f),Ah(u)){if(n.slice(f).search(u)){var a,l=c;for(u.global||(u=sl(u.source,Ec(Nt.exec(u))+"g")),u.lastIndex=0;a=u.exec(l);)var s=a.index;
c=c.slice(0,s===X?f:s)}}else if(n.indexOf(vu(u),f)!=f){var h=c.lastIndexOf(u);h>-1&&(c=c.slice(0,h))}return c+e}function Ia(n){return n=Ec(n),n&&jt.test(n)?n.replace(mt,ye):n}function Ra(n,t,r){return n=Ec(n),t=r?X:t,t===X?$(n)?Q(n):_(n):n.match(t)||[]}function za(t){var r=null==t?0:t.length,e=mi();return t=r?c(t,function(n){if("function"!=typeof n[1])throw new pl(en);return[e(n[0]),n[1]]}):[],uu(function(e){for(var u=-1;++u<r;){var i=t[u];if(n(i[0],this,e))return n(i[1],this,e)}})}function Ea(n){
return Nr(Fr(n,an))}function Sa(n){return function(){return n}}function Wa(n,t){return null==n||n!==n?t:n}function La(n){return n}function Ca(n){return De("function"==typeof n?n:Fr(n,an))}function Ua(n){return qe(Fr(n,an))}function Ba(n,t){return Ze(n,Fr(t,an))}function Ta(n,t,e){var u=Pc(t),i=fe(t,u);null!=e||fc(t)&&(i.length||!u.length)||(e=t,t=n,n=this,i=fe(t,Pc(t)));var o=!(fc(e)&&"chain"in e&&!e.chain),f=uc(n);return r(i,function(r){var e=t[r];n[r]=e,f&&(n.prototype[r]=function(){var t=this.__chain__;
if(o||t){var r=n(this.__wrapped__);return(r.__actions__=Tu(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,a([this.value()],arguments))})}),n}function $a(){return re._===this&&(re._=Al),this}function Da(){}function Ma(n){return n=kc(n),uu(function(t){return Ge(t,n)})}function Fa(n){return Bi(n)?m(no(n)):Qe(n)}function Na(n){return function(t){return null==n?X:_e(n,t)}}function Pa(){return[]}function qa(){return!1}function Za(){return{}}function Ka(){return"";
}function Va(){return!0}function Ga(n,t){if(n=kc(n),n<1||n>Wn)return[];var r=Un,e=Hl(n,Un);t=mi(t),n-=Un;for(var u=O(e,t);++r<n;)t(r);return u}function Ha(n){return bh(n)?c(n,no):bc(n)?[n]:Tu(Cs(Ec(n)))}function Ja(n){var t=++wl;return Ec(n)+t}function Ya(n){return n&&n.length?Yr(n,La,me):X}function Qa(n,t){return n&&n.length?Yr(n,mi(t,2),me):X}function Xa(n){return w(n,La)}function nl(n,t){return w(n,mi(t,2))}function tl(n){return n&&n.length?Yr(n,La,Ne):X}function rl(n,t){return n&&n.length?Yr(n,mi(t,2),Ne):X;
}function el(n){return n&&n.length?k(n,La):0}function ul(n,t){return n&&n.length?k(n,mi(t,2)):0}x=null==x?re:be.defaults(re.Object(),x,be.pick(re,qr));var il=x.Array,ol=x.Date,fl=x.Error,cl=x.Function,al=x.Math,ll=x.Object,sl=x.RegExp,hl=x.String,pl=x.TypeError,_l=il.prototype,vl=cl.prototype,gl=ll.prototype,yl=x["__core-js_shared__"],dl=vl.toString,bl=gl.hasOwnProperty,wl=0,ml=function(){var n=/[^.]+$/.exec(yl&&yl.keys&&yl.keys.IE_PROTO||"");return n?"Symbol(src)_1."+n:""}(),xl=gl.toString,jl=dl.call(ll),Al=re._,kl=sl("^"+dl.call(bl).replace(St,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ol=ie?x.Buffer:X,Il=x.Symbol,Rl=x.Uint8Array,zl=Ol?Ol.allocUnsafe:X,El=F(ll.getPrototypeOf,ll),Sl=ll.create,Wl=gl.propertyIsEnumerable,Ll=_l.splice,Cl=Il?Il.isConcatSpreadable:X,Ul=Il?Il.iterator:X,Bl=Il?Il.toStringTag:X,Tl=function(){
try{var n=Ai(ll,"defineProperty");return n({},"",{}),n}catch(n){}}(),$l=x.clearTimeout!==re.clearTimeout&&x.clearTimeout,Dl=ol&&ol.now!==re.Date.now&&ol.now,Ml=x.setTimeout!==re.setTimeout&&x.setTimeout,Fl=al.ceil,Nl=al.floor,Pl=ll.getOwnPropertySymbols,ql=Ol?Ol.isBuffer:X,Zl=x.isFinite,Kl=_l.join,Vl=F(ll.keys,ll),Gl=al.max,Hl=al.min,Jl=ol.now,Yl=x.parseInt,Ql=al.random,Xl=_l.reverse,ns=Ai(x,"DataView"),ts=Ai(x,"Map"),rs=Ai(x,"Promise"),es=Ai(x,"Set"),us=Ai(x,"WeakMap"),is=Ai(ll,"create"),os=us&&new us,fs={},cs=to(ns),as=to(ts),ls=to(rs),ss=to(es),hs=to(us),ps=Il?Il.prototype:X,_s=ps?ps.valueOf:X,vs=ps?ps.toString:X,gs=function(){
function n(){}return function(t){if(!fc(t))return{};if(Sl)return Sl(t);n.prototype=t;var r=new n;return n.prototype=X,r}}();Z.templateSettings={escape:kt,evaluate:Ot,interpolate:It,variable:"",imports:{_:Z}},Z.prototype=J.prototype,Z.prototype.constructor=Z,Y.prototype=gs(J.prototype),Y.prototype.constructor=Y,Ct.prototype=gs(J.prototype),Ct.prototype.constructor=Ct,Xt.prototype.clear=nr,Xt.prototype.delete=tr,Xt.prototype.get=rr,Xt.prototype.has=er,Xt.prototype.set=ur,ir.prototype.clear=or,ir.prototype.delete=fr,
ir.prototype.get=cr,ir.prototype.has=ar,ir.prototype.set=lr,sr.prototype.clear=hr,sr.prototype.delete=pr,sr.prototype.get=_r,sr.prototype.has=vr,sr.prototype.set=gr,yr.prototype.add=yr.prototype.push=dr,yr.prototype.has=br,wr.prototype.clear=mr,wr.prototype.delete=xr,wr.prototype.get=jr,wr.prototype.has=Ar,wr.prototype.set=kr;var ys=Pu(ue),ds=Pu(oe,!0),bs=qu(),ws=qu(!0),ms=os?function(n,t){return os.set(n,t),n}:La,xs=Tl?function(n,t){return Tl(n,"toString",{configurable:!0,enumerable:!1,value:Sa(t),
writable:!0})}:La,js=uu,As=$l||function(n){return re.clearTimeout(n)},ks=es&&1/P(new es([,-0]))[1]==Sn?function(n){return new es(n)}:Da,Os=os?function(n){return os.get(n)}:Da,Is=Pl?function(n){return null==n?[]:(n=ll(n),i(Pl(n),function(t){return Wl.call(n,t)}))}:Pa,Rs=Pl?function(n){for(var t=[];n;)a(t,Is(n)),n=El(n);return t}:Pa,zs=we;(ns&&zs(new ns(new ArrayBuffer(1)))!=ct||ts&&zs(new ts)!=Gn||rs&&zs(rs.resolve())!=Qn||es&&zs(new es)!=tt||us&&zs(new us)!=it)&&(zs=function(n){var t=we(n),r=t==Yn?n.constructor:X,e=r?to(r):"";
if(e)switch(e){case cs:return ct;case as:return Gn;case ls:return Qn;case ss:return tt;case hs:return it}return t});var Es=yl?uc:qa,Ss=Qi(ms),Ws=Ml||function(n,t){return re.setTimeout(n,t)},Ls=Qi(xs),Cs=Pi(function(n){var t=[];return 46===n.charCodeAt(0)&&t.push(""),n.replace(Et,function(n,r,e,u){t.push(e?u.replace(Mt,"$1"):r||n)}),t}),Us=uu(function(n,t){return Jf(n)?Hr(n,ee(t,1,Jf,!0)):[]}),Bs=uu(function(n,t){var r=jo(t);return Jf(r)&&(r=X),Jf(n)?Hr(n,ee(t,1,Jf,!0),mi(r,2)):[]}),Ts=uu(function(n,t){
var r=jo(t);return Jf(r)&&(r=X),Jf(n)?Hr(n,ee(t,1,Jf,!0),X,r):[]}),$s=uu(function(n){var t=c(n,ju);return t.length&&t[0]===n[0]?ke(t):[]}),Ds=uu(function(n){var t=jo(n),r=c(n,ju);return t===jo(r)?t=X:r.pop(),r.length&&r[0]===n[0]?ke(r,mi(t,2)):[]}),Ms=uu(function(n){var t=jo(n),r=c(n,ju);return t="function"==typeof t?t:X,t&&r.pop(),r.length&&r[0]===n[0]?ke(r,X,t):[]}),Fs=uu(Oo),Ns=gi(function(n,t){var r=null==n?0:n.length,e=Tr(n,t);return nu(n,c(t,function(n){return Ci(n,r)?+n:n}).sort(Lu)),e}),Ps=uu(function(n){
return gu(ee(n,1,Jf,!0))}),qs=uu(function(n){var t=jo(n);return Jf(t)&&(t=X),gu(ee(n,1,Jf,!0),mi(t,2))}),Zs=uu(function(n){var t=jo(n);return t="function"==typeof t?t:X,gu(ee(n,1,Jf,!0),X,t)}),Ks=uu(function(n,t){return Jf(n)?Hr(n,t):[]}),Vs=uu(function(n){return mu(i(n,Jf))}),Gs=uu(function(n){var t=jo(n);return Jf(t)&&(t=X),mu(i(n,Jf),mi(t,2))}),Hs=uu(function(n){var t=jo(n);return t="function"==typeof t?t:X,mu(i(n,Jf),X,t)}),Js=uu(Go),Ys=uu(function(n){var t=n.length,r=t>1?n[t-1]:X;return r="function"==typeof r?(n.pop(),
r):X,Ho(n,r)}),Qs=gi(function(n){var t=n.length,r=t?n[0]:0,e=this.__wrapped__,u=function(t){return Tr(t,n)};return!(t>1||this.__actions__.length)&&e instanceof Ct&&Ci(r)?(e=e.slice(r,+r+(t?1:0)),e.__actions__.push({func:nf,args:[u],thisArg:X}),new Y(e,this.__chain__).thru(function(n){return t&&!n.length&&n.push(X),n})):this.thru(u)}),Xs=Fu(function(n,t,r){bl.call(n,r)?++n[r]:Br(n,r,1)}),nh=Ju(ho),th=Ju(po),rh=Fu(function(n,t,r){bl.call(n,r)?n[r].push(t):Br(n,r,[t])}),eh=uu(function(t,r,e){var u=-1,i="function"==typeof r,o=Hf(t)?il(t.length):[];
return ys(t,function(t){o[++u]=i?n(r,t,e):Ie(t,r,e)}),o}),uh=Fu(function(n,t,r){Br(n,r,t)}),ih=Fu(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),oh=uu(function(n,t){if(null==n)return[];var r=t.length;return r>1&&Ui(n,t[0],t[1])?t=[]:r>2&&Ui(t[0],t[1],t[2])&&(t=[t[0]]),He(n,ee(t,1),[])}),fh=Dl||function(){return re.Date.now()},ch=uu(function(n,t,r){var e=_n;if(r.length){var u=N(r,wi(ch));e|=bn}return ai(n,e,t,r,u)}),ah=uu(function(n,t,r){var e=_n|vn;if(r.length){var u=N(r,wi(ah));e|=bn;
}return ai(t,e,n,r,u)}),lh=uu(function(n,t){return Gr(n,1,t)}),sh=uu(function(n,t,r){return Gr(n,Ic(t)||0,r)});Cf.Cache=sr;var hh=js(function(t,r){r=1==r.length&&bh(r[0])?c(r[0],z(mi())):c(ee(r,1),z(mi()));var e=r.length;return uu(function(u){for(var i=-1,o=Hl(u.length,e);++i<o;)u[i]=r[i].call(this,u[i]);return n(t,this,u)})}),ph=uu(function(n,t){return ai(n,bn,X,t,N(t,wi(ph)))}),_h=uu(function(n,t){return ai(n,wn,X,t,N(t,wi(_h)))}),vh=gi(function(n,t){return ai(n,xn,X,X,X,t)}),gh=ii(me),yh=ii(function(n,t){
return n>=t}),dh=Re(function(){return arguments}())?Re:function(n){return cc(n)&&bl.call(n,"callee")&&!Wl.call(n,"callee")},bh=il.isArray,wh=ce?z(ce):ze,mh=ql||qa,xh=ae?z(ae):Ee,jh=le?z(le):Le,Ah=se?z(se):Be,kh=he?z(he):Te,Oh=pe?z(pe):$e,Ih=ii(Ne),Rh=ii(function(n,t){return n<=t}),zh=Nu(function(n,t){if(Mi(t)||Hf(t))return $u(t,Pc(t),n),X;for(var r in t)bl.call(t,r)&&Sr(n,r,t[r])}),Eh=Nu(function(n,t){$u(t,qc(t),n)}),Sh=Nu(function(n,t,r,e){$u(t,qc(t),n,e)}),Wh=Nu(function(n,t,r,e){$u(t,Pc(t),n,e);
}),Lh=gi(Tr),Ch=uu(function(n,t){n=ll(n);var r=-1,e=t.length,u=e>2?t[2]:X;for(u&&Ui(t[0],t[1],u)&&(e=1);++r<e;)for(var i=t[r],o=qc(i),f=-1,c=o.length;++f<c;){var a=o[f],l=n[a];(l===X||Gf(l,gl[a])&&!bl.call(n,a))&&(n[a]=i[a])}return n}),Uh=uu(function(t){return t.push(X,si),n(Mh,X,t)}),Bh=Xu(function(n,t,r){null!=t&&"function"!=typeof t.toString&&(t=xl.call(t)),n[t]=r},Sa(La)),Th=Xu(function(n,t,r){null!=t&&"function"!=typeof t.toString&&(t=xl.call(t)),bl.call(n,t)?n[t].push(r):n[t]=[r]},mi),$h=uu(Ie),Dh=Nu(function(n,t,r){
Ke(n,t,r)}),Mh=Nu(function(n,t,r,e){Ke(n,t,r,e)}),Fh=gi(function(n,t){var r={};if(null==n)return r;var e=!1;t=c(t,function(t){return t=ku(t,n),e||(e=t.length>1),t}),$u(n,di(n),r),e&&(r=Fr(r,an|ln|sn,hi));for(var u=t.length;u--;)yu(r,t[u]);return r}),Nh=gi(function(n,t){return null==n?{}:Je(n,t)}),Ph=ci(Pc),qh=ci(qc),Zh=Vu(function(n,t,r){return t=t.toLowerCase(),n+(r?fa(t):t)}),Kh=Vu(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Vh=Vu(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),Gh=Ku("toLowerCase"),Hh=Vu(function(n,t,r){
return n+(r?"_":"")+t.toLowerCase()}),Jh=Vu(function(n,t,r){return n+(r?" ":"")+Qh(t)}),Yh=Vu(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),Qh=Ku("toUpperCase"),Xh=uu(function(t,r){try{return n(t,X,r)}catch(n){return rc(n)?n:new fl(n)}}),np=gi(function(n,t){return r(t,function(t){t=no(t),Br(n,t,ch(n[t],n))}),n}),tp=Yu(),rp=Yu(!0),ep=uu(function(n,t){return function(r){return Ie(r,n,t)}}),up=uu(function(n,t){return function(r){return Ie(n,r,t)}}),ip=ti(c),op=ti(u),fp=ti(h),cp=ui(),ap=ui(!0),lp=ni(function(n,t){
return n+t},0),sp=fi("ceil"),hp=ni(function(n,t){return n/t},1),pp=fi("floor"),_p=ni(function(n,t){return n*t},1),vp=fi("round"),gp=ni(function(n,t){return n-t},0);return Z.after=If,Z.ary=Rf,Z.assign=zh,Z.assignIn=Eh,Z.assignInWith=Sh,Z.assignWith=Wh,Z.at=Lh,Z.before=zf,Z.bind=ch,Z.bindAll=np,Z.bindKey=ah,Z.castArray=Nf,Z.chain=Qo,Z.chunk=uo,Z.compact=io,Z.concat=oo,Z.cond=za,Z.conforms=Ea,Z.constant=Sa,Z.countBy=Xs,Z.create=Sc,Z.curry=Ef,Z.curryRight=Sf,Z.debounce=Wf,Z.defaults=Ch,Z.defaultsDeep=Uh,
Z.defer=lh,Z.delay=sh,Z.difference=Us,Z.differenceBy=Bs,Z.differenceWith=Ts,Z.drop=fo,Z.dropRight=co,Z.dropRightWhile=ao,Z.dropWhile=lo,Z.fill=so,Z.filter=lf,Z.flatMap=sf,Z.flatMapDeep=hf,Z.flatMapDepth=pf,Z.flatten=_o,Z.flattenDeep=vo,Z.flattenDepth=go,Z.flip=Lf,Z.flow=tp,Z.flowRight=rp,Z.fromPairs=yo,Z.functions=$c,Z.functionsIn=Dc,Z.groupBy=rh,Z.initial=mo,Z.intersection=$s,Z.intersectionBy=Ds,Z.intersectionWith=Ms,Z.invert=Bh,Z.invertBy=Th,Z.invokeMap=eh,Z.iteratee=Ca,Z.keyBy=uh,Z.keys=Pc,Z.keysIn=qc,
Z.map=yf,Z.mapKeys=Zc,Z.mapValues=Kc,Z.matches=Ua,Z.matchesProperty=Ba,Z.memoize=Cf,Z.merge=Dh,Z.mergeWith=Mh,Z.method=ep,Z.methodOf=up,Z.mixin=Ta,Z.negate=Uf,Z.nthArg=Ma,Z.omit=Fh,Z.omitBy=Vc,Z.once=Bf,Z.orderBy=df,Z.over=ip,Z.overArgs=hh,Z.overEvery=op,Z.overSome=fp,Z.partial=ph,Z.partialRight=_h,Z.partition=ih,Z.pick=Nh,Z.pickBy=Gc,Z.property=Fa,Z.propertyOf=Na,Z.pull=Fs,Z.pullAll=Oo,Z.pullAllBy=Io,Z.pullAllWith=Ro,Z.pullAt=Ns,Z.range=cp,Z.rangeRight=ap,Z.rearg=vh,Z.reject=mf,Z.remove=zo,Z.rest=Tf,
Z.reverse=Eo,Z.sampleSize=jf,Z.set=Jc,Z.setWith=Yc,Z.shuffle=Af,Z.slice=So,Z.sortBy=oh,Z.sortedUniq=$o,Z.sortedUniqBy=Do,Z.split=da,Z.spread=$f,Z.tail=Mo,Z.take=Fo,Z.takeRight=No,Z.takeRightWhile=Po,Z.takeWhile=qo,Z.tap=Xo,Z.throttle=Df,Z.thru=nf,Z.toArray=jc,Z.toPairs=Ph,Z.toPairsIn=qh,Z.toPath=Ha,Z.toPlainObject=Rc,Z.transform=Qc,Z.unary=Mf,Z.union=Ps,Z.unionBy=qs,Z.unionWith=Zs,Z.uniq=Zo,Z.uniqBy=Ko,Z.uniqWith=Vo,Z.unset=Xc,Z.unzip=Go,Z.unzipWith=Ho,Z.update=na,Z.updateWith=ta,Z.values=ra,Z.valuesIn=ea,
Z.without=Ks,Z.words=Ra,Z.wrap=Ff,Z.xor=Vs,Z.xorBy=Gs,Z.xorWith=Hs,Z.zip=Js,Z.zipObject=Jo,Z.zipObjectDeep=Yo,Z.zipWith=Ys,Z.entries=Ph,Z.entriesIn=qh,Z.extend=Eh,Z.extendWith=Sh,Ta(Z,Z),Z.add=lp,Z.attempt=Xh,Z.camelCase=Zh,Z.capitalize=fa,Z.ceil=sp,Z.clamp=ua,Z.clone=Pf,Z.cloneDeep=Zf,Z.cloneDeepWith=Kf,Z.cloneWith=qf,Z.conformsTo=Vf,Z.deburr=ca,Z.defaultTo=Wa,Z.divide=hp,Z.endsWith=aa,Z.eq=Gf,Z.escape=la,Z.escapeRegExp=sa,Z.every=af,Z.find=nh,Z.findIndex=ho,Z.findKey=Wc,Z.findLast=th,Z.findLastIndex=po,
Z.findLastKey=Lc,Z.floor=pp,Z.forEach=_f,Z.forEachRight=vf,Z.forIn=Cc,Z.forInRight=Uc,Z.forOwn=Bc,Z.forOwnRight=Tc,Z.get=Mc,Z.gt=gh,Z.gte=yh,Z.has=Fc,Z.hasIn=Nc,Z.head=bo,Z.identity=La,Z.includes=gf,Z.indexOf=wo,Z.inRange=ia,Z.invoke=$h,Z.isArguments=dh,Z.isArray=bh,Z.isArrayBuffer=wh,Z.isArrayLike=Hf,Z.isArrayLikeObject=Jf,Z.isBoolean=Yf,Z.isBuffer=mh,Z.isDate=xh,Z.isElement=Qf,Z.isEmpty=Xf,Z.isEqual=nc,Z.isEqualWith=tc,Z.isError=rc,Z.isFinite=ec,Z.isFunction=uc,Z.isInteger=ic,Z.isLength=oc,Z.isMap=jh,
Z.isMatch=ac,Z.isMatchWith=lc,Z.isNaN=sc,Z.isNative=hc,Z.isNil=_c,Z.isNull=pc,Z.isNumber=vc,Z.isObject=fc,Z.isObjectLike=cc,Z.isPlainObject=gc,Z.isRegExp=Ah,Z.isSafeInteger=yc,Z.isSet=kh,Z.isString=dc,Z.isSymbol=bc,Z.isTypedArray=Oh,Z.isUndefined=wc,Z.isWeakMap=mc,Z.isWeakSet=xc,Z.join=xo,Z.kebabCase=Kh,Z.last=jo,Z.lastIndexOf=Ao,Z.lowerCase=Vh,Z.lowerFirst=Gh,Z.lt=Ih,Z.lte=Rh,Z.max=Ya,Z.maxBy=Qa,Z.mean=Xa,Z.meanBy=nl,Z.min=tl,Z.minBy=rl,Z.stubArray=Pa,Z.stubFalse=qa,Z.stubObject=Za,Z.stubString=Ka,
Z.stubTrue=Va,Z.multiply=_p,Z.nth=ko,Z.noConflict=$a,Z.noop=Da,Z.now=fh,Z.pad=ha,Z.padEnd=pa,Z.padStart=_a,Z.parseInt=va,Z.random=oa,Z.reduce=bf,Z.reduceRight=wf,Z.repeat=ga,Z.replace=ya,Z.result=Hc,Z.round=vp,Z.runInContext=p,Z.sample=xf,Z.size=kf,Z.snakeCase=Hh,Z.some=Of,Z.sortedIndex=Wo,Z.sortedIndexBy=Lo,Z.sortedIndexOf=Co,Z.sortedLastIndex=Uo,Z.sortedLastIndexBy=Bo,Z.sortedLastIndexOf=To,Z.startCase=Jh,Z.startsWith=ba,Z.subtract=gp,Z.sum=el,Z.sumBy=ul,Z.template=wa,Z.times=Ga,Z.toFinite=Ac,Z.toInteger=kc,
Z.toLength=Oc,Z.toLower=ma,Z.toNumber=Ic,Z.toSafeInteger=zc,Z.toString=Ec,Z.toUpper=xa,Z.trim=ja,Z.trimEnd=Aa,Z.trimStart=ka,Z.truncate=Oa,Z.unescape=Ia,Z.uniqueId=Ja,Z.upperCase=Yh,Z.upperFirst=Qh,Z.each=_f,Z.eachRight=vf,Z.first=bo,Ta(Z,function(){var n={};return ue(Z,function(t,r){bl.call(Z.prototype,r)||(n[r]=t)}),n}(),{chain:!1}),Z.VERSION=nn,r(["bind","bindKey","curry","curryRight","partial","partialRight"],function(n){Z[n].placeholder=Z}),r(["drop","take"],function(n,t){Ct.prototype[n]=function(r){
r=r===X?1:Gl(kc(r),0);var e=this.__filtered__&&!t?new Ct(this):this.clone();return e.__filtered__?e.__takeCount__=Hl(r,e.__takeCount__):e.__views__.push({size:Hl(r,Un),type:n+(e.__dir__<0?"Right":"")}),e},Ct.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()}}),r(["filter","map","takeWhile"],function(n,t){var r=t+1,e=r==Rn||r==En;Ct.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:mi(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),r(["head","last"],function(n,t){
var r="take"+(t?"Right":"");Ct.prototype[n]=function(){return this[r](1).value()[0]}}),r(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");Ct.prototype[n]=function(){return this.__filtered__?new Ct(this):this[r](1)}}),Ct.prototype.compact=function(){return this.filter(La)},Ct.prototype.find=function(n){return this.filter(n).head()},Ct.prototype.findLast=function(n){return this.reverse().find(n)},Ct.prototype.invokeMap=uu(function(n,t){return"function"==typeof n?new Ct(this):this.map(function(r){
return Ie(r,n,t)})}),Ct.prototype.reject=function(n){return this.filter(Uf(mi(n)))},Ct.prototype.slice=function(n,t){n=kc(n);var r=this;return r.__filtered__&&(n>0||t<0)?new Ct(r):(n<0?r=r.takeRight(-n):n&&(r=r.drop(n)),t!==X&&(t=kc(t),r=t<0?r.dropRight(-t):r.take(t-n)),r)},Ct.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},Ct.prototype.toArray=function(){return this.take(Un)},ue(Ct.prototype,function(n,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=Z[e?"take"+("last"==t?"Right":""):t],i=e||/^find/.test(t);
u&&(Z.prototype[t]=function(){var t=this.__wrapped__,o=e?[1]:arguments,f=t instanceof Ct,c=o[0],l=f||bh(t),s=function(n){var t=u.apply(Z,a([n],o));return e&&h?t[0]:t};l&&r&&"function"==typeof c&&1!=c.length&&(f=l=!1);var h=this.__chain__,p=!!this.__actions__.length,_=i&&!h,v=f&&!p;if(!i&&l){t=v?t:new Ct(this);var g=n.apply(t,o);return g.__actions__.push({func:nf,args:[s],thisArg:X}),new Y(g,h)}return _&&v?n.apply(this,o):(g=this.thru(s),_?e?g.value()[0]:g.value():g)})}),r(["pop","push","shift","sort","splice","unshift"],function(n){
var t=_l[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);Z.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(bh(u)?u:[],n)}return this[r](function(r){return t.apply(bh(r)?r:[],n)})}}),ue(Ct.prototype,function(n,t){var r=Z[t];if(r){var e=r.name+"";bl.call(fs,e)||(fs[e]=[]),fs[e].push({name:t,func:r})}}),fs[Qu(X,vn).name]=[{name:"wrapper",func:X}],Ct.prototype.clone=$t,Ct.prototype.reverse=Yt,Ct.prototype.value=Qt,Z.prototype.at=Qs,
Z.prototype.chain=tf,Z.prototype.commit=rf,Z.prototype.next=ef,Z.prototype.plant=of,Z.prototype.reverse=ff,Z.prototype.toJSON=Z.prototype.valueOf=Z.prototype.value=cf,Z.prototype.first=Z.prototype.head,Ul&&(Z.prototype[Ul]=uf),Z},be=de();"function"==typeof define&&"object"==typeof define.amd&&define.amd?(re._=be,define(function(){return be})):ue?((ue.exports=be)._=be,ee._=be):re._=be}).call(this);

/**
 * /src/js/runtime/contentScript.js
 * 
 */
window.annexSearch.DependencyLoader.load(function() {
    window.annexSearch.AnnexSearch.setup();
});
