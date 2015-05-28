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
        banked: 0,
        cashable: 0,
        lost: 0,
        member: $scope.member.current
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
        
        $scope.member.totals.banked += (result.banked || 0);
        $scope.member.totals.cashable += (result.cashable || 0);
        $scope.member.totals.lost += (result.lost || 0);
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
