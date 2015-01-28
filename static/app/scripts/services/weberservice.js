'use strict';

/**
 * @ngdoc service
 * @name weberApp.weberService
 * @description
 * # weberService
 * Service in the weberApp.
 */
angular.module('weberApp')
	.filter('highlight', function($sce) {
		return function(text, phrase) {
			if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
				'<span class="highlighted">$1</span>');
			return $sce.trustAsHtml(text);
		};
	})
	.service('UserService', function($http, Restangular) {
		this.users = [];

		this.get = function(userId) {

			for (var i in this.users) {
				if (this.users[i]._id == userId) {
					return this.users[i];
				}
			}
			var promise = Restangular.one('people',userId).get().$object;
			promise._id = userId;
			this.users.push(promise);
			return promise;
		};
	})
	.service('CurrentUser', function($http,$auth, Restangular) {
		this.userId = null;
		this.reset = function() {
			this.userId = null;
		};
		if (this.userId === null) {
			$http.get('/api/me', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': $auth.getToken()
				}
			}).success(function(userId) {
				this.userId = userId;
				Restangular.one('people',JSON.parse(userId)).get().then(function(user) {
					this.user = user;
				}.bind(this));
			}.bind(this));
		}
	})
	.service('ESClient', function(esFactory) {
		return esFactory({
			host: 'http://127.0.0.1:8000',
			apiVersion: '1.2',
			log: 'trace'
		});
	})
	.factory('InfinitePosts', function($http, Restangular, $alert, $timeout) {
		var InfinitePosts = function(user_obj) {
			this.posts = [];
			this.user_obj = user_obj;
			this.busy = false;
			this.page = 1;
			this.end = false;

			this.user_obj.all('posts').getList({
				max_results: 10,
				page: this.page,
				sort: '[("_created",-1)]'
			}).then(function(posts) {
				if (posts.length < 10) {
					this.end = true;
				}
				this.posts.push.apply(this.posts, posts);
				this.page = this.page + 1;
				this.busy = false;
			}.bind(this));

		};

		InfinitePosts.prototype.addPost = function(content,similar_keywords) {

			this.user_obj.all('posts').post({
				author: this.user_obj._id,
				content: content,
				keywords: similar_keywords
			}).then(function(data) {
					this.posts.unshift({
					author: this.user_obj._id,
					content: content,
					_created: "a few seconds ago"
				});
				var myAlert = $alert({
					title: 'Successfully Posted! :)',
					placement: 'top',
					type: 'success',
					show: true
				});
				$timeout(function() {
					myAlert.hide();
				}, 5000);
			}.bind(this));
		};


		InfinitePosts.prototype.nextPage = function() {
			if (this.busy | this.end) return;
			this.busy = true;

			this.user_obj.all('posts').getList({
				max_results: 10,
				page: this.page,
				sort: '[("_created",-1)]'
			}).then(function(posts) {
				if (posts.length === 0) {
					this.end = true;
				}
				this.posts.push.apply(this.posts, posts);
				this.page = this.page + 1;
				this.busy = false;
			}.bind(this));



		};
		return InfinitePosts;
	}).factory('SearchActivity', function($http, Restangular, $alert, $timeout) {

		var SearchActivity = function(user_obj) {
			this.searchResult = [];
			this.user_obj = user_obj;
			this.user_obj.all('searchActivity').getList({
				sort: '[("_created",-1)]'
			}).then(function(sResult) {
				this.searchResult.push.apply(this.searchResult,sResult);
			}.bind(this));

		};


		SearchActivity.prototype.addSearchText = function(content,resultcount,resultIds,keywords) {
			this.user_obj.all('searchActivity').post({
				author: this.user_obj._id,
				content: content,
				keywords:keywords,
				totalResults:resultcount,
				matchedPosts:resultIds
			}).then(function(data) {
					this.searchResult.unshift({
					author: this.user_obj._id,
					content: content,
				});

			}.bind(this));
		};

		function combine_ids(ids) {
   				return (ids.length ? "\"" + ids.join("\",\"") + "\"" : "");
			}

		SearchActivity.prototype.getMatchedNewResults = function(searchPostId) {
			var params = '{"_id":"'+searchPostId+'"}';
			this.user_obj.all('searchActivity').getList({
				where :params,
				sort: '[("_created",-1)]'
			}).then(function(sResult) {
				console.log(sResult[0].matchedPosts);
				var param = '{"_id":{"$in":['+combine_ids(sResult[0].matchedPosts)+']}}';
				Restangular.all("posts").getList({
					where: param
				}).then(function(searchResults){
					console.log(searchResults)
				});
			}.bind(this));
		};


	return SearchActivity;
	}).factory('matchMeResults', function($http, Restangular, $alert, $timeout) {

		var  matchMeResults = function() {
			this.total_matches = '';
			this.searchresults = []
		};

		matchMeResults.prototype.getMatchResults = function(searchPostId) {
			var params = '{"_id":"'+searchPostId+'"}';
			this.user_obj.all('searchActivity').getList({
				where :params,
				sort: '[("_created",-1)]'
			}).then(function(sResult) {
				console.log(sResult[0].matchedPosts);
				var param = '{"_id":{"$in":['+combine_ids(sResult[0].matchedPosts)+']}}';
				Restangular.all("posts").getList({
					where: param
				}).then(function(searchResults){
					console.log(searchResults)
				});
			}.bind(this));
		};


		return matchMeResults;
	});