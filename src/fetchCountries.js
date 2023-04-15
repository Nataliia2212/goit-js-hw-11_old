import { Notify } from 'notiflix';

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const filter = 'fields=name,capital,population,flags,languages'

function fetchCountries(name) {
   return fetch(`${BASE_URL}${name}?${filter}`).then(resp => {
        if (!resp.ok) {
            throw new Error(Notify.failure('Oops, there is no country with that name'))
        }
        return resp.json()
    }).catch(err=> console.error(err))
}

export { fetchCountries };