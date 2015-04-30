(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("resultsPanel", resultsPanel);

  function resultsPanel() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      templateUrl: "calculator/resultsPanel.html"
    };
  }

})();
