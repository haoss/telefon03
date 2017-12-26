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

  $('.ajax-popup-link').magnificPopup({
    type: 'ajax', // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    showCloseBtn: false
  });

  $(document).on('click', '.popup__close', function(){
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

  priceModelCarousel();
  priceTableCarousel();
  faq();
  priceTable();

  commentCarousel();

  $('.readmore').readmore({
    speed: 75,
    collapsedHeight: 200,
    moreLink: '<div class="readmore__bottom readmore__bottom--down"><a href="#">Подробнее</a></div>',
    lessLink: '<div class="readmore__bottom readmore__bottom--up"><a href="#">Свернуть</a></div>'
  });

  commentFormInput();

  indexAnimate();

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-master');
  simpleForm('form.form-master-block');
  simpleForm('form.form-сomment');
});

$(window).on('load', function() {
  // $(".loader_inner").fadeOut();
  $(".body .loader").delay(400).fadeOut("slow");

  $('.price__table-carousel ul').on('setPosition', function() {
  	$(this).find('.slick-slide').height('auto');
  	var slickTrack = $(this).find('.slick-track');
  	var slickTrackHeight = $(slickTrack).height();
  	$(this).find('.slick-slide').css('height', slickTrackHeight + 'px');
  });
});

$(window).on('resize', function() {
  navRemove();
  commentFormInput();
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

  carousel.each(function(){
    var _this = $(this);
    var li = _this.find('li');
    var liLength = li.length;

    if (liLength > 3 && width < 480) {
      li.removeClass('active');
      _this.parent().addClass('price__table-carousel--w320');
      _this.parents('.price__table-head').addClass('is-carousel');
      _this.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        infinite: false,
        arrows: true,
        variableWidth: true,
        centerPadding: '0px',
        swipe: false,
        adaptiveHeight: true
      });
    }

    if (liLength > 5 && width > 480 && width <= 767) {
      li.removeClass('active');
      _this.parent().addClass('price__table-carousel--w480');
      _this.parents('.price__table-head').addClass('is-carousel');
      _this.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        infinite: false,
        arrows: true,
        variableWidth: true,
        centerPadding: '0px',
        swipe: false,
        adaptiveHeight: true
      });
    }

    if (liLength > 8 && width > 767 && width <= 991) {
      li.removeClass('active');
      _this.parent().addClass('price__table-carousel--w767');
      _this.parents('.price__table-head').addClass('is-carousel');
      _this.slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        infinite: false,
        arrows: true,
        variableWidth: true,
        centerPadding: '0px',
        swipe: false,
        adaptiveHeight: true
      });
    }

    if (liLength > 10 && width > 991) {
      li.removeClass('active');
      _this.parent().addClass('price__table-carousel--w991');
      _this.parents('.price__table-head').addClass('is-carousel');
      _this.slick({
        slidesToShow: 10,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        infinite: false,
        arrows: true,
        variableWidth: true,
        centerPadding: '0px',
        swipe: false,
        adaptiveHeight: true
      });
    }

    _this.find('.slick-slide').on('click', function() {
      _this.find('.slick-slide').removeClass('active');
    });

    _this.on('beforeChange', function(event,slick,slide,nextSlide) {
      _this.find('.slick-slide').eq(nextSlide).find('a').trigger('click');
    });
  })

}

function priceModelCarousel() {
  $('.price__model-head ul').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    infinite: true,
    arrows: false,
    centerPadding: '0px',
    swipe: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          // centerMode: true
        }
      }
    ]
  });

  $('.price__model-head ul .slick-slide').on('click', function() {
    $('.price__model-head ul .slick-slide').removeClass('active');
  });

  $('.price__model-head ul').on('beforeChange', function(event,slick,slide,nextSlide) {
    $('.price__model-head ul').find('.slick-slide').eq(nextSlide).find('a').trigger( 'click' );
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
    $(faqBlock).removeClass('is-active');
    faqBlockAnswer.hide();

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

function commentCarousel(){
  $('.comments__top').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: '.comments__carousel-bottom ul',
    adaptiveHeight: true,
    touchMove: false,
    swipe: false,
    swipeToSlide: false
  });
  $('.comments__carousel-bottom ul').slick({
    slidesToShow: 7,
    slidesToScroll: 1,
    asNavFor: '.comments__top',
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  });
}

