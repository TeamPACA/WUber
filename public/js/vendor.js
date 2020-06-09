$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    let memberid;
    const wname = $('#wineryname-input');
    const waddress = $('#wineaddress-input');
    const wpostcode = $('#winepostcode-input');
    const wphone = $('#winephone-input');
    const wemail = $('#wineemail-input');
   



    //Adding Event handlers for adding of wines,wineries and events modals.
    $('body').on('click', '.wine-input', function () {
        let wineryID = ($(this).attr("data"));
        $('#wine-modal')[0].style.display = "block";
        wineSubmit(wineryID);
    });

    $('body').on('click', '.winery-event', function () {
        let wineryID = ($(this).attr("data"));
        $('#event-modal')[0].style.display = "block";
        eventSubmit(wineryID);
    });

    $('body').on('click', '.winery-addition', function () {
        $('#winery-modal')[0].style.display = "block";
    });
    $('body').on('click', '#reload-page', function () {
        location.reload();
    });






    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.email);
        $('.memberid').text(data.id);
        memberid = data.id

        return memberid;
    }).then(function (memberid) {


        $('form.addwinery').on('submit', function (event) {
            event.preventDefault();
            const wineryData = {
                wineryname: $('#wineryname-input').val().trim(),
                wineryaddress: $('#wineaddress-input').val().trim(),
                winerypostcode: $('#winepostcode-input').val().trim(),
                wineryphone: $('#winephone-input').val().trim(),
                wineryemail: $('#wineemail-input').val().trim(),
                userid: memberid,
            }
            console.log(wineryData);
            addwinery(wineryData.wineryname, wineryData.wineryaddress, wineryData.winerypostcode, wineryData.wineryphone, wineryData.wineryemail, wineryData.userid)
            wname.val("");
            waddress.val("");
            wpostcode.val("");
            wphone.val("");
            wemail.val("");
        });

        getwineries(memberid)

    })

    function addwinery(name, address, postcode, phone, email, id) {
        $.post("/api/addwinery", {
            wineryname: name,
            wineaddress: address,
            winepostcode: postcode,
            winephone: phone,
            wineemail: email,
            FK_Userid: id,
        }).then(function (data) {
            console.log(data)
            window.location.reload();
        }).catch(handleLoginErr);
    };

    function handleLoginErr(err) {
        console.log(err.responseJSON.errors[0].message)
        // $("#alert .msg").text(err.responseJSON.errors[0].message);
        // $("#alert").fadeIn(500);
    };


    function getwineries(id) {
        $.get("/api/wineries_data/" + id, function (data) {
            console.log(data)
        }).then(function (data) {
            data.forEach(element => {
                getwines(element.id);
                getevents(element.id);
                const wineries = renderwineries(element);
                $('#wineries').append(wineries)
            });
        })
    };

    //Function to get all wines from the database for each winery under the user account.
    //Render all of the wines to the winery card.
    function getwines(id) {
        $.get("/api/wines/" + id, function (data) {

            data.forEach(element => {
                const tablerow = $("<tr>");
                tablerow.html(`<td>${element.winename}</td><td>${element.variety}</td><td>${element.year}</td><td>$${element.price}</td>`);
                $('#winery' + id).append(tablerow);
            })

        })
    }

    function getevents(id) {
        $.get("/api/events/" + id, function (data) {
            data.forEach(element => {
                const eventData = $('#eventsByWinery' + id);
                eventData.append(`<br>${element.eventname}`)
                eventData.append(`<br>at ${element.time} on the ${element.date}`)

            })
        })
    }



    function renderwineries(data) {
        const block = `<div class="card border-dark mb-3">
               <div class="card-header">${data.wineryname}</div>
               <div class="card-body text-dark">                    
                    <div class="row">
                        <div class="col-4" id="eventsByWinery${data.id}">
                            <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                            <p class="card-text">Address: ${data.wineaddress}</p>
                            <p class="card-text">Email: ${data.wineemail}</p>
                            <p class="card-text">Phone: ${data.winephone}</p>
                            <button type="submit" class="btn btn-primary wine-input mt-2" data=${data.id}>Add a wine</button>
                            <button type="submit" class="btn btn-primary winery-event mt-2" data=${data.id}>Add a calendar event</button>
                            <h5>Upcoming Events</h5>
                        </div>
                        <div class="col-8"">
                                <table class="table">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th scope="col">Wine Name</th>
                                            <th scope="col">Variety</th>
                                            <th scope="col">Year</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody id="winery${data.id}">
                                    </tbody>
                                </table>

                        </div>
                    </div>
                </div>
             </div>`
        return block
    }



    //Function for submitting a wine and calling the API. Passing in the winery id as a parameter.
    function wineSubmit(winery) {
        $('form.addwine').on('submit', function (event) {
            event.preventDefault();
            const wineData = {
                winename: $('#winename-input').val().trim(),
                winevariety: $('#winevariety-input').val().trim(),
                wineyear: $('#wineyear-input').val().trim(),
                winedescription: $('#winedescription-input').val().trim(),
                wineprice: $('#wineprice-input').val().trim(),
                wineryid: winery,
            }

            console.log(wineData);

            addwine(wineData.winename, wineData.winevariety, wineData.wineyear, wineData.winedescription, wineData.wineprice, wineData.wineryid);
            //Clear out the contents and drop the modal. May not be necessary to do this as there is a page reload.
            $('#winename-input').val("");
            $('#winevariety-input').val("");
            $('#wineyear-input').val("");
            $('#winedescription-input').val("");
            $('#wineprice-input').val("");
            $('#wine-modal')[0].style.display = "none";

        })
    }

    //function to post wine to the database via /api/addwine route

    function addwine(name, variety, year, description, price, id) {
        console.log("Wine Submitted");
        $.post("/api/addwine/", {
            winename: name,
            variety: variety,
            year: year,
            description: description,
            price: price,
            WineryId: id,
        }).then(function (data) {
            console.log(data)
            window.location.reload();
        }).catch(function () {
            console.log("API failure")
        });
    };


    function eventSubmit(winery){
        $('form.addevent').on('submit', function(event){
        event.preventDefault();
        let dateFormatted = moment($('#eventdate-input').val()).format("DD/MM/YYYY")
        const eventData = {
            eventname: $('#eventname-input').val().trim(),
            time: $('#eventtime-input').val(),
            date:dateFormatted,
            //isPast:false,
            WineryId: winery,
        }
        console.log(eventData);
        //addevent(eventData.eventname,eventData.time,eventData.date,eventData.isPast,eventData.WineryId)
        addevent(eventData.eventname,eventData.time,eventData.date,eventData.WineryId)

            addevent(eventData.eventname, eventData.time, eventData.date, eventData.wineryid)
            //$('#eventname-input').val("");
            //$('#eventtime-input').val("");
            //$('#eventdate-input').val("");

            $('#event-modal')[0].style.display = "none";

        })
    }



    function addevent(name, time, date, id) {
        console.log("Event Submitted");
        $.post("/api/addEvent/", {
            eventname: name,
            time: time,
            date: date,
            WineryId: id,
        }).then(function (data) {
            console.log(data)
            window.location.reload();
        }).catch(function () {
            console.log("API failure")
        });
    };


});