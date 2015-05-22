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
      reset: reset
    };

    $scope.member = {
      current: { accrued: {} },
      result: { ready: false }
    };

    $scope.resultPanelConfigs = [];

    $scope.$on("resultPanelConfig", function(event, config) {
      config.member = $scope.member.current;
      config.result = $scope.member.result[config.id];
      $scope.resultPanelConfigs.push(config);
    });
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

      $scope.$broadcast("reset");
    }
  }
})();