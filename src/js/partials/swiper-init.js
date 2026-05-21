document.addEventListener("DOMContentLoaded", () => {
	const dictionaryCarousel = document.querySelectorAll(".dictionary__slider");

	if (dictionaryCarousel.length > 0) {
		dictionaryCarousel.forEach(el => {
			const dictionaryCarouselNext = el.querySelector(".swiper-btn-next");
			const dictionaryCarouselPrev = el.querySelector(".swiper-btn-prev");

			const slider = new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				loop: true,
				autoHeight: true,
				effect: "fade",
				fadeEffect: {
					crossFade: true
				},
				navigation: {
					nextEl: dictionaryCarouselNext,
					prevEl: dictionaryCarouselPrev,
				}
			});
		});
	}

	const popupCarousel = document.querySelectorAll(".popup__slider");

	if (popupCarousel.length > 0) {
		popupCarousel.forEach(el => {
			const popupCarouselNext = el.querySelector(".swiper-btn-next");
			const popupCarouselPrev = el.querySelector(".swiper-btn-prev");

			const slider = new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				loop: true,
				effect: "fade",
				fadeEffect: {
					crossFade: true
				},
				navigation: {
					nextEl: popupCarouselNext,
					prevEl: popupCarouselPrev,
				}
			});
		});
	}
});
