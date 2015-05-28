(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .directive("introPanel", cashoutCalculator);

  function cashoutCalculator() {
    return {
      restrict: "E",
      templateUrl: "calculator/introPanel.html"
    };
  }
})();