(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("cashoutCalculator", cashoutCalculator)
      .directive("resultsPanel", resultsPanel);

  function cashoutCalculator() {
    return {
      restrict: "E",
      scope: {
        jobs: "=",
        member: "=",
        result: "="
      },
      templateUrl: "calculator/cashoutCalculator.html"
    };
  }

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
