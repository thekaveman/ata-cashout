(function () {
  "use strict";

  angular
    .module("ataCashout.holiday")
      .value("CashableHolidayHours", 8)
      .factory("HolidayCashout", ["Members", "CashableHolidayHours", "HolidayNonCashoutRule", HolidayCashoutFactory])
      .factory("HolidayNonCashoutRule", HolidayNonCashoutRuleFactory);

  function HolidayCashoutFactory(members, cashableHours, rule) {
    return {
      evaluate: evaluate,
      nonCashableRule: rule
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = member.accrued.holiday < cashableHours
                   ? member.accrued.holiday
                   : cashableHours;
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