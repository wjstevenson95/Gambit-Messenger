// Messages controller for angular app
// SEAF wrapped
(function() {
	'use strict';

	angular.module('app').controller('Messages.IndexController',controller);

	function controller() {
		var vm = this;
		vm.user = null;
	}
})();