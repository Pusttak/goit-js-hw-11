import apiGallery from './gallery-api';
import makeCardsMarkupTpl from '../templates/gallery-card.hbs';
import { smoothScroll } from './smooth-scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SmoothScroll from 'smoothscroll-for-websites';
import { lightbox } from './simpleLightbox';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchClick);
refs.loadMore.addEventListener('click', onLoadMoreClick);

SmoothScroll({
  animationTime: 400,
  stepSize: 60,
  pulseAlgorithm: true,
  pulseScale: 4,
  pulseNormalize: 1,
});

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
    const data = await newApiGallery.axiosGallery();

    if (data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    refs.gallery.innerHTML = '';
    makeGalleryMarkup(data.hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  const data = await newApiGallery.axiosGallery();
  makeGalleryMarkup(data.hits);
  lightbox.refresh();
  smoothScroll();
}

function makeGalleryMarkup(arrayImgs) {
  refs.gallery.insertAdjacentHTML('beforeend', makeCardsMarkupTpl(arrayImgs));
  isMorePages();
}

function isMorePages() {
  if (!newApiGallery.morePages) {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
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
