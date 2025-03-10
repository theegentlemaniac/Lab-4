document.getElementById("search-btn").addEventListener("click", async () => {
    const countryName = document.getElementById("country-input").value.trim();

    if (!countryName) {
        alert("Input allows only Country names!");
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found!");

        const data = await response.json();
        const country = data[0];

        document.getElementById("country-info").innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="flag">
        `;

        const borders = country.borders;
        if (!borders) {
            document.getElementById("bordering-countries").innerHTML = `<p>No bordering countries.</p>`;
            return;
        }

        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`);
        const borderData = await borderResponse.json();

        const borderHTML = borderData.map(borderCountry => `
            <p><strong>${borderCountry.name.common}</strong></p>
            <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}" class="border-flag">
        `).join("");

        document.getElementById("bordering-countries").innerHTML = `<h3>Bordering Countries:</h3>${borderHTML}`;

    } catch (error) {
        document.getElementById("country-info").innerHTML = `<p style="color:red;">${error.message}</p>`;
        document.getElementById("bordering-countries").innerHTML = "";
    }
});
