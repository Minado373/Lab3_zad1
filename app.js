const getElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Nie znaleziono elementu o ID: ${elementId}`);
    return;
  }

  return element;
};

const countryButton = getElement("countryButton");
const countryInput = getElement("countryInput");
const table = getElement("table");
const resultMessage = getElement("resultMessage");
const loader = getElement("loader");

const countryDetails = getElement("countryDetails");
const currencyElement = getElement("currency");
const officialNameElement = getElement("official_name");
const flagImg = getElement("flag");

const countryRow = getElement("countryRow");

const COUNTRY_ROW = {
  name: getElement("countryName"),
  capital: getElement("countryCapital"),
  population: getElement("countryPopulation"),
  region: getElement("countryRegion"),
  subregion: getElement("countrySubregion"),
};

let countryData;

const API_KEY = "rc_live_7dd1f206b53143539439cabe907e50e7";
const baseURL = `https://api.restcountries.com/countries/v5?q=`;

const displayMessage = (content, color = "black") => {
  resultMessage.style.display = "block";
  resultMessage.textContent = content;
  resultMessage.style.color = color;
};

const changeLoaderDisplay = (mode) => {
  loader.style.display = mode === "block" ? "block" : "none";
};

const getCountryData = async (country) => {
  try {
    changeLoaderDisplay("block");
    countryDetails.style.visibility = "hidden";
    const response = await fetch(`${baseURL}${country}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) {
      displayMessage("Niepoprawna odpowiedź HTTP!!");
      return;
    }

    const data = await response.json();
    countryData = data.data.objects[0];
    if (countryData) {
      renderCountry();
    }
  } catch (error) {
    displayMessage(error.message, "red");
  } finally {
    changeLoaderDisplay("none");
  }
};

const renderCountry = () => {
  resultMessage.style.display = "none";
  table.style.display = "block";

  const columnValues = {
    name: countryData.names.common,
    capital: countryData.capitals?.[0]?.name ?? "Brak stolicy",
    population: countryData.population ?? "Brak ludzi",
    region: countryData.region || "Brak regionu",
    subregion: countryData.subregion || "Brak subregionu",
  };

  Object.entries(columnValues).forEach(([key, value]) => {
    if (COUNTRY_ROW[key]) {
      COUNTRY_ROW[key].textContent = value;
    }
  });
  fillCountryDetails();
};

const showCountryDetails = () => {
  countryDetails.style.visibility = "visible";
};

const fillCountryDetails = () => {
  flagImg.src = countryData.flag.url_png;
  const currencies = countryData.currencies.map((currency) => currency.code);
  currencyElement.textContent = currencies.join(", ");
  officialNameElement.textContent = countryData.names.official;
};

const initApp = () => {
  displayMessage("Brak wyników");

  countryButton.addEventListener("click", (e) => {
    e.preventDefault();
    const countryValue = countryInput.value;
    if (countryValue) {
      getCountryData(countryValue);
      countryInput.value = "";
    } else {
      displayMessage("Wpisz nazwę kraju!", "red");
    }
  });

  countryRow.addEventListener("click", showCountryDetails);
};

initApp();
