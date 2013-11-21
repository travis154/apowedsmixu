
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , async = require('async')
  , request = require('request')
  , mongoose = require('mongoose')

db = mongoose.connect("localhost/apo");

var Schema = mongoose.Schema({
	_id:'string',
	user:'string',
	lowpic:'string',
	pic:'string',
	approved:'boolean'
}, {strict:false});

var Pic = db.model('pics', Schema);


async.forever(function(n){
	setTimeout(function(){
		var url = "https://api.instagram.com/v1/tags/apowedsmixu/media/recent?client_id=c6cf5ca4c023477babba474ef3ac5117";
		request(url, function(err, res, body){
			var data = JSON.parse(body);
			data.data.forEach(function(e){
				new Pic({
					_id:e.id,
					user:e.user.full_name,
					lowpic:e.images.thumbnail.url,
					pic:e.images.standard_resolution.url,
					approved:false
				}).save(function(err){});
			});
			setTimeout(function(){
				n(null);
			}, 5000);
		});
	},5000);
}, console.log);

var app = express();
var server =  http.createServer(app).listen(4567);

var io = require('socket.io').listen(server);

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/', function(req,res){
	console.log(req.body.data);
	res.end();
});
app.get('/', function(req,res){
	res.render('layout');
});
app.get('/approve', function(req,res){
	Pic
	.find({approved:false})
	.lean()
	.exec(function(err, d){
		console.log(d);
		res.render('approve', {pics:d});
	})
});

app.get('/approve/:id', function(req,res){
	res.end();
	var id = req.params.id;
	Pic
	.update({_id:id},{$set:{approved:true}}, function(e,d){
		Pic.findOne({_id:id}, function(e,d){
			io.sockets.emit('pic', d);
		});
	});
});


