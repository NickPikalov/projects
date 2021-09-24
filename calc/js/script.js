'use strict';

const inputRub = document.querySelector('#rub'),
    inputUsd = document.querySelector('#usd');

inputRub.addEventListener('input', () => {
    // создаем запрос - объект XMLHttpRequest
    const request = new XMLHttpRequest();

    //  собираем настройки для запроса
    request.open('GET', 'js/current.json');
    //  устанавливаем заголовки для передачи json
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    //  отправка запроса
    request.send();

    //  отслеживаем статус запроса в реальном времени
    request.addEventListener('load', () => {
        //  теперь просто проверяем успешность запроса 
        //  (мы знаем, что он уже закончился)
        if (request.status === 200) {
            console.log(request.response);
            const data = JSON.parse(request.response);
            inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2);
        } else {  
            inputUsd.value = "что-то пошло не так";
        }
    });

});


