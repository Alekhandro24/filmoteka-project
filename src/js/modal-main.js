import * as API from './api';
import { createMarkupModal } from './createMarkup';
import { refs } from './refs';
import { save } from '../utils/storage';

const WATCHED_KEY = 'watched';

const addToWatchedBtn = document.querySelector('.modal__btn--watched');
const watchLib = document.querySelector('.library__btn');
console.log('watchLib', watchLib);

let watched = [];

async function onClickCard(e) {
  window.addEventListener('keydown', onEscKey);

  const { id } = e.target.dataset;

  const savedWatched = localStorage.getItem(WATCHED_KEY);
  const parsedWatched = JSON.parse(savedWatched);
  console.log('parsedWatched', parsedWatched);

  function addToWatch() {
    console.log('id inside onClick', id);
    if (!parsedWatched) {
      watched.push(id);
    }

    //     localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
  }
  // if (e.target.classList.contains('js-film')) {

  e.preventDefault();
  const elt = e.target.closest('.film-gallery__list');
  if (elt) {
    const currentEl = e.target;
    const movieId = currentEl.dataset.id;
    refs.modal.classList.toggle('is-hidden');
    refs.body.classList.toggle('no-scroll');
    refs.btnAddWatched.setAttribute('data-id', movieId);
    refs.btnAddQueue.setAttribute('data-id', movieId);
    try {
      const movieInfo = await API.getMovieById(movieId);
      const markupModal = createMarkupModal(movieInfo);
      refs.modalList.insertAdjacentHTML('beforeend', markupModal);
      addToWatchedBtn.addEventListener('click', addToWatch);
    } catch (error) {
      console.log(error.message);
    }
  }
}

function onCloseBtn() {
  refs.modal.classList.toggle('is-hidden');
  refs.body.classList.toggle('no-scroll');
  
  refs.modalList.innerHTML = '';
}

function onBackdropClick(e) {
  if (e.currentTarget === e.target) {
    onCloseBtn();
  }
}

function onEscKey(e) {
  if (e.code === 'Escape') {
    onCloseBtn();
    window.removeEventListener('keydown', onEscKey);
  }
}

refs.closeModalBtn.addEventListener('click', onCloseBtn);
refs.cardMovie.addEventListener('click', onClickCard);
refs.backdropModal.addEventListener('click', onBackdropClick);