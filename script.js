const API_KEY = "014ee686e7ce64cf0b540756cbc51640";
const SEARCH_URL = "https://api.themoviedb.org/3/search";
const TRENDING_URL = "https://api.themoviedb.org/3/trending";
const MOVIE_URL = "https://api.themoviedb.org/3/movie";

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  const includeAdult = document.getElementById("includeAdult").checked;
  const type = document.querySelector('input[name="type"]:checked').value;
  const use2embed = document.getElementById("use2embed").checked;

  const url = `${SEARCH_URL}/${type}?query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=en-US&page=1&api_key=${API_KEY}`;

  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(url);
    const data = await response.json();
    resultsContainer.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        const tmdbId = item.id;
        const title = item.name || item.title;
        const overview = item.overview || "No description available.";
        const mediaType = item.media_type || type;
        const detailsPage = use2embed ? `details_2embed.html?id=${tmdbId}&type=${mediaType}` : `details.html?id=${tmdbId}&type=${mediaType}`;
        const imageUrl = item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
          : "https://via.placeholder.com/500x300?text=No+Image";

        card.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <div class="card-content">
            <h2>${title}</h2>
            <span>ID: ${tmdbId}</span>
            <p>${overview}</p>
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = detailsPage;
        });

        resultsContainer.appendChild(card);
      });
    } else {
      resultsContainer.innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    resultsContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
    console.error(error);
  }
});

async function fetchLatestMovies() {
  const url = `${MOVIE_URL}/latest?language=en-US&api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults([data], "Latest Movies");
  } catch (error) {
    console.error("Error fetching latest movies:", error);
  }
}

async function fetchTrendingContent() {
  const url = `${TRENDING_URL}/all/day?language=en-US&api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results, "Trending Movies & TV Shows");
  } catch (error) {
    console.error("Error fetching trending content:", error);
  }
}

function displayResults(results, title) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML += `<h2>${title}</h2>`;

  results.sort((a, b) => {
    if (a.poster_path && !b.poster_path) return -1;
    if (!a.poster_path && b.poster_path) return 1;
    return 0;
  });

  if (results && results.length > 0) {
    results.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      const tmdbId = item.id;
      const title = item.name || item.title;
      const overview = item.overview || "No description available.";
      const mediaType = item.media_type || 'movie';
      const detailsPage = use2embed ? `details_2embed.html?id=${tmdbId}&type=${mediaType}` : `details.html?id=${tmdbId}&type=${mediaType}`;
      const imageUrl = item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
        : "https://via.placeholder.com/500x300?text=No+Image";

      card.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <div class="card-content">
          <h2>${title}</h2>
          <span>ID: ${tmdbId}</span>
          <p>${overview}</p>
        </div>
      `;
      card.addEventListener("click", () => {
        window.location.href = detailsPage;
      });

      resultsContainer.appendChild(card);
    });
  } else {
    resultsContainer.innerHTML += "<p>No results found.</p>";
  }
}

// Call these functions when the page loads
window.addEventListener('load', () => {
  fetchLatestMovies();
  fetchTrendingContent();
});
