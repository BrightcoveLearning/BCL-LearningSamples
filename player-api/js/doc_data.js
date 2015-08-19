var docData = [
    {
        "comment": "/**\n * @fileoverview Player Component - Base class for all UI objects\n *\n */",
        "meta": {
            "range": [
                0,
                76
            ],
            "filename": "component.js",
            "lineno": 1,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "name": "component.js",
        "kind": "file",
        "description": "<p>Player Component - Base class for all UI objects</p>",
        "preserveName": true,
        "longname": "component.js",
        "scope": "global"
    },
    {
        "comment": "/**\n * Base UI Component class\n *\n * Components are embeddable UI objects that are represented by both a\n * JavaScript object and an element in the DOM. They can be children of other\n * components, and can have many children themselves.\n *\n *     // adding a button to the player\n *     var button = player.addChild('button');\n *     button.el(); // -> button element\n *\n *     <div class=\"video-js\">\n *       <div class=\"vjs-button\">Button</div>\n *     </div>\n *\n * Components are also event emitters.\n *\n *     button.on('click', function(){\n *       console.log('Button Clicked!');\n *     });\n *\n *     button.trigger('customevent');\n *\n * @param {Object} player  Main Player\n * @param {Object=} options\n * @class Component\n */",
        "meta": {
            "range": [
                78,
                808
            ],
            "filename": "component.js",
            "lineno": 6,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Base UI Component class</p>\n<p>Components are embeddable UI objects that are represented by both a\nJavaScript object and an element in the DOM. They can be children of other\ncomponents, and can have many children themselves.</p>\n<pre class=\"prettyprint source\"><code>// adding a button to the player\nvar button = player.addChild('button');\nbutton.el(); // -> button element\n\n&lt;div class=&quot;video-js&quot;>\n  &lt;div class=&quot;vjs-button&quot;>Button&lt;/div>\n&lt;/div></code></pre><p>Components are also event emitters.</p>\n<pre class=\"prettyprint source\"><code>button.on('click', function(){\n  console.log('Button Clicked!');\n});\n\nbutton.trigger('customevent');</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "description": "<p>Main Player</p>",
                "name": "player"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "name": "options"
            }
        ],
        "kind": "class",
        "name": "Component",
        "longname": "Component",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Dispose of the component and all child components\n   * @method dispose\n   */",
        "meta": {
            "range": [
                810,
                895
            ],
            "filename": "component.js",
            "lineno": 34,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Dispose of the component and all child components</p>",
        "kind": "function",
        "name": "dispose",
        "longname": "dispose",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Return the component's player\n   *\n   * @return {Player}\n   * @private\n   * @method player()\n   */",
        "meta": {
            "range": [
                897,
                1004
            ],
            "filename": "component.js",
            "lineno": 39,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Return the component's player</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                }
            }
        ],
        "access": "private",
        "kind": "function",
        "name": "player()",
        "longname": "player()",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Deep merge of options objects\n   *\n   * Whenever a property is an object on both options objects\n   * the two properties will be merged using mergeOptions.\n   *\n   * This is used for merging options for child components. We\n   * want it to be easy to override individual options on a child\n   * component without having to rewrite all the other default options.\n   *\n   *     Parent.prototype.options_ = {\n   *       children: {\n   *         'childOne': { 'foo': 'bar', 'asdf': 'fdsa' },\n   *         'childTwo': {},\n   *         'childThree': {}\n   *       }\n   *     }\n   *     newOptions = {\n   *       children: {\n   *         'childOne': { 'foo': 'baz', 'abc': '123' }\n   *         'childTwo': null,\n   *         'childFour': {}\n   *       }\n   *     }\n   *\n   *     this.options(newOptions);\n   *\n   * RESULT\n   *\n   *     {\n   *       children: {\n   *         'childOne': { 'foo': 'baz', 'asdf': 'fdsa', 'abc': '123' },\n   *         'childTwo': null, // Disabled. Won't be initialized.\n   *         'childThree': {},\n   *         'childFour': {}\n   *       }\n   *     }\n   *\n   * @param  {Object} obj Object of new option values\n   * @returns {Object}     A NEW object of this.options_ and obj merged\n   * @method options\n   */",
        "meta": {
            "range": [
                1006,
                2249
            ],
            "filename": "component.js",
            "lineno": 47,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Deep merge of options objects</p>\n<p>Whenever a property is an object on both options objects\nthe two properties will be merged using mergeOptions.</p>\n<p>This is used for merging options for child components. We\nwant it to be easy to override individual options on a child\ncomponent without having to rewrite all the other default options.</p>\n<pre class=\"prettyprint source\"><code>Parent.prototype.options_ = {\n  children: {\n    'childOne': { 'foo': 'bar', 'asdf': 'fdsa' },\n    'childTwo': {},\n    'childThree': {}\n  }\n}\nnewOptions = {\n  children: {\n    'childOne': { 'foo': 'baz', 'abc': '123' }\n    'childTwo': null,\n    'childFour': {}\n  }\n}\n\nthis.options(newOptions);</code></pre><p>RESULT</p>\n<pre class=\"prettyprint source\"><code>{\n  children: {\n    'childOne': { 'foo': 'baz', 'asdf': 'fdsa', 'abc': '123' },\n    'childTwo': null, // Disabled. Won't be initialized.\n    'childThree': {},\n    'childFour': {}\n  }\n}</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "description": "<p>Object of new option values</p>",
                "name": "obj"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "description": "<p>A NEW object of this.options_ and obj merged</p>"
            }
        ],
        "kind": "function",
        "name": "options",
        "longname": "options",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the component's DOM element\n   *\n   *     var domEl = myComponent.el();\n   *\n   * @return {Element}\n   * @method el\n   */",
        "meta": {
            "range": [
                2251,
                2385
            ],
            "filename": "component.js",
            "lineno": 90,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the component's DOM element</p>\n<pre class=\"prettyprint source\"><code>var domEl = myComponent.el();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Element"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "el",
        "longname": "el",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Create the component's DOM element\n   *\n   * @param  {String=} tagName  Element's node type. e.g. 'div'\n   * @param  {Object=} attributes An object of element attributes that should be set on the element\n   * @return {Element}\n   * @method createEl\n   */",
        "meta": {
            "range": [
                2387,
                2650
            ],
            "filename": "component.js",
            "lineno": 99,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Create the component's DOM element</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "optional": true,
                "description": "<p>Element's node type. e.g. 'div'</p>",
                "name": "tagName"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "description": "<p>An object of element attributes that should be set on the element</p>",
                "name": "attributes"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Element"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "createEl",
        "longname": "createEl",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Return the component's DOM element where children are inserted.\n   * Will either be the same as el() or a new element defined in createEl().\n   *\n   * @return {Element}\n   * @method contentEl\n   */",
        "meta": {
            "range": [
                2652,
                2858
            ],
            "filename": "component.js",
            "lineno": 108,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Return the component's DOM element where children are inserted.\nWill either be the same as el() or a new element defined in createEl().</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Element"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "contentEl",
        "longname": "contentEl",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the component's ID\n   *\n   *     var id = myComponent.id();\n   *\n   * @return {String}\n   * @method id\n   */",
        "meta": {
            "range": [
                2860,
                2981
            ],
            "filename": "component.js",
            "lineno": 116,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the component's ID</p>\n<pre class=\"prettyprint source\"><code>var id = myComponent.id();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "id",
        "longname": "id",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the component's name. The name is often used to reference the component.\n   *\n   *     var name = myComponent.name();\n   *\n   * @return {String}\n   * @method name\n   */",
        "meta": {
            "range": [
                2983,
                3164
            ],
            "filename": "component.js",
            "lineno": 125,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the component's name. The name is often used to reference the component.</p>\n<pre class=\"prettyprint source\"><code>var name = myComponent.name();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "name",
        "longname": "name",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get an array of all child components\n   *\n   *     var kids = myComponent.children();\n   *\n   * @return {Array} The children\n   * @method children\n   */",
        "meta": {
            "range": [
                3166,
                3327
            ],
            "filename": "component.js",
            "lineno": 134,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get an array of all child components</p>\n<pre class=\"prettyprint source\"><code>var kids = myComponent.children();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Array"
                    ]
                },
                "description": "<p>The children</p>"
            }
        ],
        "kind": "function",
        "name": "children",
        "longname": "children",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Returns a child component with the provided ID\n   *\n   * @return {Component}\n   * @method getChildById\n   */",
        "meta": {
            "range": [
                3329,
                3446
            ],
            "filename": "component.js",
            "lineno": 143,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Returns a child component with the provided ID</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "getChildById",
        "longname": "getChildById",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Returns a child component with the provided name\n   *\n   * @return {Component}\n   * @method getChild\n   */",
        "meta": {
            "range": [
                3448,
                3563
            ],
            "filename": "component.js",
            "lineno": 150,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Returns a child component with the provided name</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "getChild",
        "longname": "getChild",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Adds a child component inside this component\n   *\n   *     myComponent.el();\n   *     // -> <div class='my-component'></div>\n   *     myComponent.children();\n   *     // [empty array]\n   *\n   *     var myButton = myComponent.addChild('MyButton');\n   *     // -> <div class='my-component'><div class=\"my-button\">myButton<div></div>\n   *     // -> myButton === myComonent.children()[0];\n   *\n   * Pass in options for child constructors and options for children of the child\n   *\n   *     var myButton = myComponent.addChild('MyButton', {\n   *       text: 'Press Me',\n   *       children: {\n   *         buttonChildExample: {\n   *           buttonChildOption: true\n   *         }\n   *       }\n   *     });\n   *\n   * @param {String|Component} child The class name or instance of a child to add\n   * @param {Object=} options Options, including options to be passed to children of the child.\n   * @return {Component} The child component (created by this process if a string was used)\n   * @method addChild\n   */",
        "meta": {
            "range": [
                3565,
                4579
            ],
            "filename": "component.js",
            "lineno": 157,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Adds a child component inside this component</p>\n<pre class=\"prettyprint source\"><code>myComponent.el();\n// -> &lt;div class='my-component'>&lt;/div>\nmyComponent.children();\n// [empty array]\n\nvar myButton = myComponent.addChild('MyButton');\n// -> &lt;div class='my-component'>&lt;div class=&quot;my-button&quot;>myButton&lt;div>&lt;/div>\n// -> myButton === myComonent.children()[0];</code></pre><p>Pass in options for child constructors and options for children of the child</p>\n<pre class=\"prettyprint source\"><code>var myButton = myComponent.addChild('MyButton', {\n  text: 'Press Me',\n  children: {\n    buttonChildExample: {\n      buttonChildOption: true\n    }\n  }\n});</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String",
                        "Component"
                    ]
                },
                "description": "<p>The class name or instance of a child to add</p>",
                "name": "child"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "description": "<p>Options, including options to be passed to children of the child.</p>",
                "name": "options"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>The child component (created by this process if a string was used)</p>"
            }
        ],
        "kind": "function",
        "name": "addChild",
        "longname": "addChild",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Remove a child component from this component's list of children, and the\n   * child component's element from this component's element\n   *\n   * @param  {Component} component Component to remove\n   * @method removeChild\n   */",
        "meta": {
            "range": [
                4581,
                4814
            ],
            "filename": "component.js",
            "lineno": 186,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Remove a child component from this component's list of children, and the\nchild component's element from this component's element</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>Component to remove</p>",
                "name": "component"
            }
        ],
        "kind": "function",
        "name": "removeChild",
        "longname": "removeChild",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Add and initialize default child components from options\n   *\n   *     // when an instance of MyComponent is created, all children in options\n   *     // will be added to the instance by their name strings and options\n   *     MyComponent.prototype.options_.children = {\n   *       myChildComponent: {\n   *         myChildOption: true\n   *       }\n   *     }\n   *\n   *     // Or when creating the component\n   *     var myComp = new MyComponent(player, {\n   *       children: {\n   *         myChildComponent: {\n   *           myChildOption: true\n   *         }\n   *       }\n   *     });\n   *\n   * The children option can also be an Array of child names or\n   * child options objects (that also include a 'name' key).\n   *\n   *     var myComp = new MyComponent(player, {\n   *       children: [\n   *         'button',\n   *         {\n   *           name: 'button',\n   *           someOtherOption: true\n   *         }\n   *       ]\n   *     });\n   * @method initChildren\n   */",
        "meta": {
            "range": [
                4816,
                5796
            ],
            "filename": "component.js",
            "lineno": 194,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Add and initialize default child components from options</p>\n<pre class=\"prettyprint source\"><code>// when an instance of MyComponent is created, all children in options\n// will be added to the instance by their name strings and options\nMyComponent.prototype.options_.children = {\n  myChildComponent: {\n    myChildOption: true\n  }\n}\n\n// Or when creating the component\nvar myComp = new MyComponent(player, {\n  children: {\n    myChildComponent: {\n      myChildOption: true\n    }\n  }\n});</code></pre><p>The children option can also be an Array of child names or\nchild options objects (that also include a 'name' key).</p>\n<pre class=\"prettyprint source\"><code>var myComp = new MyComponent(player, {\n  children: [\n    'button',\n    {\n      name: 'button',\n      someOtherOption: true\n    }\n  ]\n});</code></pre>",
        "kind": "function",
        "name": "initChildren",
        "longname": "initChildren",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Allows sub components to stack CSS class names\n   *\n   * @return {String} The constructed class name\n   * @method buildCSSClass\n   */",
        "meta": {
            "range": [
                5798,
                5940
            ],
            "filename": "component.js",
            "lineno": 229,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Allows sub components to stack CSS class names</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The constructed class name</p>"
            }
        ],
        "kind": "function",
        "name": "buildCSSClass",
        "longname": "buildCSSClass",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Add an event listener to this component's element\n   *\n   *     var myFunc = function(){\n   *       var myComponent = this;\n   *       // Do something when the event is fired\n   *     };\n   *\n   *     myComponent.on('eventType', myFunc);\n   *\n   * The context of myFunc will be myComponent unless previously bound.\n   *\n   * Alternatively, you can add a listener to another element or component.\n   *\n   *     myComponent.on(otherElement, 'eventName', myFunc);\n   *     myComponent.on(otherComponent, 'eventName', myFunc);\n   *\n   * The benefit of using this over `VjsEvents.on(otherElement, 'eventName', myFunc)`\n   * and `otherComponent.on('eventName', myFunc)` is that this way the listeners\n   * will be automatically cleaned up when either component is disposed.\n   * It will also bind myComponent as the context of myFunc.\n   *\n   * **NOTE**: When using this on elements in the page other than window\n   * and document (both permanent), if you remove the element from the DOM\n   * you need to call `myComponent.trigger(el, 'dispose')` on it to clean up\n   * references to it and allow the browser to garbage collect it.\n   *\n   * @param  {String|Component} first   The event type or other component\n   * @param  {Function|String} second  The event handler or event type\n   * @param  {Function} third   The event handler\n   * @return {Component} self\n   * @method on\n   */",
        "meta": {
            "range": [
                5942,
                7328
            ],
            "filename": "component.js",
            "lineno": 236,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Add an event listener to this component's element</p>\n<pre class=\"prettyprint source\"><code>var myFunc = function(){\n  var myComponent = this;\n  // Do something when the event is fired\n};\n\nmyComponent.on('eventType', myFunc);</code></pre><p>The context of myFunc will be myComponent unless previously bound.</p>\n<p>Alternatively, you can add a listener to another element or component.</p>\n<pre class=\"prettyprint source\"><code>myComponent.on(otherElement, 'eventName', myFunc);\nmyComponent.on(otherComponent, 'eventName', myFunc);</code></pre><p>The benefit of using this over <code>VjsEvents.on(otherElement, 'eventName', myFunc)</code>\nand <code>otherComponent.on('eventName', myFunc)</code> is that this way the listeners\nwill be automatically cleaned up when either component is disposed.\nIt will also bind myComponent as the context of myFunc.</p>\n<p><strong>NOTE</strong>: When using this on elements in the page other than window\nand document (both permanent), if you remove the element from the DOM\nyou need to call <code>myComponent.trigger(el, 'dispose')</code> on it to clean up\nreferences to it and allow the browser to garbage collect it.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String",
                        "Component"
                    ]
                },
                "description": "<p>The event type or other component</p>",
                "name": "first"
            },
            {
                "type": {
                    "names": [
                        "function",
                        "String"
                    ]
                },
                "description": "<p>The event handler or event type</p>",
                "name": "second"
            },
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "description": "<p>The event handler</p>",
                "name": "third"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "on",
        "longname": "on",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Remove an event listener from this component's element\n   *\n   *     myComponent.off('eventType', myFunc);\n   *\n   * If myFunc is excluded, ALL listeners for the event type will be removed.\n   * If eventType is excluded, ALL listeners will be removed from the component.\n   *\n   * Alternatively you can use `off` to remove listeners that were added to other\n   * elements or components using `myComponent.on(otherComponent...`.\n   * In this case both the event type and listener function are REQUIRED.\n   *\n   *     myComponent.off(otherElement, 'eventType', myFunc);\n   *     myComponent.off(otherComponent, 'eventType', myFunc);\n   *\n   * @param  {String=|Component} first  The event type or other component\n   * @param  {Function=|String} second The listener function or event type\n   * @param  {Function=} third  The listener for other component\n   * @return {Component}\n   * @method off\n   */",
        "meta": {
            "range": [
                7330,
                8236
            ],
            "filename": "component.js",
            "lineno": 270,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Remove an event listener from this component's element</p>\n<pre class=\"prettyprint source\"><code>myComponent.off('eventType', myFunc);</code></pre><p>If myFunc is excluded, ALL listeners for the event type will be removed.\nIf eventType is excluded, ALL listeners will be removed from the component.</p>\n<p>Alternatively you can use <code>off</code> to remove listeners that were added to other\nelements or components using <code>myComponent.on(otherComponent...</code>.\nIn this case both the event type and listener function are REQUIRED.</p>\n<pre class=\"prettyprint source\"><code>myComponent.off(otherElement, 'eventType', myFunc);\nmyComponent.off(otherComponent, 'eventType', myFunc);</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String",
                        "Component"
                    ]
                },
                "description": "<p>The event type or other component</p>",
                "name": "first"
            },
            {
                "type": {
                    "names": [
                        "function",
                        "String"
                    ]
                },
                "description": "<p>The listener function or event type</p>",
                "name": "second"
            },
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "optional": true,
                "description": "<p>The listener for other component</p>",
                "name": "third"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "off",
        "longname": "off",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Add an event listener to be triggered only once and then removed\n   *\n   *     myComponent.one('eventName', myFunc);\n   *\n   * Alternatively you can add a listener to another element or component\n   * that will be triggered only once.\n   *\n   *     myComponent.one(otherElement, 'eventName', myFunc);\n   *     myComponent.one(otherComponent, 'eventName', myFunc);\n   *\n   * @param  {String|Component} first   The event type or other component\n   * @param  {Function|String} second  The listener function or event type\n   * @param  {Function=} third   The listener function for other component\n   * @return {Component}\n   * @method one\n   */",
        "meta": {
            "range": [
                8238,
                8887
            ],
            "filename": "component.js",
            "lineno": 292,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Add an event listener to be triggered only once and then removed</p>\n<pre class=\"prettyprint source\"><code>myComponent.one('eventName', myFunc);</code></pre><p>Alternatively you can add a listener to another element or component\nthat will be triggered only once.</p>\n<pre class=\"prettyprint source\"><code>myComponent.one(otherElement, 'eventName', myFunc);\nmyComponent.one(otherComponent, 'eventName', myFunc);</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String",
                        "Component"
                    ]
                },
                "description": "<p>The event type or other component</p>",
                "name": "first"
            },
            {
                "type": {
                    "names": [
                        "function",
                        "String"
                    ]
                },
                "description": "<p>The listener function or event type</p>",
                "name": "second"
            },
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "optional": true,
                "description": "<p>The listener function for other component</p>",
                "name": "third"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "one",
        "longname": "one",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Trigger an event on an element\n   *\n   *     myComponent.trigger('eventName');\n   *     myComponent.trigger({'type':'eventName'});\n   *\n   * @param  {Event|Object|String} event  A string (the type) or an event object with a type attribute\n   * @return {Component} self\n   * @method trigger\n   */",
        "meta": {
            "range": [
                8889,
                9193
            ],
            "filename": "component.js",
            "lineno": 310,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Trigger an event on an element</p>\n<pre class=\"prettyprint source\"><code>myComponent.trigger('eventName');\nmyComponent.trigger({'type':'eventName'});</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "Event",
                        "Object",
                        "String"
                    ]
                },
                "description": "<p>A string (the type) or an event object with a type attribute</p>",
                "name": "event"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "trigger",
        "longname": "trigger",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Bind a listener to the component's ready state\n   *\n   * Different from event listeners in that if the ready event has already happened\n   * it will trigger the function immediately.\n   *\n   * @param  {Function} fn Ready listener\n   * @return {Component}\n   * @method ready\n   */",
        "meta": {
            "range": [
                9195,
                9483
            ],
            "filename": "component.js",
            "lineno": 321,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Bind a listener to the component's ready state</p>\n<p>Different from event listeners in that if the ready event has already happened\nit will trigger the function immediately.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "description": "<p>Ready listener</p>",
                "name": "fn"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "ready",
        "longname": "ready",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Trigger the ready listeners\n   *\n   * @return {Component}\n   * @method triggerReady\n   */",
        "meta": {
            "range": [
                9485,
                9583
            ],
            "filename": "component.js",
            "lineno": 332,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Trigger the ready listeners</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "triggerReady",
        "longname": "triggerReady",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Check if a component's element has a CSS class name\n   *\n   * @param {String} classToCheck Classname to check\n   * @return {Component}\n   * @method hasClass\n   */",
        "meta": {
            "range": [
                9585,
                9756
            ],
            "filename": "component.js",
            "lineno": 339,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Check if a component's element has a CSS class name</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>Classname to check</p>",
                "name": "classToCheck"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "hasClass",
        "longname": "hasClass",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Add a CSS class name to the component's element\n   *\n   * @param {String} classToAdd Classname to add\n   * @return {Component}\n   * @method addClass\n   */",
        "meta": {
            "range": [
                9758,
                9921
            ],
            "filename": "component.js",
            "lineno": 347,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Add a CSS class name to the component's element</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>Classname to add</p>",
                "name": "classToAdd"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "addClass",
        "longname": "addClass",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Remove a CSS class name from the component's element\n   *\n   * @param {String} classToRemove Classname to remove\n   * @return {Component}\n   * @method removeClass\n   */",
        "meta": {
            "range": [
                9923,
                10100
            ],
            "filename": "component.js",
            "lineno": 355,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Remove a CSS class name from the component's element</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>Classname to remove</p>",
                "name": "classToRemove"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "removeClass",
        "longname": "removeClass",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Show the component element if hidden\n   *\n   * @return {Component}\n   * @method show\n   */",
        "meta": {
            "range": [
                10102,
                10201
            ],
            "filename": "component.js",
            "lineno": 363,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Show the component element if hidden</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "show",
        "longname": "show",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Hide the component element if currently showing\n   *\n   * @return {Component}\n   * @method hide\n   */",
        "meta": {
            "range": [
                10203,
                10313
            ],
            "filename": "component.js",
            "lineno": 370,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Hide the component element if currently showing</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "hide",
        "longname": "hide",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Lock an item in its visible state\n   * To be used with fadeIn/fadeOut.\n   *\n   * @return {Component}\n   * @private\n   * @method lockShowing\n   */",
        "meta": {
            "range": [
                10315,
                10469
            ],
            "filename": "component.js",
            "lineno": 377,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Lock an item in its visible state\nTo be used with fadeIn/fadeOut.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "access": "private",
        "kind": "function",
        "name": "lockShowing",
        "longname": "lockShowing",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Unlock an item to be hidden\n   * To be used with fadeIn/fadeOut.\n   *\n   * @return {Component}\n   * @private\n   * @method unlockShowing\n   */",
        "meta": {
            "range": [
                10471,
                10621
            ],
            "filename": "component.js",
            "lineno": 386,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Unlock an item to be hidden\nTo be used with fadeIn/fadeOut.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                }
            }
        ],
        "access": "private",
        "kind": "function",
        "name": "unlockShowing",
        "longname": "unlockShowing",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Set or get the width of the component (CSS values)\n   *\n   * Setting the video tag dimension values only works with values in pixels.\n   * Percent values will not work.\n   * Some percents can be used, but width()/height() will return the number + %,\n   * not the actual computed width/height.\n   *\n   * @param  {Number|String=} num   Optional width number\n   * @param  {Boolean} skipListeners Skip the 'resize' event trigger\n   * @return {Component} This component, when setting the width\n   * @return {Number|String} The width, when getting\n   * @method width\n   */",
        "meta": {
            "range": [
                10623,
                11198
            ],
            "filename": "component.js",
            "lineno": 395,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Set or get the width of the component (CSS values)</p>\n<p>Setting the video tag dimension values only works with values in pixels.\nPercent values will not work.\nSome percents can be used, but width()/height() will return the number + %,\nnot the actual computed width/height.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>Optional width number</p>",
                "name": "num"
            },
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>Skip the 'resize' event trigger</p>",
                "name": "skipListeners"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>This component, when setting the width</p>"
            },
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>The width, when getting</p>"
            }
        ],
        "kind": "function",
        "name": "width",
        "longname": "width",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the height of the component (CSS values)\n   *\n   * Setting the video tag dimension values only works with values in pixels.\n   * Percent values will not work.\n   * Some percents can be used, but width()/height() will return the number + %,\n   * not the actual computed width/height.\n   *\n   * @param  {Number|String=} num New component height\n   * @param  {Boolean=} skipListeners Skip the resize event trigger\n   * @return {Component} This component, when setting the height\n   * @return {Number|String} The height, when getting\n   * @method height\n   */",
        "meta": {
            "range": [
                11200,
                11775
            ],
            "filename": "component.js",
            "lineno": 410,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the height of the component (CSS values)</p>\n<p>Setting the video tag dimension values only works with values in pixels.\nPercent values will not work.\nSome percents can be used, but width()/height() will return the number + %,\nnot the actual computed width/height.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>New component height</p>",
                "name": "num"
            },
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "optional": true,
                "description": "<p>Skip the resize event trigger</p>",
                "name": "skipListeners"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>This component, when setting the height</p>"
            },
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>The height, when getting</p>"
            }
        ],
        "kind": "function",
        "name": "height",
        "longname": "height",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Set both width and height at the same time\n   *\n   * @param  {Number|String} width\n   * @param  {Number|String} height\n   * @return {Component} The component\n   * @method dimensions\n   */",
        "meta": {
            "range": [
                11777,
                11973
            ],
            "filename": "component.js",
            "lineno": 425,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Set both width and height at the same time</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "name": "width"
            },
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "name": "height"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>The component</p>"
            }
        ],
        "kind": "function",
        "name": "dimensions",
        "longname": "dimensions",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set width or height\n   *\n   * This is the shared code for the width() and height() methods.\n   * All for an integer, integer + 'px' or integer + '%';\n   *\n   * Known issue: Hidden elements officially have a width of 0. We're defaulting\n   * to the style.width value and falling back to computedStyle which has the\n   * hidden element issue. Info, but probably not an efficient fix:\n   * http://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/\n   *\n   * @param  {String} widthOrHeight  'width' or 'height'\n   * @param  {Number|String=} num     New dimension\n   * @param  {Boolean=} skipListeners Skip resize event trigger\n   * @return {Component} The component if a dimension was set\n   * @return {Number|String} The dimension if nothing was set\n   * @private\n   * @method dimension\n   */",
        "meta": {
            "range": [
                11975,
                12817
            ],
            "filename": "component.js",
            "lineno": 434,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set width or height</p>\n<p>This is the shared code for the width() and height() methods.\nAll for an integer, integer + 'px' or integer + '%';</p>\n<p>Known issue: Hidden elements officially have a width of 0. We're defaulting\nto the style.width value and falling back to computedStyle which has the\nhidden element issue. Info, but probably not an efficient fix:\nhttp://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>'width' or 'height'</p>",
                "name": "widthOrHeight"
            },
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>New dimension</p>",
                "name": "num"
            },
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "optional": true,
                "description": "<p>Skip resize event trigger</p>",
                "name": "skipListeners"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Component"
                    ]
                },
                "description": "<p>The component if a dimension was set</p>"
            },
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>The dimension if nothing was set</p>"
            }
        ],
        "access": "private",
        "kind": "function",
        "name": "dimension",
        "longname": "dimension",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Emit 'tap' events when touch events are supported\n   *\n   * This is used to support toggling the controls through a tap on the video.\n   *\n   * We're requiring them to be enabled because otherwise every component would\n   * have this extra overhead unnecessarily, on mobile devices where extra\n   * overhead is especially bad.\n   * @private\n   * @method emitTapEvents\n   */",
        "meta": {
            "range": [
                12819,
                13201
            ],
            "filename": "component.js",
            "lineno": 454,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Emit 'tap' events when touch events are supported</p>\n<p>This is used to support toggling the controls through a tap on the video.</p>\n<p>We're requiring them to be enabled because otherwise every component would\nhave this extra overhead unnecessarily, on mobile devices where extra\noverhead is especially bad.</p>",
        "access": "private",
        "kind": "function",
        "name": "emitTapEvents",
        "longname": "emitTapEvents",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Report user touch activity when touch events occur\n   *\n   * User activity is used to determine when controls should show/hide. It's\n   * relatively simple when it comes to mouse events, because any mouse event\n   * should show the controls. So we capture mouse events that bubble up to the\n   * player and report activity when that happens.\n   *\n   * With touch events it isn't as easy. We can't rely on touch events at the\n   * player level, because a tap (touchstart + touchend) on the video itself on\n   * mobile devices is meant to turn controls off (and on). User activity is\n   * checked asynchronously, so what could happen is a tap event on the video\n   * turns the controls off, then the touchend event bubbles up to the player,\n   * which if it reported user activity, would turn the controls right back on.\n   * (We also don't want to completely block touch events from bubbling up)\n   *\n   * Also a touchmove, touch+hold, and anything other than a tap is not supposed\n   * to turn the controls back on on a mobile device.\n   *\n   * Here we're setting the default component behavior to report user activity\n   * whenever touch events happen, and this can be turned off by components that\n   * want touch events to act differently.\n   * @method enableTouchActivity\n   */",
        "meta": {
            "range": [
                13203,
                14493
            ],
            "filename": "component.js",
            "lineno": 466,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Report user touch activity when touch events occur</p>\n<p>User activity is used to determine when controls should show/hide. It's\nrelatively simple when it comes to mouse events, because any mouse event\nshould show the controls. So we capture mouse events that bubble up to the\nplayer and report activity when that happens.</p>\n<p>With touch events it isn't as easy. We can't rely on touch events at the\nplayer level, because a tap (touchstart + touchend) on the video itself on\nmobile devices is meant to turn controls off (and on). User activity is\nchecked asynchronously, so what could happen is a tap event on the video\nturns the controls off, then the touchend event bubbles up to the player,\nwhich if it reported user activity, would turn the controls right back on.\n(We also don't want to completely block touch events from bubbling up)</p>\n<p>Also a touchmove, touch+hold, and anything other than a tap is not supposed\nto turn the controls back on on a mobile device.</p>\n<p>Here we're setting the default component behavior to report user activity\nwhenever touch events happen, and this can be turned off by components that\nwant touch events to act differently.</p>",
        "kind": "function",
        "name": "enableTouchActivity",
        "longname": "enableTouchActivity",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Creates timeout and sets up disposal automatically.\n   * @param {Function} fn The function to run after the timeout.\n   * @param {Number} timeout Number of ms to delay before executing specified function.\n   * @return {Number} Returns the timeout ID\n   * @method setTimeout\n   */",
        "meta": {
            "range": [
                14495,
                14783
            ],
            "filename": "component.js",
            "lineno": 491,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Creates timeout and sets up disposal automatically.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "description": "<p>The function to run after the timeout.</p>",
                "name": "fn"
            },
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Number of ms to delay before executing specified function.</p>",
                "name": "timeout"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the timeout ID</p>"
            }
        ],
        "kind": "function",
        "name": "setTimeout",
        "longname": "setTimeout",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Clears a timeout and removes the associated dispose listener\n   * @param {Number} timeoutId The id of the timeout to clear\n   * @return {Number} Returns the timeout ID\n   * @method clearTimeout\n   */",
        "meta": {
            "range": [
                14785,
                14993
            ],
            "filename": "component.js",
            "lineno": 499,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Clears a timeout and removes the associated dispose listener</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The id of the timeout to clear</p>",
                "name": "timeoutId"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the timeout ID</p>"
            }
        ],
        "kind": "function",
        "name": "clearTimeout",
        "longname": "clearTimeout",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Creates an interval and sets up disposal automatically.\n   * @param {Function} fn The function to run every N seconds.\n   * @param {Number} interval Number of ms to delay before executing specified function.\n   * @return {Number} Returns the interval ID\n   * @method setInterval\n   */",
        "meta": {
            "range": [
                14995,
                15288
            ],
            "filename": "component.js",
            "lineno": 506,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Creates an interval and sets up disposal automatically.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "description": "<p>The function to run every N seconds.</p>",
                "name": "fn"
            },
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Number of ms to delay before executing specified function.</p>",
                "name": "interval"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the interval ID</p>"
            }
        ],
        "kind": "function",
        "name": "setInterval",
        "longname": "setInterval",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Clears an interval and removes the associated dispose listener\n   * @param {Number} intervalId The id of the interval to clear\n   * @return {Number} Returns the interval ID\n   * @method clearInterval\n   */",
        "meta": {
            "range": [
                15290,
                15504
            ],
            "filename": "component.js",
            "lineno": 514,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Clears an interval and removes the associated dispose listener</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The id of the interval to clear</p>",
                "name": "intervalId"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the interval ID</p>"
            }
        ],
        "kind": "function",
        "name": "clearInterval",
        "longname": "clearInterval",
        "scope": "global"
    },
    {
        "comment": "/**\n * An instance of the `Player` class is created when any of the Video.js setup methods are used to initialize a video.\n *\n * ```js\n * var myPlayer = videojs('example_video_1');\n * ```\n *\n * In the following example, the `data-setup` attribute tells the Video.js library to create a player instance when the library is ready.\n *\n * ```html\n * <video id=\"example_video_1\" data-setup='{}' controls>\n *   <source src=\"my-source.mp4\" type=\"video/mp4\">\n * </video>\n * ```\n *\n * After an instance has been created it can be accessed globally using `Video('example_video_1')`.\n *\n * @param {Element} tag        The original video tag used for configuring options\n * @param {Object=} options    Player options\n * @param {Function=} ready    Ready callback function\n * @extends Component\n * @class Player\n */",
        "meta": {
            "range": [
                0,
                802
            ],
            "filename": "player.js",
            "lineno": 1,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>An instance of the <code>Player</code> class is created when any of the Video.js setup methods are used to initialize a video.</p>\n<pre class=\"prettyprint source lang-js\"><code>var myPlayer = videojs('example_video_1');</code></pre><p>In the following example, the <code>data-setup</code> attribute tells the Video.js library to create a player instance when the library is ready.</p>\n<pre class=\"prettyprint source lang-html\"><code>&lt;video id=&quot;example_video_1&quot; data-setup='{}' controls>\n  &lt;source src=&quot;my-source.mp4&quot; type=&quot;video/mp4&quot;>\n&lt;/video></code></pre><p>After an instance has been created it can be accessed globally using <code>Video('example_video_1')</code>.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Element"
                    ]
                },
                "description": "<p>The original video tag used for configuring options</p>",
                "name": "tag"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "description": "<p>Player options</p>",
                "name": "options"
            },
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "optional": true,
                "description": "<p>Ready callback function</p>",
                "name": "ready"
            }
        ],
        "augments": [
            "Component"
        ],
        "kind": "class",
        "name": "Player",
        "longname": "Player",
        "scope": "global"
    },
    {
        "comment": "/**\n   * player's constructor function\n   *\n   * @constructs\n   * @method init\n   * @param {Element} tag        The original video tag used for configuring options\n   * @param {Object=} options    Player options\n   * @param {Function=} ready    Ready callback function\n   */",
        "meta": {
            "range": [
                804,
                1078
            ],
            "filename": "player.js",
            "lineno": 25,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>player's constructor function</p>",
        "alias": "{@thisClass}",
        "kind": "function",
        "name": "init",
        "params": [
            {
                "type": {
                    "names": [
                        "Element"
                    ]
                },
                "description": "<p>The original video tag used for configuring options</p>",
                "name": "tag"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "description": "<p>Player options</p>",
                "name": "options"
            },
            {
                "type": {
                    "names": [
                        "function"
                    ]
                },
                "optional": true,
                "description": "<p>Ready callback function</p>",
                "name": "ready"
            }
        ],
        "longname": "init",
        "scope": "global"
    },
    {
        "comment": "/** \n   * Destroys the video player and does any necessary cleanup\n   *\n   *     myPlayer.dispose();\n   *\n   * This is especially helpful if you are dynamically adding and removing videos\n   * to/from the DOM.\n   * @method dispose\n   */",
        "meta": {
            "range": [
                1205,
                1441
            ],
            "filename": "player.js",
            "lineno": 41,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Destroys the video player and does any necessary cleanup</p>\n<pre class=\"prettyprint source\"><code>myPlayer.dispose();</code></pre><p>This is especially helpful if you are dynamically adding and removing videos\nto/from the DOM.</p>",
        "kind": "function",
        "name": "dispose",
        "longname": "dispose",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired when the user agent begins looking for media data\n   * @event loadstart\n   */",
        "meta": {
            "range": [
                1935,
                2027
            ],
            "filename": "player.js",
            "lineno": 72,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the user agent begins looking for media data</p>",
        "kind": "event",
        "name": "loadstart",
        "longname": "event:loadstart",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired whenever the media begins or resumes playback\n   * @event play\n   */",
        "meta": {
            "range": [
                2029,
                2112
            ],
            "filename": "player.js",
            "lineno": 77,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired whenever the media begins or resumes playback</p>",
        "kind": "event",
        "name": "play",
        "longname": "event:play",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired whenever the media begins waiting\n   * @event waiting\n   */",
        "meta": {
            "range": [
                2114,
                2188
            ],
            "filename": "player.js",
            "lineno": 82,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired whenever the media begins waiting</p>",
        "kind": "event",
        "name": "waiting",
        "longname": "event:waiting",
        "scope": "global"
    },
    {
        "comment": "/**\n   * A handler for events that signal that waiting has ended\n   * which is not consistent between browsers. See #1351\n   * @event canplay\n   */",
        "meta": {
            "range": [
                2190,
                2337
            ],
            "filename": "player.js",
            "lineno": 87,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>A handler for events that signal that waiting has ended\nwhich is not consistent between browsers. See #1351</p>",
        "kind": "event",
        "name": "canplay",
        "longname": "event:canplay",
        "scope": "global"
    },
    {
        "comment": "/**\n   * A handler for events that signal that waiting has ended\n   * which is not consistent between browsers. See #1351\n   * @event canplaythrough\n   */",
        "meta": {
            "range": [
                2339,
                2493
            ],
            "filename": "player.js",
            "lineno": 93,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>A handler for events that signal that waiting has ended\nwhich is not consistent between browsers. See #1351</p>",
        "kind": "event",
        "name": "canplaythrough",
        "longname": "event:canplaythrough",
        "scope": "global"
    },
    {
        "comment": "/**\n   * A handler for events that signal that waiting has ended\n   * which is not consistent between browsers. See #1351\n   * @event playing\n   */",
        "meta": {
            "range": [
                2495,
                2642
            ],
            "filename": "player.js",
            "lineno": 99,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>A handler for events that signal that waiting has ended\nwhich is not consistent between browsers. See #1351</p>",
        "kind": "event",
        "name": "playing",
        "longname": "event:playing",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired whenever the player is jumping to a new time\n   * @event seeking\n   */",
        "meta": {
            "range": [
                2644,
                2729
            ],
            "filename": "player.js",
            "lineno": 105,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired whenever the player is jumping to a new time</p>",
        "kind": "event",
        "name": "seeking",
        "longname": "event:seeking",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired when the player has finished jumping to a new time\n   * @event seeked\n   */",
        "meta": {
            "range": [
                2731,
                2821
            ],
            "filename": "player.js",
            "lineno": 110,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the player has finished jumping to a new time</p>",
        "kind": "event",
        "name": "seeked",
        "longname": "event:seeked",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired the first time a video is played\n   *\n   * Not part of the HLS spec, and we're not sure if this is the best\n   * implementation yet, so use sparingly. If you don't have a reason to\n   * prevent playback, use `myPlayer.one('play');` instead.\n   *\n   * @event firstplay\n   */",
        "meta": {
            "range": [
                2823,
                3111
            ],
            "filename": "player.js",
            "lineno": 115,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired the first time a video is played</p>\n<p>Not part of the HLS spec, and we're not sure if this is the best\nimplementation yet, so use sparingly. If you don't have a reason to\nprevent playback, use <code>myPlayer.one('play');</code> instead.</p>",
        "kind": "event",
        "name": "firstplay",
        "longname": "event:firstplay",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired whenever the media has been paused\n   * @event pause\n   */",
        "meta": {
            "range": [
                3113,
                3186
            ],
            "filename": "player.js",
            "lineno": 125,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired whenever the media has been paused</p>",
        "kind": "event",
        "name": "pause",
        "longname": "event:pause",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired while the user agent is downloading media data\n   * @event progress\n   */",
        "meta": {
            "range": [
                3188,
                3276
            ],
            "filename": "player.js",
            "lineno": 130,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired while the user agent is downloading media data</p>",
        "kind": "event",
        "name": "progress",
        "longname": "event:progress",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired when the end of the media resource is reached (currentTime == duration)\n   * @event ended\n   */",
        "meta": {
            "range": [
                3278,
                3388
            ],
            "filename": "player.js",
            "lineno": 135,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the end of the media resource is reached (currentTime == duration)</p>",
        "kind": "event",
        "name": "ended",
        "longname": "event:ended",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired when the duration of the media resource is first known or changed\n   * @event durationchange\n   */",
        "meta": {
            "range": [
                3390,
                3503
            ],
            "filename": "player.js",
            "lineno": 140,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the duration of the media resource is first known or changed</p>",
        "kind": "event",
        "name": "durationchange",
        "longname": "event:durationchange",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fired when the player switches in or out of fullscreen mode\n   * @event fullscreenchange\n   */",
        "meta": {
            "range": [
                3782,
                3885
            ],
            "filename": "player.js",
            "lineno": 159,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the player switches in or out of fullscreen mode</p>",
        "kind": "event",
        "name": "fullscreenchange",
        "longname": "event:fullscreenchange",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when an error occurred during the loading of an audio/video\n   * @event error\n   */",
        "meta": {
            "range": [
                4048,
                4146
            ],
            "filename": "player.js",
            "lineno": 170,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when an error occurred during the loading of an audio/video</p>",
        "kind": "event",
        "name": "error",
        "longname": "event:error",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the browser is intentionally not getting media data\n   * @event suspend\n   */",
        "meta": {
            "range": [
                4148,
                4245
            ],
            "filename": "player.js",
            "lineno": 175,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the browser is intentionally not getting media data</p>",
        "kind": "event",
        "name": "suspend",
        "longname": "event:suspend",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the loading of an audio/video is aborted\n   * @event abort\n   */",
        "meta": {
            "range": [
                4247,
                4331
            ],
            "filename": "player.js",
            "lineno": 180,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the loading of an audio/video is aborted</p>",
        "kind": "event",
        "name": "abort",
        "longname": "event:abort",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the current playlist is empty\n   * @event emptied\n   */",
        "meta": {
            "range": [
                4333,
                4408
            ],
            "filename": "player.js",
            "lineno": 185,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the current playlist is empty</p>",
        "kind": "event",
        "name": "emptied",
        "longname": "event:emptied",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the browser is trying to get media data, but data is not available\n   * @event stalled\n   */",
        "meta": {
            "range": [
                4410,
                4522
            ],
            "filename": "player.js",
            "lineno": 190,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the browser is trying to get media data, but data is not available</p>",
        "kind": "event",
        "name": "stalled",
        "longname": "event:stalled",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the browser has loaded meta data for the audio/video\n   * @event loadedmetadata\n   */",
        "meta": {
            "range": [
                4524,
                4629
            ],
            "filename": "player.js",
            "lineno": 195,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the browser has loaded meta data for the audio/video</p>",
        "kind": "event",
        "name": "loadedmetadata",
        "longname": "event:loadedmetadata",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the browser has loaded the current frame of the audio/video\n   * @event loaddata\n   */",
        "meta": {
            "range": [
                4631,
                4737
            ],
            "filename": "player.js",
            "lineno": 200,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the browser has loaded the current frame of the audio/video</p>",
        "kind": "event",
        "name": "loaddata",
        "longname": "event:loaddata",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the current playback position has changed\n   * @event timeupdate\n   */",
        "meta": {
            "range": [
                4739,
                4829
            ],
            "filename": "player.js",
            "lineno": 205,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the current playback position has changed</p>",
        "kind": "event",
        "name": "timeupdate",
        "longname": "event:timeupdate",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the playing speed of the audio/video is changed\n   * @event ratechange\n   */",
        "meta": {
            "range": [
                4831,
                4927
            ],
            "filename": "player.js",
            "lineno": 210,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the playing speed of the audio/video is changed</p>",
        "kind": "event",
        "name": "ratechange",
        "longname": "event:ratechange",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the volume has been changed\n   * @event volumechange\n   */",
        "meta": {
            "range": [
                4929,
                5007
            ],
            "filename": "player.js",
            "lineno": 215,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the volume has been changed</p>",
        "kind": "event",
        "name": "volumechange",
        "longname": "event:volumechange",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Fires when the text track has been changed\n   * @event texttrackchange\n   */",
        "meta": {
            "range": [
                5009,
                5094
            ],
            "filename": "player.js",
            "lineno": 220,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fires when the text track has been changed</p>",
        "kind": "event",
        "name": "texttrackchange",
        "longname": "event:texttrackchange",
        "scope": "global"
    },
    {
        "comment": "/**\n   * start media playback\n   *\n   *     myPlayer.play();\n   *\n   * @return {Player} self\n   * @method play\n   */",
        "meta": {
            "range": [
                5138,
                5254
            ],
            "filename": "player.js",
            "lineno": 229,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>start media playback</p>\n<pre class=\"prettyprint source\"><code>myPlayer.play();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "play",
        "longname": "play",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Pause the video playback\n   *\n   *     myPlayer.pause();\n   *\n   * @return {Player} self\n   * @method pause\n   */",
        "meta": {
            "range": [
                5256,
                5378
            ],
            "filename": "player.js",
            "lineno": 238,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Pause the video playback</p>\n<pre class=\"prettyprint source\"><code>myPlayer.pause();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "pause",
        "longname": "pause",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Check if the player is paused\n   *\n   *     var isPaused = myPlayer.paused();\n   *     var isPlaying = !myPlayer.paused();\n   *\n   * @return {Boolean} false if the media is currently playing, or true otherwise\n   * @method paused\n   */",
        "meta": {
            "range": [
                5380,
                5624
            ],
            "filename": "player.js",
            "lineno": 247,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Check if the player is paused</p>\n<pre class=\"prettyprint source\"><code>var isPaused = myPlayer.paused();\nvar isPlaying = !myPlayer.paused();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>false if the media is currently playing, or true otherwise</p>"
            }
        ],
        "kind": "function",
        "name": "paused",
        "longname": "paused",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the current time (in seconds)\n   *\n   *     // get\n   *     var whereYouAt = myPlayer.currentTime();\n   *\n   *     // set\n   *     myPlayer.currentTime(120); // 2 minutes into the video\n   *\n   * @param  {Number|String=} seconds The time to seek to\n   * @return {Number}        The time in seconds, when not setting\n   * @return {Player}    self, when the current time is set\n   * @method currentTime\n   */",
        "meta": {
            "range": [
                5997,
                6423
            ],
            "filename": "player.js",
            "lineno": 265,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the current time (in seconds)</p>\n<pre class=\"prettyprint source\"><code>// get\nvar whereYouAt = myPlayer.currentTime();\n\n// set\nmyPlayer.currentTime(120); // 2 minutes into the video</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number",
                        "String"
                    ]
                },
                "description": "<p>The time to seek to</p>",
                "name": "seconds"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The time in seconds, when not setting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self, when the current time is set</p>"
            }
        ],
        "kind": "function",
        "name": "currentTime",
        "longname": "currentTime",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the length in time of the video in seconds\n   *\n   *     var lengthOfVideo = myPlayer.duration();\n   *\n   * **NOTE**: The video must have started loading before the duration can be\n   * known, and in the case of Flash, may not be known until the video starts\n   * playing.\n   *\n   * @return {Number} The duration of the video in seconds\n   * @method duration\n   */",
        "meta": {
            "range": [
                6425,
                6802
            ],
            "filename": "player.js",
            "lineno": 280,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the length in time of the video in seconds</p>\n<pre class=\"prettyprint source\"><code>var lengthOfVideo = myPlayer.duration();</code></pre><p><strong>NOTE</strong>: The video must have started loading before the duration can be\nknown, and in the case of Flash, may not be known until the video starts\nplaying.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The duration of the video in seconds</p>"
            }
        ],
        "kind": "function",
        "name": "duration",
        "longname": "duration",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Calculates how much time is left.\n   *\n   *     var timeLeft = myPlayer.remainingTime();\n   *\n   * Not a native video element function, but useful\n   * @return {Number} The time remaining in seconds\n   * @method remainingTime\n   */",
        "meta": {
            "range": [
                6804,
                7044
            ],
            "filename": "player.js",
            "lineno": 293,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Calculates how much time is left.</p>\n<pre class=\"prettyprint source\"><code>var timeLeft = myPlayer.remainingTime();</code></pre><p>Not a native video element function, but useful</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The time remaining in seconds</p>"
            }
        ],
        "kind": "function",
        "name": "remainingTime",
        "longname": "remainingTime",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get a TimeRange object with the times of the video that have been downloaded\n   *\n   * If you just want the percent of the video that's been downloaded,\n   * use bufferedPercent.\n   *\n   *     // Number of different ranges of time have been buffered. Usually 1.\n   *     numberOfRanges = bufferedTimeRange.length,\n   *\n   *     // Time in seconds when the first range starts. Usually 0.\n   *     firstRangeStart = bufferedTimeRange.start(0),\n   *\n   *     // Time in seconds when the first range ends\n   *     firstRangeEnd = bufferedTimeRange.end(0),\n   *\n   *     // Length in seconds of the first time range\n   *     firstRangeLength = firstRangeEnd - firstRangeStart;\n   *\n   * @return {Object} A mock TimeRange object (following HTML spec)\n   * @method buffered\n   */",
        "meta": {
            "range": [
                7046,
                7827
            ],
            "filename": "player.js",
            "lineno": 303,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get a TimeRange object with the times of the video that have been downloaded</p>\n<p>If you just want the percent of the video that's been downloaded,\nuse bufferedPercent.</p>\n<pre class=\"prettyprint source\"><code>// Number of different ranges of time have been buffered. Usually 1.\nnumberOfRanges = bufferedTimeRange.length,\n\n// Time in seconds when the first range starts. Usually 0.\nfirstRangeStart = bufferedTimeRange.start(0),\n\n// Time in seconds when the first range ends\nfirstRangeEnd = bufferedTimeRange.end(0),\n\n// Length in seconds of the first time range\nfirstRangeLength = firstRangeEnd - firstRangeStart;</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "description": "<p>A mock TimeRange object (following HTML spec)</p>"
            }
        ],
        "kind": "function",
        "name": "buffered",
        "longname": "buffered",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the ending time of the last buffered time range\n   *\n   * This is used in the progress bar to encapsulate all time ranges.\n   * @return {Number} The end of the last buffered time range\n   * @method bufferedEnd\n   */",
        "meta": {
            "range": [
                8164,
                8392
            ],
            "filename": "player.js",
            "lineno": 336,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the ending time of the last buffered time range</p>\n<p>This is used in the progress bar to encapsulate all time ranges.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The end of the last buffered time range</p>"
            }
        ],
        "kind": "function",
        "name": "bufferedEnd",
        "longname": "bufferedEnd",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the current volume of the media\n   *\n   *     // get\n   *     var howLoudIsIt = myPlayer.volume();\n   *\n   *     // set\n   *     myPlayer.volume(0.5); // Set volume to half\n   *\n   * 0 is off (muted), 1.0 is all the way up, 0.5 is half way.\n   *\n   * @param  {Number} percentAsDecimal The new volume as a decimal percent\n   * @return {Number}                  The current volume, when getting\n   * @return {Player}              self, when setting\n   * @method volume\n   */",
        "meta": {
            "range": [
                8394,
                8886
            ],
            "filename": "player.js",
            "lineno": 344,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the current volume of the media</p>\n<pre class=\"prettyprint source\"><code>// get\nvar howLoudIsIt = myPlayer.volume();\n\n// set\nmyPlayer.volume(0.5); // Set volume to half</code></pre><p>0 is off (muted), 1.0 is all the way up, 0.5 is half way.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The new volume as a decimal percent</p>",
                "name": "percentAsDecimal"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>The current volume, when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self, when setting</p>"
            }
        ],
        "kind": "function",
        "name": "volume",
        "longname": "volume",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the current muted state, or turn mute on or off\n   *\n   *     // get\n   *     var isVolumeMuted = myPlayer.muted();\n   *\n   *     // set\n   *     myPlayer.muted(true); // mute the volume\n   *\n   * @param  {Boolean=} muted True to mute, false to unmute\n   * @return {Boolean} True if mute is on, false if not, when getting\n   * @return {Player} self, when setting mute\n   * @method muted\n   */",
        "meta": {
            "range": [
                8888,
                9293
            ],
            "filename": "player.js",
            "lineno": 361,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the current muted state, or turn mute on or off</p>\n<pre class=\"prettyprint source\"><code>// get\nvar isVolumeMuted = myPlayer.muted();\n\n// set\nmyPlayer.muted(true); // mute the volume</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "optional": true,
                "description": "<p>True to mute, false to unmute</p>",
                "name": "muted"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>True if mute is on, false if not, when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self, when setting mute</p>"
            }
        ],
        "kind": "function",
        "name": "muted",
        "longname": "muted",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Check if the player is in fullscreen mode\n   *\n   *     // get\n   *     var fullscreenOrNot = myPlayer.isFullscreen();\n   *\n   *     // set\n   *     myPlayer.isFullscreen(true); // tell the player it's in fullscreen\n   *\n   * NOTE: As of the latest HTML5 spec, isFullscreen is no longer an official\n   * property and instead document.fullscreenElement is used. But isFullscreen is\n   * still a valuable property for internal player workings.\n   *\n   * @param  {Boolean=} isFS Update the player's fullscreen state\n   * @return {Boolean} true if fullscreen, false if not\n   * @return {Player} self, when setting\n   * @method isFullscreen\n   */",
        "meta": {
            "range": [
                9295,
                9945
            ],
            "filename": "player.js",
            "lineno": 376,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Check if the player is in fullscreen mode</p>\n<pre class=\"prettyprint source\"><code>// get\nvar fullscreenOrNot = myPlayer.isFullscreen();\n\n// set\nmyPlayer.isFullscreen(true); // tell the player it's in fullscreen</code></pre><p>NOTE: As of the latest HTML5 spec, isFullscreen is no longer an official\nproperty and instead document.fullscreenElement is used. But isFullscreen is\nstill a valuable property for internal player workings.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "optional": true,
                "description": "<p>Update the player's fullscreen state</p>",
                "name": "isFS"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>true if fullscreen, false if not</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self, when setting</p>"
            }
        ],
        "kind": "function",
        "name": "isFullscreen",
        "longname": "isFullscreen",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Increase the size of the video to full screen\n   *\n   *     myPlayer.requestFullscreen();\n   *\n   * In some browsers, full screen is not supported natively, so it enters\n   * \"full window mode\", where the video fills the browser window.\n   * In browsers and devices that support native full screen, sometimes the\n   * browser's default controls will be shown, and not the Video.js custom skin.\n   * This includes most mobile devices (iOS, Android) and older versions of\n   * Safari.\n   *\n   * @return {Player} self\n   * @method requestFullscreen\n   */",
        "meta": {
            "range": [
                10036,
                10596
            ],
            "filename": "player.js",
            "lineno": 400,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Increase the size of the video to full screen</p>\n<pre class=\"prettyprint source\"><code>myPlayer.requestFullscreen();</code></pre><p>In some browsers, full screen is not supported natively, so it enters\n&quot;full window mode&quot;, where the video fills the browser window.\nIn browsers and devices that support native full screen, sometimes the\nbrowser's default controls will be shown, and not the Video.js custom skin.\nThis includes most mobile devices (iOS, Android) and older versions of\nSafari.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "requestFullscreen",
        "longname": "requestFullscreen",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Old naming for requestFullscreen\n   * @deprecated for lower case 's' version\n   * @method requestFullScreen\n   */",
        "meta": {
            "range": [
                10598,
                10720
            ],
            "filename": "player.js",
            "lineno": 416,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Old naming for requestFullscreen</p>",
        "deprecated": "for lower case 's' version",
        "kind": "function",
        "name": "requestFullScreen",
        "longname": "requestFullScreen",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Return the video to its normal size after having been in full screen mode\n   *\n   *     myPlayer.exitFullscreen();\n   *\n   * @return {Player} self\n   * @method exitFullscreen\n   */",
        "meta": {
            "range": [
                10722,
                10911
            ],
            "filename": "player.js",
            "lineno": 422,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Return the video to its normal size after having been in full screen mode</p>\n<pre class=\"prettyprint source\"><code>myPlayer.exitFullscreen();</code></pre>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self</p>"
            }
        ],
        "kind": "function",
        "name": "exitFullscreen",
        "longname": "exitFullscreen",
        "scope": "global"
    },
    {
        "comment": "/**\n   * The source function updates the video source\n   *\n   * There are three types of variables you can pass as the argument.\n   *\n   * **URL String**: A URL to the the video file. Use this method if you are sure\n   * the current playback technology (HTML5/Flash) can support the source you\n   * provide. Currently only MP4 files can be used in both HTML5 and Flash.\n   *\n   *     myPlayer.src(\"http://www.example.com/path/to/video.mp4\");\n   *\n   * **Source Object (or element):** A javascript object containing information\n   * about the source file. Use this method if you want the player to determine if\n   * it can support the file using the type information.\n   *\n   *     myPlayer.src({ type: \"video/mp4\", src: \"http://www.example.com/path/to/video.mp4\" });\n   *\n   * **Array of Source Objects:** To provide multiple versions of the source so\n   * that it can be played using HTML5 across browsers you can use an array of\n   * source objects. Video.js will detect which version is supported and load that\n   * file.\n   *\n   *     myPlayer.src([\n   *       { type: \"video/mp4\", src: \"http://www.example.com/path/to/video.mp4\" },\n   *       { type: \"video/webm\", src: \"http://www.example.com/path/to/video.webm\" },\n   *       { type: \"video/ogg\", src: \"http://www.example.com/path/to/video.ogv\" }\n   *     ]);\n   *\n   * @param  {String|Object|Array=} source The source URL, object, or array of sources\n   * @return {String} The current video source when getting\n   * @return {String} The player when setting\n   * @method src\n   */",
        "meta": {
            "range": [
                11024,
                12561
            ],
            "filename": "player.js",
            "lineno": 437,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>The source function updates the video source</p>\n<p>There are three types of variables you can pass as the argument.</p>\n<p><strong>URL String</strong>: A URL to the the video file. Use this method if you are sure\nthe current playback technology (HTML5/Flash) can support the source you\nprovide. Currently only MP4 files can be used in both HTML5 and Flash.</p>\n<pre class=\"prettyprint source\"><code>myPlayer.src(&quot;http://www.example.com/path/to/video.mp4&quot;);</code></pre><p><strong>Source Object (or element):</strong> A javascript object containing information\nabout the source file. Use this method if you want the player to determine if\nit can support the file using the type information.</p>\n<pre class=\"prettyprint source\"><code>myPlayer.src({ type: &quot;video/mp4&quot;, src: &quot;http://www.example.com/path/to/video.mp4&quot; });</code></pre><p><strong>Array of Source Objects:</strong> To provide multiple versions of the source so\nthat it can be played using HTML5 across browsers you can use an array of\nsource objects. Video.js will detect which version is supported and load that\nfile.</p>\n<pre class=\"prettyprint source\"><code>myPlayer.src([\n  { type: &quot;video/mp4&quot;, src: &quot;http://www.example.com/path/to/video.mp4&quot; },\n  { type: &quot;video/webm&quot;, src: &quot;http://www.example.com/path/to/video.webm&quot; },\n  { type: &quot;video/ogg&quot;, src: &quot;http://www.example.com/path/to/video.ogv&quot; }\n]);</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String",
                        "Object",
                        "Array"
                    ]
                },
                "description": "<p>The source URL, object, or array of sources</p>",
                "name": "source"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The current video source when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The player when setting</p>"
            }
        ],
        "kind": "function",
        "name": "src",
        "longname": "src",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Begin loading the src data.\n   * @return {Player} Returns the player\n   * @method load\n   */",
        "meta": {
            "range": [
                12683,
                12784
            ],
            "filename": "player.js",
            "lineno": 477,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Begin loading the src data.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>Returns the player</p>"
            }
        ],
        "kind": "function",
        "name": "load",
        "longname": "load",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Returns the fully qualified URL of the current source value e.g. http://mysite.com/video.mp4\n   * Can be used in conjuction with `currentType` to assist in rebuilding the current source object.\n   * @return {String} The current source\n   * @method currentSrc\n   */",
        "meta": {
            "range": [
                12786,
                13059
            ],
            "filename": "player.js",
            "lineno": 483,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Returns the fully qualified URL of the current source value e.g. http://mysite.com/video.mp4\nCan be used in conjuction with <code>currentType</code> to assist in rebuilding the current source object.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The current source</p>"
            }
        ],
        "kind": "function",
        "name": "currentSrc",
        "longname": "currentSrc",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get the current source type e.g. video/mp4\n   * This can allow you rebuild the current source object so that you could load the same\n   * source and tech later\n   * @return {String} The source MIME type\n   * @method currentType\n   */",
        "meta": {
            "range": [
                13061,
                13303
            ],
            "filename": "player.js",
            "lineno": 490,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get the current source type e.g. video/mp4\nThis can allow you rebuild the current source object so that you could load the same\nsource and tech later</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The source MIME type</p>"
            }
        ],
        "kind": "function",
        "name": "currentType",
        "longname": "currentType",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the preload attribute.\n   * @return {String} The preload attribute value when getting\n   * @return {Player} Returns the player when setting\n   * @method preload\n   */",
        "meta": {
            "range": [
                13305,
                13491
            ],
            "filename": "player.js",
            "lineno": 498,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the preload attribute.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The preload attribute value when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>Returns the player when setting</p>"
            }
        ],
        "kind": "function",
        "name": "preload",
        "longname": "preload",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the autoplay attribute.\n   * @return {String} The autoplay attribute value when getting\n   * @return {Player} Returns the player when setting\n   * @method autoplay\n   */",
        "meta": {
            "range": [
                13493,
                13682
            ],
            "filename": "player.js",
            "lineno": 505,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the autoplay attribute.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The autoplay attribute value when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>Returns the player when setting</p>"
            }
        ],
        "kind": "function",
        "name": "autoplay",
        "longname": "autoplay",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set the loop attribute on the video element.\n   * @return {String} The loop attribute value when getting\n   * @return {Player} Returns the player when setting\n   * @method loop\n   */",
        "meta": {
            "range": [
                13684,
                13882
            ],
            "filename": "player.js",
            "lineno": 512,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set the loop attribute on the video element.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The loop attribute value when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>Returns the player when setting</p>"
            }
        ],
        "kind": "function",
        "name": "loop",
        "longname": "loop",
        "scope": "global"
    },
    {
        "comment": "/**\n   * get or set the poster image source url\n   *\n   * ##### EXAMPLE:\n   *\n   *     // getting\n   *     var currentPoster = myPlayer.poster();\n   *\n   *     // setting\n   *     myPlayer.poster('http://example.com/myImage.jpg');\n   *\n   * @param  {String=} [src] Poster image source URL\n   * @return {String} poster URL when getting\n   * @return {Player} self when setting\n   * @method poster\n   */",
        "meta": {
            "range": [
                13884,
                14284
            ],
            "filename": "player.js",
            "lineno": 519,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>get or set the poster image source url</p>\n<h5>EXAMPLE:</h5><pre class=\"prettyprint source\"><code>// getting\nvar currentPoster = myPlayer.poster();\n\n// setting\nmyPlayer.poster('http://example.com/myImage.jpg');</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "optional": true,
                "description": "<p>Poster image source URL</p>",
                "name": "src"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>poster URL when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self when setting</p>"
            }
        ],
        "kind": "function",
        "name": "poster",
        "longname": "poster",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Get or set whether or not the controls are showing.\n   * @param  {Boolean} controls Set controls to showing or not\n   * @return {Boolean}    Controls are showing\n   * @method controls\n   */",
        "meta": {
            "range": [
                14286,
                14484
            ],
            "filename": "player.js",
            "lineno": 536,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Get or set whether or not the controls are showing.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>Set controls to showing or not</p>",
                "name": "controls"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>Controls are showing</p>"
            }
        ],
        "kind": "function",
        "name": "controls",
        "longname": "controls",
        "scope": "global"
    },
    {
        "comment": "/**\n           * player is using the native device controls\n           *\n           * @event usingnativecontrols\n           * @memberof Player\n           * @instance\n           * @private\n           */",
        "meta": {
            "range": [
                14934,
                15135
            ],
            "filename": "player.js",
            "lineno": 556,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>player is using the native device controls</p>",
        "kind": "event",
        "name": "usingnativecontrols",
        "memberof": "Player",
        "scope": "instance",
        "access": "private",
        "longname": "Player#event:usingnativecontrols"
    },
    {
        "comment": "/**\n           * player is using the custom HTML controls\n           *\n           * @event usingcustomcontrols\n           * @memberof Player\n           * @instance\n           * @private\n           */",
        "meta": {
            "range": [
                15137,
                15336
            ],
            "filename": "player.js",
            "lineno": 565,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>player is using the custom HTML controls</p>",
        "kind": "event",
        "name": "usingcustomcontrols",
        "memberof": "Player",
        "scope": "instance",
        "access": "private",
        "longname": "Player#event:usingcustomcontrols"
    },
    {
        "comment": "/**\n   * Set or get the current MediaError\n   * @param  {*} err A MediaError or a String/Number to be turned into a MediaError\n   * @return {MediaError|null}     when getting\n   * @return {Player}              when setting\n   * @method error\n   */",
        "meta": {
            "range": [
                15338,
                15585
            ],
            "filename": "player.js",
            "lineno": 574,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Set or get the current MediaError</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "*"
                    ]
                },
                "description": "<p>A MediaError or a String/Number to be turned into a MediaError</p>",
                "name": "err"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "MediaError",
                        "null"
                    ]
                },
                "description": "<p>when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>when setting</p>"
            }
        ],
        "kind": "function",
        "name": "error",
        "longname": "error",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Returns whether or not the player is in the \"ended\" state.\n   * @return {Boolean} True if the player is in the ended state, false if not.\n   * @method ended\n   */",
        "meta": {
            "range": [
                15587,
                15758
            ],
            "filename": "player.js",
            "lineno": 582,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Returns whether or not the player is in the &quot;ended&quot; state.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>True if the player is in the ended state, false if not.</p>"
            }
        ],
        "kind": "function",
        "name": "ended",
        "longname": "ended",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Returns whether or not the player is in the \"seeking\" state.\n   * @return {Boolean} True if the player is in the seeking state, false if not.\n   * @method seeking\n   */",
        "meta": {
            "range": [
                15760,
                15937
            ],
            "filename": "player.js",
            "lineno": 588,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Returns whether or not the player is in the &quot;seeking&quot; state.</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "Boolean"
                    ]
                },
                "description": "<p>True if the player is in the seeking state, false if not.</p>"
            }
        ],
        "kind": "function",
        "name": "seeking",
        "longname": "seeking",
        "scope": "global"
    },
    {
        "comment": "/**\n   * Gets or sets the current playback rate.  A playback rate of\n   * 1.0 represents normal speed and 0.5 would indicate half-speed\n   * playback, for instance.\n   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-playbackrate\n   * @param  {Number} rate    New playback rate to set.\n   * @return {Number}         Returns the new playback rate when setting\n   * @return {Number}         Returns the current playback rate when getting\n   * @method playbackRate\n   */",
        "meta": {
            "range": [
                15939,
                16435
            ],
            "filename": "player.js",
            "lineno": 594,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Gets or sets the current playback rate.  A playback rate of\n1.0 represents normal speed and 0.5 would indicate half-speed\nplayback, for instance.</p>",
        "see": [
            "https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-playbackrate"
        ],
        "params": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>New playback rate to set.</p>",
                "name": "rate"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the new playback rate when setting</p>"
            },
            {
                "type": {
                    "names": [
                        "Number"
                    ]
                },
                "description": "<p>Returns the current playback rate when getting</p>"
            }
        ],
        "kind": "function",
        "name": "playbackRate",
        "longname": "playbackRate",
        "scope": "global"
    },
    {
        "comment": "/**\n   * The player's language code\n   *\n   * NOTE: The language should be set in the player options if you want the\n   * the controls to be built with a specific language. Changing the lanugage\n   * later will not update controls text.\n   *\n   * @param {String} code  The locale string\n   * @return {String}      The locale string when getting\n   * @return {Player}      self, when setting\n   * @method language\n   */",
        "meta": {
            "range": [
                19769,
                20187
            ],
            "filename": "player.js",
            "lineno": 678,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>The player's language code</p>\n<p>NOTE: The language should be set in the player options if you want the\nthe controls to be built with a specific language. Changing the lanugage\nlater will not update controls text.</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The locale string</p>",
                "name": "code"
            }
        ],
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "description": "<p>The locale string when getting</p>"
            },
            {
                "type": {
                    "names": [
                        "Player"
                    ]
                },
                "description": "<p>self, when setting</p>"
            }
        ],
        "kind": "function",
        "name": "language",
        "longname": "language",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the player has initial duration and dimension information\n * @event loadedmetadata\n */",
        "meta": {
            "range": [
                20711,
                20815
            ],
            "filename": "player.js",
            "lineno": 712,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the player has initial duration and dimension information</p>",
        "kind": "event",
        "name": "loadedmetadata",
        "longname": "event:loadedmetadata",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the player has downloaded data at the current playback position\n * @event loadeddata\n */",
        "meta": {
            "range": [
                20817,
                20923
            ],
            "filename": "player.js",
            "lineno": 717,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the player has downloaded data at the current playback position</p>",
        "kind": "event",
        "name": "loadeddata",
        "longname": "event:loadeddata",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the player has finished downloading the source data\n * @event loadedalldata\n */",
        "meta": {
            "range": [
                20925,
                21022
            ],
            "filename": "player.js",
            "lineno": 722,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the player has finished downloading the source data</p>",
        "kind": "event",
        "name": "loadedalldata",
        "longname": "event:loadedalldata",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the user is active, e.g. moves the mouse over the player\n * @event useractive\n */",
        "meta": {
            "range": [
                21024,
                21123
            ],
            "filename": "player.js",
            "lineno": 727,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the user is active, e.g. moves the mouse over the player</p>",
        "kind": "event",
        "name": "useractive",
        "longname": "event:useractive",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the user is inactive, e.g. a short delay after the last mouse move or control interaction\n * @event userinactive\n */",
        "meta": {
            "range": [
                21125,
                21259
            ],
            "filename": "player.js",
            "lineno": 732,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the user is inactive, e.g. a short delay after the last mouse move or control interaction</p>",
        "kind": "event",
        "name": "userinactive",
        "longname": "event:userinactive",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the current playback position has changed\n *\n * During playback this is fired every 15-250 milliseconds, depending on the\n * playback technology in use.\n * @event timeupdate\n */",
        "meta": {
            "range": [
                21261,
                21456
            ],
            "filename": "player.js",
            "lineno": 737,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the current playback position has changed</p>\n<p>During playback this is fired every 15-250 milliseconds, depending on the\nplayback technology in use.</p>",
        "kind": "event",
        "name": "timeupdate",
        "longname": "event:timeupdate",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when the volume changes\n * @event volumechange\n */",
        "meta": {
            "range": [
                21458,
                21521
            ],
            "filename": "player.js",
            "lineno": 745,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when the volume changes</p>",
        "kind": "event",
        "name": "volumechange",
        "longname": "event:volumechange",
        "scope": "global"
    },
    {
        "comment": "/**\n * Fired when an error occurs\n * @event error\n */",
        "meta": {
            "range": [
                21523,
                21576
            ],
            "filename": "player.js",
            "lineno": 750,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Fired when an error occurs</p>",
        "kind": "event",
        "name": "error",
        "longname": "event:error",
        "scope": "global"
    },
    {
        "comment": "/**\n * Base class for all buttons\n * @param {Player|Object} player\n * @param {Object=} options\n * @extends Component\n * @class Button\n */",
        "meta": {
            "range": [
                0,
                137
            ],
            "filename": "button.js",
            "lineno": 1,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Base class for all buttons</p>",
        "params": [
            {
                "type": {
                    "names": [
                        "Player",
                        "Object"
                    ]
                },
                "name": "player"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "name": "options"
            }
        ],
        "augments": [
            "Component"
        ],
        "kind": "class",
        "name": "Button",
        "longname": "Button",
        "scope": "global"
    },
    {
        "comment": "/**\n  * Create the component's DOM element\n  *\n  *     //This is test code\n  *     var myPlayer = this;\n  *\n  * @param {String=} type - Element's node type. e.g. 'div'\n  * @param {Object=} props - An object of element attributes that should be set on the element Tag name \n  * @return HTML Element\n  * @method createEl\n  */",
        "meta": {
            "range": [
                139,
                462
            ],
            "filename": "button.js",
            "lineno": 9,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Create the component's DOM element</p>\n<pre class=\"prettyprint source\"><code>//This is test code\nvar myPlayer = this;</code></pre>",
        "params": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                },
                "optional": true,
                "description": "<p>Element's node type. e.g. 'div'</p>",
                "name": "type"
            },
            {
                "type": {
                    "names": [
                        "Object"
                    ]
                },
                "optional": true,
                "description": "<p>An object of element attributes that should be set on the element Tag name</p>",
                "name": "props"
            }
        ],
        "returns": [
            {
                "description": "<p>HTML Element</p>"
            }
        ],
        "kind": "function",
        "name": "createEl",
        "longname": "createEl",
        "scope": "global"
    },
    {
        "comment": "/**\n  * Allows sub components to stack CSS class names\n  * @return {String}\n  * @method buildCSSClass\n  */",
        "meta": {
            "range": [
                464,
                570
            ],
            "filename": "button.js",
            "lineno": 21,
            "path": "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2",
            "code": {}
        },
        "description": "<p>Allows sub components to stack CSS class names</p>",
        "returns": [
            {
                "type": {
                    "names": [
                        "String"
                    ]
                }
            }
        ],
        "kind": "function",
        "name": "buildCSSClass",
        "longname": "buildCSSClass",
        "scope": "global"
    },
    {
        "kind": "package",
        "longname": "package:undefined",
        "files": [
            "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2/component.js",
            "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2/player.js",
            "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2/button.js",
            "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2/big-play-button.js"
        ]
    }
];
