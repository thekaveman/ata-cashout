(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("totalsPanel", totalsPanel)
      .controller("TotalsPanelController", ["$scope", "numberFilter", TotalsPanelController]);

  function totalsPanel() {
    return {
      restrict: "E",
      scope: {
        member: "=",
        totals: "=",
      },
      controller: "TotalsPanelController",
      templateUrl: "results/totalsPanel.html"
    };
  }

  function TotalsPanelController($scope, numberFilter) {
    $scope.hours = {
      cashable: function() {
        if($scope.totals && $scope.totals.cashable) {
          return $scope.totals.cashable;
        }
        return 0;
      }
    };

    $scope.amounts = {
      cashable: function() {
        return numberFilter($scope.hours.cashable() * $scope.member.payRate, 2);
      }
    }
  }
})();