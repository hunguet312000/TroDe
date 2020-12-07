$(document).ready(function() {
    $('.gallery').slick({
        infinite: false,
        lazyLoad: 'ondemand',
        slidesToShow: 2.4,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 990,
            settings: {
                slidesToShow: 2
            }
        }]
    });
    $('.gallery-img').mouseenter(function() {
        $(this).addClass('is-hover');
    }).mouseleave(function() {
        $(this).removeClass('is-hover');
    })
    $('.gallery').mouseenter(function() {
        $(this).addClass('is-hover');
    }).mouseleave(function() {
        $(this).removeClass('is-hover');
    })
    $("#editor").editor({
        height: 200
    });

    var today, datepicker;
    today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $('#datepicker').datetimepicker({
        minDate: today,
        datepicker: {
            disableDates: function(date) {
                return date >= today ? true : false;
            }
        },
        footer: true
    });
    $('.thong-tin').readmore({
        speed: 75,
        moreLink: '<a href="#" class = "doc-them">Đọc thêm</a>',
        lessLink: '<a href="#" class = "thu-gon">Thu gọn</a>',
        collapsedHeight: 300,
        maxHeight: 300
    });
    $("#map-badinh").geomap({
        center: [105.8147, 21.0335],
        zoom: 16,
        scroll: "off"
    });
    $("#map-bactuliem").geomap({
        center: [105.7577, 21.0701],
        zoom: 16,
        scroll: "off"
    });
    $("#map-caugiay").geomap({
        center: [105.7923, 21.0261],
        zoom: 16,
        scroll: "off"
    });
    $("#map-dongda").geomap({
        center: [105.8239, 21.0155],
        zoom: 16,
        scroll: "off"
    });
    $("#map-hadong").geomap({
        center: [105.759, 20.9515],
        zoom: 16,
        scroll: "off"
    });
    $("#map-haibatrung").geomap({
        center: [105.8564, 21.0055],
        zoom: 16,
        scroll: "off"
    });
    $("#map-hoangmai").geomap({
        center: [105.8656, 20.9732],
        zoom: 16,
        scroll: "off"
    });
    $("#map-hoankiem").geomap({
        center: [105.851, 21.0286],
        zoom: 16,
        scroll: "off"
    });
    $("#map-longbien").geomap({
        center: [105.8916, 21.0378],
        zoom: 16,
        scroll: "off"
    });
    $("#map-namtulien").geomap({
        center: [105.7595, 21.0187],
        zoom: 16,
        scroll: "off"
    });
    $("#map-tayho").geomap({
        center: [105.8261, 21.066],
        zoom: 16,
        scroll: "off"
    });
    $("#map-thanhxuan").geomap({
        center: [105.8149, 20.9933],
        zoom: 16,
        scroll: "off"
    });
    $('.img-click').slick({
        infinite: false,
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
    });
    $(".gallery-img").on("click", function() {
        $("body").css("background-color", "#222");
        $(".close").css("display", "block");
        $(".gallery-img1").css("display", "inline-block");
        $(".img-click .slick-prev").css("display", "block");
        $(".img-click .slick-next").css("display", "block");
        $(".gallery-img").hide();
        $(".wrap-content").hide();
        $(".header-wrap").hide();
        $("footer").hide();

    })

    $(".btn-close").on("click", function() {
        $("body").css("background-color", "#fff");
        $(".close").css("display", "none");
        $(".gallery-img1").css("display", "none");
        $(".img-click .slick-prev").css("display", "none");
        $(".img-click .slick-next").css("display", "none");
        $(".img-no-click").show();
        $(".gallery-img").show();
        $(".wrap-content").show();
        $(".header-wrap").show();
        $("footer").show();
    })

    $(".img-click .slick-prev").css("display", "none");
    $(".img-click .slick-next").css("display", "none");

});