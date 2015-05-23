(function () {
  "use strict";

  angular
    .module("ataCashout.holiday")
      .value("CashableHolidayHours", 8)
      .factory("HolidayCashout", ["Members", "CashableHolidayHours", HolidayCashoutFactory]);

  function HolidayCashoutFactory(members, cashableHours) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = member.accrued.holiday < cashableHours
                   ? member.accrued.holiday
                   : cashableHours;

      var diff = member.accrued.holiday - cashable;

      return {
        accrued: member.accrued.holiday,
        cashable: cashable,
        diff: diff,
        config: {
          heading: "Holiday / Floating Holiday",
          id: "holiday",
          nonCashable: {
            show: diff > 0,
            type: "loss"
          }
        }
      };
    }
  }
})();