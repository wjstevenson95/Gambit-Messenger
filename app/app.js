// Entry point for the angular application where the app module is declared
// along with dependencies and contains configuration and starup logic
// for when the app is first loaded

// SEAF wrapped
(function() {
	var gambit = angular.module('app',['ui.router']).config(config).run(run);

	function config($stateProvider, $urlRouterProvider) {
		// Default route
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/app/home/index.html',
				controller: 'Home.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'home' }
			})
			.state('account', {
				url: '/account',
				templateUrl: '/app/account/index.html',
				controller: 'Account.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'account' }
			})
			.state('contacts', {
				url: '/contacts',
				templateUrl: '/app/contacts/index.html',
				controller: 'Contacts.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'contacts' }
			})
			.state('messages', {
				url: '/messages',
				templateUrl: '/app/messages/index.html',
				controller: 'Messages.IndexController',
				controllerAs: 'vm',
				data: { activeTab: 'messages' }
			});
	}

	function run($http, $rootScope, $window) {
		$http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			console.log('changing state...');
			$rootScope.activeTab = toState.data.activeTab;
		})
	}

	$(function() {
		$.get('/app/token', function(token) {
			window.jwtToken = token;

			// manually initialize angular app
			angular.bootstrap(document, ['app']);
		});
	});
})();