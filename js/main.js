(function($, undefined){
    $(function() {

        $('.document table').addClass('docutils');

        $('.showcase').each(function(){

            var $this = $(that || this),
                text, nodeName, lang, that;

            if ($this.data('showcaseImport')) {
                $this = $($this.data('showcaseImport'));
                that = $this.get(0);
            }

            nodeName = (that || this).nodeName.toLowerCase();
            lang = nodeName == 'script'
                ? 'js'
                : (nodeName == 'style' ? 'css' : 'html');

            if (lang == 'html') {
                text = $('<div></div>').append($this.clone()).html();
            } else {
                text = $this.text();
            }

            var newNode = $('<pre></pre>')
                .append($('<code class="'+ lang +'"></code>').text(text))
                .insertBefore(this);

            that && $(this).remove();
        });

    });

})(jQuery);