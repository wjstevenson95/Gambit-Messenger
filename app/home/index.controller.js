// Home controller for angular app
// SEAF wrapped
(function() {
	'use strict';

	angular.module('app').controller('Home.IndexController',controller);

	function controller($window, UserService, FlashService) {
		var vm = this;

		vm.user = null;
		vm.blogs = [];
		vm.active_blog = null;
		vm.set_active_blog = set_active_blog;
		vm.submit_blog = submit_blog;

		initialize_controller();

		function initialize_controller() {
			// UserService is app factory service
			UserService.getCurrent().then(function(user) {
				vm.user = user;
			});

			UserService.getCurrentBlogs().then(function(blogs) {
				vm.blogs = blogs;
				console.log(blogs);
			});
		}

		function submit_blog() {
			console.log("submitting....");
			var new_blog = {
				author: vm.user.first_name + " " + vm.user.last_name,
				title: vm.blog_title,
				text: vm.blog_text,
				timestamp: Date.now()
			}

			UserService.submitBlog(new_blog).then(function() {
				FlashService.success('Blog submitted!');
			})
			.catch(function(err) {
				FlashService.error(err);
			})

			$window.location.reload();
		}

		function set_active_blog(blog) {
			vm.active_blog = blog;
		}
	}
})();