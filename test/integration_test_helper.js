module.exports = {

  /////////////////////////////////////////////
  // simulate right click event in javascript
  /////////////////////////////////////////////
  rightClick : function rightClick(selector) {
    var element = document.querySelector(selector);
    var evt = element.ownerDocument.createEvent('MouseEvents');
    var RIGHT_CLICK_BUTTON_CODE = 2;

    evt.initMouseEvent('contextmenu', true, true,
      element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
      false, false, false, RIGHT_CLICK_BUTTON_CODE, null);

    if (document.createEventObject) {
      // dispatch for IE <= 9
      return element.fireEvent('onclick', evt)
    } else {
      // dispatch for normal browsers
      return !element.dispatchEvent(evt);
    }
  }

};
