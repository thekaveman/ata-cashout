(function () {
  "use strict";

  angular
    .module("ataCashout.calculator", [
      "ataCashout.holiday",
      "ataCashout.personal",
      "ataCashout.sick",
      "ataCashout.vacation",
    ]).controller("CalculatorController", [
      "$scope",
      "HolidayCashout",
      "PersonalCashout",
      "SickCashout",
      "VacationCashout",
      CalculatorController
    ]);

  function CalculatorController($scope, holidayCashout, personalCashout, sickCashout, vacationCashout) {
    $scope.member = {
      current: { accrued: {} },
      result: { ready: false }
    };
    $scope.calc = {
      go: go,
      reset: reset
    };

    function go() {
      var m = $scope.member.current;
      $scope.member.result = {
        holiday: holidayCashout.evaluate(m),
        personal: personalCashout.evaluate(m),
        sick: sickCashout.evaluate(m),
        vacation: vacationCashout.evaluate(m),
        ready: true
      };
    }

    function reset() {
      $scope.member = {
        current: { accrued: {} },
        result: { ready: false }
      };
    }
  }
})();
