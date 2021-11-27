import RequestHandler from "./requestHandler.js";
import {buildCard} from './app.js'
export{section, arrows};

const section = document.querySelector('#cards');
const btnFolder = document.querySelector('.fav-icon');
const nav = document.querySelector('nav');
const arrows = document.querySelector('#pages');
const footer = document.querySelector('footer');


localStorage.setItem('showingFavs', 'false');
if (localStorage.getItem('favs')==null) {
    localStorage.setItem('favs',  JSON.stringify([]));
}


section.addEventListener('click', (e) => {
    let favs = JSON.parse(localStorage.getItem('favs'));
    const icon = e.target;
    if (icon.tagName === 'I') {
        // let allFavs = user.favs;
        const idCharacter = icon.id;
        if (icon.classList.contains('save-icon')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.classList.remove('save-icon');
            icon.classList.add('saved-icon');
           favs.push(idCharacter);
        }
        else if (icon.classList.contains('saved-icon')) {
            icon.classList.add('far');
            icon.classList.remove('fas');   
            icon.classList.add('save-icon');
            icon.classList.remove('saved-icon');
            favs = favs.filter(x => x != icon.id);
            if (localStorage.getItem('showingFavs') == 'true') { 
                const card = document.getElementById(`${icon.id}`);
                card.style.display='none';
            }

        }
        localStorage.setItem('favs', JSON.stringify(favs));

    }
    else if (icon.tagName === 'I' && user == null ) {
        window.scrollTo(0, 0);
        login_component.style.display = 'flex';
        section.style.opacity = '0.2';
    }

})


btnFolder.addEventListener('click', async ()=> {
        showFavs();
        arrows.style.display = 'none'
    
})

const getFavs = async(favs)=> {
    const api_request = new RequestHandler();
    const data = await api_request.getCharactersByID(favs); 
    return data;
}

const showFavs = async()=> {
    section.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('favs'));
    const data = await getFavs(favs);
    console.log(data);
    if (favs.length == 0) {
        section.innerHTML = ` <div id="error-page">
        You don't have any favs yet! <i class="fas fa-sad-tear sad"></i></i>
    </div>`
    }
    if (Array.isArray(data)) {
        data.forEach(e => {
            section.innerHTML += buildCard(e);
        });   
    }
    else   section.innerHTML += buildCard(data);
    localStorage.setItem('showingFavs', 'true');
}

nav.addEventListener('click', e => {
    const target = e.target;
    if (target.id==='logo') {
        localStorage.setItem('showingFavs', 'false');
        arrows.style.display = '';
        footer.style.display = '';
    }
     
    else if(target.classList.contains('signOut-btn')){
        localStorage.setItem('showingFavs', 'false');
        arrows.style.display = ''
        footer.style.display = '';
    }
        
})

