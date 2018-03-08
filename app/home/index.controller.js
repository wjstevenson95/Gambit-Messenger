// Home controller for angular app
// SEAF wrapped
(function() {
	'use strict';

	angular.module('app').controller('Home.IndexController',controller);

	function controller() {
		var vm = this;

		vm.user = null;
	}
})();