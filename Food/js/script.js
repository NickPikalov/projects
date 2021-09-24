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

  const deadline = "2021-08-22";

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
    modal = document.querySelector(".modal"),
    closeButton = document.querySelector("[data-close]");

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
      modal.classList.add("show");
      modal.classList.remove("hide");
      document.body.classList.add("scroll__hidden");
    });
  });
  closeButton.addEventListener("click", () => {
    closeModal();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

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
        this.itemElement = 'menu__item';
        itemElement.classList.add(this.itemElement);
      } else {
        this.classes.forEach(className => itemElement.classList.add(className));
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
  new AddMenuItem(
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    20,
    "img/tabs/vegy.jpg",
    "vegy",
    ".menu .container"
  ).render();

  new AddMenuItem(
      'Меню “Премиум”',
      'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      25,
      'img/tabs/elite.jpg',
      'elite',
      '.menu .container'
  ).render();

  new AddMenuItem(
      'Меню "Постное"',
      'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      18,
      'img/tabs/post.jpg',
      'post',
      '.menu .container'
  ).render();

});
