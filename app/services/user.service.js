// JS file for user CRUD operation from front on angular app
(function() {
	'use strict';

	angular.module('app').factory('UserService',user_service);

	function user_service($http, $q) {
		var service = {};

		service.getCurrent = getCurrent;
		service.updateUser = updateUser;
		service.deleteUser = deleteUser;
		service.addContact = addContact;
		service.removeContact = removeContact;
		service.acceptContact = acceptContact;
		service.declineContact = declineContact;
		service.getContactInfo = getContactInfo;
		service.getCurrentBlogs = getCurrentBlogs;
		service.submitBlog = submitBlog;

		return service;

		function getCurrent() {
			// AJAX request to api/users for current logged-in user
			return $http.get('/api/users/current').then(handle_success, handle_error);
		}

		function updateUser(user_info) {
			// Update information of current user
			return $http.put('/api/users/' + user._id, user_info).then(handle_success, handle_error);
		}

		function deleteUser(user_id) {
			// Delete current user
			return $http.delete('/api/users/' + user_id).then(handle_success, handle_error);
		}

		function addContact(contact_username, user) {
			var input = {
				contact_username: contact_username,
				user: user
			}
			return $http.put('/api/users/add_contact',input).then(handle_success, handle_error);
		}

		function removeContact(user_id, contact_id) {
			var input = {
				user_id: user_id,
				contact_id: contact_id
			};
			return $http.put('/api/users/remove_contact', input).then(handle_success, handle_error);
		}

		function acceptContact(user_id, contact_id) {
			var input = {
				user_id: user_id,
				contact_id: contact_id
			};
			return $http.put('/api/users/accept', input).then(handle_success, handle_error);
		}

		function declineContact(user_id, contact_id) {
			var input = {
				user_id: user_id,
				contact_id: contact_id
			};
			return $http.put('/api/users/decline', input).then(handle_success, handle_error);
		}

		function getContactInfo(contact_id) {
			return $http.get('/api/users/get_contact/' + contact_id).then(handle_success, handle_error);
		}

		function getCurrentBlogs() {
			return $http.get('/api/users/current_blogs').then(handle_success, handle_error);
		}

		function submitBlog(blog) {
			return $http.put('/api/users/submit_blog',blog).then(handle_success, handle_error);
		}

		function handle_success(res) {
			return res.data;
		}

		function handle_error(res) {
			return $q.reject(res.data);
		}

	}
})();