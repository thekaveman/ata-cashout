(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("lost", lost)
      .controller("LostController", ["$scope", "numberFilter", LostController]);

  function lost() {
    return {
      restrict: "E",
      scope: {
        result: "="
      },
      controller: "LostController",
      templateUrl: "results/lost.html"
    };
  }

  function LostController($scope, numberFilter) {
    $scope.hours = function() {
      return $scope.result.lost || 0;
    };

    $scope.amount = function() {
      return numberFilter($scope.hours() * $scope.result.member.payRate, 2);
    };

    $scope.notes = function() {
      var notes = $scope.result.notes;
      return notes.lost ? notes.lost.filter(function(n) {
        return n.show;
      }) : [];
    };

    $scope.show = {
      lost: function() {
        return $scope.hours() > 0;
      },
      notes: function() {
        return $scope.notes().length > 0;
      },
    };
  }
})();