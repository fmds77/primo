(function () {
	"use strict";
	'use strict';

	// Detect IE versions <= 10 and serve up an unsupported browser message
	var ua = window.navigator.userAgent;

	if (ua.indexOf('MSIE ') >= 0) {
		document.body.innerHTML =
			"<div id='unsupported-browser'>"
			+ "<h1>You're viewing the University Library in an unsupported browser</h1>"
			+ "<p>Rather than show you a page that may not work properly, we're showing you this."
			+ " We suggest using the latest versions of the following:</p>"
			+ "<ul><li>Google Chrome</li><li>Mozilla Firefox</li><li>Apple Safari</li>"
			+ "<li>Microsoft IE 11 or Edge</li></ul>"
			+ "<p>This page should work in full featured mobile browsers.</p></div>";

		return;
	}

	var app = angular.module('viewCustom', ['angularLoad'], function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
	});

	/****************************************************************************************************/
	/*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/
	/*var app = angular.module('centralCustom', ['angularLoad']);*/
	/****************************************************************************************************/

	// Load Altmetrics and Syndetics
	app.controller('FullViewAfterController', ['angularLoad', function (angularLoad) {

			self = this;

			this.$onInit = function () {

				// Try to load the Altmetrics script and grab the DOI of this
				// item. Disregard any errors so we can still try to load the
				// Syndetics information
				try {
					this.doi = this.parentCtrl.item.pnx.addata.doi[0] || '';
					angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now());
				} catch (error) {
					/* Empty */
				}

				// Syndetics information loading
				// Grab the long property chain in a nice variable
				var data = self.parentCtrl.item.pnx.search;

				// Populate the metadata object
				var _metadata = {
					'isbn'	: data.isbn[0],
					'title'	: data.title[0],
					'author': data.creatorcontrib[0],
					'id'	: data.recordid[0]
				};

				if (self.parentCtrl.item.delivery.bestlocation
					&& self.parentCtrl.item.delivery.bestlocation.callNumber) {

					_metadata.callnumber = self.parentCtrl.item.delivery
											.bestlocation.callNumber;
				}

				// Load the Syndetics script
				angularLoad.loadScript('https://unbound.syndetics.com/syndeticsunbound/connector/initiator.php?a_id=202&i_id=').then(function () {

					if (typeof LibraryThingConnector !== 'undefined') {
						LibraryThingConnector.runUnboundWithMetadata(_metadata);
					}
				});

			};

	}]);

	// Insert the Altmetrics widget into the page
	app.component('prmFullViewAfter', {
		bindings: { parentCtrl: '<' },
		controller: 'FullViewAfterController',
		template: '<div class="full-view-section loc-altmetrics" flex-md="65" flex-lg="65" flex-xl="65" flex><div class="layout-full-width full-view-section-content" ng-if="$ctrl.doi"><div class="section-header" layout="row" layout-align="center center"><h2 class="section-title md-title light-text">AltMetrics</h2><md-divider flex></md-divider></div><div class="full-view-section"><div class="full-view-section-content"><div class="section-body" layout="row" layout-align="center center"><div class="spaced-rows" layout="column"><div ng-if="$ctrl.doi" class="altmetric-embed" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}"></div></div></div></div></div></div></div>'
	});

	// Dynamically load the chat widget script
	var script = document.createElement("script"); // Create a script element
	script.src = "https://v2.libanswers.com/load_chat.php?hash=ea89a9251e2ffa561d8e935d8c60a3f3";
	document.head.appendChild(script); // Add it to the head of the page

	// Add chat widget markup to the prm-explore-main-after directive
	app.component('prmExploreMainAfter', {
		bindings: { parentCtrl: '<' },
		//template: "<div class='libchat-popup'><p>Chat with our online librarian</p><div id='libchat_ea89a9251e2ffa561d8e935d8c60a3f3'></div></div>"
		template: "<div class='libchat-popup'><div id='libchat_ea89a9251e2ffa561d8e935d8c60a3f3'></div></div>"
	});

	// Remove 'tabs' from auto suggestions in simple search
	app.component('prmSearchBarAfter', {
		bindings: { parentCtrl: '<' },

		controller: function ($scope) {
			$scope.$parent.$ctrl.tabs = [];
		}
	});

	// Automatically activate search after changing search scope
	// (reload results with changed search scope)
	app.component('prmTabsAndScopesSelectorAfter', {
		bindings: { parentCtrl: '<' },

		controller: function ($scope) {

			setTimeout(function () {

				var searchScopes = document.querySelectorAll('[id^="select_option_"]');

				// Grab the search button in a variable so we don't have to keep
				// getting it in the loop
				var searchButton =
					document.getElementsByClassName(
						"zero-margin"
						+ " button-confirm"
						+ " md-button"
						+ " md-primoExplore-theme"
					)[0];

				// Loop over each drop down element and add a click handler that
				// clicks the search button
				for (var i in searchScopes) {
					if (searchScopes.hasOwnProperty(i)) {

						searchScopes[i].addEventListener("click", function () {
							// setTimeout is needed to allow the dropdown to
							// actually change its value before searching
							setTimeout(function () { searchButton.click() }, 50);
						});
					}
				}
			}, 300)
		}
	});

})();
