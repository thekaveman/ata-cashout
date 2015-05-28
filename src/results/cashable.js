(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("cashable", cashable)
      .controller("CashableController", ["$scope", "numberFilter", CashableController]);

  function cashable() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "CashableController",
      templateUrl: "results/cashable.html"
    };
  }

  function CashableController($scope, numberFilter) {

    $scope.hours = function() {
      return $scope.result.cashable;
    }

    $scope.amount = function() {
      return numberFilter($scope.hours() * $scope.result.member.payRate, 2);
    }

    $scope.notes = function() {
      var notes = $scope.result.notes;
      return notes.cashable ? notes.cashable.filter(function(n) {
        return n.show;
      }) : [];
    };

    $scope.show = {
      hours: function() {
        return $scope.hours() > 0;
      },
      notes: function() {
        return $scope.notes().length > 0;
      }
    };
  }
})();