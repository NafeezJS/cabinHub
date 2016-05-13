var express = require("express");
var router  = express.Router();
var Cabin = require("../models/cabin");
var middleware = require("../middleware");


//INDEX
router.get("/", function(req, res){
    Cabin.find({}, function(err, allCabins){
       if(err){
           console.log(err);
       } else {
          res.render("cabins/index",{cabins:allCabins});
       }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCabin = {name: name, image: image, description: desc, author:author}
    // Create and save to DB
    Cabin.create(newCabin, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/cabins");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("cabins/new"); 
});

// SHOW
router.get("/:id", function(req, res){
    //find with provided ID
    Cabin.findById(req.params.id).populate("comments").exec(function(err, foundCabin){
        if(err){
            console.log(err);
        } else {
            console.log(foundCabin)
            res.render("cabins/show", {cabin: foundCabin});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCabinOwnership, function(req, res){
    Cabin.findById(req.params.id, function(err, foundCabin){
        res.render("cabins/edit", {cabin: foundCabin});
    });
});

// UPDATE
router.put("/:id",middleware.checkCabinOwnership, function(req, res){
    Cabin.findByIdAndUpdate(req.params.id, req.body.cabin, function(err, updatedCabin){
       if(err){
           res.redirect("/cabins");
       } else {
           res.redirect("/cabins/" + req.params.id);
       }
    });
});

// DESTROY
router.delete("/:id",middleware.checkCabinOwnership, function(req, res){
   Cabin.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/cabins");
      } else {
          res.redirect("/cabins");
      }
   });
});

module.exports = router;

