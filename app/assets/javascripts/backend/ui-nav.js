(function ($) {
  "use strict";
  
  $(document).on('click', '[ui-nav] a, [data-ui-nav] a', function (e) {
    var $this = $(e.target), $active, $li;
    $this.is('a') || ($this = $this.closest('a'));
    
    $li = $this.parent();
    $active = $li.siblings( ".active" );
    $li.addClass('active');
    $active.removeClass('active');
    if($this.attr('href') && $this.attr('href') !=''){
      $(document).trigger('Nav:changed');
    }
  });

  // init the active class when page reload\
  $('[ui-nav] a, [data-ui-nav] a').filter( function() {
        return location.href.indexOf( $(this).attr('href') ) != -1;
  }).parent().addClass( 'active' );

})(jQuery);
