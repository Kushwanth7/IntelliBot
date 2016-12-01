http = require('http');
express = require('express');
body_parser = require('body-parser');
url = require('url');
path = require('path');
webSocket = require('ws');
model = require('./model.js');
mysql = require('mysql');
server = http.createServer();
globals = require('./globals');
app = express();

user = {};


app.use(express.static(path.join(__dirname+'/')));

json_parser = body_parser.json();
urlencoded_parser = body_parser.urlencoded({extended:true});
trainedClassifier = model.trainClassifier();
app.use(json_parser, urlencoded_parser);


app.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/talk.html'));
});

app.post('/login', function(req,res)
{
	userObj = req.body.user;
	var query = "select id,phone_number,userPassword from Intellibot.UserProfile where phone_number = " + "'" + userObj.name + "'";
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : globals.databasePassword,
		database : 'EntroChef'
	});

	connection.connect(
		function(err)
		{
		}
	);

	connection.query(query, function(err,rows,fields)
	{
		if(rows.length <= 0)
		{
			//User is not registered
			res.status(400).end("user is not registered");
		}
		else
		{
			var returnedObj = rows[0];
			if(returnedObj.userPassword != userObj.password)
			{
				res.status(401).end("Incorrect user name or password");
			}
			else
			{
				response = {};
				response.success = true;
				user.id = returnedObj.id;
				user.phone_number = returnedObj.phone_number;
				response.user = user;
				res.send(JSON.stringify(response));
			}
		}
	});
});

app.post('/register', function(req, res)
{
		var userObj = req.body.user;
		var query = "insert into Intellibot.UserProfile(phone_number,userPassword,isProfessor) values(" + "'" + userObj.name + "','" + userObj.password + "'," + "false)";
		var connection = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : globals.databasePassword,
			database : 'EntroChef'
		});

		connection.connect(
			function(err)
			{
			}
		);

		connection.query(query, function(err,rows,fields)
		{
			if(err)
			{
				res.status(400).end("User already registered");
			}
			else
			{
				res.status(200).end("OK");
			}
		});
});

app.get('/user_list', function(req, res)
{
	var query = "select * from Intellibot.UserProfile";
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : globals.databasePassword,
		database : 'EntroChef'
	});

	connection.connect(
		function(err)
		{
		}
	);

	connection.query(query, function(err,rows,fields)
	{
		response = {};
		response.success=true;
		response.user_list=rows;
		res.send(JSON.stringify(response));
	});
});

function broadcast(broadcast_msg_obj, from)
{
	connections.forEach(function(wsn){

		if (wsn.user_details.id != from.id) {
			console.log('broadcasted for : '+wsn.user_details.id);
			wsn.send(JSON.stringify(broadcast_msg_obj));
		}
	})
}

webSocketServer = webSocket.Server;
wss = new webSocketServer({server:server});

connections = [];

wss.on('connection', function(wsn)
{
  //User is the object who is logged in
	wsn.user_details = user;
	connections[user.id] = wsn;
	request = wsn.upgradeReq;
	if (request.headers.origin != 'http://localhost:8000') {
		wsn.close();
	}

	broadcast_msg_obj = {};
	broadcast_msg_obj.status_code = 101;
	broadcast_msg_obj.message = "Update user list";
	broadcast(broadcast_msg_obj, user);

	wsn.on("message", function(msg)
  {
		msg_obj = JSON.parse(msg);
    if(msg_obj.to == 2)
    {
      msg_obj.to = msg_obj.from
      msg_obj.message = model.getResponseToQuestion(trainedClassifier,msg_obj.message);
    }
    msg_obj.status_code = 200;
    wsn_to = connections[msg_obj.to];
    if (wsn_to === undefined)
    {
      msg_obj.status_code = 400;
      wsn_to = wsn;
    }
    wsn_to.send(JSON.stringify(msg_obj));
	});

	wsn.on('close', function(){
		var removed = connections.splice(user.id, 1);
		console.log('WebSocket connection closed for : '+ removed);
	});

});


server.on('request', app);
server.listen(8000, function(){
	console.log('server listening on port : '+server.address().port);
});
