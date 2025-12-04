$(document).ready(function() {
    const propertiesData = {
        addis: {
            description: "Location: ",
            listings: [
                { img: "images/addisproperty1.png", title: "Addis Real Estate" },
            ]
        },
        ahenk: {
            description: "Location: ",
            listings: [
                { img: "images/ahenkproperty1.png", title: "Ahenk Real Estate" },
            ]
        },
        amibara: {
            description: "Location: ",
            listings: [
                { img: "images/amibaraproperty1.png", title: "Amibara Properties" },
            ]
        },
        ayat: {
            description: "Location: ",
            listings: [
                { img: "images/ayatproperty1.png", title: "Ayat Real Estate" },
            ]
        },
        fh: {
            description: "Location: ",
            listings: [
                { img: "images/fhproperty1.png", title: "FH Real Estate" },
            ]
        },
        hosea: {
            description: "Location: ",
            listings: [
                { img: "images/hoseaproperty1.png", title: "Hosea Real Estate" },
            ]
        },
        metro: {
            description: "Location: ",
            listings: [
                { img: "images/metroproperty1.png", title: "Metro Real Estate" },
            ]
        },
        palm: {
            description: "Location: ",
            listings: [
                { img: "images/palmproperty1.png", title: "Palm Real Estate" },
                { img: "images/palmproperty2.png", title: "Palm Real Estate" },
            ]
        },
        reality: {
            description: "Location: ",
            listings: [
                { img: "images/realityproperty1.png", title: "Reality Real Estate" },
            ]
        },
        temer: {
            description: "Location: ",
            listings: [
                { img: "images/temerproperty1.png", title: "Temer Real Estate" },
            ]
        }
    };

    // --- Engaging Promotion Slider Logic ---
    let currentSlide = 0;
    const slides = $('.promotion-slider .slide');
    const slideCount = slides.length;

    function showSlide(index) {
        slides.removeClass('active');
        $(slides[index]).addClass('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }

    $('.slider-nav .next-slide').click(nextSlide);
    $('.slider-nav .prev-slide').click(function() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(currentSlide);
    });

    let slideInterval = setInterval(nextSlide, 7000);
    showSlide(currentSlide);

    // --- Property Loading Logic ---
    function loadProperties(companyKey) {
        const display = $('#property-display');
        const descriptionBox = $('#property-location-description');
        display.empty();
        descriptionBox.empty();

        const companiesToDisplay = (companyKey === 'all') ? Object.keys(propertiesData) : [companyKey];

        const descriptionHtml = `
            <div class="location-info">
                <i class="fa fa-map-marker" aria-hidden="true"></i>
                <h4>${(companyKey !== 'all' && propertiesData[companyKey]) ? propertiesData[companyKey].description : 'Showing all our available properties across Addis Ababa.'}</h4>
            </div>`;
        descriptionBox.html(descriptionHtml);

        companiesToDisplay.forEach(key => {
            const company = propertiesData[key];
            company.listings.forEach(property => {
                const requestUrl = `request-quote.html?img=${encodeURIComponent(property.img)}&title=${encodeURIComponent(property.title)}`;
                const propertyHtml = `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <a href="${requestUrl}" class="product_box_link">
                            <div class="product_box">
                                <figure>
                                    <img src="${property.img}" alt="${property.title}"/>
                                    <div class="overlay">
                                        <span class="view-btn">View Details</span>
                                    </div>
                                </figure>
                                <div class="product_info">
                                    <h3>${property.title}</h3>
                                    <div class="meta">
                                        <span class="location-badge"><i class="fa fa-map-marker"></i> Addis Ababa</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                display.append(propertyHtml);
            });
        });
    }

    // --- Sidebar, Filter & Icon Positioning Logic ---
    const sidebar = $('#product-sidebar');
    const sidebarToggle = $('#sidebar-toggle');
    const sidebarOverlay = $('#sidebar-overlay');

    sidebarToggle.click(function() {
        sidebar.toggleClass('show');
        sidebarOverlay.toggleClass('show');
        $(this).fadeOut(200);
    });

    function closeSidebar() {
        sidebar.removeClass('show');
        sidebarOverlay.removeClass('show');
        sidebarToggle.fadeIn(200);
    }

    sidebarOverlay.click(closeSidebar);

    $('.subgroups a').click(function(e) {
        e.preventDefault();
        $('.subgroups a').removeClass('active');
        $(this).addClass('active');
        const company = $(this).data('company');
        loadProperties(company);
        
        const headerHeight = $('.header').outerHeight() || 0;
        const listingsTop = $('#property-location-description').offset().top;
        $('html, body').animate({
            scrollTop: listingsTop - headerHeight - 20
        }, 800);

        if ($(window).width() < 768) {
            closeSidebar();
        }
    });
    
    // Function to manage the hamburger icon's position on scroll
    function handleStickyToggler() {
        if ($(window).width() >= 768) {
            sidebarToggle.css({ 'display': 'none', 'position': '', 'top': '' });
            return;
        }

        sidebarToggle.css('display', 'block');
        
        const footer = $('footer');
        if (!footer.length || !sidebarToggle.length) return;
        
        const scrollBottom = $(window).scrollTop() + $(window).height();
        const footerTop = footer.offset().top;
        const togglerHeight = sidebarToggle.outerHeight();

        if (scrollBottom >= footerTop) {
            sidebarToggle.css({
                position: 'absolute',
                top: footerTop - togglerHeight - 20
            });
        } else {
            sidebarToggle.css({
                position: 'fixed',
                top: '85px'
            });
        }
    }

    $(window).on('scroll resize', handleStickyToggler);
    
    // Initial setup
    loadProperties('all');
    $('.subgroups a[data-company="all"]').addClass('active');
    handleStickyToggler();
});