const region = new URLSearchParams(window.location.search).get('region');
const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search');
const applyFiltersButton = document.getElementById('apply-filters');

if (!region) {
    alert("No region specified in the URL!");
    window.location.href = "index.html";
}

let countries = [];

async function fetchCountries() {
    try {
        if (!region) {
            alert('No region specified in URL!');
            return;
        }
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        countries = await response.json();
        renderCountries(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function renderCountries(countries) {
    countriesContainer.innerHTML = '';
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            </div>
            <div class="country-info">
                <div class="info-header">
                    <h3>${country.name.common}</h3>
                    <span class="material-symbols-outlined heart-icon">favorite</span>
                </div>
                <button class="check-country" data-country-name="${country.name.common}">Check country</button>
            </div>
        `;
        countriesContainer.appendChild(card);
    });

    const buttons = document.querySelectorAll(".check-country");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            const countryName = event.target.dataset.countryName;
            navigateToCountryDetails(countryName);
        });
    });
}

function navigateToCountryDetails(countryName) {
    const selectedCountry = countries.find(country => country.name.common === countryName);
    if (selectedCountry) {
        localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
        const url = new URL("countryDetails.html", window.location.origin);
        url.searchParams.set("country", countryName);
        window.location.href = url;
    }
}

function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const sortValue = document.querySelector('input[name="sort"]:checked')?.value;

    const url = new URL(window.location);
    url.searchParams.set('search', searchValue);
    url.searchParams.set('sort', sortValue || '');
    window.history.pushState({}, '', url);

    let filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchValue)
    );

    if (sortValue === 'asc') {
        filteredCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortValue === 'desc') {
        filteredCountries.sort((a, b) => b.name.common.localeCompare(a.name.common));
    }

    renderCountries(filteredCountries);
}

function loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('search') || '';
    const sortValue = urlParams.get('sort') || '';

    searchInput.value = searchValue;
    if (sortValue) {
        document.querySelector(`input[name="sort"][value="${sortValue}"]`).checked = true;
    }

    applyFilters();
}

applyFiltersButton.addEventListener('click', applyFilters);

document.addEventListener("DOMContentLoaded", () => {
    loadFiltersFromURL();
    fetchCountries();

});

function loadFavorites() {
    const favoriteCountries = JSON.parse(localStorage.getItem("favoriteCountries")) || [];
    document.querySelectorAll(".country-card .heart-icon").forEach(icon => {
        const countryName = icon.parentElement.querySelector("h3").textContent;
        if (favoriteCountries.includes(countryName)) {
            icon.classList.add("liked");
        }
    });
}

function toggleFavorite(countryName, icon) {
    let favoriteCountries = JSON.parse(localStorage.getItem("favoriteCountries")) || [];
    if (favoriteCountries.includes(countryName)) {
        favoriteCountries = favoriteCountries.filter(country => country !== countryName);
        icon.classList.remove("liked");
    } else {
        favoriteCountries.push(countryName);
        icon.classList.add("liked");
    }
    localStorage.setItem("favoriteCountries", JSON.stringify(favoriteCountries));
}

function renderCountries(countries) {
    countriesContainer.innerHTML = '';
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            </div>
            <div class="country-info">
                <div class="info-header">
                    <h3>${country.name.common}</h3>
                    <span class="material-symbols-outlined heart-icon">favorite</span>
                </div>
                <button class="check-country" data-country-name="${country.name.common}">Check country</button>
            </div>
        `;
        countriesContainer.appendChild(card);
    });

    document.querySelectorAll(".heart-icon").forEach(icon => {
        const countryName = icon.parentElement.querySelector("h3").textContent;
        icon.addEventListener("click", () => {
            toggleFavorite(countryName, icon);
        });
    });

    loadFavorites();

    const buttons = document.querySelectorAll(".check-country");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            const countryName = event.target.dataset.countryName;
            navigateToCountryDetails(countryName);
        });
    });
}

fetchCountries();
