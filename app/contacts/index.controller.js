// Contacts controller for angular app
(function() {
	'use strict';

	angular.module('app').controller('Contacts.IndexController',controller);

	function controller() {
		var vm = this;

		vm.user = null;
	}
})();