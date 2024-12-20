const API_KEY = "014ee686e7ce64cf0b540756cbc51640";
const SEARCH_URL = "https://api.themoviedb.org/3/search";
const TRENDING_URL = "https://api.themoviedb.org/3/trending";
const MOVIE_URL = "https://api.themoviedb.org/3/movie";

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("query").value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  const netflix = document.getElementById("netflix").checked;
  const use2embed = document.getElementById("use2embed").checked;

  const url = `${SEARCH_URL}/${type}?query=${encodeURIComponent(query)}&language=en-US&page=1&api_key=${API_KEY}`;

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
        
        // Determine which details page to use
        let detailsPage;
        if (netflix) {
          detailsPage = `details2.html?id=${tmdbId}&type=${mediaType}`;
        } else if (use2embed && netflix) {
          detailsPage = `details2.html?id=${tmdbId}&type=${mediaType}&season=1&e=1`;
        // } else if (use2embed) {
        //   detailsPage = `details_2embed.html?id=${tmdbId}&type=${mediaType}&season=1&e=1`;
        } else {
          detailsPage = `details1.html?id=${tmdbId}&type=${mediaType}`;
        }

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
    
    if (!data || !data.results) {
      console.error("Invalid trending data received:", data);
      return;
    }
    
    displayResults(data.results, "Trending Movies & TV Shows");
  } catch (error) {
    console.error("Error fetching trending content:", error);
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<p>Error loading trending content</p>";
  }
}

function displayResults(results, title) {
  const resultsContainer = document.getElementById("results");
  
  if (title === "Trending Movies & TV Shows") {
    resultsContainer.innerHTML = "";
  }
  
  resultsContainer.innerHTML += `<h2>${title}</h2>`;

  if (!results || results.length === 0) {
    resultsContainer.innerHTML += "<p>No results found.</p>";
    return;
  }

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
      
      // Replace the player radio selection with checkbox logic
      const netflix = document.getElementById("netflix").checked;
      const use2embed = document.getElementById("use2embed").checked;
      let detailsPage;
      
      if (netflix) {
        detailsPage = `details2.html?id=${tmdbId}&type=${mediaType}`;
      } else if (use2embed) {
        detailsPage = `details_2embed.html?id=${tmdbId}&type=${mediaType}&season=1&e=1`;
      } else {
        detailsPage = `details.html?id=${tmdbId}&type=${mediaType}`;
      }

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
  fetchTrendingContent();
});

// Add checkbox mutual exclusivity logic
document.getElementById("netflix").addEventListener("change", function() {
  if (this.checked) {
    document.getElementById("use2embed").checked = false;
  }
});

document.getElementById("use2embed").addEventListener("change", function() {
  if (this.checked) {
    document.getElementById("netflix").checked = false;
  }
});
