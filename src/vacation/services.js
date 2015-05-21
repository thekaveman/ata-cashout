(function () {
  "use strict";

  angular
    .module("ataCashout.vacation")
      .factory("VacationCashout", ["DayHours", "Members", VacationCashoutFactory]);

  function VacationCashoutFactory(hours, members) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = hours.toHours(hours.toWholeDays(member.accrued.vacation));
      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        diff: member.accrued.vacation - cashable
      };
    }
  }
})();