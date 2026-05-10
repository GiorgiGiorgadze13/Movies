const input = document.querySelector(".input");
const searchBtn = document.querySelector(".searchBtn");
const moviesContainer = document.querySelector(".Movies");
const search = document.querySelector(".search");
const detailsWrapper = document.querySelector(".details-wrapper");
const loadMore = document.querySelector(".loadMore");
const loader = document.querySelector(".loader");
const genreBtn = document.querySelectorAll(".genre-btn");
const fromYear = document.querySelector("#fromYear");
const toYear = document.querySelector("#toYear");
const TvSerialFilter = document.querySelector(".TvSerialFilter");
let dataOfMovies;
let accumulatedGenreMovies = [];

let page;
let currentQuery = "";
let currentGenre = null;
let filteredMovies;
let typeValue = "";
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
      `https://www.omdbapi.com/?s=${randomWord}&apikey=6966b57d`,
    );
    const data = await res.json();
    dataOfMovies = data.Search;
    console.log(dataOfMovies);
    loader.classList.add("hidden");
  } catch (err) {
    console.log(err);
  }
}

////////////////

///////////////////
let fromValue = null;
let toValue = null;
let activeFromYear = null;
let activeToYear = null;
function getByYear(from, to) {
  if (!dataOfMovies) return;

  activeFromYear = from;
  activeToYear = to;

  const filteredYear = dataOfMovies.filter((movies) => {
    const year = +movies.Year;
    return year >= from && year <= to;
  });
  renderFilteredMovies(filteredYear);
  console.log(dataOfMovies);
}
/////////////////////

//////////////////////

function getByMovOrSer(type) {
  const filteredType = dataOfMovies.filter((movie) => movie.Type === type);
  renderFilteredMovies(filteredType);
}

TvSerialFilter.addEventListener("change", function (e) {
  typeValue = e.target.value;
  if (typeValue) getByMovOrSer(typeValue);
});

//////////////////

///////////////

function createYearDropdown(selectElement) {
  selectElement.innerHTML = `<option value="">Select Year</option>`;

  for (let i = 1980; i <= 2026; i++) {
    selectElement.insertAdjacentHTML(
      "beforeend",
      `<option value="${i}">${i}</option>`,
    );
  }
}

////////////////////////////

//////////////////////
fromYear.addEventListener("change", (e) => {
  fromValue = +e.target.value;
  if (fromValue && toValue) getByYear(fromValue, toValue);
});

///////////////////

/////////////

toYear.addEventListener("change", (e) => {
  toValue = +e.target.value;
  if (fromValue && toValue) getByYear(fromValue, toValue);
});
createYearDropdown(fromYear);
createYearDropdown(toYear);

/////////////////////

/////////////////////
async function getData() {
  try {
    loader.classList.remove("hidden");

    const res = await fetch(
      `https://www.omdbapi.com/?s=${currentQuery}&apikey=6966b57d`,
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

//////////////////////

////////////////////////
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

////////////////////////

///////////////
async function getMoreMovies(query, page) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=6966b57d`,
    );
    const data = await res.json();
    loader.classList.add("hidden");
    if (data.Response === "False") return null;

    dataOfMovies = [...dataOfMovies, ...data.Search];
    return dataOfMovies;
  } catch (err) {
    console.log(err);
  }
}
///////////////

///////////////////

function getMovieIcon() {
  let images = dataOfMovies
    .map(
      (poster) =>
        `
      <div class="movieTitle">
      <li  ><a href="details.html?id=${poster.imdbID}"> <img src=${poster.Poster} /></a>   </li>
                <p class="title">${poster.Title} </p>
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

////////////////

////

function renderError() {
  const p = document.createElement("p");
  p.classList.add("error");
  moviesContainer.innerHTML = `<p class="error">No Results</p>`;
}

//////////

//////////////
searchBtn.addEventListener("click", async function () {
  currentQuery = input.value;
  currentGenre = null;
  activeFromYear = null;
  activeToYear = null;
  fromValue = null;
  toValue = null;
  fromYear.value = "";
  toYear.value = "";
  page = 1;
  await getData();
  moviesContainer.innerHTML = "";

  if (!dataOfMovies || dataOfMovies.length === 0) {
    renderError();
    loadMore.setAttribute("hidden", true);
    loader.classList.add("hidden");

    return;
  }
  moviesContainer.innerHTML = "";

  getMovieIcon();
  input.value = "";
  loadMore.removeAttribute("hidden");
});
/////////////

/////////////

loadMore.addEventListener("click", async function () {
  loader.classList.remove("hidden");
  page++;

  const movies = await getMoreMovies(currentQuery, page);

  if (!movies) {
    loadMore.setAttribute("hidden", true);
    loader.classList.add("hidden");
    return;
  }
  moviesContainer.innerHTML = "";
  if (activeFromYear && activeToYear) {
    const filteredYear = dataOfMovies.filter((movie) => {
      const year = +movie.Year;
      return year >= activeFromYear && year <= activeToYear;
    });
    renderFilteredMovies(filteredYear);
  }
  if (typeValue) {
    getByMovOrSer(typeValue);
  } else if (currentGenre) {
    const detailedMovie = await Promise.all(
      movies.slice(-10).map(async (movie) => {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=6966b57d`,
        );
        return await res.json();
      }),
    );
    const filtered = detailedMovie.filter((movie) =>
      movie.Genre?.toLowerCase().includes(currentGenre.toLowerCase()),
    );
    accumulatedGenreMovies = [...accumulatedGenreMovies, ...filtered]; // ← accumulate
    renderFilteredMovies(accumulatedGenreMovies);
  } else {
    moviesContainer.innerHTML = "";
    renderFilteredMovies(dataOfMovies);
  }

  loader.classList.add("hidden");
});

///////////////////

////////////////
let genresArray;

async function getByGenre(genre) {
  if (!dataOfMovies?.length) return;

  loader.classList.remove("hidden");
  const detailedMovie = await Promise.all(
    dataOfMovies.map(async (movie) => {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=6966b57d`,
      );
      const data = await res.json();

      return data;
    }),
  );

  const FilteredData = detailedMovie.filter((movie) => {
    genresArray = movie.Genre.split(", ").map((g) => g.toLowerCase());
    return genresArray.includes(genre.toLowerCase());
  });
  accumulatedGenreMovies = FilteredData;
  moviesContainer.innerHTML = "";
  if (FilteredData.length === 0) {
    moviesContainer.innerHTML = `<p class="error">No movies found</p>`;
  } else {
    renderFilteredMovies(FilteredData);
  }

  loader.classList.add("hidden");
}

/////////////////

// const data = await res.json();

////////////////////////
genreBtn.forEach((btn) => {
  btn.addEventListener("click", async function (e) {
    const genre = e.target.dataset.genre;
    currentGenre = genre;
    accumulatedGenreMovies = [];
    page = 1;
    await getByGenre(genre);
  });
});

window.addEventListener("load", async function () {
  await HomeMovies();

  if (!dataOfMovies || dataOfMovies.length === 0) {
    loader.classList.add("hidden");

    loadMore.setAttribute("hidden", true);

    return;
  }
  moviesContainer.innerHTML = "";

  getMovieIcon();
  input.value = "";
  loadMore.removeAttribute("hidden");
  loader.classList.add("hidden");
});
