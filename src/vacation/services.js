(function () {
  "use strict";

  angular
    .module("ataCashout.vacation")
      .factory("VacationCashoutAmounts", VacationCashoutAmounts)
      .factory("VacationCashout", ["DayHours", "Members", "VacationCashoutAmounts", VacationCashoutFactory]);

  function VacationCashoutAmounts() {
    return [{
      minYears: 0,
      maxYears: 9,
      amount: 40
    },{
      minYears: 10,
      maxYears: 14,
      amount: 60
   },{
      minYears: 15,
      maxYears: Number.MAX_VALUE,
      amount: 80
   }];
  }

  function VacationCashoutFactory(hours, members, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var wholeHours = hours.toHours(hours.toWholeDays(member.accrued.vacation));
      var amount = findAmount(member.serviceYears);
      var cashable = wholeHours <= amount ? wholeHours : amount;
      var diff = member.accrued.vacation - cashable;

      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        diff: diff,
        config: {
          heading: "Vacation",
          id: "vacation",
          nonCashable: {
            show: diff > 0,
            type: "bank"
          }
        }
      };
    }

    function findAmount(years) {
      var filtered = amounts.filter(function(amt) {
        return amt.minYears <= years && years <= amt.maxYears;
      });

      if(filtered.length == 1) {
        return filtered[0].amount;
      }

      return 0;
    }
  }
})();