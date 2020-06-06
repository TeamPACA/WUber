$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      username: $('#username-input').val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      usertype: $('#usertype').val()

    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.username, userData.email, userData.password, userData.usertype);
    emailInput.val("");
    passwordInput.val("");
    $('#username-input').val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(username, email, password, type) {
    $.post("/api/signup", {
      username: username,
      email: email,
      password: password,
      usertype: type,
    })
      .then(function(data) {
        let type = data.usertype;
        if(type == "patron"){
          window.location.replace("/members");
        }else{
          window.location.replace("/vendor");
        }
        
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    console.log(err.responseJSON.errors[0].message)
    $("#alert .msg").text(err.responseJSON.errors[0].message);
    $("#alert").fadeIn(500);
  }
});
