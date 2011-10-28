(function($, undefined){

    $(function() {
        $('script.showcase').each(function(){
            var $this = $(this);
            $('<pre class="prettyprint lang-js"></pre>')
                .text($this.text())
                .insertBefore($this);
        });

        prettyPrint()
    });

})(jQuery);