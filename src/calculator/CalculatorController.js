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
      $scope.resultPanelConfigs.push(config);
    });
    function go() {
      var m = $scope.member.current;

      resetResultConfigs();

      $scope.member.result = {
        holiday: holidayCashout.evaluate(m),
        personal: personalCashout.evaluate(m),
        sick: sickCashout.evaluate(m),
        vacation: vacationCashout.evaluate(m),
        ready: true
      };

      angular.forEach($scope.resultPanelConfigs, function(config) {
        config.member = $scope.member.current;
        config.result = $scope.member.result[config.id];
      });
    }

    function reset() {
      $scope.member = {
        current: { accrued: {} },
        result: { ready: false }
      };
      resetResultConfigs();
      $scope.$broadcast("reset");
    }

    function resetResultConfigs() {
      $scope.resultPanelConfigs = [];
    }
  }
})();