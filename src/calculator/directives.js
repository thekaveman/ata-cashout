(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("cashoutCalculator", cashoutCalculator)
      .directive("resultWrapper", resultWrapper);

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

  function resultWrapper() {
    return {
      restrict: "E",
      scope: {
        heading: "@",
        member: "=",
        result: "="
      },
      transclude: true,
      templateUrl: "calculator/resultWrapper.html"
    };
  }
})();