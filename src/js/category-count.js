const baseURL = import.meta.env.VITE_SERVER_URL;

async function getCategoryCount(category) {

    const response = await fetch(
        `${baseURL}products/search/${category}`
    );

    const data = await response.json();

    return data.Result.length;
}

async function displayCategoryCounts(){

    const tents = await getCategoryCount("tents");
    document.querySelector("#tents-count").textContent = tents;


    const backpacks = await getCategoryCount("backpacks");
    document.querySelector("#backpacks-count").textContent = backpacks;


    const sleepingBags = await getCategoryCount("sleeping-bags");
    document.querySelector("#sleeping-bags-count").textContent = sleepingBags;


    const hammocks = await getCategoryCount("hammocks");
    document.querySelector("#hammocks-count").textContent = hammocks;

}z


displayCategoryCounts();