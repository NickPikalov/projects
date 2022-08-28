document.querySelector('.prev').addEventListener('click', () => {
    slider.goTo('prev');
});
document.querySelector('.next').addEventListener('click', () => {
    slider.goTo('next');
});


window.addEventListener('DOMContentLoaded', () => {
    const slider = tns({
        container: '.carousel__inner',
        items: 1,
        slideBy: 'page',
        autoplay: false,
        controls: false,
        nav: false,
        speed: 1000,
        autoplayButtonOutput: false,
        autoplayButton: false,
        responsive: {
            320: {
                mouseDrag: true
            },
            575: {
                items: 1,
                slideBy: 1,
                autoWidth: true,
                mouseDrag: true,
                autoplay: true,
            },
            992: {
                autoHeight: true,
                autoplay: false,
            },
            1200: {
                autoHeight: false
            }
        }
    });

    document.querySelector('.prev').addEventListener('click', () => {
        slider.goTo('prev');
    });
    document.querySelector('.next').addEventListener('click', () => {
        slider.goTo('next');
    });

    //

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function () {
        $(this)
            .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
            .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });

    function toggleSlide(item) {
        $(item).each(function (i) {
            $(this).on('click', function (e) {
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            });
        });
    }

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    const catalogMoreBtn = document.querySelector('.catalog__more');
    catalogMoreBtn.addEventListener('click', e => {
        e.target.style.display = 'none';
        e.preventDefault();

        const catalogItems = document.querySelectorAll('.catalog__content .catalog-item');
        catalogItems.forEach(e => {
            e.style.display = 'block';
        });
    });

});