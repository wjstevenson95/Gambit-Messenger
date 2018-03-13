// Contacts controller for angular app
(function() {
	'use strict';

	angular.module('app').controller('Contacts.IndexController',controller);

	function controller(UserService, FlashService) {
		var vm = this;
		vm.user = null;
		vm.add_contact = add_contact;

		initializer_controller();

		function initializer_controller() {
			UserService.getCurrent().then(function(user) {
				vm.user = user;
			});
		};

		function add_contact() {
			console.log(vm.contact_username);
			UserService.addContact(vm.contact_username, vm.user).then(function() {
				FlashService.success('Contact added!')
			})
			.catch(function(err) {
				FlashService.error(err);
			});
		};
	}
})();