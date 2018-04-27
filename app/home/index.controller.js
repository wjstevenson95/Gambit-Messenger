// Home controller for angular app
// SEAF wrapped
(function() {
	'use strict';

	angular.module('app').controller('Home.IndexController',controller);

	function controller(UserService) {
		var vm = this;

		vm.user = null;
		vm.blogs = {};

		initialize_controller();

		function initialize_controller() {
			// UserService is app factory service
			UserService.getCurrent().then(function(user) {
				vm.user = user;
			});
		}
	}
})();