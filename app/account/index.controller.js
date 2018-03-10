// Account controller for angular app
(function() {
	'use strict';

	angular.module('app').controller('Account.IndexController',controller);

	function controller($window, UserService, FlashService) {
		var vm = this;
		vm.user = null;
		vm.update_user = save_user;
		vm.delete_user = delete_user;

		initialize_controller();

		function initialize_controller() {
			UserService.getCurrent().then(function(user) {
				vm.user = user;
			})
		}

		function save_user() {
			UserService.updateUser(vm.user).then(function() {
				FlashService.success('User Updated!');
			}).catch(function(err) {
				FlashService.error(err);
			})
		}

		function delete_user() {
			UserService.deleteUser(vm.user._id).then(function() {
				$window.location = '/login';
			})
			.catch(function(err) {
				FlashService.error(err);
			});
		}
	}
})();