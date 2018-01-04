var // mouse starting positions
  _startX = 0,
  _startY = 0,
  // current element offset
  _offsetX = 0,
  _offsetY = 0,
  // needs to be passed from OnMouseDown to OnMouseMove
  _dragElement,
  // we temporarily increase the z-index during drag
  _oldZIndex = 0,
  // for sample purposes, make it easier to see what's happening
  playerWrapper = document.getElementById('playerWrapper');

// initialize
InitDragDrop();

// +++ Set event handlers for mouseup and mousedown +++
/**
 * sets up mouse up and down functions
 */
function InitDragDrop() {
  document.onmousedown = OnMouseDown;
  document.onmouseup = OnMouseUp;
}

// +++ Act on mouse down +++
/**
 * handler for mousedown events
 * @param {Object} e the element moused down on
 */
function OnMouseDown(e) {
  // older IE doesn't pass the event object
  if (e === null)
    e = window.event;
  // older IE uses srcElement, others use target
  var target = e.target !== null ? e.target : e.srcElement;
  // for older IE, left click == 1
  // for older Firefox, left click == 0
  if ((e.button === 1 && window.event !== null ||
      e.button === 0) &&
    target.className === 'drag') {
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;
    // grab the clicked element's position
    _offsetX = ExtractNumber(target.style.left);
    _offsetY = ExtractNumber(target.style.top);
    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = 10000;
    // we need to access the element in OnMouseMove
    _dragElement = target;
    // tell the code to start moving the element with the mouse
    document.onmousemove = OnMouseMove;
    // cancel out any text selections
    document.body.focus();
    // prevent text selection in IE
    document.onselectstart = function() {
      return false;
    };
    // prevent IE from trying to drag an image
    target.ondragstart = function() {
      return false;
    };
    // prevent text selection (except IE)
    return false;
  }
}

/**
 * extract a number from a string like 45px
 * @param {String} value string to extract the number from
 */
function ExtractNumber(value) {
  var n = parseInt(value);
  return n == null || isNaN(n) ? 0 : n;
}

// +++ Act on mouse move +++
/**
 * mouse move event handler
 * @param {Object} e the element being moved
 */
function OnMouseMove(e) {
  if (e == null)
    var e = window.event;
  // this is the actual "drag code"
  _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
  _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';

}

// +++ Act on mouse up +++
/**
 * handler for mouse up events
 * @param {Object} e the target element
 */
function OnMouseUp(e) {
  if (_dragElement != null) {
    // _dragElement.style.zIndex = _oldZIndex;
    // we're done with these events until the next OnMouseDown
    document.onmousemove = null;
    document.onselectstart = null;
    _dragElement.ondragstart = null;
    // this is how we know we're not dragging
    _dragElement = null;
    playerWrapper.setAttribute('style', 'position:fixed;top:' + e.clientY + 'px;left:' + e.clientX + 'px;');
  }
}
