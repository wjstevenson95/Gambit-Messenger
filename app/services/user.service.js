// JS file for user CRUD operation from front on angular app
(function() {
	'use strict';

	angular.module('app').factory('UserService',user_service);

	function user_service($http, $q) {
		var service = {};

		service.getCurrent = getCurrent;
		service.updateUser = updateUser;
		service.deleteUser = deleteUser;

		return service;

		function getCurrent() {
			// AJAX request to api/users for current logged-in user
			console.log("got to user service, AJAX call next...");
			return $http.get('/api/users/current').then(handle_success, handle_error);
		}

		function updateUser() {
			// Update information of current user
		}

		function deleteUser() {
			// Delete current user
		}

		function handle_success(res) {
			return res.data;
		}

		function handle_error(res) {
			return $q.reject(res.data);
		}

	}
})();