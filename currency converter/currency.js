const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msgElement = document.querySelector(".msg"); // Assuming this is the element with the msg class

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;
    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    console.log(fromCurr.value, toCurr.value);

    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${fromCurrency}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        let data = await response.json();

        // Log the entire response to see the structure
        console.log("API Response Data:", data);

        // Check if the target currency's rate is present
        if (data && data[fromCurrency] && data[fromCurrency][toCurrency]) {
            let exchangeRate = data[fromCurrency][toCurrency];
            let convertedAmount = amtval * exchangeRate;

            // Update the msg element with the formatted conversion result
            msgElement.innerText = `${amtval} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
        } else {
            msgElement.innerText = `${toCurrency.toUpperCase()} conversion rate not found`;
        }

    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        msgElement.innerText = "Error fetching conversion rate";
    }
});
