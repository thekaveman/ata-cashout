(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("cashoutCalculator", cashoutCalculator);

  function cashoutCalculator() {
    return {
      restrict: "E",
      templateUrl: "calculator/cashoutCalculator.html"
    };
  }
})();