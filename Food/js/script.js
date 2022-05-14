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
		prev = document.querySelector(".offer__slider-prev"),
		next = document.querySelector(".offer__slider-next"),
		total = document.querySelector("#total"),
		current = document.querySelector("#current"),
		slidesWrapper = document.querySelector(".offer__slider-wrapper"),
		slidesField = document.querySelector(".offer__slider-inner"),
		width = window.getComputedStyle(slidesWrapper).width;
	let slideIndex = 1;
	let offset = 0; // отступ - ширина на которую будем смещать слайды

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	// на всяк случ задаем ширину слайдам по ширине контейнера (поля) слайдов
	slides.forEach((slide) => {
		slide.style.width = width;
	});

	// расширяем поле со слайдами и ставим картинки вряд
	slidesField.style.cssText = `
  width: ${100 * slides.length}%;
  display: flex;
  transition: 0.5s all;`;
	slidesWrapper.style.overflow = "hidden";

	next.addEventListener("click", () => {
		if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
			// если слайд последний
			offset = 0;
		} else {
			offset += +width.slice(0, width.length - 2);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	});

	prev.addEventListener("click", () => {
		if (offset == 0) {
			//если слайд первый и мотаем влево, записываем в оффсет последний слайд
			offset = +width.slice(0, width.length - 2) * (slides.length - 1);
		} else {
			offset -= +width.slice(0, width.length - 2);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	});
});