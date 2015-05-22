(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("cashoutCalculator", cashoutCalculator);

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
})();