$(document).ready(function() {
    $('.items').slick({
        infinite: false,
        lazyLoad: 'ondemand',
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 990,
            settings: {
                slidesToShow: 3
            }
        }]
    });
    $('.wrap-content2-items').slick({
        infinite: false,
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 990,
            settings: {
                slidesToShow: 2
            }
        }]
    });
});