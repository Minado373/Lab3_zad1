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

const COUNTRY_ROW = {
  name: getElement("countryName"),
  capital: getElement("countryCapital"),
  population: getElement("countryPopulation"),
  region: getElement("countryRegion"),
  subregion: getElement("countrySubregion"),
};

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
    const response = await fetch(`${baseURL}${country}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) {
      displayMessage("Niepoprawna odpowiedź HTTP!!");
      return;
    }

    const data = await response.json();

    if (data) {
      renderCountry(data.data.objects[0]);
    }
  } catch (error) {
    displayMessage(error.message, "red");
  } finally {
    changeLoaderDisplay("none");
  }
};

const renderCountry = (data) => {
  resultMessage.style.display = "none";
  table.style.display = "block";

  const countryData = {
    name: data.names.common,
    capital: data.capitals?.[0]?.name ?? "Brak stolicy",
    population: data.population ?? "Brak ludzi",
    region: data.region || "Brak regionu",
    subregion: data.subregion || "Brak subregionu",
  };

  Object.entries(countryData).forEach(([key, value]) => {
    if (COUNTRY_ROW[key]) {
      COUNTRY_ROW[key].textContent = value;
    }
  });
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
};

initApp();
