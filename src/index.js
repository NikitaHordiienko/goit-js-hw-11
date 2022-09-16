import './css/common.css'
import { PixabayApi } from "./js/pixabay-api";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import photoCardInfo from './templates/photoCard.hbs'

const searchFormEl = document.querySelector('.search-form');
const inputValueEl = document.querySelector('input[name="searchQuery"]')
const galleryListEl = document.querySelector('.gallery');
const targetEl = document.querySelector('.js-target-element');
const lightBox = new SimpleLightbox('.gallery a');
const pixabayApi = new PixabayApi();
const observerOptions = {
  root: null,
  rootMargin: '0px 0px 300px 0px',
  threshold: 1,
};

const observer = new IntersectionObserver(async (entries, observer) => {
    if (entries[0].isIntersecting) {
        try {
            pixabayApi.page += 1;

            const { data } = await pixabayApi.fetchImagesByQuery();

            galleryListEl.insertAdjacentHTML('beforeend', photoCardInfo(data.hits));
            
            lightBox.refresh();
            
            if (data.hits.length <= pixabayApi.page) {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
                observer.unobserve(targetEl);
            }
        } catch (err) {
            console.log(err)
        }
    }
}, observerOptions);

const onSearchFormElSubmit = async event => {
    event.preventDefault();

    pixabayApi.searchQuery = inputValueEl.value;
    pixabayApi.page = 1;

    try {
        const { data } = await pixabayApi.fetchImagesByQuery();

        if (data.hits.length === 0) {
            galleryListEl.innerHTML = '';
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            return;            
        }

        galleryListEl.innerHTML = photoCardInfo(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`)
        lightBox.refresh();
        observer.observe(targetEl);
    } catch (err) {
        console.log(err)
    }
};

searchFormEl.addEventListener('submit', onSearchFormElSubmit);