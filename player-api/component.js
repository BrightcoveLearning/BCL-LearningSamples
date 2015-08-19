var parent_class_data = [
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
        "kind": "package",
        "longname": "package:undefined",
        "files": [
            "/Users/mboles/git/BCL-LearningSamples/jsdoc-tests2/component.js"
        ]
    }
];
