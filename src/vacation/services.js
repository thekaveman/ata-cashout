(function () {
  "use strict";

  angular
    .module("ataCashout.vacation")
      .factory("VacationCashout", ["Members", "DayHours", VacationCashoutFactory]);

  function VacationCashoutFactory(members, dayHours) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = dayHours.toHours(dayHours.toWholeDays(member.accrued.vacation));
      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        diff: member.accrued.vacation - cashable
      };
    }
  }
})();
