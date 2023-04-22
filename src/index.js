import './css/styles.css';
import {axiosGet} from './axiosGet';
import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css" ;

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    // guard: document.querySelector('.js-guard'),
    loadMore: document.querySelector('.load-more')
}



let searchQuery = '';
let page = 1;
let totalHits = 0;
let lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch)
refs.loadMore.addEventListener('click', onLoadMore)

async function onLoadMore() {
  page += 1;

  const data = await axiosGet(searchQuery, page);
  totalHits += data.hits.length
 
  if (totalHits>=500 || data.total===totalHits) {
    refs.loadMore.classList.add("is-hidden");
    Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  const markUp = await createMarkup(data.hits);
    
  appendMarkup(createMarkup(data.hits))
  lightbox.refresh();
}

async function onSearch(event) {
  event.preventDefault()
  refs.loadMore.classList.add("is-hidden");
    clearContainer();  

    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    page = 1;
  
    if (!searchQuery) {
        Notify.info("Sorry. Please enter a search.")
        return
    }
  const data = await axiosGet(searchQuery,page);
  
    const markUp = await createMarkup(data.hits);

    appendMarkup(markUp)
    lightbox.refresh();
    Notify.info(`Hooray! We found ${data.totalHits} images.`)
    if (data.total < 40) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMore.classList.add("is-hidden");
      return
    }
    totalHits += data.hits.length;
    refs.loadMore.classList.remove("is-hidden");
}



function createMarkup(arr) {
    const markup = arr.map(item =>
    `<div class="photo-card"><a href="${item.largeImageURL}">
      <img src="${item.webformatURL}" alt="${item.tags}"  class="gallery__image" loading="lazy" width=100px />
      <div class="info">
        <p class="info-item">
          <b>Likes</b> <br>${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b><br>${item.views}
        </p>
        <p class="info-item">
          <b>Comments</b><br> ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b><br> ${item.downloads}
        </p>
      </div></a>
    </div>`).join('');
    return markup
      
    // observer.observe(refs.guard)
}

function appendMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  refs.gallery.innerHTML = '';
}

console.log('ok')