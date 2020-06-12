// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var sequelize = require("sequelize");
var db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("signup")
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login")
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    res.render("members")
  });

  app.get("/vendor", isAuthenticated, function (req, res) {
    res.render("vendor")
  });


  app.get("/winerypage/:id", isAuthenticated, function (req, res) {
    db.Wineries.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Wine, db.Event]

    }).then(function (wineryData) {
      console.log(wineryData.get())
      results = wineryData.get()
      results.Wines = results.Wines.map((wine) => wine.get())
      results.Events = results.Events.map((event) => event.get())
      res.render("winerypage", {
        data: results
      })
      console.log(results)
    })
  })


};