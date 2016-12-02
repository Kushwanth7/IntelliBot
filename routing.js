app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'login.html'
	}).
	when('/signup',
	{
		templateUrl: 'signup.html'
	}).
	when('/chat', {
		templateUrl: 'chat.html',
	})
}]);
