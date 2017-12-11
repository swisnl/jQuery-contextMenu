// determine zIndex
export default function zindex($t) {
    let zin = 0,
        $tt = $t;

    while (true) {
        zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
        $tt = $tt.parent();
        if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
            break;
        }
    }
    return zin;
}