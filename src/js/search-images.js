import apiGallery from './gallery-api';
import makeCardsMarkupTpl from '../templates/gallery-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchClick);
refs.loadMore.addEventListener('click', onLoadMoreClick);

const newApiGallery = new apiGallery();

async function onSearchClick(evt) {
  evt.preventDefault();
  const inputValue = evt.currentTarget.elements.searchQuery.value;

  if (inputValue === '') {
    Notify.info('Enter what you want to find today.');
    return;
  }

  newApiGallery.query = inputValue;
  newApiGallery.resetPage();

  try {
    const hits = await newApiGallery.fetchGallery();

    if (hits.length === 0) {
      Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    refs.gallery.innerHTML = '';
    makeGalleryMarkup(hits);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  const hits = await newApiGallery.fetchGallery();
  makeGalleryMarkup(hits);
}

function makeGalleryMarkup(arrayImgs) {
  refs.gallery.insertAdjacentHTML('beforeend', makeCardsMarkupTpl(arrayImgs));
  isMorePages();
}

function isMorePages() {
  if (!newApiGallery.morePages) {
    refs.gallery.insertAdjacentHTML(
      'afterend',
      "<div class='nomore-text'>We're sorry, but you've reached the end of search results.</div>",
    );
  }
  showLoadMoreButton();
}

function showLoadMoreButton() {
  if (newApiGallery.morePages) {
    refs.loadMore.classList.remove('is-hidden');
  } else {
    refs.loadMore.classList.add('is-hidden');
  }
}
