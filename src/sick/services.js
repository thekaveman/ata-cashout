(function () {
  "use strict";

  angular
    .module("ataCashout.sick", ["ataCashout.common"])
      .factory("SickCashoutAmounts", SickCashoutAmounts)
      .factory("SickCashout", ["Members", "DayHours", "SickCashoutAmounts", SickCashoutFactory]);

  function SickCashoutAmounts() {
    return [{
      minYears: 0,
      maxYears: 9,
      amounts: [6,6,6,5,4,3,2,1]
    },{
      minYears: 10,
      maxYears: Number.MAX_VALUE,
      amounts: [12,12,12,11,10,9,8,7,6,5,4,3,2,1]
   }];
  }

  function SickCashoutFactory(members, dayHours, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = member.accrued.sick < 12
                   ? 0
                   : getCashableHours(member.serviceYears, member.used.sick);
      return {
        accrued: member.accrued.sick,
        cashable: cashable,
        diff: member.accrued.sick - cashable
      };
    }

    function getCashableHours(serviceYears, usedHours) {
      var cashable = 0;
      for (var i = 0; i < amounts.length; i++) {
        if(amounts[i].minYears <= serviceYears && serviceYears <= amounts[i].maxYears) {
          cashable = findAmount(amounts[i].amounts, usedHours);
          break;
        }
      }
      return cashable;
    }

    function findAmount(amounts, usedHours) {
      var usedDays = dayHours.toWholeDays(usedHours);
      if (usedDays < amounts.length) {
        var cashableDays = amounts[usedDays];
        return dayHours.toHours(cashableDays);
      }
      return 0;
    }
  }
})();
