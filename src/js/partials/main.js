document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);

	const media991 = window.matchMedia("(max-width: 991px)").matches;

	// Плавный скролл
	/*const lenis = new Lenis({
		autoRaf: true
	});*/

	const fadeIn = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeOut = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeUp = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeX = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			x: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const fadeY = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			opacity: 1,
			y: 0,
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const widthX = (element, duration = 0.7, delay = 0) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
				start: "top 100%",
				end: "bottom 10%"
			},
			width: "100%",
			duration,
			delay,
			ease: "power2.out"
		});
	}

	const heroSection = document.querySelector(".hero");

	if (heroSection) {
		const heroObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const container = heroSection.querySelector(".container--small");
					const cloud1 = heroSection.querySelector(".cloud--1");
					const cloud2 = heroSection.querySelector(".cloud--2");
					const cloud3 = heroSection.querySelector(".cloud--3");
					const dashes1 = heroSection.querySelector(".dashes--1");
					const dashes2 = heroSection.querySelector(".dashes--2");
					const dashes3 = heroSection.querySelector(".dashes--3");
					const square1 = heroSection.querySelector(".square--1");
					const square2 = heroSection.querySelector(".square--2");
					const square3 = heroSection.querySelector(".square--3");
					const top = heroSection.querySelector(".hero__top");
					const text = heroSection.querySelector(".hero__text");
					const yearLabel = heroSection.querySelector(".hero__year-label");
					const year2 = heroSection.querySelector(".hero__year-2");
					const year0 = heroSection.querySelector(".hero__year-0");
					const tabLine = heroSection.querySelector(".tabs__line");
					const tabYears = heroSection.querySelectorAll(".tabs__timeline > span");
					const tabsBottom = heroSection.querySelector(".tabs__bottom");
					const tabsButton = heroSection.querySelectorAll(".tabs__item:not(.tabs__item--popup) .tabs__button");
					const tabsPopupButton = heroSection.querySelector(".tabs__item--popup");
					const tabsContentWrapper = heroSection.querySelector(".hero__content");
					const tabsContent = heroSection.querySelectorAll(".timeline__page");
					const dictionaryItems = heroSection.querySelectorAll(".dictionary__title");
					const title = heroSection.querySelector(".tabs__title");
					const dictionaryCarousel = heroSection.querySelector(".dictionary__slider");
					const clientsCarousel = heroSection.querySelector(".clients__slider");
					let horizontalTween;

					// Анимация первого экрана
					fadeUp(top, 0.3);
					fadeX(year2, 0.5, 0.4);
					fadeX(year0, 0.5, 0.4);
					fadeX(yearLabel, 0.5, 0.6);
					fadeIn(cloud1, 0.3, 1);
					fadeY(square1, 0.3, 1.2);
					fadeY(square2, 0.3, 1.2);
					fadeIn(dashes1, 0.3, 1.4);
					fadeX(dashes2, 0.3, 1.4);
					fadeX(text, 0.3, 1.4);
					widthX(tabLine, 1, 1.6);
					tabYears.forEach(year => fadeIn(year, 1, 2.1));
					fadeY(tabsBottom, 0.5, 2.3);
					fadeX(cloud2, 1, 0.4);
					fadeX(cloud3, 1, 0.7);
					fadeIn(square3, 0.3, 1.3);
					fadeIn(dashes3, 0.3, 1.4);

					// Клик на табы
					tabsButton.forEach((button, index) => {
						button.addEventListener("click", () => {
							const timeline = document.querySelector(".timeline");
							const clientTitle = document.querySelector(".clients__title-name");
							const timelineActiveClass = Array.from(timeline.classList).find(className => className.startsWith("active-"));

							// Присваиваем класс по активному табу
							if (timelineActiveClass) {
								timeline.classList.remove(timelineActiveClass);
							}
							timeline.classList.add(`active-${index + 1}`);

							// Применяем стандартный контейнер
							if (container) {
								container.classList.remove("container--small");
							}

							// Класс для анимаций второго экрана
							if (!heroSection.classList.contains("hero--closed")) {
								heroSection.classList.add("hero--closed");
							}

							tabsButton.forEach(el => {
								el.parentElement.removeAttribute("data-hidden");
								el.classList.add("disabled");
							});
							button.parentElement.dataset.hidden = "true";
							tabsPopupButton.removeAttribute("data-hidden");

							tabsContent.forEach(el => {
								el.style.display = "none";
								fadeOut(el, 0.3);
							});
							tabsContent[index].style.display = "flex";
							fadeIn(tabsContent[index], 0.3);

							tabsContentWrapper.style.display = "flex";
							fadeY(tabsContentWrapper, 0.3, 0.7);

							title.textContent = button.nextElementSibling.textContent;
							title.dataset.text = button.textContent;

							// Высота линии от года до карточки
							const timelineSteps = document.querySelectorAll(".timeline-step");

							if (timelineSteps && timelineSteps.length > 0) {
								timelineSteps.forEach(step => {
									const line = step.querySelector(".timeline-step__line");
									const year = step.querySelector(".timeline-step__year");
									const card = step.querySelector(".timeline-step__card");

									if (year && card) {
										const yearRect = year.getBoundingClientRect();
										const cardRect = card.getBoundingClientRect();

										line.style.height = `${cardRect.top - yearRect.bottom}px`;
									}
								});
							}

							// Горизонтальный скролл
							const timelineWrapper = document.querySelector(".timeline__wrapper");

							window.scrollTo(0, 0);

							document.body.setAttribute("no-scroll", true);

							if (horizontalTween) {
								if (horizontalTween.scrollTrigger) {
									horizontalTween.scrollTrigger.kill();
								}
								horizontalTween.kill();
								horizontalTween = undefined;
								timelineWrapper.removeAttribute("style");
							}

							setTimeout(() => {
								const horizontalSection = document.querySelector(".hero");

								const timelineScrollWidth = tabsContent[index].offsetWidth/* + (index === 0 ? 700 : 200)*/ + 200;
								const timelineWidth = timeline.offsetWidth;
								const scrollDistance = timelineScrollWidth - timelineWidth;

								gsap.set(timelineWrapper, {
									width: timelineScrollWidth,
									x: 0
								});

								horizontalTween = gsap.to(timelineWrapper, {
									x: -scrollDistance,
									ease: "none",
									onInit: () => {
										tabsButton.forEach(el => el.classList.remove("disabled"));
										document.body.removeAttribute("no-scroll");
									},
									scrollTrigger: {
										trigger: horizontalSection,
										start: "bottom bottom",
										pin: true,
										scrub: 3,
										anticipatePin: 1,
										invalidateOnRefresh: true,
										onUpdate: (self) => {
											if (dictionaryCarousel.swiper) {
												dictionaryCarousel.swiper.slideTo(
													Math.round(self.progress * (dictionaryCarousel.swiper.slides.length))
												);
											}

											if (clientsCarousel.swiper && !media991) {
												if (clientsCarousel.swiper.activeIndex === 0) {
													clientTitle.textContent = "поставщики";
												} else if (clientsCarousel.swiper.activeIndex === 1) {
													clientTitle.textContent = "заказчики";
												} else {
													clientTitle.textContent = "чиновники";
												}

												clientsCarousel.swiper.slideTo(
													Math.round(self.progress * (clientsCarousel.swiper.slides.length))
												);
											}
										}
									}
								});

								ScrollTrigger.refresh();

								if (media991) {
									window.scrollTo({
										top: timelineWrapper.offsetTop + timelineWrapper.clientHeight,
										behavior: "smooth"
									});
								}
							}, 1100);
						});
					});

					// Словарь
					dictionaryItems.forEach(el => {
						const text = el.querySelector(".dictionary__text");

						el.addEventListener("click", (e) => {
							text.classList.add("open");
						});

						document.addEventListener("click", (e) => {
							if (el && !el.contains(e.target) && e.target !== el || e.target.classList.contains("dictionary__close")) {
								text.classList.remove("open");
							}
						});
					});

					heroObserver.unobserve(heroSection);
				}
			});
		});

		heroObserver.observe(heroSection);
	}

	// Открыть/закрыть попап
	const popup = document.querySelector(".popup");

	const openPopupHandler = (popup) => {
		popup.classList.add("open");
	}

	const closePopupHandler = (popup) => {
		popup.classList.remove("open");
	}

	if (popup) {
		const popupOpenButton = document.querySelector(".tabs__item--popup");
		const popupCloseButton = popup.querySelector(".popup__button");
		const overlay = popup.querySelector(".popup__overlay");

		popupOpenButton.addEventListener("click", () => openPopupHandler(popup));
		popupCloseButton.addEventListener("click", () => closePopupHandler(popup));
		overlay.addEventListener("click", () => closePopupHandler(popup));
	}
});
