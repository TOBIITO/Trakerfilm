function Addf(num){
    if (num == "1"){
        window.location.href = "1.html"
    }
    if (num == "2"){
        window.location.href = "2.html"
    }
    if (num == "3"){
        window.location.href = "3.html"
    }
    if (num == "4"){
        window.location.href = "4.html"
    }
}
function Return(){
    window.location.href = "index.html"
}
let kino = [];

// Умная функция, которая сама определяет ключ базы данных в зависимости от страницы
function getStorageKey() {
    if (window.location.href.includes('1.html')) return 'КиноПланирую';
    if (window.location.href.includes('2.html')) return 'КиноПросмотрено';
    if (window.location.href.includes('3.html')) return 'КиноБрошено';
    return 'КиноОбщее';
}

// Твой ключ Кинопоиска, который мы прописываем в заголовках запроса
const API_KEY = 'ff454051-9496-4366-897a-ee1829560403';

async function Addfilm() {
    let name = document.getElementById('Namekino').value;
    if (name == '') return;

    try {
        // 1. Делаем ленивый запрос к API Кинопоиска, ищем фильм по названию
            let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(name)}&page=1`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        let data = await response.json();
        
        // Берем самый первый фильм из результатов поиска
        let film = data.films[0]; 
        
        // Если Кинопоиск ничего не нашёл, ставим дефолтную заглушку
        let poster = film ? film.posterUrlPreview : 'https://placeholder.com';
        let rating = (film && film.rating !== 'null') ? film.rating : '—';
        let originalName = film ? film.nameRu : name;

        // 2. Теперь создаем объект фильма, чтобы сохранить и имя, и обложку, и рейтинг!
        let filmObject = {
            name: originalName,
            poster: poster,
            rating: rating
        };

        // 3. Закидываем объект в массив и сохраняем в базу данных по твоему умному пропуску
        kino.push(filmObject);
        let key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(kino));

        // Очищаем инпут
        document.getElementById('Namekino').value = '';

        // 4. Мгновенно выводим красивую карточку с обложкой и рейтингом на экран!
        if (document.getElementById('list1')) {
            document.getElementById('list1').innerHTML += `
                <li style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; list-style: none;">
                    <img src="${poster}" style="width: 60px; height: 90px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                    <div>
                        <b style="font-size: 16px; color: #ffffff; display: block;">${originalName}</b>
                        <span style="font-size: 14px; color: #ff8000; font-weight: bold;">⭐ ${rating}</span>
                    </div>
                </li>
            `;
        }

    } catch (error) {
        console.error("Ошибка при подключении к Кинопоиску:", error);
    }
}


window.onload = function() {
    let key = getStorageKey();
    let text = JSON.parse(localStorage.getItem(key));
    if (text == null) return;
    
    if (document.getElementById('list1')) { 
        text.forEach(function(item){
            // Так как item теперь объект, мы берем item.name, item.poster и item.rating
            document.getElementById('list1').innerHTML += `
                <li style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; list-style: none;">
                    <img src="${item.poster}" style="width: 60px; height: 90px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                    <div>
                        <b style="font-size: 16px; color: #ffffff; display: block;">${item.name}</b>
                        <span style="font-size: 14px; color: #ff8000; font-weight: bold;">⭐ ${item.rating}</span>
                        <button onclick="Delete('${item.name}')" style="margin-top: 5px; background: #ff8000; color: #1a1a1a; border: none; padding: 4px 8px; border-radius: 4px; font-weight: bold; cursor: pointer;">Удалить</button>
                    </div>
                </li>
            `;
            kino.push(item);
        });
    }
}

function Delete(name) {
    // Ищем фильм в массиве объектов по его имени
    let index = kino.findIndex(item => item.name === name);
    if (index !== -1) {
        kino.splice(index, 1);
    }
    
    let key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(kino));
    
    if (document.getElementById('list1')) {
        document.getElementById('list1').innerHTML = '';
        kino.forEach(function(item){
            document.getElementById('list1').innerHTML += `
                <li style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; list-style: none;">
                    <img src="${item.poster}" style="width: 60px; height: 90px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                    <div>
                        <b style="font-size: 16px; color: #ffffff; display: block;">${item.name}</b>
                        <span style="font-size: 14px; color: #ff8000; font-weight: bold;">⭐ ${item.rating}</span>
                        <button onclick="Delete('${item.name}')" style="margin-top: 5px; background: #ff8000; color: #1a1a1a; border: none; padding: 4px 8px; border-radius: 4px; font-weight: bold; cursor: pointer;">Удалить</button>
                    </div>
                </li>
            `;
        });
    }
}
