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
    $('body').on('click','.wine-input',function(){
        let wineryID = ($(this).attr("data"));
        $('#wine-modal')[0].style.display = "block";
        wineSubmit(wineryID);
    });

    $('body').on('click','.winery-event',function(){
        let wineryID = ($(this).attr("data"));
        $('#event-modal')[0].style.display = "block";
        eventSubmit(wineryID);
    });

    $('body').on('click','.winery-addition',function(){
        $('#winery-modal')[0].style.display = "block";        
    });
   // $('body').on('click','.reload-page',function(){
   //     location.reload();        
   // });






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

        getwineries(memberid);

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
                //console.log('#winery'+element.id);
                const wineries = renderwineries(element);                
                $('#wineries').append(wineries)       
            });
        })
    };



    function getwines(id){
        $.get("/api/wines/" + id,function(data){
            //console.log(data);
            data.forEach(element =>{
                console.log(element.winename);
                console.log(element.variety);
                console.log(element.year);
                console.log(element.description);
                console.log(element.price);
            })

        })
    }

    function getevents(id){
        $.get("/api/events/" + id,function(data){
            console.log(data);
        })
    }




    function renderwines(data) {
        const block = `     <h5>${data.winename}</h5>
                            <p >${data.variety}</p>
                            <p >${data.year}</p>
                            <p >${data.price}</p>
                    `
        return block
    }





    function renderwineries(data) {
        const block = `<div class="card border-dark mb-3">
               <div class="card-header">${data.wineryname}</div>
               <div class="card-body text-dark">                    
                    <div class="row">
                        <div class="col-4">
                            <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                            <p class="card-text">Address: ${data.wineaddress}</p>
                            <p class="card-text">Email: ${data.wineemail}</p>
                            <p class="card-text">Phone: ${data.winephone}</p>
                            <button type="submit" class="btn btn-primary wine-input mt-2" data=${data.id}>Add a wine</button>
                            <button type="submit" class="btn btn-primary winery-event mt-2" data=${data.id}>Add a calendar event</button>
                        </div>
                        <div class="col-8" id="winery${data.id}">
                
                        </div>
                    </div>
                </div>
             </div>`
        return block
    }

   //Function for submitting a wine and calling the API. Passing in the winery id as a parameter.
   function wineSubmit(winery){
    $('form.addwine').on('submit', function(event){
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
        
        addwine(wineData.winename,wineData.winevariety,wineData.wineyear,wineData.winedescription,wineData.wineprice,wineData.wineryid);
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
    
    function addwine(name,variety,year,description,price,id){
        console.log("Wine Submitted");
        $.post("/api/addwine/", {
            winename:name,
            variety:variety,
            year:year,
            description: description,
            price: price,
            WineryId: id,
        }).then(function(data){
            console.log(data)
            window.location.reload();
        }).catch(function(){
            console.log("API failure")
        });
    };
    

    function eventSubmit(winery){
        $('form.addevent').on('submit', function(event){
        event.preventDefault();
        const eventData = {
            eventname: $('#eventname-input').val().trim(),
            time: $('#eventtime-input').val().trim(),
            date: $('#eventdate-input').val().trim(),
            wineryid: winery,
        }
        console.log(eventData);

        addevent(eventData.eventname,eventData.time,eventData.date,eventData.wineryid)
        //$('#eventname-input').val("");
        //$('#eventtime-input').val("");
        //$('#eventdate-input').val("");

        $('#event-modal')[0].style.display = "none";

        }) 
    }       



    function addevent(name,time,date,id){
        console.log("Event Submitted");
            $.post("/api/addEvent/", {
            eventname:name,
            time:time,
            date:date,
            WineryId: id,
        }).then(function(data){
            console.log(data)
            window.location.reload();
        }).catch(function(){
            console.log("API failure")
        });
    }; 
    







});