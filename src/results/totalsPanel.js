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
        member: "=",
        totals: "=",
      },
      controller: "TotalsPanelController",
      templateUrl: "results/totalsPanel.html"
    };
  }

  function TotalsPanelController($scope) {
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
        return $scope.hours.cashable() * $scope.member.payRate;
      }
    }
  }
})();