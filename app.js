const getElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Nie znaleziono elementu o ID: ${elementId}`);
    return;
  }

  return element;
};

const countryButton = getElement("countryButton");
const table = getElement("table");
const tableBody = getElement("tableBody");
const resultMessage = getElement("resultMessage");
const loader = getElement("loader");

const regionSelect = getElement("regions");

let regionValue = regionSelect.value;
let countries = [];

const API_KEY = "rc_live_7dd1f206b53143539439cabe907e50e7";
const baseURL = `https://api.restcountries.com/countries/v5?region=`;

const displayMessage = (content, color = "black") => {
  resultMessage.style.display = "block";
  resultMessage.textContent = content;
  resultMessage.style.color = color;
};

const changeLoaderDisplay = (mode) => {
  loader.style.display = mode === "block" ? "block" : "none";
};

const clearTableBody = () => {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
};

const createCountryRow = (country) => {
  return `
   <tr>
         <td>${country.names.common}</td>
         <td>${country.capitals?.[0]?.name ?? "Nieznane"}</td>
         <td>${country.population}</td>
         <td>${country.subregion}</td>
    </tr>  
  `;
};

const sortCountries = () => {
  countries.sort((a, b) => a.names.common.localeCompare(b.names.common));
};
const renderCountries = () => {
  sortCountries();
  clearTableBody();
  resultMessage.style.display = "none";
  table.style.display = "block";
  const rows = countries.map(createCountryRow);

  for (const row of rows) {
    tableBody.innerHTML += row;
  }
};

const getCountriesByRegion = async () => {
  try {
    changeLoaderDisplay("block");
    const response = await fetch(`${baseURL}${regionValue}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) {
      displayMessage("Niepoprawna odpowiedź HTTP!!");
      return;
    }

    const { data } = await response.json();

    countries = data.objects;
    renderCountries();
  } catch (error) {
    displayMessage(error.message, "red");
  } finally {
    changeLoaderDisplay("none");
  }
};

const initApp = () => {
  displayMessage("Brak wyników");

  countryButton.addEventListener("click", (e) => {
    e.preventDefault();
    getCountriesByRegion();
  });

  regionSelect.addEventListener("change", (event) => {
    regionValue = event.target.value;
  });
};

initApp();
