(function () {
  "use strict";

  angular
    .module("ataCashout.holiday")
      .value("CashableHolidayHours", 8)
      .factory("HolidayCashout", [
        "$rootScope",
        "Members",
        "CashableHolidayHours",
        "HolidayNonCashoutRule",
        "resultPanelConfig",
        HolidayCashoutFactory
      ])
      .factory("HolidayNonCashoutRule", HolidayNonCashoutRuleFactory);

  function HolidayCashoutFactory($rootScope, members, cashableHours, rule, resultPanelConfig) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = member.accrued.holiday < cashableHours
                   ? member.accrued.holiday
                   : cashableHours;

      $rootScope.$broadcast("resultPanelConfig", resultPanelConfig.new({
        id: "holiday",
        heading: "Holiday / Floating Holiday",
        nonCashableRule: rule,
      }));

      return {
        accrued: member.accrued.holiday,
        cashable: cashable,
        diff: member.accrued.holiday - cashable
      };
    }
  }

  function HolidayNonCashoutRuleFactory() {
    return {
      detail: "lost at end of fiscal year",
      show: show,
      type: "alert"
    };

    function show(result) {
      try {
        return result.diff > 0;
      }
      catch (ex) {
        return false;
      }
    }
  }
})();