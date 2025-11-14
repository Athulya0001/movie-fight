const createAutoComplete = ({ root,renderOption,onOptionSelect, inputValue,fetchData }) => {
  root.innerHTML = `
      <div class="dropdown">
        <label for="search"><b>Search for a movie</b></label>
        <input id="search" type="text" />
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  input.focus();

  const inputFunc = async (e) => {
    const items = await fetchData(e.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = ``;
    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");


      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);

        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };
  input.addEventListener("input", debounce(inputFunc, 500));

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
