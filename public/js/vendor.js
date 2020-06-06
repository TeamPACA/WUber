$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    let memberid;
    const wname = $('#wineryname-input');
    const waddress = $('#wineaddress-input');
    const wpostcode = $('#winepostcode-input');
    const wphone = $('#winephone-input');
    const wemail = $('#wineemail-input');



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
                const wineries = renderwineries(element);
                $('#wineries').append(wineries);

            });
        })

    };

    function renderwineries(data) {
        const block = `<div class="card border-dark mb-3">
               <div class="card-header">${data.wineryname}</div>
               <div class="card-body text-dark">
                 <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                 <p class="card-text">Address: ${data.wineaddress}</p>
                 <p class="card-text">Email: ${data.wineemail}</p>
                 <p class="card-text">Phone: ${data.winephone}</p>
               </div>
             </div>`
        return block
    }
});