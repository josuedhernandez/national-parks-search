const apiKey = "TyyqlQDFmTZTbVKPauKderycw5qLeX0VYlVvSdta";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    // for each park object in the items
    //array, add a list item to the results
    //list with the park name, description,
    //and url
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>
      <p>Address: ${responseJson.data[i].addresses[1].line1} ${responseJson.data[i].addresses[1].line2} ${responseJson.data[i].addresses[1].line3}
      ${responseJson.data[i].addresses[1].city}, ${responseJson.data[i].addresses[1].stateCode}, ${responseJson.data[i].addresses[1].postalCode}</p>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function getParks(query, maxResults = 5) {
  const params = {
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString + `&api_key=apiKey`;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  // Watch for submissions in form
  $("form").submit((event) => {
    event.preventDefault();
    const searchParksState = $("#js-search-park").val().replace(/ /g, '').split(",");
    const maxResults = $("#js-max-results").val();
    getParks(searchParksState, maxResults);
  });
}

$(watchForm);
