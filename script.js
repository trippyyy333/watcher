const API_KEY = "014ee686e7ce64cf0b540756cbc51640";
const BASE_URL = "https://api.themoviedb.org/3/search";

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  const includeAdult = document.getElementById("includeAdult").checked;
  const type = document.querySelector('input[name="type"]:checked').value;

  const url = `${BASE_URL}/${type}?query=${encodeURIComponent(query)}&include_adult=${includeAdult}&language=en-US&page=1&api_key=${API_KEY}`;

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
        const typeQuery = type === "movie" ? "tt" : "tv";
        const detailsPage = `details.html?id=${tmdbId}&type=${type}`;
        const imageUrl = item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
        : "https://via.placeholder.com/500x300?text=No+Image";

        card.innerHTML = `
          <img src="${imageUrl}" alt="${item.name || item.title}">

          <span>${tmdbId}</span>
          <h2>${title}</h2>
          <div class="card-content">
            <h2>${item.name || item.title}</h2>
            <p>${item.overview || "No description available."}</p>

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

function updateUrl(season, episode) {
  const url = new URL(window.location);
  url.searchParams.set('s', season);
  url.searchParams.set('e', episode);
  window.history.pushState({}, '', url);
}

document.querySelectorAll('.episode-button').forEach(button => {
  button.addEventListener('click', function() {
    const seasonNumber = this.dataset.season;
    const episodeNumber = this.dataset.episode;
    updateUrl(seasonNumber, episodeNumber);
    updateIframeSource(seasonNumber, episodeNumber);
  });
});

// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Extract season and episode from URL
const season = getUrlParameter('s');
const episode = getUrlParameter('e');

// Update iframe source based on URL parameters
function updateIframeSource(season, episode) {
  const iframe = document.getElementById("player-iframe");
  if (season && episode) {
    iframe.src = `https://vidsrc.xyz/embed/tv?imdb=${currentImdbId}&season=${season}&episode=${episode}&ds_lang=en`;
  }
}

// Call the function to update the iframe source
updateIframeSource(season, episode);
