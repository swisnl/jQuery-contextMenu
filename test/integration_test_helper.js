module.exports = {

  /* simulate right click event in javascript */
  rightClick: function rightClick(selector, type) {
    var element = document.querySelector(selector);
    var evt = element.ownerDocument.createEvent('MouseEvents');
    var RIGHT_CLICK_BUTTON_CODE = 2;
    var eventType = type ? type : 'contextmenu';

    evt.initMouseEvent(eventType, true, true,
      element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
      false, false, false, RIGHT_CLICK_BUTTON_CODE, null);

    if (document.createEventObject) {
      // dispatch for IE <= 9
      return element.fireEvent('onclick', evt)
    } else {
      // dispatch for normal browsers
      return !element.dispatchEvent(evt);
    }
  },

  /* close jQuery contextMenu */
  closeMenu: function closeMenu(selector) {
    jQuery(selector).contextMenu('hide');
  }
};
