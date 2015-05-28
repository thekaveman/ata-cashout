(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("banked", banked)
      .controller("BankedController", ["$scope", "numberFilter", BankedController]);

  function banked() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "BankedController",
      templateUrl: "results/banked.html"
    };
  }

  function BankedController($scope, numberFilter) {

    $scope.hours = function() {
      return $scope.result.banked;
    };

    $scope.amount = function() {
      return numberFilter($scope.hours() * $scope.result.member.payRate, 2);
    };

    $scope.notes = function() {
      var notes = $scope.result.notes;
      return notes.banked ? notes.banked.filter(function(n) {
        return n.show;
      }) : [];
    };

    $scope.show = {
      banked: function() {
        return $scope.hours() > 0;
      },
      notes: function() {
        return $scope.notes().length > 0;
      },
    };
  }
})();