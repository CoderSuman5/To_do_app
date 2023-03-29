const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');
const _= require('lodash');

const app = express();
// var items = ["buy vegies", "cook food", "solve 3 DSA prblm"];
// var wrokItems = []


mongoose.connect("mongodb+srv://admin-suman:sum162087@atlascluster.hr622sa.mongodb.net/todolistDB", {useNewUrlParser: true});

const targetsSchema  = new mongoose.Schema({
   work: "String",
});

const Target = mongoose.model("target", targetsSchema);
const target = new Target({
  work: "complete the to_do module",
});

const target1 = new Target({
  work: "complete the total 3 question of DsA",
});

const target2 = new Target({
  work: "complete the dinner before 10 PM"
});

const deafultItems = [target, target1, target2];
// Target.insertMany(deafultItems, function(err){
//   if(err){
//     console.log("err");
//   } else {
//     console.log("items successfully added")
//   }
// });


const listSchema = {
  name: String,
  items: [targetsSchema]
};

const List = mongoose.model("list", listSchema);

//----------------------------------------------------------------//
app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'view'))
app.set('views', 'view')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("Public"))

app.get("/", function(req,res){

  Target.find({}, function (err, foundItems) {

    if(foundItems.length === 0){
      Target.insertMany(deafultItems, function(err){
        if(err){
          console.log("err");
        } else {
          console.log("items successfully added")
        }
      res.redirect("/");
    });
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
    }

    // res.render("list", {listTitle: day, newListItems: foundItems});
  })
var today = new Date();

var options = {
  weekday: "long",
  day: "numeric",
  month: "long"
}
var day = today.toLocaleDateString("hi-IN", options);
})


app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundItems) {
    if(!err){
      if(!foundItems){
          // creating a list
          const list = new List({
            name: customListName,
            items: deafultItems
          });
          list.save();
         res.redirect("/" + customListName);
      } else{
        // show an existing list
        res.render("list", {listTitle: foundItems.name, newListItems: foundItems.items})
      }
  }
});


});

app.post("/", function(req, res){
    // var item = req.body.newItem;
    // if(req.body.list === "work"){
    //   workItems.push(item)
    //   res.redirect("/work")
    // } else {
    //   items.push(item)
    //   res.redirect("/")
    // }

    const itemName = req.body.newItem;
    const listName = req.body.list;
    // let listName = req.body.list;   if (listName) {     listName = listName.trim();   }
   const targets = new Target({
     work: itemName,
   });

    if(listName == "day"){
      targets.save();
      res.redirect("/");
    } else {
      List.findOne({name: listName}, function(err, foundList) {
        //------------error cannot read properties of null (reading 'lists')-----------//
          foundList.items.push(targets);
          //---------------in this line------------------//
          foundList.save();
          res.redirect("/" + listName);
      });

    }
});

app.post("/delete", function(req, res) {
  const delItem = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "day"){
    Target.findByIdAndRemove(del, function(err) {
      if(err){
        console.log("err");
      } else {
        console.log("successfully item deleted");
        res.redirect("/")
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: delItem}}}, function(err, foundList) {
      if(!err){
        res.redirect("/" + listName);
      }
    })
  }



  // const checkedItemId = req.body.checkbox;
})




// app.get("/work", function(req, res){
//   res.render("list", {listTitle: "work list", newListItems: "workItems"})
// })

app.get("/about", function(req, res){
  res.render("about")
})


app.listen(3000, function(){
  console.log("server is running on port 3000")
})


//-------------different appoach-----------------//
