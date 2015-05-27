(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("totalsPanel", totalsPanel)
      .controller("TotalsPanelController", ["$scope", TotalsPanelController]);

  function totalsPanel() {
    return {
      restrict: "E",
      scope: {
        results: "=",
      },
      controller: "TotalsPanelController",
      templateUrl: "results/totalsPanel.html"
    };
  }

  function TotalsPanelController($scope) {
    $scope.hours = {
      cashable: function() {
        if($scope.results && $scope.results.length > 0) {
          return $scope.results.reduce(function(prev, curr) {
            if(curr.cashable) {
              prev += curr.cashable;
            }
          }, 0);
        }
        return 0;
      }
    };
  }
})();