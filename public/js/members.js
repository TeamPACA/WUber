$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  searchedWinery = $("#winery-search");



  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
  });

  function searchForWinery(event) {
    event.preventDefault();
    let wineryname = searchedWinery.val().trim();
    $.get("/api/wineries_name/" + wineryname, function (data) {
      console.log("in get req")
    }).then(function (data) {
      console.log(data)
      console.log("Search4 Working");
      $("#results-container").empty()
      getwineries(wineryname);

    }).catch(function () {
      console.log("api fail")
    })

  }

  function getwineries(id) {
    $.get("/api/wineries_name/" + id, function (data) {
      console.log(data)
    }).then(function (data) {
      data.forEach(element => {
        const wineries = displayWineries(element);
        $('#results-container').append(wineries)
      });
    })
  };

  function displayWineries(data) {
    let wineryCard = `
    <div class="col-md-3">
      <div class="card border-dark m-2">
        <img src="./old/assets/img/grapevine.jpg" class="card-img-top" alt="Grapes on a vine">
        <div class="card-body">
          <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
          <p><strong>Location:</strong></p>
          <p class="card-text">${data.wineaddress}, ${data.winepostcode}
          </p>
          <p class="card-text"><strong>PH: ${data.winephone}</strong>
          <p class="card-text">${data.wineemail}</p>
          <button class="btn btn-primary" id="enter-winery-btn" data=${data.id}>View this winery!</button>
        </div>
      </div>
    </div>
  </div>`
    return wineryCard
  }


  $("#search-for-winery-btn").on("click", searchForWinery)


});