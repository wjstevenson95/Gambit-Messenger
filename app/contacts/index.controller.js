// Contacts controller for angular app
(function() {
	'use strict';

	angular.module('app').controller('Contacts.IndexController',controller);

	function controller($window, UserService, FlashService) {
		var vm = this;
		vm.user = null;
		vm.add_contact = add_contact;
		vm.accept_contact = accept_contact;
		vm.decline_contact = decline_contact;
		vm.remove_contact = remove_contact;
		vm.set_active_contact = set_active_contact;
		vm.active_contact = null;

		initialize_controller();

		function initialize_controller() {
			UserService.getCurrent().then(function(user) {
				vm.user = user;

				vm.current_contacts = [];
				vm.current_pending = [];
				console.log("Contacts length: " + vm.user.contacts.length);

				for(var i = 0; i < vm.user.contacts.length; i++) {
					UserService.getContactInfo(vm.user.contacts[i].id).then(function(contact) {
						console.log("should print three times...");
						vm.current_contacts.push(contact);
					});
				}

				for(var j = 0; j < vm.user.pending.length; j++) {
					UserService.getContactInfo(vm.user.pending[j].id).then(function(pending_contact) {
						vm.current_pending.push(pending_contact);
					});
				}
			});
		};

		function add_contact() {
			UserService.addContact(vm.contact_username, vm.user).then(function() {
				FlashService.success('Contact added!');
			})
			.catch(function(err) {
				FlashService.error(err);
			});
		};

		function remove_contact() {
			UserService.removeContact(vm.user._id, vm.active_contact._id).then(function() {
				FlashService.success('Contact removed!');
			})
			.catch(function(err) {
				FlashService.error(err);
			});

			$window.location.reload();
		}

		function accept_contact(user_id, contact_id) {
			UserService.acceptContact(user_id, contact_id).then(function() {
				FlashService.success('New contact!');
			})
			.catch(function(err) {
				FlashService.error(err);
			});

			$window.location.reload();
		};

		function decline_contact(user_id, contact_id) {
			UserService.declineContact(user_id, contact_id).then(function() {
				FlashService.success('Contact declined!');
			})
			.catch(function(err) {
				FlashService.error(err);
			});

			initialize_controller();
		};

		function set_active_contact(contact) {
			vm.active_contact = contact;
		}
	}
})();