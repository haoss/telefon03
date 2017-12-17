'use strict'

// Document ready
$(document).on('ready', function(){

  // SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $('.open-popup-link').magnificPopup({
    type: 'inline', // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    showCloseBtn: false
  });

  $('.popup__close').on('click', function(){
    $.magnificPopup.close();
  });

  mobileNav();
  navRemove();

  $('.product__content').on('click', function() {
    $(this).addClass('is-active');
    $(this).css({height: '100%', overflow: 'visible'});
    $('.product__content-wrapper div').css({float: 'none', margin: '0'});
  });

  $('.about__content').on('click', function() {
    $(this).addClass('is-active');
    $(this).css({height: '100%', overflow: 'visible'});
    $('.about__content-wrapper div').css({float: 'none', margin: '0'});
  });

  priceTable();
  priceTableCarousel();
  faq();

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch(err) {

  };

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

$(window).on('load', function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");
});

// $(window).on('scroll', function() { console.log('scroll'); });
$(window).on('resize', function() {
  navRemove();
  // priceTableCarousel();
});

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();
    var formData = {};
    var hasFile = false;
    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');

    return false;
  });
}

function mobileNav(){
  var btn = $('#mobile');
  var shadow = $('.header__nav-shadow');
  var nav = $('.navigation');

  btn.on('click', function(){
    shadow.toggleClass('is-active');
    nav.toggleClass('is-active');
    $(this).toggleClass('is-active');
  });

  shadow.on('click', function(){
    btn.removeClass('is-active');
    nav.removeClass('is-active');
    $(this).removeClass('is-active');
  });
}

function navRemove(){
  var width = $(window).width();
  var btn = $('#mobile');
  var shadow = $('.header__nav-shadow');
  var nav = $('.navigation');

  if (width > 991 && btn.hasClass('is-active')) {
    btn.removeClass('is-active');
    nav.removeClass('is-active');
    shadow.removeClass('is-active');
  }
}

function priceTable(){
  var tableBlock = $('.price__table-block');

  tableBlock.each(function(){
    var _this = $(this);
    var blockWrapper = _this.find('.price__table-block__wrapper');
    var row = blockWrapper.find('.row');

    if (row.length > 5) {
      blockWrapper.parent().append('<div class="price__table-see-all"><a href="#!" class="btn btn--red btn--small btn--border btn--wauto">смотреть все цены</a></div>');
      row.addClass('hidden');
      row.slice(0,5).removeClass('hidden');
    }

    $(document).on('click', '.price__table-see-all', function(){
      if (_this.hasClass('active')) {
        row.removeClass('hidden');
        this.remove();
      }
    });

  })

}

function priceTableCarousel(){
  var width = $(window).width();
  var carousel = $('.price__table-carousel ul');
  var li = carousel.find('li');
  var liLength = li.length;

  if (liLength > 3 && width < 480) {
    li.removeClass('active');
    carousel.parent().addClass('price__table-carousel--w320');
    carousel.parents('.price__table-head').addClass('is-carousel');
    $('.price__table-carousel ul').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      infinite: true,
      arrows: true,
      variableWidth: true,
      centerPadding: '0px'
    });
  }

  if (liLength > 5 && width > 480 && width <= 767) {
    li.removeClass('active');
    carousel.parent().addClass('price__table-carousel--w480');
    carousel.parents('.price__table-head').addClass('is-carousel');
    $('.price__table-carousel ul').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      infinite: true,
      arrows: true,
      variableWidth: true,
      centerPadding: '0px'
    });
  }

  if (liLength > 8 && width > 767 && width <= 991) {
    li.removeClass('active');
    carousel.parent().addClass('price__table-carousel--w767');
    carousel.parents('.price__table-head').addClass('is-carousel');
    $('.price__table-carousel ul').slick({
      slidesToShow: 8,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      infinite: true,
      arrows: true,
      variableWidth: true,
      centerPadding: '0px'
    });
  }

  if (liLength > 10 && width > 991) {
    li.removeClass('active');
    carousel.parent().addClass('price__table-carousel--w991');
    carousel.parents('.price__table-head').addClass('is-carousel');
    $('.price__table-carousel ul').slick({
      slidesToShow: 10,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      infinite: true,
      arrows: true,
      variableWidth: true,
      centerPadding: '0px'
    });
  }

  $('.price__table-carousel ul .slick-slide').on('click', function() {
    $('.price__table-carousel .slick-slide').removeClass('active');
  });

  $('.price__table-carousel ul').on('beforeChange', function(event,slick,slide,nextSlide) {
    $('.price__table-carousel').find('.slick-slide').eq(nextSlide).find('a').trigger( 'click' );
  });

}

function faq(){
  var faqBlock = '.faq__block',
      faqBlockAnswer = $('.faq__block-answer'),
      faqBlockTitle = $('.faq__block-title');

  $(faqBlock).each(function(){
    var _this = $(this);
    if (_this.hasClass('is-active')) {
      _this.find('.faq__block-answer').show();
    }
  });

  faqBlockTitle.on('click', function(e){
    e.preventDefault();
    var _this = $(this);

    if (!_this.parents(faqBlock).hasClass('is-active')) {
      _this.parents(faqBlock).addClass('is-active');
      _this.next(faqBlockAnswer).show();
    } else {
      _this.parents(faqBlock).removeClass('is-active');
      _this.next(faqBlockAnswer).hide();
    }
  });
}
