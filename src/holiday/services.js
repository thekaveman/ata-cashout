(function () {
  "use strict";

  angular
    .module("ataCashout.holiday", ["ataCashout.common"])
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
      return {
        accrued: member.accrued.holiday,
        cashable: cashable,
        diff: member.accrued.holiday - cashable
      };
    }
  }
})();
