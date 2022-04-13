const API_KEY = '26702272-2d7e64543fb5f8670261a42e5';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiGallery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.morePages = false;
  }

  async fetchGallery() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();

      if (data.totalHits / this.perPage <= this.page) {
        this.morePages = false;
      }
      this.incrementPage();

      return data.hits;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
    this.morePages = true;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
