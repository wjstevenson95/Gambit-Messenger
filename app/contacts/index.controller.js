// Contacts controller for angular app
(function() {
	'use strict';

	angular.module('app').controller('Contacts.IndexController',controller);

	function controller(UserService, FlashService) {
		var vm = this;
		vm.user = null;
		vm.current_pending = [];
		vm.current_friends = [];
		vm.add_contact = add_contact;

		initializer_controller();

		function initializer_controller() {
			UserService.getCurrent().then(function(user) {
				vm.user = user;

				for(var i = 0; i < vm.user.friends.length; i++) {
					UserService.getContactInfo(vm.user.friends[i].id).then(function(contact) {
						vm.current_friends.push(contact);
					});
				}

				for(var j = 0; j < vm.user.pending.length; j++) {
					UserService.getContactInfo(vm.user.pending[j].id).then(function(pending_contact) {
						vm.current_pending.push(pending_contact);
					});
				}

				console.log(vm.current_pending);
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