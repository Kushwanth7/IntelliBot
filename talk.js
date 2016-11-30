app = angular.module("talket",['ngMaterial', 'ngRoute']);

app.controller("talketrl", ["$scope", "$http", "$mdSidenav", "$mdToast", function($scope, $http, $mdSidenav, $mdToast){

	$scope.user_list = [];

	$scope.signUpUser = function(name)
	{
		if (name===undefined || name.length == 0)
		{
			$mdToast.show(
				$mdToast.simple()
				.position('end')
				.textContent("Please enter a valid name")
				.hideDelay(3000)
			);
		} else {
			$http({
				method: "POST",
				url: "register",
				data: {
					phone_number:name
				}
			}).then(function(response){
				window.location.hash="#/chat";
				$scope.my_details = response.data.user;
				$scope.chat($scope.my_details);
					$http({
						method: "GET",
						url: "user_list",
					}).then(function(success)
					{
					 	console.log(success.data.user_list);
					 	$scope.user_list = success.data.user_list;

					}, function(error){console.error(error)});

			}, function(error){});
		}
	};

	$scope.showSideNav = function(){
		$mdSidenav('leftNav').toggle();
	};

	$scope.chat = function(user){

		ws = new WebSocket('ws://localhost:8000');

		ws.onopen =  function(){
			console.log('ws connection opened : ' + ws);
		};

		ws.onmessage =  function(response, flags){
			console.log('received : '+ response.data);
			data = JSON.parse(response.data);
			if (data.status_code == 200) {
				$scope.incomingMsgHandler(data.message);
			} else if(data.status_code == 101) {
				$mdToast.show(
					$mdToast.simple()
					.position("bottom right")
					.textContent("Updating user list")
					.hideDelay(1500)
					);
				$http({
					method: "GET",
					url: "user_list",
				}).then(function(success){

					$scope.user_list = success.data.user_list;

				}, function(error){console.error(error)});
			} else if (data.status_code == 400){
				data.message = 'Failed to send : '+data.message;
			}

		};
		ws.onclose = function(){
			console.log('ws connection closed');
		};
	};

	$scope.sendMessage = function(msg_input_node, to_id)
	{
		message_string = msg_input_node.value;

		if (message_string.trim() && to_id) {
			log_node = document.getElementById('chatLog');
			p_node = document.createElement("P");
			p_node.className = "message float-right";
			msg_node = document.createTextNode(message_string);
			p_node.appendChild(msg_node);
			if (log_node.lastChild != null) {
				margin = (1 - log_node.lastChild.offsetWidth/chatLog.offsetWidth)*87;
				log_node.lastChild.style.marginLeft = margin+"%";
			}
			log_node.appendChild(p_node);
			log_node.scrollTop = log_node.scrollHeight;
			msg_input_node.value="";
			msg_input_node.focus();

			msg_obj = {};
			msg_obj.from = $scope.my_details.id;
			msg_obj.to = to_id;
			msg_obj.message = message_string;

			msg = JSON.stringify(msg_obj);
			ws.send(msg);
		} else {
			$mdToast.show(
				$mdToast.simple()
				.position('bottom right')
				.textContent("Incomplete message")
				.hideDelay(3000)
			);
		}
	};

	$scope.sendMsgHandler = function(e, to_id)
	{
		if (e.keyCode==13 || e.which==13) {
			msg_input_node = document.getElementById("chatInput");
			$scope.sendMessage(msg_input_node, to_id);
		}
		return false;
	};

	$scope.incomingMsgHandler = function(message_string)
	{
		log_node = document.getElementById('chatLog');
		p_node = document.createElement("P");
		p_node.className = "message float-left";
		msg_node = document.createTextNode(message_string);
		p_node.appendChild(msg_node);
		if (log_node.lastChild != null) {
			margin = (1 - log_node.lastChild.offsetWidth/chatLog.offsetWidth)*87;
			log_node.lastChild.style.marginRight = margin+"%";
		}
		log_node.appendChild(p_node);
		log_node.scrollTop = log_node.scrollHeight;
	};

}]);
