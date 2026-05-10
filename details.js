const detailsWrapper = document.querySelector(".details-wrapper");
const Home = document.querySelector(".Home");
const loader = document.querySelector(".loader");

async function getMovieDetails() {
  try {
    loader.classList.remove("hidden");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=6966b57d`);
    const data = await res.json();
    console.log(data);

    const html = `
   <ul class="ul-Details">
   <div>  <img src=${data.Poster}  /> </div>
  <li>Title: ${data.Title}</li>
    <li>Year: ${data.Year}</li>
  <li>Actors: ${data.Actors}</li>
  <li>Genre: ${data.Genre}</li>
  <li class=posterImg>Description: ${data.Plot}</li>
    <li>Year: ${data.Year}</li>
    <li>IMDB: ${data.imdbRating}</li>
  </ul>

  `;
    detailsWrapper.insertAdjacentHTML("afterbegin", html);
    await getYoutubeData(data.Title);

    loader.classList.add("hidden");
  } catch (err) {
    console.log(err);
  }
}
getMovieDetails();
const apiKey = "AIzaSyDT6BJLWdsJLH3e_zY3s1BUSzj1l74QtCs";

async function getYoutubeData(movieTitle) {
  loader.classList.remove("hidden");

  const query = `${movieTitle} official trailer`;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`,
  );
  const data = await res.json();
  const videoId = data.items?.[0]?.id?.videoId;
  if (videoId) {
    showTrailer(videoId);
  }
  loader.classList.add("hidden");

  return videoId;
}

function showTrailer(videoId) {
  const trailerBox = document.querySelector(".trailer");

  trailerBox.innerHTML = `
    <iframe
      width="100%"
      height="500"
      src="https://www.youtube.com/embed/${videoId}"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
}
