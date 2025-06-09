document.addEventListener('DOMContentLoaded', () => {
  const searchIcon = document.getElementById('search-icon');
  const searchBox = document.getElementById('search-box');
  const closeSearch = document.getElementById('close-search');
  searchIcon.addEventListener('click', (event) => {
    event.preventDefault();
    searchBox.style.display = (searchBox.style.display === 'block') ? 'none' : 'block';
  });
  closeSearch.addEventListener('click', () => {
    searchBox.style.display = 'none';
  });
  document.addEventListener('click', (event) => {
    if (!searchBox.contains(event.target) && event.target !== searchIcon) {
      searchBox.style.display = 'none';
    }
  });
});