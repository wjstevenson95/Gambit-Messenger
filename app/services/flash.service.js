// JS file for flash messages
// Used to flash success/error messages on CRUD operatins for Users

(function() {
	'use strict';

	angular.module('app').factory('FlashService', service);

	function service($rootScope) {
		var service = {};

		service.success = success;
		service.error = error;

		initialize_flash_service();

		return service;

		function initialize_flash_service() {
			$rootScope.$on('$locationChangeStart', function() {
				clearFlashMessage();
			});

			function clearFlashMessage() {
				var flash = $rootScope.flash;
				if(flash) {
					if(!flash.keepAfterLocationChange) {
						delete $rootScope.flash;
					} else {
						flash.keepAfterLocationChange = false;
					}
				}
			}
		}

		function success(message, keepAfterLocationChange) {
			$rootScope.flash = {
				message: message,
				type: 'success',
				keepAfterLocationChange: keepAfterLocationChangel
			};
		}

		function error(message, keepAfterLocationChange) {
			$rootScope.flash = {
				message: message,
				type: 'danger',
				keepAfterLocationChange: keepAfterLocationChange
			};
		}
	}
})();