(function () {
  "use strict";

  angular
    .module("ataCashout.results")
      .directive("noncashable", noncashable)
      .controller("noncashableController", ["$scope", noncashableController]);

  function noncashable() {
    return {
      restrict: "E",
      scope: {
        member: "=",
        result: "=",
        rule: "="
      },
      controller: "noncashableController",
      templateUrl: "results/noncashable.html"
    };
  }

  function noncashableController($scope) {
    $scope.showDetail = function() {
      return $scope.rule.detail && $scope.rule.detail.length > 0;
    };

    $scope.icon = function() {
      return "glyphicon-" + $scope.rule.type;
    };
  }
})();