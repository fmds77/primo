// syndetics

(function ()
	{
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

	app.component('prmFullViewAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'FullViewAfterControllerUnbound',
		template: ''
	});
	
	app.controller('FullViewAfterControllerUnbound', ['angularLoad', function (angularLoad)
		{
		var vm = this;

		vm.$onInit = function ()
			{
			angularLoad.loadScript('https://unbound.syndetics.com/syndeticsunbound/connector/initiator.php?a_id=202&i_id=').then(function ()
			{
			if (typeof LibraryThingConnector !== 'undefined')
				{
				var _isbn = '';
				var _title = '';
				var _author = '';
				var _id = '';
				var _callnumber = '';
				if ( vm.parentCtrl.item.pnx.search.isbn )
					{
					_isbn = vm.parentCtrl.item.pnx.search.isbn[0] || '';
					}
				if ( vm.parentCtrl.item.pnx.search.title )
					{
					_title = vm.parentCtrl.item.pnx.search.title[0] || '';
					}
				if ( vm.parentCtrl.item.pnx.search.creatorcontrib )
					{
					_author = vm.parentCtrl.item.pnx.search.creatorcontrib[0] || '';
					}
				if ( vm.parentCtrl.item.pnx.search.recordid )
					{
					_id = vm.parentCtrl.item.pnx.search.recordid[0] || '';
					}
				if ( vm.parentCtrl.item.delivery.bestlocation && vm.parentCtrl.item.delivery.bestlocation.callNumber)
					{
					_callnumber = vm.parentCtrl.item.delivery.bestlocation.callNumber || '';
					}

				var _metadata = {
					'isbn': _isbn,
					'title': _title,
					'author': _author,
					'id': _id,
					'callnumber' : _callnumber
				};
				LibraryThingConnector.runUnboundWithMetadata(_metadata);
				}
			});
			};
		}]);

	// Hook window open functionality so we can catch when a new
	// window is opened (and if it's libchat, resize it)
	window.myOpen = window.open;

	window.open = function () {

		var win = window.myOpen.apply(this, arguments);

		if (win.name === "libchat") {

			win.resizeTo(400, 500);
		}
	};

	// Dynamically load the chat widget script
	var script = document.createElement("script"); // Create a script element
	script.src = "https://v2.libanswers.com/load_chat.php?hash=ea89a9251e2ffa561d8e935d8c60a3f3";
	//script.src = "https://v2.libanswers.com/load_chat.php?hash=1a0d766d385e8ead60a389e759268750"; //Set it's src to the url
	document.head.appendChild(script); // Add it to the head of the page

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


