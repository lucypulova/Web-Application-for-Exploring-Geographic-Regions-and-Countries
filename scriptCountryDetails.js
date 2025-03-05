const selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));

if (!selectedCountry) {
    console.error("No country data found in localStorage. Redirecting...");
    window.location.href = "countriesList.html"; 
}

function renderCountryDetails() {
    console.log("Selected country data:", selectedCountry); 

    document.getElementById("country-flag").src = selectedCountry.flags.svg;
    document.getElementById("country-flag").alt = `Flag of ${selectedCountry.name.common}`;

    document.getElementById("country-name").textContent = selectedCountry.name.common;

    document.getElementById("country-capital").textContent =
        selectedCountry.capital ? selectedCountry.capital.join(', ') : "N/A";

    document.getElementById("country-area").textContent =
        selectedCountry.area ? `${selectedCountry.area.toLocaleString()} km²` : "N/A";

    document.getElementById("country-timezones").textContent =
        selectedCountry.timezones ? selectedCountry.timezones.join(', ') : "N/A";

    document.getElementById("country-languages").textContent =
        selectedCountry.languages
            ? Object.values(selectedCountry.languages).join(', ')
            : "N/A";

    document.getElementById("country-currencies").textContent =
        selectedCountry.currencies
            ? Object.values(selectedCountry.currencies)
                  .map(currency => `${currency.name} (${currency.symbol})`)
                  .join(', ')
            : "N/A";

    document.getElementById("country-neighbours").textContent =
        selectedCountry.borders ? selectedCountry.borders.join(', ') : "No neighbouring countries";
}

document.addEventListener("DOMContentLoaded", () => {
    if (selectedCountry) {
        renderCountryDetails();
        setupFavoriteIcon();
    }
});

function setupFavoriteIcon() {
    const favoriteIcon = document.getElementById("favorite-icon");

    let favoriteCountries = JSON.parse(localStorage.getItem("favoriteCountries")) || [];
    const isFavorite = favoriteCountries.includes(selectedCountry.name.common);

    if (isFavorite) {
        favoriteIcon.classList.add("liked");
    }

    favoriteIcon.addEventListener("click", () => {
        if (favoriteCountries.includes(selectedCountry.name.common)) {
            favoriteCountries = favoriteCountries.filter(
                country => country !== selectedCountry.name.common
            );
            favoriteIcon.classList.remove("liked");
        } else {
            favoriteCountries.push(selectedCountry.name.common);
            favoriteIcon.classList.add("liked");
        }

        localStorage.setItem("favoriteCountries", JSON.stringify(favoriteCountries));
    });
}
