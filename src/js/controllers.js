(function () {
  "use strict";

  angular
    .module("ataCashout")
    .controller("CalculatorController", [
      "$scope",
      "SickCashout",
      "VacationCashout",
      "HolidayCashout",
      "PersonalCashout",
      CalculatorController
    ]);

  function CalculatorController($scope, sickCashout, vacationCashout, holidayCashout, personalCashout) {
    $scope.member = { accrued: {} };
    $scope.result = { ready: false };
    $scope.calc = {
      go: go,
      reset: reset
    };

    $scope.$watch(function() { return $scope.member.accrued; }, watcher, true);

    function go() {
      var m = $scope.member;
      $scope.result = {
        sick: sickCashout.evaluate(m),
        vacation: vacationCashout.evaluate(m),
        holiday: holidayCashout.evaluate(m),
        personal: personalCashout.evaluate(m),
        ready: true
      };
    }

    function reset() {
      $scope.member = { accrued: {} };
      $scope.result = { ready: false };
    }

    function watcher(newVal, oldVal) {
      if(newVal !== oldVal)
        go();
    }
  }
})();
