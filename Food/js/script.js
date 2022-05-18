window.addEventListener("DOMContentLoaded", () => {
	const tabs = document.querySelectorAll(".tabheader__item"),
		tabsContent = document.querySelectorAll(".tabcontent"),
		tabsParent = document.querySelector(".tabheader__items");

	function hideTabContent() {
		tabsContent.forEach((item) => {
			item.classList.add("hide");
			item.classList.remove("show", "fade");
		});

		tabs.forEach((tab) => {
			tab.classList.remove("tabheader__item_active");
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add("show", "fade");
		tabsContent[i].classList.remove("hide");
		tabs[i].classList.add("tabheader__item_active");
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener("click", (e) => {
		const target = e.target;
		if (target && target.classList.contains("tabheader__item")) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// Timer

	const deadline = "2021-10-22";

	function getTimeRemeaning(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((t / 1000 / 60) % 60),
			seconds = Math.floor((t / 1000) % 60);

		return {
			total: t,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector("#days"),
			hours = timer.querySelector("#hours"),
			minutes = timer.querySelector("#minutes"),
			seconds = timer.querySelector("#seconds");

		const timeInterval = setInterval(updateClock, 1000);
		updateClock();

		function updateClock() {
			const t = getTimeRemeaning(endtime);
			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock(".timer", deadline);

	//Modal
	const modalButton = document.querySelectorAll("[data-modal]"),
		modal = document.querySelector(".modal");

	function showModal() {
		modal.classList.add("show");
		modal.classList.remove("hide");
		document.body.classList.add("scroll__hidden");
	}

	function closeModal() {
		modal.classList.add("hide");
		modal.classList.remove("show");
		document.body.classList.remove("scroll__hidden");
	}

	function keyDown(key) {
		console.log(key);
	}

	modalButton.forEach((e) => {
		e.addEventListener("click", () => {
			showModal();
		});
	});

	modal.addEventListener("click", (e) => {
		if (e.target === modal || e.target.getAttribute("data-close") == "") {
			closeModal();
		}
	});
	document.addEventListener("keydown", (e) => {
		if (e.code === "Escape" && modal.classList.contains("show")) {
			closeModal();
		}
	});

	setTimeout(showModal, 5000);

	//  Classes

	class AddMenuItem {
		constructor(subtitle, desc, price, img, alt, parentSelector, ...classes) {
			this.subtitle = subtitle;
			this.desc = desc;
			this.price = price;
			this.img = img;
			this.alt = alt;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27; // курс валют...
			this.changeToUAH();
		}
		// конвертация валют
		changeToUAH() {
			this.price = this.price * this.transfer;
		}

		render() {
			const itemElement = document.createElement("div");
			if (this.classes.length === 0) {
				this.itemElement = "menu__item";
				itemElement.classList.add(this.itemElement);
			} else {
				this.classes.forEach((className) =>
					itemElement.classList.add(className)
				);
			}

			itemElement.innerHTML = `
              <img src=${this.img} alt=${this.alt}>
              <h3 class="menu__item-subtitle">${this.subtitle}</h3>
              <div class="menu__item-descr">${this.desc}</div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
              </div>
        `;

			this.parent.append(itemElement);

			//document.querySelector('.menu__field').querySelector('.container').append(item);
		}
	}

	const getResource = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			// обработчик ошибок
			// выкинуть (throw) ошибку (Error)
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}
		return await res.json();
	};

	/*   getResource('http://localhost:3000/menu') // получаем данные с json сервера
	    .then(data => { // данные приходят как массив объектов
	      data.forEach(({ // его можно перебрать и деструктуризировать
	        // subtitle, desc, price, img, alt, parentSelector, ...classes
	        title,
	        descr,
	        price,
	        img,
	        altimg
	      }) => {
	        new AddMenuItem(title, descr, price, img, altimg, '.menu .container').render();
	      });
	    }); */

	axios.get("http://localhost:3000/menu").then((data) => {
		// данные приходят как массив объектов
		data.data.forEach(
			({
				// его можно перебрать и деструктуризировать
				// subtitle, desc, price, img, alt, parentSelector, ...classes
				title,
				descr,
				price,
				img,
				altimg,
			}) => {
				new AddMenuItem(
					title,
					descr,
					price,
					img,
					altimg,
					".menu .container"
				).render();
			}
		);
	});

	// Forms

	const forms = document.querySelectorAll("form");

	const message = {
		loading: "img/form/spinner.svg",
		success: "Thanks. We will call you back",
		failure: "something went wrong",
	};

	forms.forEach((item) => {
		bindPostData(item);
	});

	// async говорит что внутри функции будет асинхронный код
	const postData = async (url, data) => {
		// await говорит выполнение каких операций мы будем ждать
		// только после выполнения fetch будет создана переменная res
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: data,
		});
		// без async/await переменная res могла создаться "пустой"
		return await res.json();
	};

	function bindPostData(form) {
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			//  создаем блок на странице для отображения успешности отправки формы
			const statusMessage = document.createElement("img");
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
			form.insertAdjacentElement("afterend", statusMessage);

			const formData = new FormData(form);
			// Object.entries() - получили массив с массивами
			// Object.fromEntries() - превратили этот массив в объект
			const json = JSON.stringify(Object.fromEntries(FormData.entries()));

			postData("http://localhost:3000/requests", json)
				.then((data) => {
					showThanksModal(message.success);
					form.reset();
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector(".modal__dialog");

		prevModalDialog.classList.add("hide");
		showModal();

		const thanksModal = document.createElement("div");
		thanksModal.classList.add("modal__dialog");
		thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>X</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

		document.querySelector(".modal").append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add("show");
			prevModalDialog.classList.remove("hide");
			closeModal();
		}, 4000);
	}

	//  Slider

	const slides = document.querySelectorAll(".offer__slide"),
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector(".offer__slider-prev"),
		next = document.querySelector(".offer__slider-next"),
		total = document.querySelector("#total"),
		current = document.querySelector("#current"),
		slidesWrapper = document.querySelector(".offer__slider-wrapper"),
		slidesField = document.querySelector(".offer__slider-inner"),
		width = window.getComputedStyle(slidesWrapper).width;
	let slideIndex = 1;
	let offset = 0; // отступ - ширина на которую будем смещать слайды

	total.textContent = (slides.length < 10) ? `0${slides.length}` : slides.length;
	showFirstZero();

	// на всяк случ задаем ширину слайдам по ширине контейнера (поля) слайдов
	slides.forEach((slide) => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'),
		dots = [];
	indicators.classList.add('carousel-indicators');
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.classList.add('dot');
		indicators.append(dot);
		dots.push(dot);
	}

	function activeDotHighlite() {
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = '1';
	}
	activeDotHighlite();
	// удаляем лишние px и % со значений размеров, полученных со страницы
	function deleteNotDigits(str) {
		return +str.replace(/\D/g, '');
	}
	indicators.addEventListener('click', e => {
		if (e.target && e.target.tagName == 'LI') {
			slideIndex = e.target.getAttribute('data-slide-to');
			current.textContent = (slideIndex < 10) ? `0${slideIndex}` : slideIndex;
			offset = deleteNotDigits(width) * (slideIndex - 1);
			slidesField.style.transform = `translateX(-${offset}px)`;
			activeDotHighlite();
		}
	});

	//  если число меньше 10, показываем вначале дополнительный "0"
	function showFirstZero() {
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	// расширяем поле со слайдами и ставим картинки вряд
	slidesField.style.cssText = `
  width: ${100 * slides.length}%;
  display: flex;
  transition: 0.5s all;`;
	slidesWrapper.style.overflow = "hidden";

	next.addEventListener("click", () => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			// если слайд последний
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		showFirstZero();
		activeDotHighlite();
	});

	prev.addEventListener("click", () => {
		if (offset == 0) {
			//если слайд первый и мотаем влево, записываем в оффсет последний слайд
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		showFirstZero();
		activeDotHighlite();
	});

	//  Calc
	const result = document.querySelector('.calculating__result span');
	let sex = 'female',
		height, weight, age,
		ratio = 1.375;

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = "____";
			return;
		}
		if (sex == 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	calcTotal();

	function getStaticInformation(parentSelector, activeClass) {
		const elements = document.querySelectorAll(`${parentSelector} div`); // Получаем divы внутри parentSelector

		elements.forEach(elem => {
			elem.addEventListener('click', (e) => {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
				} else { // если у элемента нет аттрибута 'data-ratio', значит этот элемент - выбор пола
					sex = e.target.getAttribute('id');
				}

				elements.forEach(elem => {
					elem.classList.remove(activeClass);
				});

				e.target.classList.add(activeClass);

				calcTotal();
			});
		});

	}

	getStaticInformation('#gender', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {
			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}

			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');



});