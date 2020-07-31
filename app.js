const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const https = require("https");
const XLSX=require("xlsx");
const multer=require("multer");
const fs=require("fs");
const app = express();

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads')
     },
     filename: (req, file, cb) => {
        cb(null, file.originalname)
     }
   });
   
const upload=multer({storage: storage});

app.use(express.static(__dirname + "/public"));


app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin_intern:test123@cluster0.13fen.mongodb.net/entryDB", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set("useCreateIndex", true);

const tupleSchema= new mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    gender: String
})

const Tuple=new mongoose.model("Tuple", tupleSchema);

app.get("/", function(req, res){
    res.render("accept");
})

app.post("/", upload.single("file"), function(req, res){
    console.log(req.file);
      
    var workbook = XLSX.readFile(req.file.path);
    
     var sheet_name_list = workbook.SheetNames;
     var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    xlData.forEach(function(data){
         var tuple=new Tuple({
             name: data.Name,
             email: data.Email,
             mobile: data.Mobile,
             gender: data.Gender
         })
         tuple.save();
     })
    res.redirect("/");
})

app.get("/display", function(req, res){
    Tuple.find({}, function(err, tuples){
        if(err){console.log(err);}
        res.render("display", {tuples: tuples});
    })
})





app.listen(process.env.PORT || 3000, function () {
    console.log("Started");
})
