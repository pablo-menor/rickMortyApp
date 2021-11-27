
export default class RequestHandler {
    constructor() { }

    async getCharacters(page) {
        const url = `https://rickandmortyapi.com/api/character/?page=${page}`
        const res = await fetch(url)
        const data = await res.json();
        return data;
    }

    async getCharacterByName(page,name){
        const url = `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
        const res = await fetch(url);
        const data = await res.json();
        if (res.status === 404) {
            return false;
        }
        return data;
    }

    async getCharactersByID(ids){
        const url = `https://rickandmortyapi.com/api/character/${ids}`
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }

}