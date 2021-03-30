(function ($) {
 "use strict";

/*---------------------
	footer background parallax
--------------------- */
$(function(){
  var footerscene = document.getElementById('footer-scene');
  var parallaxInstance = new Parallax(footerscene, {
	relativeInput: true
  });
});

})(jQuery);