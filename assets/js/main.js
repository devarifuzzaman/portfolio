(function ($) {
 "use strict";

/*----------------------------
 wow js
------------------------------ */
new WOW().init();
/*---------------------
	preloader
--------------------- */
$(window).on("load", function () {
	$('.preloader').fadeOut();
	$('.preloader').delay(100).fadeOut('slow');
});
/*--------------------------
venobox
---------------------------- */
$('.venobox').venobox();
/*--------------------------
counterup
---------------------------- */
$('.counter').counterUp({
	delay: 10,
	time: 1000
});
/*--------------------------
isotop
---------------------------- */
$(window).on('load',function() {
    $('.portfolio-items').isotope();
});

$('.portfolio-menu li').on('click', function() {
    
    $(".portfolio-menu li").removeClass("active");
    $(this).addClass("active");        

    var selector = $(this).attr('data-filter');
    $(".portfolio-items").isotope({ 
        filter: selector, 
        animationOptions: {
            duration: 750, 
            easing: 'linear',
            queue: false
        } 
    });
    return false; 
});

// isotop
$('.portfolio-items').imagesLoaded(function () {
	
	 $('.portfolio-items').isotope();

	// filter items on button click
	$('.portfolio-menu li').on('click', function() {
		
		$(".portfolio-menu li").removeClass("active");
		$(this).addClass("active");        

		var selector = $(this).attr('data-filter');
		$(".portfolio-items").isotope({ 
			filter: selector, 
			animationOptions: {
				duration: 750, 
				easing: 'linear',
				queue: false
			} 
		});
		return false; 
	});

});

/*--------------------------
testimonial-carousel
---------------------------- */
$(".testimonial-carousel").slick({
  dots: true,
  arrows:false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  adaptiveHeight: true,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				dots: false
			}
    },
    {
      breakpoint: 401,
      settings: {
        slidesToShow: 1,
        dots: false
      }
    }
	]
});
/*--------------------------
blog-carousel
---------------------------- */
if ($(window).width() < 992) {
  $(".blog-carousel").slick({
    dots: true,
    arrows:false,
    infinite: true,
    autoplay:true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          dots: false
        }
      },
      {
        breakpoint: 992,
        settings: {
			dots: false,
			arrows:true,
			prevArrow:"<button type='button' class='arrow-prev'><i class='arrow_carrot-left'></i></button>",
			nextArrow:"<button type='button' class='arrow-next'><i class='arrow_carrot-right'></i></button>",
        }
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1,
			arrows:true,
			prevArrow:"<button type='button' class='arrow-prev'><i class='arrow_carrot-left'></i></button>",
			nextArrow:"<button type='button' class='arrow-next'><i class='arrow_carrot-right'></i></button>",
			dots: false
        }
      }
    ]
  });
}
/*--------------------------
scrollUp
---------------------------- */	
$.scrollUp({
	scrollText: '<i class="fad fa-angle-up"></i>',
	easingType: 'linear',
	scrollSpeed: 900,
	animation: 'slide'
});
/*---------------------
	page scrolling
--------------------- */
$(function() {
  $('a.page-scroll').on('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
  });
});

/*--------------------------
menu active class
---------------------------- */	
$('.mainmenu ul li:first-child').addClass('active');

//for menu active class
$('.mainmenu ul li').on('click',function () {
	$('.navbar-nav li').removeClass("active");
	$(this).addClass("active");
});
/*---------------------
menu-stick
--------------------- */
var s = $("#sticker");
var pos = s.position();

$(window).on('scroll', function() {
	var windowpos = $(window).scrollTop();
	if (windowpos > pos.top) {
		s.addClass("stick");
	} else {
		s.removeClass("stick");	
	}
});

})(jQuery);