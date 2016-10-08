(function ($) {
	'use strict';

    
    $('[ui-jp], [data-ui-jp]').uiJp();
    $('body').uiInclude();

    init();
    function init(){
      // parallax
      if($.stellar){
        $.stellar({
          horizontalScrolling: false,
          verticalOffset: 0
        });
      }
    }

    $(document).on('pjaxStart', function() {
        $('#aside').modal('hide');
        $('body').removeClass('modal-open').find('.modal-backdrop').remove();
        $('.navbar-toggleable-sm').collapse('hide');
    });
    
    if ($.support.pjax) {
      $.pjax.defaults.maxCacheLength = 0;
      var container = $('#view');
      $(document).on('click', 'a[data-pjax], [data-pjax] a, #aside .nav a, .item a, .playlist a', function(event) {
        if($("#view").length == 0 || $(this).hasClass('no-ajax')){
          return;
        }
        $.pjax.click(event, {container: container, timeout: 6000, fragment: '#view'});
      });

      $(document).on('pjax:start', function() {
        $( document ).trigger( "pjaxStart" );
      });
      // fix js
      $(document).on('pjax:end', function(event) {
        
        $(event.target).find('[ui-jp], [data-ui-jp]').uiJp();
        $(event.target).uiInclude();

        $( document ).trigger( "pjaxEnd" );
        
        init();
      });
    }


})(jQuery);
