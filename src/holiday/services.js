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
      var cashable = Math.min(member.accrued.holiday, cashableHours);
      var diff = member.accrued.holiday - cashable;

      return {
        accrued: member.accrued.holiday,
        cashable: cashable,
        lost: diff,
        notes: {
          cashable: [{
            show: member.accrued.holiday >= cashableHours,
            text: "Maximum " + cashableHours + " Holiday / Floating Holiday hours are cashable"
          }]
        },
        panel: {
          heading: "Holiday / Floating Holiday",
          id: "holiday",
        }
      };
    }
  }
})();