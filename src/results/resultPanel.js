(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("resultPanel", resultPanel)
      .controller("ResultPanelController", ["$scope", ResultPanelController]);

  function resultPanel() {
    return {
      restrict: "E",
      scope: {
        result: "=",
      },
      controller: "ResultPanelController",
      templateUrl: "results/resultPanel.html"
    };
  }

  function ResultPanelController($scope) {
    $scope.cols = {
      cashable: {
        class: function() { return "col-md-" + $scope.cols.cashable.number(); },
        number: function() { return $scope.result.noncashable > 0 ? 5 : 8; }
      },
      noncashable: {
        class: function() { return $scope.cols.noncashable.number() > 0 ? "col-md-" + $scope.cols.noncashable.number() : null; },
        number: function() { return $scope.result.noncashable > 0 ? 12 - $scope.cols.cashable.number() : 0; }
      }
    };
  }
})();