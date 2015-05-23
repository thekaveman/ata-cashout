(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("resultPanel", resultPanel);

  function resultPanel() {
    return {
      restrict: "E",
      scope: {
        result: "=",
      },
      link: function(scope, element, attrs) {
        console.log(scope.result);
        var cashableCols = scope.result.diff > 0 ? 5 : 8;
        var nonCashableCols = 12 - cashableCols;
        scope.cashableCols = "col-md-" + cashableCols;
        scope.nonCashableCols = nonCashableCols > 0 ? "col-md-" + nonCashableCols : null;
      },
      templateUrl: "results/resultPanel.html"
    };
  }
})();