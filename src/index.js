import './css/styles.css';
import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css" ;


console.log('hello')

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
    loadMore: document.querySelector('.load-more')
}

const API_KEY = '35439381-dc6c31f5e4218074de9a0ab23';
const BASE_URL = 'https://pixabay.com/api/';



let searchQuery = '';
let page = 1;
let totalHits = 0;


refs.form.addEventListener('submit', onSearch)
refs.loadMore.addEventListener('click', onLoadMore)


async function onLoadMore(event) {
  page += 1;

  const data = await axiosGet(searchQuery);
  totalHits += data.hits.length
  console.log(totalHits)
  if (totalHits>=500 || data.total===totalHits) {
    refs.loadMore.classList.toggle("is-hidden");
    Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  const markUp = await createMarkup(data.hits);
    
  appendMarkup(createMarkup(data.hits))
 
}

async function onSearch(event) {
  event.preventDefault()

  clearContainer();  

  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  
   if (!searchQuery) {
        Notify.info("Sorry. Please enter a search.")
        return
   }
  
  const data = await axiosGet(searchQuery);
  
  const markUp = await createMarkup(data.hits);

  appendMarkup(markUp)
  if (data.total < 40) {
    refs.loadMore.classList.toggle("is-hidden");
    Notify.warning("We're sorry, but you've reached the end of search results.");
  }
    totalHits += data.hits.length;
    console.log(totalHits)
      refs.loadMore.classList.toggle("is-hidden");
}

async function axiosGet(search) {
  try {
    const responce = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${search}&page=${page}`, {
      params: {
        key: '35439381-dc6c31f5e4218074de9a0ab23',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 140
      },
    })
    console.log(responce)
 if (!responce.data.total) {
            throw new Error(Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
 }
    return responce.data
  } catch (error) {
    console.error(error)
  } 
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
  let lightbox = new SimpleLightbox('.gallery a');
}

function clearContainer() {
  refs.gallery.innerHTML = '';
}



console.log('ok')