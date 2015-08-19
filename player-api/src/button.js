import Component from './component';
import * as Dom from './utils/dom.js';
import * as Events from './utils/events.js';
import * as Fn from './utils/fn.js';
import document from 'global/document';
import assign from 'object.assign';

/**
 * Base class for all buttons
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class Button
 */
class Button extends Component {

  constructor(player, options) {
    super(player, options);

    this.emitTapEvents();

    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
    this.on('focus', this.handleFocus);
    this.on('blur', this.handleBlur);
  }

  /**
  * Create the component's DOM element
  * @param {String=} type - Element's node type. e.g. 'div'
  * @param {Object=} props - An object of element attributes that should be set on the element Tag name
  * @returns HTML Element
  * @method createEl
  */
  createEl(type, props) {
    // Add standard Aria and Tabindex info
    props = assign({
      className: this.buildCSSClass(),
      'role': 'button',
      'aria-live': 'polite', // let the screen reader user know that the text of the button may change
      tabIndex: 0
    }, props);

    let el = super.createEl(type, props);

    // if innerHTML hasn't been overridden (bigPlayButton), add content elements
    if (!props.innerHTML) {
      this.contentEl_ = Dom.createEl('div', {
        className: 'vjs-control-content'
      });

      this.controlText_ = Dom.createEl('span', {
        className: 'vjs-control-text',
        innerHTML: this.localize(this.buttonText) || 'Need Text'
      });

      this.contentEl_.appendChild(this.controlText_);
      el.appendChild(this.contentEl_);
    }

    return el;
  }

  /**
  * Allows sub components to stack CSS class names
  * @return {String}
  * @method buildCSSClass
  */
  buildCSSClass() {
    return `vjs-control vjs-button ${super.buildCSSClass()}`;
  }

  // Click - Override with specific functionality for button
  handleClick() {}

  // Focus - Add keyboard functionality to element
  handleFocus() {
    Events.on(document, 'keydown', Fn.bind(this, this.handleKeyPress));
  }

  // KeyPress (document level) - Trigger click when keys are pressed
  handleKeyPress(event) {
    // Check for space bar (32) or enter (13) keys
    if (event.which === 32 || event.which === 13) {
      event.preventDefault();
      this.handleClick();
    }
  }

  // Blur - Remove keyboard triggers
  handleBlur() {
    Events.off(document, 'keydown', Fn.bind(this, this.handleKeyPress));
  }

}


Component.registerComponent('Button', Button);
export default Button;
