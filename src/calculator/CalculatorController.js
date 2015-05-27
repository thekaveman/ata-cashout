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
      results: [],
      totals: {}
    };

    function go() {
      $scope.member.results = [];
      $scope.member.totals = {
        cashable: 0,
        loss: 0,
        member: $scope.member.current,
        noncashable: 0,
      };

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
        $scope.member.totals.cashable += (result.cashable || 0);
        $scope.member.totals.noncashable += (result.noncashable || 0);
        $scope.member.totals.loss += (result.loss || 0);
      });
    }

    function ready() {
      return $scope.member.results.length > 0;
    }

    function reset() {
      $scope.member = {
        current: { accrued: {} },
        results: [],
        totals: {}
      };
      $scope.$broadcast("reset");
    }
  }
})();
