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
      results: []
    };

    function go() {
      $scope.member.results = [];

      var m = $scope.member.current;

      var results = [
        holidayCashout.evaluate(m),
        personalCashout.evaluate(m),
        sickCashout.evaluate(m),
        vacationCashout.evaluate(m),
      ];

      angular.forEach(results, function(result) {
        result.member = $scope.member.current;
        $scope.member.results.push(result);
      });
    }

    function reset() {
      $scope.member = {
        current: { accrued: {} },
        results: []
      };
      $scope.$broadcast("reset");
    }

    function ready() {
      return $scope.member.results.length > 0;
    }
  }
})();
