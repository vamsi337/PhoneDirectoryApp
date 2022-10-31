var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// MongoDB connnection ---------------------------------------
mongoose.connect('mongodb://localhost/phdir');

// MongoDB Schema and Model creation --------------------------------
var dirSchema = new mongoose.Schema({
    username: String, 
    mobile: Number,
    createdOn: {type: Date, default: Date.now}
});
var Directory = mongoose.model('Directory', dirSchema);

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

var urlencodedParser = bodyParser.urlencoded({extended: false});

//route for listing (Read logic) ----------------------------
app.get('/', function(req, res){
    Directory.find({}, function(err, dir){
        if(err) throw err;
        res.render('dirPg', {dir: dir});
    });
});

//route for record creation (Create logic) ---------------------
app.post('/add', urlencodedParser, function(req, res){
    // console.log(req.body);
    var newDir = new Directory();
    newDir.username = req.body.userName;
    newDir.mobile = req.body.mobile;

    newDir.save(function(err, dir){
        if(err) throw err;
        console.log(dir);
        res.redirect('/');
    });
});

//deletion operation (Delete logic)--------------------------------
app.get('/delete/:id', function(req, res){
    Directory.findOneAndDelete({_id: req.params.id}, function(err, dir){
        if(err) throw err;
        console.log(dir);
        res.redirect('/');
    });
});

//update UI page ---------------------------------
app.get('/update/:id', function(req, res){
    Directory.find({_id: req.params.id}, function(err, dir){
        if(err) throw err;
        console.log(dir);
        res.render('dirUpdtPg', {dir: dir})
    });
});	

//update directory (Update logic) --------------------------
app.post('/updateDir', urlencodedParser, function(req, res){
    Directory.findByIdAndUpdate(req.body.id, {username: req.body.userName, mobile: req.body.mobile}, {new: true}, function(err, dir){
        if(err) throw err;
        console.log(dir);
        res.redirect('/');
    });
});

app.listen(3000);
console.log('Server has started on port 3000');