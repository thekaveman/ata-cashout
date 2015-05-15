(function () {
  "use strict";

  angular
    .module("ataCashout.calculator")
      .controller("CalculatorController", [
        "$scope",
        "FiscalYears",
        "JobClasses",
        "HolidayCashout",
        "PersonalCashout",
        "SickCashout",
        "VacationCashout",
        CalculatorController
      ]);

  function CalculatorController($scope, fy, jobs, holidayCashout, personalCashout, sickCashout, vacationCashout) {
    $scope.calc = {
      go: go,
      reset: reset
    };

    $scope.jobs = [];

    $scope.member = {
      current: { accrued: {} },
      result: { ready: false }
    };

    fy.findClosest().then(
      function(closest) {
        jobs.getAll(closest.name).then(
          function(jobClasses) {
            $scope.jobs = jobClasses;
          }
        );
      }
    );

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
