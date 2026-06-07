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

	const clientsCarousel = document.querySelectorAll(".clients__slider");
	const contentBlock = document.querySelector(".hero__content");
	let isOnce = false;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "attributes" && mutation.attributeName === "style" && !isOnce) {
				const isHidden = window.getComputedStyle(contentBlock).display === "none";

				if (!isHidden && clientsCarousel.length > 0) {
					clientsCarousel.forEach(el => {
						const clientsCarouselNext = el.querySelector(".swiper-btn-next");
						const clientsCarouselPrev = el.querySelector(".swiper-btn-prev");
						const clientTitle = document.querySelector(".clients__title-name");
						const slider = new Swiper(el, {
							slidesPerView: 1,
							spaceBetween: 10,
							effect: "fade",
							fadeEffect: {
								crossFade: true
							},
							navigation: {
								nextEl: clientsCarouselNext,
								prevEl: clientsCarouselPrev,
							},
							autoplay: {
								delay: 7000,
								pauseOnMouseEnter: true
							},
							breakpoints: {
								992: {
									autoplay: false
								},
							},
							on: {
								init: function () {
									// Прокрутка левого блока с клиентами перетаскиванием ползунка
									const thumb = document.querySelector(".clients__thumb");
									const rail = document.querySelector(".clients__rail");
									const scrollableBlock = document.querySelectorAll(".clients__items")[this.activeIndex];
									const slider = document.querySelector(".clients__slider");
									let isDragging = false;
									let startY = 0;
									let startScrollTop = 0;
									let startThumbTop = 0;

									// Обнуляем позиции при смене слайда
									thumb.style.transform = "translateY(0px)";
									scrollableBlock.scrollTop = 0;

									// Высота области прокрутки равна высоте скролл блока
									const updateRailHeight = () => {
										const blockHeight = scrollableBlock.clientHeight;

										rail.style.height = `${blockHeight + 80}px`;
									};

									// Получаем максимальное смещение для ползунка
									const getMaxThumbTop = () => {
										const railHeight = rail.clientHeight;
										const thumbHeight = thumb.offsetHeight;

										return Math.max(0, railHeight - thumbHeight - 40);
									};

									// Получаем максимальную прокрутку скролл блока
									const getMaxScrollTop = () => {
										return Math.max(0, scrollableBlock.scrollHeight - scrollableBlock.clientHeight);
									};

									// Синхронизируем ползунок при прокрутке блока
									const syncThumbFromScroll = () => {
										const maxScroll = getMaxScrollTop();

										if (maxScroll <= 0) {
											thumb.style.transform = "translateY(0px)";
											return;
										}

										const scrollPercent = scrollableBlock.scrollTop / maxScroll;
										const maxThumbTop = getMaxThumbTop();
										const newThumbTop = scrollPercent * maxThumbTop;

										newThumbTop > 10 ? slider.classList.add("started") : slider.classList.remove("started");

										thumb.style.transform = `translateY(${newThumbTop}px)`;
									};

									// Синхронизируем скролл блок по перемещению ползунка
									const syncScrollFromThumb = (clientY) => {
										const deltaY = clientY - startY;
										let newThumbTop = startThumbTop + deltaY;
										const maxThumbTop = getMaxThumbTop();

										newThumbTop = Math.min(Math.max(0, newThumbTop), maxThumbTop);
										thumb.style.transform = `translateY(${newThumbTop}px)`;

										const maxScroll = getMaxScrollTop();

										if (maxScroll > 0) {
											const scrollPercent = newThumbTop / maxThumbTop;
											scrollableBlock.scrollTop = scrollPercent * maxScroll;
										}
									};

									// Обработчики событий мыши
									const onMouseDown = (e) => {
										e.preventDefault();
										isDragging = true;
										startY = e.clientY;
										startScrollTop = scrollableBlock.scrollTop;

										const transform = thumb.style.transform;
										const match = transform.match(/translateY\(([\d\.]+)px\)/);

										startThumbTop = match ? parseFloat(match[1]) : 0;

										document.addEventListener("mousemove", onMouseMove);
										document.addEventListener("mouseup", onMouseUp);
										thumb.classList.add("dragging");
									};

									const onMouseMove = (e) => {
										if (!isDragging) return;
										e.preventDefault();
										syncScrollFromThumb(e.clientY);
									};

									const onMouseUp = () => {
										isDragging = false;
										document.removeEventListener("mousemove", onMouseMove);
										document.removeEventListener("mouseup", onMouseUp);
										thumb.classList.remove("dragging");
									};

									// Обработчики событий touch для мобильных устройств
									const onTouchStart = (e) => {
										e.preventDefault();
										isDragging = true;
										startY = e.touches[0].clientY;
										startScrollTop = scrollableBlock.scrollTop;

										const transform = thumb.style.transform;
										const match = transform.match(/translateY\(([\d\.]+)px\)/);
										startThumbTop = match ? parseFloat(match[1]) : 0;

										document.addEventListener("touchmove", onTouchMove);
										document.addEventListener("touchend", onTouchEnd);
										thumb.classList.add("dragging");
									};

									const onTouchMove = (e) => {
										if (!isDragging) return;
										e.preventDefault();
										syncScrollFromThumb(e.touches[0].clientY);
									};

									const onTouchEnd = () => {
										isDragging = false;
										document.removeEventListener("touchmove", onTouchMove);
										document.removeEventListener("touchend", onTouchEnd);
										thumb.classList.remove("dragging");
									};

									thumb.addEventListener('mousedown', onMouseDown);
									thumb.addEventListener('touchstart', onTouchStart);
									scrollableBlock.addEventListener('scroll', syncThumbFromScroll);

									const resizeObserver = new ResizeObserver(() => {
										updateRailHeight();
										syncThumbFromScroll();
									});
									resizeObserver.observe(scrollableBlock);

									updateRailHeight();
									syncThumbFromScroll();
								},
								slideChange: function () {
									if (this.activeIndex === 0) {
										clientTitle.textContent = "поставщики";
									} else if (this.activeIndex === 1) {
										clientTitle.textContent = "заказчики";
									} else {
										clientTitle.textContent = "чиновники";
									}

									// Прокрутка левого блока с клиентами перетаскиванием ползунка
									const thumb = document.querySelector(".clients__thumb");
									const rail = document.querySelector(".clients__rail");
									const scrollableBlock = document.querySelectorAll(".clients__items")[this.activeIndex];
									const slider = document.querySelector(".clients__slider");
									let isDragging = false;
									let startY = 0;
									let startScrollTop = 0;
									let startThumbTop = 0;

									// Обнуляем позиции при смене слайда
									thumb.style.transform = "translateY(0px)";
									scrollableBlock.scrollTop = 0;

									// Высота области прокрутки равна высоте скролл блока
									const updateRailHeight = () => {
										const blockHeight = scrollableBlock.clientHeight;

										rail.style.height = `${blockHeight + 80}px`;
									};

									// Получаем максимальное смещение для ползунка
									const getMaxThumbTop = () => {
										const railHeight = rail.clientHeight;
										const thumbHeight = thumb.offsetHeight;

										return Math.max(0, railHeight - thumbHeight - 40);
									};

									// Получаем максимальную прокрутку скролл блока
									const getMaxScrollTop = () => {
										return Math.max(0, scrollableBlock.scrollHeight - scrollableBlock.clientHeight);
									};

									// Синхронизируем ползунок при прокрутке блока
									const syncThumbFromScroll = () => {
										const maxScroll = getMaxScrollTop();

										if (maxScroll <= 0) {
											thumb.style.transform = "translateY(0px)";
											return;
										}

										const scrollPercent = scrollableBlock.scrollTop / maxScroll;
										const maxThumbTop = getMaxThumbTop();
										const newThumbTop = scrollPercent * maxThumbTop;

										newThumbTop > 10 ? slider.classList.add("started") : slider.classList.remove("started");

										thumb.style.transform = `translateY(${newThumbTop}px)`;
									};

									// Синхронизируем скролл блок по перемещению ползунка
									const syncScrollFromThumb = (clientY) => {
										const deltaY = clientY - startY;
										let newThumbTop = startThumbTop + deltaY;
										const maxThumbTop = getMaxThumbTop();

										newThumbTop = Math.min(Math.max(0, newThumbTop), maxThumbTop);
										thumb.style.transform = `translateY(${newThumbTop}px)`;

										const maxScroll = getMaxScrollTop();

										if (maxScroll > 0) {
											const scrollPercent = newThumbTop / maxThumbTop;
											scrollableBlock.scrollTop = scrollPercent * maxScroll;
										}
									};

									// Обработчики событий мыши
									const onMouseDown = (e) => {
										e.preventDefault();
										isDragging = true;
										startY = e.clientY;
										startScrollTop = scrollableBlock.scrollTop;

										const transform = thumb.style.transform;
										const match = transform.match(/translateY\(([\d\.]+)px\)/);

										startThumbTop = match ? parseFloat(match[1]) : 0;

										document.addEventListener("mousemove", onMouseMove);
										document.addEventListener("mouseup", onMouseUp);
										thumb.classList.add("dragging");
									};

									const onMouseMove = (e) => {
										if (!isDragging) return;
										e.preventDefault();
										syncScrollFromThumb(e.clientY);
									};

									const onMouseUp = () => {
										isDragging = false;
										document.removeEventListener("mousemove", onMouseMove);
										document.removeEventListener("mouseup", onMouseUp);
										thumb.classList.remove("dragging");
									};

									// Обработчики событий touch для мобильных устройств
									const onTouchStart = (e) => {
										e.preventDefault();
										isDragging = true;
										startY = e.touches[0].clientY;
										startScrollTop = scrollableBlock.scrollTop;

										const transform = thumb.style.transform;
										const match = transform.match(/translateY\(([\d\.]+)px\)/);
										startThumbTop = match ? parseFloat(match[1]) : 0;

										document.addEventListener("touchmove", onTouchMove);
										document.addEventListener("touchend", onTouchEnd);
										thumb.classList.add("dragging");
									};

									const onTouchMove = (e) => {
										if (!isDragging) return;
										e.preventDefault();
										syncScrollFromThumb(e.touches[0].clientY);
									};

									const onTouchEnd = () => {
										isDragging = false;
										document.removeEventListener("touchmove", onTouchMove);
										document.removeEventListener("touchend", onTouchEnd);
										thumb.classList.remove("dragging");
									};

									thumb.addEventListener('mousedown', onMouseDown);
									thumb.addEventListener('touchstart', onTouchStart);
									scrollableBlock.addEventListener('scroll', syncThumbFromScroll);

									const resizeObserver = new ResizeObserver(() => {
										updateRailHeight();
										syncThumbFromScroll();
									});
									resizeObserver.observe(scrollableBlock);

									updateRailHeight();
									syncThumbFromScroll();
								},
							}
						});
					});
				}

				isOnce = true;
			}
		});
	});

	observer.observe(contentBlock, {
		attributes: true,
		attributeFilter: ['style', 'class']
	});
});
