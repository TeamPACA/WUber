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
        // $('#wine-modal')[0].style.display = "block";
        $('#winemodalheader').text("Add Wine");
        $('#winemodalbtn').text("Add Wine");
        // document.getElementById('winemodal').classList.remove('editwine')
        // document.getElementById('winemodal').classList.add('addwine')
        $("#editmodal").modal('show');
        $('#addwinemodalbtn').show();
        $('#editwinemodalbtn').hide();

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
    $('body').on('click','#reload-page',function(){
        location.reload();        
    });

    $('#editmodal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset'); 
    })

    //###### Editing & Deleting Wine ############//

    // This only change name
    // $(document).on('click','.winetable',function(event){
    //     $(this).attr('contenteditable', 'true');
    //     $(this).css('background-color', "white");
    //     let x = $(this).attr("id")
    //     console.log(x)
    //     getwinesdata(x);
    // });
    // This only change name

    // This work with code above to lauch ajax call
//     $(document).on('blur','.winetable',function(){
//         let newtext = $(this).text();
//         let id = $(this).attr("id");
//         console.log(newtext, id)
//         const wineedit = {
//             name: newtext,
//             id: id
//         };
//         editwine(wineedit);
//         $(this).css('background-color', "#dfd4d4")

//     });
// This work with code above to lauch ajax call



    $('body').on('click', '#editwine', function(){
        let x = $(this).attr("data")
        getwinesdata(x);

        SubmitEditWine(x);
    })

    function getwinesdata(id){
        $.get("/api/winesdata/" + id,function(data){
            console.log(data)
            modal_wine_edit(data);
            $('#editmodal').modal("show");
            $('#addwinemodalbtn').hide();
            $('#editwinemodalbtn').show();
            
        })
    };

    function modal_wine_edit(data){
        $('#winename-input').val(`${data[0].winename}`);
        $('#winevariety-input').val(`${data[0].variety}`);
        $('#wineyear-input').val(`${data[0].year}`);
        $('#winedescription-input').val(`${data[0].description}`);
        $('#wineprice-input').val(`${data[0].price}`);
        $('#winemodalheader').text("Edit Wine");
        $('#winemodalbtn').text("Edit Wine");

    };


    function SubmitEditWine(id){

        $('body').on('click','#editwinemodalbtn', function(){
            
            const editwineData = {
                name: $('#winename-input').val().trim(),
                variety: $('#winevariety-input').val().trim(),
                year: $('#wineyear-input').val().trim(),
                description: $('#winedescription-input').val().trim(),
                price: $('#wineprice-input').val().trim(),
            };
    
            console.log(editwineData, id);
            
            editwine(editwineData,id);
    
            $('#editmodal').modal("hide");
            window.location.reload();
        });

    }
    

    $(document).on('click', '.delwine', function(){
        let x = $(this).attr("id");
        
        deletewine(x);

    })

    //###### Editing & Deleting Wine ############//    

    //###### Editing & Deleting Event ############//

    $(document).on('click', '.delevent', function(){
        let x = $(this).attr("id");
        
        deleteevent(x);
    })




    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.user);
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
    function getwines(id){
        $.get("/api/wines/" + id,function(data){

            data.forEach(element =>{
                const tablerow = $("<tr class='winerow'>") ;
                tablerow.html(`
                <td class="winetable" id=${element.id} contenteditable="false">${element.winename}</td>
                <td>${element.variety}</td>
                <td>${element.year}</td>
                <td>${element.price}</td>
                <td>
                <span>
                <button class="editwine" id="editwine" data=${element.id}>Edit</button>
                <button class="delwine" id=${element.id}>Delete</button>
                </span>
                </td>`);
                $('#winery' + id).append(tablerow);
            })

        })
    }

    function getevents(id){
        $.get("/api/events/" + id,function(data){
            data.forEach(element =>{

                const tablerow = $("<tr>") ;
                tablerow.html(`
                <td id=${element.id} contenteditable="false">${element.eventname}</td>
                <td>${element.time}</td>
                <td>${element.date}</td>
                <td><button class="delevent" id=${element.id}>Delete</button></td>`);
                $('#eventsByWinery' + id).append(tablerow);


            })
        })
    }



    function renderwineries(data) {
        const block = `<div class="card border-dark mb-3">
               <div class="card-header">${data.wineryname}</div>
               <div class="card-body text-dark">                    
                    <div class="row">
                        <div class="col-sm-12 col-md-4 mb-3" >
                            <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                            <p class="card-text">Address: ${data.wineaddress}</p>
                            <p class="card-text">Email: ${data.wineemail}</p>
                            <p class="card-text">Phone: ${data.winephone}</p>
                            <button type="submit" class="btn btn-primary wine-input mt-2" data=${data.id}>Add a wine</button>
                            <button type="submit" class="btn btn-primary winery-event mt-2" data=${data.id}>Add a calendar event</button>
                        </div>
                        <div class="col-sm-12 col-md-8"">
                        <div class="row">
                        <table class="table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Wine Name</th>
                                <th scope="col">Variety</th>
                                <th scope="col">Year</th>
                                <th scope="col">Price</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody id="winery${data.id}">
                        </tbody>
                        </table>                        
                        </div>
                        <div class="row">
                        <table class="table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Event Namee</th>
                                <th scope="col">Time</th>
                                <th scope="col">Date</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody id="eventsByWinery${data.id}"">
                        </tbody>
                        </table>
                        
                        </div>


                        </div>
                    </div>
                </div>
             </div>`
        return block
    }
    //<tbody id="winery${data.id}>


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
        // $('#winename-input').val("");
        // $('#winevariety-input').val("");
        // $('#wineyear-input').val("");
        // $('#winedescription-input').val("");
        // $('#wineprice-input').val("");
        // $('#wine-modal')[0].style.display = "none";
        $('#editmodal').modal("hide");

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


//####### Edit wines ###########//

    function editwine(data, id){
        $.ajax({
            method: "PUT",
            url:"/api/wine/" + id,
            data: data
        }).then(function(result){
            console.log(result)
        }).catch(function(err){
            console.log(err)
        })
    };

//####### Delete wines ########//

    function deletewine(id){
        $.ajax({
            method: "DELETE",
            url: "/api/wine/" + id
        }).then(function(result){
            window.location.reload();
        })

    }
//####### Delete wines ########//

    function deleteevent(id){
        $.ajax({
            method: "DELETE",
            url: "/api/event/" + id
        }).then(function(result){
            window.location.reload();
        })
    }
});