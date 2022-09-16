'use strict';
import axios from "axios";

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '29970108-e22fdcbed2b0a29e4c0ee7d8b';

    constructor() {
        this.page = null;
        this.searchQuery = '';
    }

    fetchImagesByQuery() {
        const searchParams = {
            key: this.#API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: this.page,
        };

        return axios.get(`${this.#BASE_URL}`, { params: searchParams });
    }
}