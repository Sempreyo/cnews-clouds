document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(ScrollToPlugin);
	gsap.registerPlugin(Observer);

	const media767 = window.matchMedia("(max-width: 767px)").matches;

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

	// Анимация портретов на первом экране
	const animateGallery = ([...images]) => {
		const newArray = [];

		while (images.length) {
			newArray.push(images.splice(0, 2));
		}

		setTimeout(() => {
			newArray.forEach((group, index) => {
				group.forEach(element => {
					setTimeout(() => {
						fadeIn(element, 0.3);
					}, index * 100);
				});
			});
		}, 2300);
	}

	// Анимация прокрутки таймлайн блоков
	let horizontalTween;
	const animateScroll = (timeline, timelineContainer, timelineScroll, tabsButton) => {
		//window.scrollTo(0, 0);

		//document.body.setAttribute("no-scroll", true);

		if (horizontalTween) {
			if (horizontalTween.scrollTrigger) {
				horizontalTween.scrollTrigger.disable(false);
				horizontalTween.scrollTrigger.kill(true);
			}
			horizontalTween.kill();
			horizontalTween = undefined;
		}

		ScrollTrigger.getAll().forEach(st => {
			if (st.trigger === timelineContainer) {
				st.kill(true);
			}
		});

		const pinSpacer = timelineContainer.closest('.pin-spacer');
		if (pinSpacer) {
			pinSpacer.parentNode.insertBefore(timelineContainer, pinSpacer);
			pinSpacer.parentNode.removeChild(pinSpacer);
		}

		// Сбрасываем стили, которые могли остаться от прошлых расчетов
		gsap.set([timelineContainer, timelineScroll], { clearProps: "all" });
		window.scrollTo(0, 0);

		setTimeout(() => {
			// Временно обнуляем позицию ленты для точного замера координат
			gsap.set(timelineScroll, { x: 0, width: "max-content" });

			const steps = timelineContainer.querySelectorAll('.timeline__page.active .timeline-step');

			if (steps.length === 0) return;

			// Находим первый и последний элементы
			const firstStep = steps[0];
			const lastStep = steps[steps.length - 1];

			// Измеряем реальные физические границы элементов на экране
			const firstRect = firstStep.getBoundingClientRect();
			const lastRect = lastStep.getBoundingClientRect();

			// Базовая ширина от левого края первой карточки до правого края последней
			let timelineScrollWidth = lastRect.right - firstRect.left;

			// Корректируем отрицательные маргины для последних блоков
			const lastStyles = window.getComputedStyle(lastStep);
			const lastMarginRight = parseInt(lastStyles.marginRight, 10) || 0;
			const lastMarginLeft = parseInt(lastStyles.marginLeft, 10) || 0;

			// Если у последней карточки есть отрицательный маргин или она сильно сдвинута, компенсируем это в ширине:
			if (lastMarginRight < 0) {
				timelineScrollWidth += Math.abs(lastMarginRight);
			}

			// Добавляем запас в конце ленты
			const safetyPadding = 550;
			timelineScrollWidth += safetyPadding;

			//const timelineScrollWidth = timelineScroll.scrollWidth;
			const timelineWidth = timeline.offsetWidth - 220;
			const scrollDistance = timelineScrollWidth - timelineWidth;
			let isMenuVisible = false;
			const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
			const tabs = tabsWrapper.querySelector(".tabs");

			gsap.set(timelineScroll, {
				width: timelineScrollWidth,
				x: 0
			});

			horizontalTween = gsap.to(timelineScroll, {
				id: "firstHorizontal",
				x: -scrollDistance,
				ease: "power1.inOut",
				onInit: () => {
					if (tabsButton) {
						tabsButton.forEach(el => el.classList.remove("disabled"));
						document.body.removeAttribute("no-scroll");

						const history = document.querySelector(".history");
						fadeIn(history, 0.3);
					}
				},
				scrollTrigger: {
					trigger: timelineContainer,
					start: `${-(tabs.offsetHeight + 60)} top`,
					pin: true,
					scrub: 3,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					fastScrollEnd: true,
					end: () => "+=" + scrollDistance,
					onEnter: () => {
						menu.classList.add("fixed");

						tabsWrapper.style.height = `${tabs.offsetHeight}px`;
						tabs.classList.add("fixed");
						/*const startY = -(tabs.offsetHeight + 20);

						gsap.fromTo(
							tabs,
							{y: startY},
							{y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto"}
						);*/
					},
					onLeave: () => {
						/*gsap.to(tabs, { y: -(tabs.offsetHeight + 60), ease: "power2.out" });*/
					},
					onEnterBack: () => {
						/*tabsWrapper.style.height = `${tabs.offsetHeight}px`;
						tabs.classList.add("fixed");
						gsap.to(tabs, {y: 0, ease: "power2.out"});*/
					},
					onLeaveBack: () => {
						menu.classList.remove("fixed");
						tabs.classList.remove("fixed");
						tabsWrapper.style.height = "auto";

						/*const endY = -(tabs.offsetHeight + 20);

						gsap.to(tabs, {
							y: endY,
							duration: 0.3,
							ease: "power2.in",
							overwrite: "auto",
							onComplete: () => {
								tabs.classList.remove("fixed");
								gsap.set(tabs, {y: 0});
								tabsWrapper.style.height = "auto";
							}
						});*/
					},
					onUpdate: (self) => {
						const isInRange = self.progress > 0 && self.progress < 1;

						if (isInRange && !isMenuVisible) {
							//isMenuVisible = true;

							menuItemHistory.classList.remove("hidden");
							menuItemTimeline.classList.add("hidden");

							/*gsap.set(menu, { bottom: "30px", top: "auto" });

							gsap.to(
								menu,
								{y: 0, opacity: 1, ease: "none", duration: 0.3, overwrite: "auto"}
							);*/
						} else if (!isInRange && isMenuVisible) {
							menuItemHistory.classList.remove("hidden");
							menuItemTimeline.classList.add("hidden");

							/*isMenuVisible = false;

							gsap.to(
								menu,
								{y: 100, opacity: 0, ease: "none", duration: 0.1, overwrite: "auto"}
							);*/
						}
					}
				}
			});

			ScrollTrigger.refresh(true);
		}, 1100);
	}

	// Анимация прокрутки блоков истории
	let horizontalTween2;
	const animateHistory = (parent, parentContainer, parentScroll) => {
		if (horizontalTween2) {
			if (horizontalTween2.scrollTrigger) {
				horizontalTween2.scrollTrigger.disable(false);
				horizontalTween2.scrollTrigger.kill(true);
			}
			horizontalTween2.kill();
			horizontalTween2 = undefined;
		}

		ScrollTrigger.getAll().forEach(st => {
			if (st.trigger === parentContainer) {
				st.kill(true);
			}
		});

		const pinSpacer = parentContainer.closest('.pin-spacer');
		if (pinSpacer) {
			pinSpacer.parentNode.insertBefore(parentContainer, pinSpacer);
			pinSpacer.parentNode.removeChild(pinSpacer);
		}

		// Сбрасываем стили, которые могли остаться от прошлых расчетов
		gsap.set([parentContainer, parentScroll], { clearProps: "all" });
		window.scrollTo(0, 0);

		setTimeout(() => {
			// Временно обнуляем позицию ленты для точного замера координат
			gsap.set(parentScroll, { x: 0, width: "max-content" });

			const steps = parentContainer.querySelectorAll('.history__title, .history__items');

			if (steps.length === 0) return;

			// Находим первый и последний элементы
			const firstStep = steps[0];
			const lastStep = steps[steps.length - 1];

			// Измеряем реальные физические границы элементов на экране
			const firstRect = firstStep.getBoundingClientRect();
			const lastRect = lastStep.getBoundingClientRect();

			// Базовая ширина от левого края первой карточки до правого края последней
			let parentScrollWidth = lastRect.right - firstRect.left;

			// Добавляем запас в конце ленты
			const safetyPadding = 350;
			parentScrollWidth += safetyPadding;

			const parentWidth = parent.offsetWidth;
			const scrollDistance = parentScrollWidth - parentWidth;
			let isMenuVisible = false;
			const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
			const tabs = tabsWrapper.querySelector(".tabs");

			gsap.set(parentScroll, {
				width: parentScrollWidth,
				x: 0
			});

			horizontalTween2 = gsap.to(parentScroll, {
				x: -scrollDistance,
				ease: "power1.inOut",
				scrollTrigger: {
					trigger: parentContainer,
					start: `${-(tabs.offsetHeight + 60)} top`,
					pin: true,
					scrub: 3,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					fastScrollEnd: true,
					end: () => "+=" + scrollDistance,
					/*onEnter: () => {
						tabsWrapper.style.height = `${tabs.offsetHeight}px`;
						tabs.classList.add("fixed");
						const startY = -(tabs.offsetHeight + 20);

						gsap.fromTo(
							tabs,
							{y: startY},
							{y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto"}
						);
					},
					onLeave: () => {
						//tabs.classList.remove("fixed");
						gsap.to(tabs, { y: -(tabs.offsetHeight + 60), ease: "power2.out" });
						//tabsWrapper.style.height = "auto";
					},
					onEnterBack: () => {
						tabsWrapper.style.height = `${tabs.offsetHeight}px`;
						tabs.classList.add("fixed");
						gsap.to(tabs, {y: 0, ease: "power2.out"});
					},
					onLeaveBack: () => {
						const endY = -(tabs.offsetHeight + 20);

						gsap.to(tabs, {
							y: endY,
							duration: 0.3,
							ease: "power2.in",
							overwrite: "auto",
							onComplete: () => {
								tabs.classList.remove("fixed");
								gsap.set(tabs, {y: 0});
								tabsWrapper.style.height = "auto";
							}
						});
					},*/
					onUpdate: (self) => {
						const isInRange = self.progress > 0 && self.progress < 1;

						if (isInRange && !isMenuVisible) {
							//isMenuVisible = true;

							menuItemHistory.classList.add("hidden");
							menuItemTimeline.classList.remove("hidden");

							/*gsap.set(menu, { bottom: "30px", top: "auto" });

							gsap.to(
								menu,
								{y: 0, opacity: 1, ease: "none", duration: 0.3, overwrite: "auto"}
							);*/
						} else if (!isInRange && isMenuVisible) {
							menuItemHistory.classList.remove("hidden");
							menuItemTimeline.classList.add("hidden");

							/*isMenuVisible = false;

							gsap.to(
								menu,
								{
									y: 100, opacity: 0, ease: "none", duration: 0.1, overwrite: "auto"
								}
							);*/
						}
					}
				}
			});

			ScrollTrigger.refresh(true);
		}, 1100);
	}

	// Анимация прокрутки тенденций
	let horizontalObserver;
	let currentX = 0;
	const animateTrend = (parent, parentContainer, parentScroll) => {
		if (horizontalObserver) {
			horizontalObserver.kill();
			horizontalObserver = undefined;
		}

		gsap.set(parentScroll, { clearProps: "all" });
		currentX = 0;

		setTimeout(() => {
			const parentScrollWidth = parentScroll.scrollWidth;
			const parentWidth = parent.offsetWidth;
			// Максимальное расстояние, на которое можно сдвинуть контейнер влево
			const maxScroll = -(parentScrollWidth - parentWidth + 100);

			gsap.set(parentScroll, {
				width: parentScrollWidth,
				x: 0
			});

			horizontalObserver = Observer.create({
				target: parent,
				type: "wheel,touch",
				wheelSpeed: 1,
				tolerance: 5,
				preventDefault: true, // запрещаем стандартный вертикальный скролл страницы
				onChange: (self) => {
					const isTouch = self.event.type.includes('touch');

					if (isTouch) {
						const deltaX = self.deltaX * 1.8;
						currentX += deltaX;
					} else {
						const deltaY = self.deltaY * 1.2;
						currentX -= deltaY;
					}

					if (currentX > 0) currentX = 0;
					if (currentX < maxScroll) currentX = maxScroll;

					gsap.to(parentScroll, {
						x: currentX,
						duration: isTouch ? 0.1 : 0.4,
						ease: "power1.out",
						overwrite: "auto"
					});
				}
			});
		}, 400);
	}

	// Навигация по прокручиваемым блокам
	const menu = document.querySelector(".hero__menu");
	const menuItemStart = menu.querySelectorAll(".hero__menu-item")[4];
	const menuItemHistory = menu.querySelectorAll(".hero__menu-item")[0];
	const menuItemTimeline = menu.querySelectorAll(".hero__menu-item")[1];

	// Начальная позиция навигации
	//gsap.set(menu, { xPercent: -50, y: 90, opacity: 0 });

	menuItemStart.addEventListener("click", () => {
		const container = document.querySelector(".container");
		const tabsContentWrapper = container.querySelector(".hero__content");
		const tabsPopupButton = heroSection.querySelector(".tabs__item--popup");
		const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
		const tabs = tabsWrapper.querySelector(".tabs");

		//tabsWrapper.style.height = "auto";
		tabs.classList.remove("fixed");

		//gsap.set(menu, { xPercent: -50, y: 90, opacity: 0 });

		gsap.to(window, {
			scrollTo: 0,
			duration: 1.5,
			ease: "power3.out",
			overwrite: "auto"
		});

		// Возвращаем малый контейнер
		if (container) {
			container.classList.add("container--small");
		}

		// Убираем класс для анимаций второго экрана
		if (heroSection.classList.contains("hero--closed")) {
			heroSection.classList.remove("hero--closed");
		}

		tabsContentWrapper.style.display = "none";

		tabsPopupButton.setAttribute("data-hidden", true);

		ScrollTrigger.getAll().forEach(st => {
			if (
				st.trigger === document.querySelector(".timeline__wrapper") ||
				st.trigger === document.querySelector(".history__wrapper")
			) {
				st.kill(true);
			}
		});
	});

	menuItemTimeline.addEventListener("click", () => {
		if (horizontalTween && horizontalTween.scrollTrigger) {
			const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
			const targetScrollPoint = horizontalTween.scrollTrigger.start + 30;

			horizontalTween.scrollTrigger.disable(false);

			fadeOut(tabsWrapper, 0);
			fadeOut(horizontalTween._targets[0], 0);
			fadeOut(horizontalTween2._targets[0], 0);

			menuItemHistory.classList.remove("hidden");
			menuItemTimeline.classList.add("hidden");

			gsap.to(window, {
				scrollTo: targetScrollPoint,
				duration: 0.3,
				ease: "power2.out",
				overwrite: "auto",
				onComplete: () => {
					horizontalTween.scrollTrigger.enable();
					ScrollTrigger.refresh();
					fadeIn(tabsWrapper, 0.2);
					fadeIn(horizontalTween._targets[0], 0.2);
					fadeIn(horizontalTween2._targets[0], 0.2);
				}
			});
		}
	});

	menuItemHistory.addEventListener("click", () => {
		if (horizontalTween2 && horizontalTween2.scrollTrigger) {
			const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
			const targetScrollPoint = horizontalTween2.scrollTrigger.start + 90;

			horizontalTween.scrollTrigger.disable(false);

			fadeOut(tabsWrapper, 0);
			fadeOut(horizontalTween._targets[0], 0);
			fadeOut(horizontalTween2._targets[0], 0);

			menuItemHistory.classList.add("hidden");
			menuItemTimeline.classList.remove("hidden");

			gsap.to(window, {
				scrollTo: targetScrollPoint,
				duration: 0.3,
				ease: "power2.out",
				overwrite: "auto",
				onComplete: () => {
					horizontalTween.scrollTrigger.enable();
					ScrollTrigger.refresh();
					fadeIn(tabsWrapper, 0.2);
					fadeIn(horizontalTween._targets[0], 0.2);
					fadeIn(horizontalTween2._targets[0], 0.2);
				}
			});
		}
	});

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
					const square3 = heroSection.querySelector(".square--3");
					const top = heroSection.querySelector(".hero__top");
					const text = heroSection.querySelector(".hero__text");
					const yearLabel = heroSection.querySelector(".hero__year-label");
					const year2 = heroSection.querySelector(".hero__year-2");
					const year0 = heroSection.querySelector(".hero__year-0");
					const tabLine = heroSection.querySelector(".tabs__line");
					const tabYears = heroSection.querySelectorAll(".tabs__timeline > span");
					const tabsBottom = heroSection.querySelector(".tabs__bottom");
					const tabsPrev = heroSection.querySelector(".hero__menu-item--prev");
					const tabsNext = heroSection.querySelector(".hero__menu-item--next");
					const tabsButton = heroSection.querySelectorAll(".tabs__item:not(.tabs__item--popup) .tabs__button");
					const tabsPopupButton = heroSection.querySelector(".tabs__item--popup");
					const tabsContentWrapper = heroSection.querySelector(".hero__content");
					const tabsContent = heroSection.querySelectorAll(".timeline__page");
					const dictionaryItems = heroSection.querySelectorAll(".dictionary__title");
					const title = heroSection.querySelector(".tabs__title");
					const gallery = heroSection.querySelectorAll(".portraits__item");

					animateGallery(gallery);

					// Анимация первого экрана
					fadeUp(top, 0.3);
					fadeX(year2, 0.5, 0.4);
					fadeX(year0, 0.5, 0.4);
					fadeX(yearLabel, 0.5, 0.6);
					fadeIn(cloud1, 0.3, 1);
					fadeY(square1, 0.3, 1.2);
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

					const tabsHandler = (index, direction) => {
						const timeline = document.querySelector(".timeline");
						const timelineActiveClass = Array.from(timeline.classList).find(className => className.startsWith("active-"));
						const timelineActiveIndex = timelineActiveClass ? +timelineActiveClass.slice(-1) : null;
						const tabsWrapper = document.querySelector(".hero__tabs-wrapper");
						const tabs = tabsWrapper.querySelector(".tabs");
						const history = document.querySelector(".history");

						if (direction === "prev") {
							if (timelineActiveIndex - 2 >= 0) {
								index = timelineActiveIndex - 2;
							} else {
								index = 2;
							}
						}

						if (direction === "next") {
							if (timelineActiveIndex < 3) {
								index = timelineActiveIndex;
							} else {
								index = 0;
							}
						}

						fadeOut(history, 0);

						tabsWrapper.style.height = "auto";
						tabs.classList.remove("fixed");
						menu.classList.remove("fixed");

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
							el.parentElement.classList.remove("active");
							!media767 ? el.classList.add("disabled") : "";
						});
						tabsButton[index].parentElement.classList.add("active");
						tabsPopupButton.removeAttribute("data-hidden");

						tabsContent.forEach(el => {
							el.classList.remove("active");
						});
						tabsContent[index].classList.add("active");

						tabsContentWrapper.style.display = "flex";
						fadeIn(tabsContentWrapper, 0.3, 0.7);

						title.textContent = tabsButton[index].nextElementSibling.textContent;
						title.dataset.text = tabsButton[index].textContent;
						menuItemTimeline.querySelector("span").textContent = title.textContent;
						menuItemHistory.classList.remove("hidden");
						menuItemTimeline.classList.add("hidden");

						// Высота линии от года до карточки
						/*const timelineSteps = document.querySelectorAll(".timeline-step");

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
						}*/

						if (!media767) {
							// Горизонтальный скролл
							animateScroll(
								timeline,
								document.querySelector(".timeline__wrapper"),
								document.querySelector(".timeline__scroll"),
								tabsButton
							);

							// Горизонтальный скролл 2
							animateHistory(
								document.querySelector(".history"),
								document.querySelector(".history__wrapper"),
								document.querySelector(".history__scroll")
							);
						} else {
							window.scrollTo({
								top: tabsContentWrapper.offsetTop,
								behavior: "smooth"
							});

							ScrollTrigger.getAll().forEach(st => {
								if (
									st.trigger === document.querySelector(".timeline__wrapper") ||
									st.trigger === document.querySelector(".history__wrapper")
								) {
									st.kill(true);
								}
							});
						}
					}

					// Клик на табы
					tabsButton.forEach((button, index) => {
						button.addEventListener("click", () => tabsHandler(index));
					});

					tabsPrev.addEventListener("click", () => tabsHandler(false, "prev"));
					tabsNext.addEventListener("click", () => tabsHandler(false, "next"));

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
		document.body.setAttribute("no-scroll", true);

		// Горизонтальный скролл 3
		animateTrend(
			popup,
			document.querySelector(".popup__wrapper"),
			document.querySelector(".popup__scroll")
		);
	}

	const closePopupHandler = (popup) => {
		popup.classList.remove("open");
		document.body.removeAttribute("no-scroll");

		if (horizontalObserver) {
			horizontalObserver.kill();
			horizontalObserver = undefined;
		}
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
