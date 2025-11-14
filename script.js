const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src='${imgSrc}' alt='${movie.Title}'/>
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchInput) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "d9835cc5",
        s: searchInput,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summary, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      i: movie.imdbID,
    },
  });
  summary.innerHTML = movieDetails(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStat = document.querySelectorAll("#left-summary .notification");
  const rightSideStat = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStat.forEach((leftStat, index) => {
    const rightStat = rightSideStat[index];

    const leftValue = parseInt(leftStat.dataset.value); //leftStat.getAttribute("data-value"); //
    const rightValue = parseInt(rightStat.dataset.value); //rightStat.getAttribute("data-value"); //

    console.log(leftValue, rightValue);
    if (rightValue > leftValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-danger");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-danger");
    }
  });
};

const movieDetails = (movieData) => {
  const dollar =
    parseInt(movieData.BoxOffice.replace(/\$/g, "").replace(/\,/g, "")) || 0;
  const metaScore = parseInt(movieData.Metascore) || 0;
  const imdbRating = parseFloat(movieData.imdbRating) || 0;
  const imdbVotes = parseInt(movieData.imdbVotes.replace(/,/g, "")) || 0;

  const awards = movieData.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  console.log(dollar, metaScore, imdbRating, imdbVotes);

  console.log(movieData);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieData.Poster}" alt="">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieData.Title}</h1>
          <h5>${movieData.Genre}</h5>
          <p>${movieData.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieData.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollar} class="notification is-primary">
      <p class="title">${movieData.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>   
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieData.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>    
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieData.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>    
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieData.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>    
  `;
};
