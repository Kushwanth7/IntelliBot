http = require('http');
express = require('express');
body_parser = require('body-parser');
url = require('url');
path = require('path');
webSocket = require('ws');
model = require('./model.js');

server = http.createServer();

app = express();

user ={};
users = [];
count = 0;

ta_user = {};
ta_user.id = ++count;
ta_user.phone_number = "TA";
users.push(ta_user);

app.use(express.static(path.join(__dirname+'/')));

json_parser = body_parser.json();
urlencoded_parser = body_parser.urlencoded({extended:true});
trainedClassifier = model.trainClassifier();
app.use(json_parser, urlencoded_parser);


app.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/talk.html'));
});


app.post('/register', function(req, res){

	user = {};
	user.id = ++count;
	user.phone_number = req.body.phone_number;
	users.push(user);

	response = {};
	response.success = true;
	response.user = user;

	res.send(JSON.stringify(response));

});

app.get('/user_list', function(req, res){
	response = {};
	response.success=true;
	response.user_list=users;
	res.send(JSON.stringify(response));

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
    if(msg_obj.to == 1)
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
