(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .controller("CalculatorController", [
        "$scope",
        "HolidayCashout",
        "PersonalCashout",
        "SickCashout",
        "VacationCashout",
        CalculatorController
      ]);

  function CalculatorController($scope, holidayCashout, personalCashout, sickCashout, vacationCashout) {
    $scope.calc = {
      go: go,
      ready: ready,
      reset: reset
    };

    $scope.member = {
      current: { accrued: {} },
    };

    $scope.results = [];

    function go() {
      $scope.results = [];

      var m = $scope.member.current;

      var results = [
        holidayCashout.evaluate(m),
        personalCashout.evaluate(m),
        sickCashout.evaluate(m),
        vacationCashout.evaluate(m),
      ];

      angular.forEach(results, function(result) {
        result.member = $scope.member.current;
        $scope.results.push(result);
      });
    }

    function reset() {
      $scope.member = {
        current: { accrued: {} },
        result: {}
      };
      $scope.results = [];
      $scope.$broadcast("reset");
    }

    function ready() {
      return $scope.results.length > 0;
    }
  }
})();