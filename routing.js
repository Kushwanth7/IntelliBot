app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'signup.html'
	}).
	when('/chat', {
		templateUrl: 'chat.html',
	})
}]);