const input = document.querySelector(".input");
const searchBtn = document.querySelector(".searchBtn");
const moviesContainer = document.querySelector(".Movies");
const search = document.querySelector(".search");
const detailsWrapper = document.querySelector(".details-wrapper");
const loadMore = document.querySelector(".loadMore");
const loader = document.querySelector(".loader");
const genreBtn = document.querySelectorAll(".genre-btn");

let dataOfMovies;
let page;
let currentQuery = "";
let currentGenre = null;
async function HomeMovies() {
  try {
    loader.classList.remove("hidden");
    const randomSearches = [
      "batman",
      "superman",
      "spider",
      "avengers",
      "transformers",
      "fast",
      "furious",
      "mission",
      "impossible",
      "james bond",
      "harry potter",
      "lord rings",
      "hobbit",
      "star wars",
      "star trek",
      "matrix",
      "john wick",
      "terminator",
      "pirates",
      "jumanji",
      "godzilla",
      "kong",
      "jurassic",
      "dark knight",
      "inception",
      "interstellar",
      "gladiator",
      "titanic",
      "avatar",
      "dune",
      "blade",
      "legend",
      "escape",
      "war",
      "battle",
      "soldier",
      "king",
      "queen",
      "love",
      "romance",
      "comedy",
      "horror",
      "thriller",
      "mystery",
      "detective",
    ];
    const randomWord =
      randomSearches[Math.floor(Math.random() * randomSearches.length)];
    currentQuery = randomWord;
    page = 1;
    const res = await fetch(
      `https://www.omdbapi.com/?s=${randomWord}&apikey=a0c86024`,
    );
    const data = await res.json();
    dataOfMovies = data.Search;
    console.log(dataOfMovies);
    loader.classList.add("hidden");
  } catch (err) {
    console.log(err);
  }
}

async function getData() {
  try {
    loader.classList.remove("hidden");

    const res = await fetch(
      `https://www.omdbapi.com/?s=${currentQuery}&apikey=a0c86024`,
    );
    const data = await res.json();
    if (data.Response === "False") {
      dataOfMovies = [];
      return;
    }

    dataOfMovies = data.Search || [];
  } catch (err) {
    console.log(err);
  } finally {
    loader.classList.add("hidden"); // ALWAYS STOP LOADER
  }
}
function renderFilteredMovies(movies) {
  const images = movies
    .map(
      (movie) => `
      <div class="movieTitle">
        <li>
          <a href="details.html?id=${movie.imdbID}">
            <img src="${movie.Poster}" />
          </a>
        </li>
        <p class="title">${movie.Title}</p>
      </div>
    `,
    )
    .join("");

  moviesContainer.innerHTML = `
    <div>
      <ul class="ul-List">${images}</ul>
    </div>
  `;
}
async function getMoreMovies(query, page) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=a0c86024`,
    );
    const data = await res.json();
    loader.classList.add("hidden");
    dataOfMovies = [...dataOfMovies, ...data.Search];

    return dataOfMovies;
  } catch (err) {
    console.log(err);
  }
}

function getMovieIcon() {
  let images = dataOfMovies
    .map(
      (poster) =>
        `
      <div class="movieTitle">
      <li  ><a href="details.html?id=${poster.imdbID}"> <img src=${poster.Poster} /></a>   </li>
                <p>${poster.Title} </p>
    </div>
      `,
    )
    .join("");

  const html = `
    <div >
      <ul  class="ul-List">${images}</ul>
      
    </div>
  `;

  moviesContainer.insertAdjacentHTML("beforeend", html);
}

function renderError() {
  const p = document.createElement("p");
  p.classList.add("error");
  moviesContainer.innerHTML = `<p class="error">No Results</p>`;
}

searchBtn.addEventListener("click", async function () {
  currentQuery = input.value;
  page = 1;
  await getData();
  moviesContainer.innerHTML = "";

  if (!dataOfMovies || dataOfMovies.length === 0) {
    renderError();
    loadMore.setAttribute("hidden", true);
    loader.classList.add("hidden");

    return;
  }

  getMovieIcon();
  input.value = "";
  loadMore.removeAttribute("hidden");
});

loadMore.addEventListener("click", async function () {
  loader.classList.remove("hidden");

  page++;
  if (currentGenre) {
    const movies = await getMoreMovies(currentQuery, page);

    if (!movies) {
      loadMore.setAttribute("hidden", true);
      loader.classList.add("hidden");
      return;
    }

    const detailedMovie = await Promise.all(
      movies.map(async (movie) => {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=a0c86024`,
        );
        return await res.json();
      }),
    );

    const FilteredData = detailedMovie.filter((movie) =>
      movie.Genre?.toLowerCase().includes(currentGenre.toLowerCase()),
    );

    moviesContainer.innerHTML = "";
    renderFilteredMovies(FilteredData);
  } else {
    const movies = await getMoreMovies(currentQuery, page);
    moviesContainer.innerHTML = "";
    getMovieIcon();
  }
  loader.classList.add("hidden");
});
let genresArray;

async function getByGenre(genre) {
  if (!dataOfMovies?.length) return;

  loader.classList.remove("hidden");
  const detailedMovie = await Promise.all(
    dataOfMovies.map(async (movie) => {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=a0c86024`,
      );
      const data = await res.json();

      return data;
    }),
  );

  const FilteredData = detailedMovie.filter((movie) => {
    genresArray = movie.Genre.split(", ").map((g) => g.toLowerCase());
    return genresArray.includes(genre.toLowerCase());
  });

  moviesContainer.innerHTML = "";
  if (FilteredData.length === 0) {
    moviesContainer.innerHTML = `<p class="error">No movies found</p>`;
  } else {
    renderFilteredMovies(FilteredData);
  }

  loader.classList.add("hidden");
}

// const data = await res.json();

genreBtn.forEach((btn) => {
  btn.addEventListener("click", async function (e) {
    const genre = e.target.dataset.genre;
    currentGenre = genre;
    page = 1;
    await getByGenre(genre);
  });
});

window.addEventListener("load", async function () {
  await HomeMovies();
  moviesContainer.innerHTML = "";

  if (!dataOfMovies || dataOfMovies.length === 0) {
    loader.classList.add("hidden");

    loadMore.setAttribute("hidden", true);

    return;
  }

  getMovieIcon();
  input.value = "";
  loadMore.removeAttribute("hidden");
  loader.classList.add("hidden");
});
