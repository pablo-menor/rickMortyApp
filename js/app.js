//Imports
import "./favs.js"
import RequestHandler from "./requestHandler.js";
//DOM elements
const section = document.querySelector('#cards');
const search = document.querySelector('#search');
const next_arrow = document.querySelector('.next');
const before_arrow = document.querySelector('.before');
const logo = document.querySelector('#logo');
const arrows = document.querySelector('#pages');


let currentNameFilter = '';
let currentPage = 1;
let cardsData = '';

//Search by name 
search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentNameFilter = search.value.toLowerCase();
        currentPage = 1;
        buildResults(currentPage, currentNameFilter);
        localStorage.setItem('showingFavs', 'false');
        arrows.style.display = '';
    }
});

logo.addEventListener('click', () => {
    init();
    currentPage = 1;
    currentNameFilter = '';
    search.value = '';
});


const buildResults = async (page, name) => {
    section.innerHTML = "";
    let data;
    if (name == undefined) {
        data = await api_request.getCharacters(page);
    }
    else {
       
        data = await api_request.getCharacterByName(page, name);
    }
    if (data == false) {
        section.innerHTML += noResultsFound();
        arrows.style.display = 'none'
    }
    else {
        data.results.forEach(e => {
            section.innerHTML += buildCard(e);
        });
    }

    if (currentPage === 1)
        before_arrow.style.pointerEvents = 'none'
    else
        before_arrow.style.pointerEvents = 'all'

    cardsData = data;
}

const api_request = new RequestHandler();

//Starting point
const init = () => {
    buildResults(1);
}
init();

const changePages = (nextOrBefore, nameFilter) => { //0 for before, 1 for next - 
    if (nextOrBefore == 0)
        currentPage--;
    else
        currentPage++;
    if (!nameFilter) {
        buildResults(currentPage);
    }
    else {
        buildResults(currentPage, currentNameFilter);
    }
    console.log('Page: ' + currentPage);

}

const buildCard = ({ id, name, image, status, location }) => {
    let status_p;
    let favClass;
    let iconCLass = 'far';
    const favs = JSON.parse(localStorage.getItem('favs'));
    if (status === 'Alive')
        status_p = `<p class="status alive">${status}</p>`;
    else if (status === 'Dead')
        status_p = `<p class="status dead">${status}</p>`;
    else
        status_p = `<p class="status undefined">${status}</p>`;

    if (location.name === 'Earth (Replacement Dimension)') {
        location.name = 'Replacement Earth'
    }
    else if (location.name === "Earth (Evil Rick's Target Dimension)") {
        location.name = "Evil Rick's Target Dimension"
    }
    // if (logged==null) favClass = 'save-icon';
    // else{
        if (isSaved(id, favs)){
            favClass = 'saved-icon';
            iconCLass = 'fas';
        } 
        else favClass = 'save-icon';
    // } 
    // = 'saved-icon';
    return `
        <div class="card" id="${id}">
            <h3>${name}</h3>
            <img src="${image}" width="200">
             ${status_p}
            From:
            <p id="origin">${location.name} </p>   
            <i class="${iconCLass} fa-bookmark ${favClass}" id="${id}"></i>
        </div>
    `
}


const isSaved = (id, favs )=> {
     if (favs.includes(id+'')) return true;
     else return false;
}

const noResultsFound = () => {
    return `
        <div id="error-page">
            Sorry, no results found! <i class="fas fa-search"></i>
        </div>
    `
}

next_arrow.addEventListener('click', () => {
    if (currentNameFilter.length == 0) {
        changePages(1, false);
    }
    else {
        changePages(1, true);
    }

    window.scrollTo(0, 0);
});

before_arrow.addEventListener('click', () => {
    if (currentNameFilter.length == 0) {
        changePages(0, false);
    }
    else {
        changePages(0, true);
    }
    window.scrollTo(0, 0);
});

export {buildCard, cardsData};