$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  searchedWinery = $("#winery-search");



  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
  });

  function searchForWinery(event) {
    event.preventDefault();
    console.log("button press")
    let wineryname = searchedWinery.val().trim();
    $.get("api/wineries_name/" + wineryname, function (data) {
      console.log("in get req")


    }).then(function (data) {
      console.log(data)
      console.log("Working")
    })

  }

  $("#search-for-winery-btn").on("click", searchForWinery)


});