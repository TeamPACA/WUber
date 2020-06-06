$(document).ready(function () {

    var url = window.location.search;
    var wineryid;

    if (url.indexOf("?winery_id=") !== -1) {
        wineryid = url.split("=")[1];
        getwineryinfo(wineryid);
    }


    function getwineryinfo(wineryname) {
        wineryid = wineryname || "";

        if (wineryid) {
            wineryid = "/?winery_id=" + wineryid;
        }

        $.get("/api/winery" + wineryid, function (result) {
            console.log(result);
        })
    }
});