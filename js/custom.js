/*---------------------------------------------------------------------
	File Name: custom.js
---------------------------------------------------------------------*/

$(function () {

	"use strict";

	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);

	/* Tooltip
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});



	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$(".main-menu ul li.megamenu").mouseover(function () {
			if (!$(this).parent().hasClass("#wrapper")) {
				$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function () {
			$("#wrapper").removeClass('overlay');
		});
	});






	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

	$(document).ready(function () {
		$('#sidebarCollapse').on('click', function () {
			$('#sidebar').toggleClass('active');
			$(this).toggleClass('active');
		});
	});

	/* Sidebar Toggle for Mobile
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	$(document).ready(function () {
		const sidebar = $('#product-sidebar');
		const overlay = $('#sidebar-overlay');
		const toggleBtn = $('#sidebar-toggle');
		const closeBtn = $('#sidebar-close');

		// Open sidebar
		toggleBtn.on('click', function () {
			sidebar.addClass('show');
			overlay.addClass('show');
		});

		// Close sidebar
		function closeSidebar() {
			sidebar.removeClass('show');
			overlay.removeClass('show');
		}

		closeBtn.on('click', closeSidebar);
		overlay.on('click', closeSidebar);

		// Close sidebar when a filter is selected on mobile
		$('.subgroups a').on('click', function () {
			if ($(window).width() <= 768) {
				setTimeout(closeSidebar, 300);
			}
		});
	});

	/* Enhanced Hero Slider
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	$(document).ready(function () {
		let currentSlide = 0;
		const slides = $('.hero-slide');
		const indicators = $('.indicator');
		const totalSlides = slides.length;
		let autoPlayInterval;

		function showSlide(index) {
			slides.removeClass('active');
			indicators.removeClass('active');

			if (index >= totalSlides) {
				currentSlide = 0;
			} else if (index < 0) {
				currentSlide = totalSlides - 1;
			} else {
				currentSlide = index;
			}

			$(slides[currentSlide]).addClass('active');
			$(indicators[currentSlide]).addClass('active');
		}

		function nextSlide() {
			showSlide(currentSlide + 1);
		}

		function prevSlide() {
			showSlide(currentSlide - 1);
		}

		function startAutoPlay() {
			autoPlayInterval = setInterval(nextSlide, 5000);
		}

		function stopAutoPlay() {
			clearInterval(autoPlayInterval);
		}

		// Navigation buttons
		$('.hero-next').on('click', function () {
			nextSlide();
			stopAutoPlay();
			startAutoPlay();
		});

		$('.hero-prev').on('click', function () {
			prevSlide();
			stopAutoPlay();
			startAutoPlay();
		});

		// Indicator clicks
		indicators.on('click', function () {
			const index = $(this).index();
			showSlide(index);
			stopAutoPlay();
			startAutoPlay();
		});

		// Start auto-play
		startAutoPlay();

		// Pause on hover
		$('.hero-slider').hover(
			function () { stopAutoPlay(); },
			function () { startAutoPlay(); }
		);
	});

	/* Product slider 
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	// optional
	$('#blogCarousel').carousel({
		interval: 5000
	});


});