function commentFormInput(){
  var width = $(window).width();
  var wrapper = $('.comments__top-block__wrapper');
  var textarea = wrapper.find('.textarea');

  if ($('.textarea').length <= 0) return;

  if (textarea.val().length > 0) {
    wrapper.addClass('is-input');
  } else {
    wrapper.removeClass('is-input');
  }

  textarea.on('input', function(){
    if ($(this).parents(wrapper).hasClass('is-input') && $(this).val().length == 0) {
      $(this).parents(wrapper).removeClass('is-input');
    } else {
      $(this).parents(wrapper).addClass('is-input');
    }
  });
}

function indexAnimate(){
  var controller = null;
  var width = $(window).width();

  // TweenMax.set($('.main-slide__blockLeft-img1'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockLeft-img2'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockLeft-img3'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockLeft-img4'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img1'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img2'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img3'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img4'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img5'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img6'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockRight-img7'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img1'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img2'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img3'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img4'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img5'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img6'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img7'), {opacity: 0});
  // TweenMax.set($('.main-slide__blockCenter-img8'), {opacity: 0});
  // TweenMax.set($('.main-slide__form'), {opacity: 0});

  var masterTimeline = new TimelineMax({ paused:true }),
      headerTl = new TimelineMax();

  headerTl
    .to('#body .loader', 0.4, {autoAlpha: 0}, 0.4)
    .fromTo($('#body .header'), 1, {autoAlpha: 0, y: -15}, {autoAlpha: 1, y: 0}, 'header')
    .from($('#body .main-slide__blockLeft-img2'), 1, {autoAlpha: 0, x: -45}, 'header')
    .from($('#body .main-slide__blockLeft-img3'), 1, {autoAlpha: 0, x: -35}, 'header')
    .from($('#body .main-slide__blockLeft-img4'), 1, {autoAlpha: 0, y: 35}, 'header')
    .from($('#body .main-slide__blockRight-img2'), 1, {autoAlpha: 0, x: 35}, 'header')
    .from($('#body .main-slide__blockRight-img3'), 1, {autoAlpha: 0, x: 35}, 'header')
    .from($('#body .main-slide__blockRight-img4'), 1, {autoAlpha: 0, x: 35}, 'header')
    .from($('#body .main-slide__blockRight-img5'), 1, {autoAlpha: 0, x: 35}, 'header')
    .from($('#body .main-slide__blockRight-img6'), 1, {autoAlpha: 0, y: 45}, 'header')
    .from($('#body .main-slide__blockRight-img7'), 1, {autoAlpha: 0, x: 35}, 'header')
    .from($('#body .main-slide__blockCenter-img1'), 2.5, {left: '-100%', rotation: '-420deg', transformOrigin:"50% 50%"}, 'header', '+=2')
    .from($('#body .main-slide__blockCenter-img2'), 2.5, {right: '-100%', rotation: '420deg', transformOrigin:"50% 50%"}, 'header', '+=2')
    .from($('.main-slide__blockCenter-img8'), 0.5, {autoAlpha: 0})
    .from($('#body .main-slide__blockLeft-img1'), 0.5, {autoAlpha: 0, x: -45}, '-=0.5', 'people')
    .from($('#body .main-slide__blockRight-img1'), 0.5, {autoAlpha: 0, x: 45}, '-=0.5', 'people')
    .from($('.main-slide__blockCenter-img5'), 0.3, {autoAlpha: 0})
    .from($('.main-slide__blockCenter-img6'), 0.3, {autoAlpha: 0})
    .from($('.main-slide__blockCenter-img7'), 0.3, {autoAlpha: 0})
    .from($('.main-slide__blockCenter-img3'), 0.3, {autoAlpha: 0})
    .from($('.main-slide__blockCenter-img4'), 0.3, {autoAlpha: 0})
    .from($('#body .main-slide__form'), 0.5, {autoAlpha: 0, y: 30})
  ;

  masterTimeline.add([headerTl]);

  if( width > 767) {
    $(window).on('load', function(){
      masterTimeline.play();
    });
    initScrollMagic()
  } else if ( width < 768 ) {
    $("#body .loader").delay(400).fadeOut("slow");
    TweenMax.set($('#body .header'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__form'), {clearProps:"all"});
    TweenMax.set($('#body #tabCarousel'), {clearProps:"all"});
    TweenMax.set($('#body #wave'), {clearProps:"all"});
    TweenMax.set($('#body .wave__content-block--one'), {clearProps:"all"});
    TweenMax.set($('#body .wave__content-block--two'), {clearProps:"all"});
    TweenMax.set($('#body #comments'), {clearProps:"all"});
    TweenMax.set($('#body #faq'), {clearProps:"all"});
    TweenMax.set($('#body #about'), {clearProps:"all"});
    TweenMax.set($('#body #whe-work .whe-work__body .content__head'), {clearProps:"all"});
    TweenMax.set($('#body #whe-work .whe-work__form'), {clearProps:"all"});
    TweenMax.set($('#body .footer'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__blockLeft-img1'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__blockLeft-img2'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__blockLeft-img3'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__blockLeft-img4'), {clearProps:"all"});
    TweenMax.set($('#body .main-slide__blockLeft-img5'), {clearProps:"all"});
    TweenMax.set($('#body .whe-work__top-auto-body--top'), {clearProps:"all"});
    TweenMax.set($('#body .whe-work__top-auto-body--bottom'), {clearProps:"all"});
  } else if (width < 991) {
    TweenMax.set($('#body .whe-work__top-auto-body--top'), {clearProps:"all"});
    TweenMax.set($('#body .whe-work__top-auto-body--bottom'), {clearProps:"all"});
  }

  function initScrollMagic(){
    var controller = new ScrollMagic.Controller(),
      tabCarousel = $('#body #tabCarousel'),
      wave = $('#body #wave'),
      waveBlockOne = $('#body .wave__content-block--one'),
      waveBlockTwo = $('#body .wave__content-block--two'),
      comments = $('#body #comments'),
      faq = $('#body #faq'),
      wheWork = $('#body #whe-work .whe-work__body'),
      about = $('#body #about'),
      auto1 = $('#body .whe-work__top-auto-body--top'),
      auto2 = $('#body .whe-work__top-auto-body--bottom'),
      wheel11 = $('#body .whe-work__top-auto-body--top .whe-work__top-auto-wheel--11'),
      wheel12 = $('#body .whe-work__top-auto-body--top .whe-work__top-auto-wheel--12'),
      wheel21 = $('#body .whe-work__top-auto-body--bottom .whe-work__top-auto-wheel--21'),
      wheel22 = $('#body .whe-work__top-auto-body--bottom .whe-work__top-auto-wheel--22')
    ;

    var tabCarouselTl = new TimelineMax();
    tabCarouselTl
      .from(tabCarousel, 1, {autoAlpha: 0, y: 100})
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #tabCarousel',
      // triggerHook: 0.5,
      reverse: false
  	})
  		.setTween(tabCarouselTl)
  		// .addIndicators({
      //   name: 'tab',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

    var waveTl = new TimelineMax();
    waveTl
      .from(wave, 2, {autoAlpha: 0, y: 100}, 'wave1')
      .from($('#body .wave__title'), 2, {autoAlpha: 0, y: -200}, 'wave1')
      .from($('#body .wave__content-img'), 1.5, {autoAlpha: 0, x: -100}, 'wave2')
      .staggerFrom(waveBlockOne, 1, {autoAlpha: 0, y: -50}, 0.3, 'wave2', '-=0.5')
      .staggerFrom(waveBlockTwo, 1, {autoAlpha: 0, y: -50}, 0.3, '-=1')
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #wave',
      triggerHook: 0.5,
      reverse: false
  	})
  		.setTween(waveTl)
  		// .addIndicators({
      //   name: 'wave',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

    var commentsTl = new TimelineMax();
    commentsTl
      .from(comments, 1.5, {autoAlpha: 0, y: 50})
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #comments',
      triggerHook: 0.5,
      reverse: false
  	})
  		.setTween(commentsTl)
  		// .addIndicators({
      //   name: 'comments',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

    var faqTl = new TimelineMax();
    faqTl
      .from(faq, 1.5, {autoAlpha: 0, y: 50})
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #faq',
      triggerHook: 0.5,
      reverse: false
  	})
  		.setTween(faqTl)
  		// .addIndicators({
      //   name: 'faq',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

    var wheWorkAutoTl = new TimelineMax();
    wheWorkAutoTl
      .fromTo(auto2, 3, {marginLeft:'100%', x: '100%'}, {marginLeft:'0%', x: '-100%', ease: Power0.easeNone})
      .to(wheel21, 4, {rotation: '-1220deg', transformOrigin: "50% 50%", ease: Power0.easeNone}, 0)
      .to(wheel22, 4, {rotation: '-1220deg', transformOrigin: "50% 50%", ease: Power0.easeNone}, 0)
      .fromTo(auto1, 3, {marginLeft:'0%', x: '-100%'}, {marginLeft:'100%', x: '100%', ease: Power0.easeNone}, 'auto1', '-=7')
      .to(wheel11, 4, {rotation: '1220deg', transformOrigin: "50% 50%", ease: Power0.easeNone}, 'auto1', 0)
      .to(wheel12, 4, {rotation: '1220deg', transformOrigin: "50% 50%", ease: Power0.easeNone}, 'auto1', 0)
      .set($('.whe-work__top-img--1'), {className: '+=is-active'}, '-=3.5')
      .set($('.whe-work__top-img--2'), {className: '+=is-active'}, '-=3.2')
      .set($('.whe-work__top-img--3'), {className: '+=is-active'}, '-=2.9')
      .set($('.whe-work__top-img--4'), {className: '+=is-active'}, '-=2.6')
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #whe-work',
      triggerHook: 1,
      reverse: false
  	})
  		.setTween(wheWorkAutoTl)
  		.addIndicators({
        name: 'auto',
        colorStart: 'red',
        colorEnd: 'red',
        colorTrigger: 'red'
      })
  		.addTo(controller)
    ;

    var wheWorkTl = new TimelineMax();
    wheWorkTl
      .from($('#body #whe-work .whe-work__body .content__head'), 2, {autoAlpha: 0, y: -50})
      .from($('#body #whe-work .whe-work__wrapper-block--one'), 1, {autoAlpha: 0, y: 50}, 0.5, 'wave1')
      .staggerFrom($('#body #whe-work .whe-work__wrapper-block--one .whe-work__wrapper-arrow'), 0.2, {autoAlpha: 0}, 'wave1')
      .from($('#body #whe-work .whe-work__wrapper-block--two'), 1, {autoAlpha: 0, y: 50}, 1, 'wave1')
      .staggerFrom($('#body #whe-work .whe-work__wrapper-block--two .whe-work__wrapper-arrow'), 0.2, {autoAlpha: 0}, '-=1')
      .from($('#body #whe-work .whe-work__wrapper-block--three'), 1, {autoAlpha: 0, y: 50}, 1.5, 'wave1')
      .staggerFrom($('#body #whe-work .whe-work__wrapper-block--three .whe-work__wrapper-arrow'), 0.2, {autoAlpha: 0}, '-=1')
      .from($('#body #whe-work .whe-work__wrapper-block--four'), 1, {autoAlpha: 0, y: 50}, 2, 'wave1')
      .staggerFrom($('#body #whe-work .whe-work__wrapper-block--four .whe-work__wrapper-arrow'), 0.2, {autoAlpha: 0}, '-=1')
      .from($('#body #whe-work .whe-work__form'), 0.5, {autoAlpha: 0, y: 30})
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #whe-work .whe-work__body',
      triggerHook: 0.5,
      reverse: false
  	})
  		.setTween(wheWorkTl)
  		// .addIndicators({
      //   name: 'whe-work list',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

    var aboutTl = new TimelineMax();
    aboutTl
      .from(about, 1.5, {autoAlpha: 0, y: 50})
      .from('#body .footer', 1.5, {autoAlpha: 0, y: -50})
    ;
    var typeScene = new ScrollMagic.Scene({
      triggerElement: '#body #about',
      triggerHook: 0.8,
      reverse: false
  	})
  		.setTween(aboutTl)
  		// .addIndicators({
      //   name: 'about',
      //   colorStart: 'red',
      //   colorEnd: 'red',
      //   colorTrigger: 'red'
      // })
  		.addTo(controller)
    ;

  }
}
