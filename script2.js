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
    window.location.href = "main.html"
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
// Твой бесплатный рабочий ключ API для доступа к базе IMDb
// Твой бесплатный рабочий ключ API для доступа к базе IMDb
const API_KEY = 'dc5e9e5c'; 
async function Addfilm() {
    let query = document.getElementById('Namekino').value.trim();
    if (!query) return;

    let url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

                let searchResults = document.getElementById('search-results-dropdown');
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'search-results-dropdown';
            // ГЛАВНЫЙ ЧИТ-КОД: Привязываем список напрямую к body, ломая старые слои!
            document.body.appendChild(searchResults);
        }

        
        searchResults.innerHTML = ''; 

        if (data.Response === "True" && data.Search) {
            searchResults.style.display = 'block';

            data.Search.slice(0, 6).forEach(movie => {
                let item = document.createElement('div');
                item.className = 'dropdown-item';
                
                let posterUrl = movie.Poster !== "N/A" ? movie.Poster : 'https://placeholder.com';

                // Чистый оригинальный английский язык без костылей!
                item.innerHTML = `
                    <img src="${posterUrl}" alt="poster">
                    <div>
                        <span class="movie-title" style="color: #ffffff; font-size: 12px; display: block;">${movie.Title}</span>
                        <span class="movie-year" style="font-size: 9px; color: #aaaaaa; display: block; margin-top: 3px;">(${movie.Year})</span>
                    </div>
                `;

                // Клик сохраняет оригинальные данные в localStorage
                item.onclick = function() {
                    // Умный чит-код: проверяем, какой список есть на текущей странице
                    let currentListId = 'list1'; // По дефолту первая колонка
                    
                    if (document.getElementById('list2')) currentListId = 'list2';
                    else if (document.getElementById('list3')) currentListId = 'list3';
                    else if (document.getElementById('list4')) currentListId = 'list4';

                    // Передаем правильный ID списка в функцию сохранения
                    saveAndAddMovie(movie.Title, posterUrl, movie.Year, currentListId);
                    
                    searchResults.style.display = 'none';
                    document.getElementById('Namekino').value = '';
                };


                searchResults.appendChild(item);
            });
        } else {
            searchResults.innerHTML = '<div style="padding: 10px; color: #ff0000; font-size: 10px;">Фильм не найден...</div>';
        }
    } catch (error) {
        console.error("Ошибка сети:", error);
    }
}

// Функция сохранения фильма в localStorage
// 1. Измененная функция сохранения — теперь она принимает еще и имя списка (список 1 или список 2)
// 1. Обновленная функция сохранения с поддержкой 4-х списков
function saveAndAddMovie(title, poster, year, listId) {
    let movies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    
    // Зашиваем ID конкретного списка ('list1', 'list2', 'list3', 'list4')
    let newMovie = { id: Date.now(), title, poster, year, listId: listId };
    movies.push(newMovie);
    
    localStorage.setItem('savedMovies', JSON.stringify(movies));
    renderMovies();
}

// ⚠️ СРОЧНО ПРОВЕРЬ КЛИК ВНУТРИ ТВОЕЙ ФУНКЦИИ searchMovie:
// Найди в самом верху файла внутри функции поиска строку item.onclick и замени её на эту,
// чтобы новые фильмы с поиска по дефолту всегда летели в первый список ("Планирую смотреть"):
// item.onclick = function() {
//     saveAndAddMovie(movie.Title, posterUrl, movie.Year, 'list1');
//     let dropdown = document.getElementById('search-results-dropdown');
//     if (dropdown) dropdown.style.display = 'none';
//     document.getElementById('Namekino').value = '';
// };


// 2. Функция удаления фильма из памяти
function deleteMovie(id) {
    let movies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    movies = movies.filter(movie => movie.id !== id);
    localStorage.setItem('savedMovies', JSON.stringify(movies));
    renderMovies();
}


// 3. Мощная функция отрисовки под 4 независимые категории
function renderMovies() {
    // Подтягиваем все 4 твоих списка из HTML по их ID
    let list1 = document.getElementById('list1'); // Планирую смотреть
    let list2 = document.getElementById('list2'); // Смотрю сейчас
    let list3 = document.getElementById('list3'); // Просмотрено
    let list4 = document.getElementById('list4'); // Брошено
    
    // Чистим каждый список перед перерисовкой, чтобы карточки не дублировались
    if (list1) list1.innerHTML = '';
    if (list2) list2.innerHTML = '';
    if (list3) list3.innerHTML = '';
    if (list4) list4.innerHTML = '';
    
    let movies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    
    movies.forEach(movie => {
        // Ищем правильный целевой контейнер на основе listId
        let targetList;
        if (movie.listId === 'list2') targetList = list2;
        else if (movie.listId === 'list3') targetList = list3;
        else if (movie.listId === 'list4') targetList = list4;
        else targetList = list1; // По дефолту - первый список
        
        if (targetList) {
            targetList.innerHTML += `
                <li style="display: flex; flex-direction: row; align-items: center; gap: 15px; margin-bottom: 15px; list-style: none; background: rgba(0, 0, 0, 0.85); border: 2px solid #ffffff; padding: 10px 45px 10px 10px; width: 380px; box-sizing: border-box; position: relative; z-index: 1;">
                    <img src="${movie.poster}" style="width: 55px; height: 80px; object-fit: cover; border: 1px solid #fff; flex-shrink: 0;">
                    <div style="flex-grow: 1; min-width: 0; overflow: hidden;">
                        <b style="font-size: 13px; color: #ffffff; display: block; margin-bottom: 6px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${movie.title}</b>
                        <span style="font-size: 11px; color: #aaaaaa; font-weight: bold;">📅 ${movie.year}</span>
                    </div>
                    <!-- УЛЬТИМАТИВНЫЙ КРЕСТИК: Сдвинут максимально в правый край (right: 5px) -->
                    <button onclick="deleteMovie(${movie.id})" style="position: absolute; top: 50%; right: 5px; transform: translateY(-50%); background: none; border: none; color: #ff0000; font-family: 'Press Start 2P', monospace; font-size: 18px; font-weight: bold; cursor: pointer; padding: 8px; z-index: 10;">X</button>
                </li>
            `;
        }
    });
}

// Загружаем фильмы из памяти при старте страницы
document.addEventListener("DOMContentLoaded", renderMovies);



