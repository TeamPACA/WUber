// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var sequelize = require("sequelize");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
      usertype: req.user.usertype,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
        user: req.body.username,
        email: req.body.email,
        password: req.body.password,
        usertype: req.body.usertype,
      })
      .then(function () {

        res.redirect(307, "/api/login");

      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //Add winery
  app.post("/api/addwinery", function (req, res) {
    db.Wineries.create(req.body).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });



  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        user: req.user.user,
        id: req.user.id
      });
    }
  });

  app.get("/api/wineries_data/:id", function (req, res) {
    db.Wineries.findAll({
      where: {
        FK_Userid: req.params.id
      }
    }).then(function (result) {
      res.json(result)
    })
  })
  //**************************************************************** */
  //   WINE API routes
  //**************************************************************** */

  //GET route for retrieving all wines from the database.
  app.get("/api/wines/", function (req, res) {
    db.Wine.findAll({}).then(function (result) {
      res.json(result)
    })
  })

  app.get("/api/winesdata/:id", function(req,res){
    db.Wine.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(result){
      res.json(result)
    })
  })


  //GET roue for retrieving all wines by winery.
  app.get("/api/wines/:id", function (req, res) {
    db.Wine.findAll({
      where: {
        WineryId: req.params.id
      }
    }).then(function (result) {
      res.json(result)
    })
  })


  //Add wine
  //POST api route for adding wines into the database.
  app.post("/api/addwine", function (req, res) {


    console.log(req.body)
    db.Wine.create(req.body).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });

  //Edit wine name
  app.put("/api/wine/:id", function(req,res){
    
    db.Wine.update({
      winename: req.body.name,
      variety: req.body.variety,
      year: req.body.year,
      description: req.body.description,
      price: req.body.price,
    },{
      where: {
        id: req.params.id
      }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(err);
    })
  });

  //Delete wine
  app.delete("/api/wine/:id", function(req, res){
    db.Wine.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result){
      res.json(result)
    })
  });

    //Delete event
    app.delete("/api/event/:id", function(req, res){
      db.Event.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(result){
        res.json(result)
      })
    })




  //**************************************************************** */
  //   Event API routes
  //**************************************************************** */



  //POST api route for adding events into the database.
  app.post("/api/addEvent", function (req, res) {


    console.log(req.body)
    db.Event.create(req.body).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });

  //Get all events by winery id api route.
  app.get("/api/events/:id", function (req, res) {
    db.Event.findAll({
      where: {
        WineryId: req.params.id
      }
    }).then(function (result) {
      res.json(result)
    })
  })
  //**************************************************************** */
  //   Booking API routes
  //**************************************************************** */
  app.post("/api/createBooking", function (req, res) {

    db.Booking.create(req.body).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      res.status(401).json(err);
    });
  });




  // CLIENT SIDE LOGIC
  app.get("/api/wineries_name/:wineryname", function (req, res) {
    console.log("in api route" + req.params.wineryname)
    var userSearchValue = req.params.wineryname
    console.log(userSearchValue)
    db.Wineries.sequelize.query(`SELECT * FROM Wineries where locate("${userSearchValue}", wineryname) > 0`, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(searchResult => {
        console.log("API ROUTE firing")
        console.log(searchResult)
        res.json(searchResult)
        // We don't need spread here, since only the results will be returned for select queries
      })
  })

  app.get("/api/wineries_return/:searched", function (req, res) {
    console.log(req.params.searched)
    let searchedValue = req.params.searched
    db.Wineries.sequelize.query(`SELECT * FROM Wineries where locate("${searchedValue}", wineryname) > 0`, {
      type: sequelize.QueryTypes.SELECT
    }).then(function (result) {
      res.json(result)
    })
  })


  app.get("/api/wines/:id", function (req, res) {
    db.Wine.findAll({
      where: {
        WineryId: req.params.id
      }
    }).then(function (result) {
      res.json(result)
    })
  })

  // app.get("/api/wineries_name/Lukes", function (req, res) {
  //   console.log("in api route")
  //   db.Wineries.sequelize.query(`SELECT * FROM Wineries where locate(wineryname, "Lukes") > 0`, {
  //       type: sequelize.QueryTypes.SELECT
  //     })
  //     .then(searchResult => {
  //       console.log("API ROUTE firing")
  //       console.log(searchResult)
  //       res.json(searchResult)
  //       // We don't need spread here, since only the results will be returned for select queries
  //     })
  //   // })
  // })





};