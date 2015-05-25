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
        var cashableCols = scope.result.noncashable > 0 ? 5 : 8;
        var noncashableCols = 12 - cashableCols;
        scope.cashableCols = "col-md-" + cashableCols;
        scope.noncashableCols = noncashableCols > 0 ? "col-md-" + noncashableCols : null;
      },
      templateUrl: "results/resultPanel.html"
    };
  }
})();