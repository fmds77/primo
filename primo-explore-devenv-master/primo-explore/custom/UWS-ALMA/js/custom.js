// libchat widget

(function () {
    "use strict";
    'use strict';

    var app = angular.module('viewCustom', ['angularLoad'], function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    });

    // Dynamically load the chat widget script
    var script = document.createElement("script"); // Create a script element
    script.src = "http://v2.libanswers.com/load_chat.php?hash=1a0d766d385e8ead60a389e759268750"; //Set it's src to the url
    document.head.appendChild(script); // Add it to the head of the page
	
	// Dynamically load the chat widget script
    var script = document.createElement("script"); // Create a script element
    script.src = "https://v2.libanswers.com/load_chat.php?hash=ea89a9251e2ffa561d8e935d8c60a3f3"; //Set it's src to the url
    document.head.appendChild(script); // Add it to the head of the page

})();


// syndetics

(function ()
	{
	"use strict";
	'use strict';


	var app = angular.module('viewCustom', ['angularLoad']);

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
	})();


