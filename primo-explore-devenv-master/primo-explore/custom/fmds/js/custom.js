(function () {
    "use strict";
    'use strict';

    var app = angular.module('viewCustom', ['angularLoad'], function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    });

})();
