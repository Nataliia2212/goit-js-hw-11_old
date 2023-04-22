import { Notify } from 'notiflix';
import axios from 'axios';

const API_KEY = '35439381-dc6c31f5e4218074de9a0ab23';
const BASE_URL = 'https://pixabay.com/api/';

 async function axiosGet(search, page) {
  try {
    const responce = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${search}&page=${page}`, {
      params: {
        key: '35439381-dc6c31f5e4218074de9a0ab23',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40
      },
    })
    
 if (!responce.data.total) {
            throw new Error(Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
 }
    return responce.data
  } catch (error) {
    console.error(error)
  } 
}

export { axiosGet };