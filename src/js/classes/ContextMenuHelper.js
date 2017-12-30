/**
 * @class ContextMenuHelper
 * @classdesc Few helper static functions
 */
export default class ContextMenuHelper {
    /**
     * Calculates zIndex of an element
     * @memberOf ContextMenuHelper
     * @method zindex
     * @static
     * @param {JQuery} $t - Element to calculate z-index of.
     * @return {number} - Elements zIndex
     */
    static zindex($t) {
        let zin = 0;
        let $tt = $t;

        while (true) {
            zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
            $tt = $tt.parent();
            if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                break;
            }
        }
        return zin;
    }

    /**
     * Split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
     * @memberOf ContextMenuHelper
     * @method splitAccesskey
     * @static
     * @param {string} val - Accesskey value
     * @return {Array} - Seperate keys to handle as accesskey
     */
    static splitAccesskey(val) {
        let t = val.split(/\s+/);
        let keys = [];

        for (let i = 0, k; k = t[i]; i++) {
            k = k.charAt(0).toUpperCase(); // first character only
            // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
            // a map to look up already used access keys would be nice
            keys.push(k);
        }

        return keys;
    }
}
