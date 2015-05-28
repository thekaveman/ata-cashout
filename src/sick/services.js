(function () {
  "use strict";

  angular
    .module("ataCashout.sick")
      .factory("SickCashoutAmounts", SickCashoutAmounts)
      .factory("SickCashoutBank", ["DayHours", SickCashoutBank])
      .factory("SickCashout", [
        "DayHours",
        "Members",
        "SickCashoutAmounts",
        "SickCashoutBank",
        SickCashoutFactory
      ]);

  function SickCashoutAmounts() {
    //the 'amounts' arrays below
    //represent cashable days
    //indexed by used days
    return [{
      minYears: 1,
      maxYears: 9,
      days: [6,6,6,5,4,3,2,1]
    },{
      minYears: 10,
      maxYears: Number.MAX_VALUE,
      days: [12,12,12,11,10,9,8,7,6,5,4,3,2,1]
   }];
  }

  function SickCashoutBank(hours) {
    return {
      minBalance: hours.toHours(12)
    };
  }

  function SickCashoutFactory(hours, members, amounts, bank) {
    return {
      evaluate: evaluate,
    };

    function evaluate(member) {
      member = members.initialize(member);
      var cashable = member.accrued.sick < bank.minBalance
                   ? 0
                   : getCashableHours(member.serviceYears, member.used.sick);

      var diff = member.accrued.sick - cashable;

      return {
        accrued: member.accrued.sick,
        cashable: Math.min(cashable, member.accrued.sick),
        banked: diff,
        notes: {
          cashable: [{
            show: member.accrued.sick < bank.minBalance,
            text: "Minimum "+bank.minBalance+" hour balance to cash out.",
          },{
            show: member.serviceYears > 0 && member.accrued.sick >= bank.minBalance && member.accrued.sick >= cashable,
            text: "Maximum "+cashable+ " cashable Sick hours",
          },{
            show: member.serviceYears < minYears(),
            text: "Must have at least "+minYears()+" service year"
          }]
        },
        panel: {
          heading: "Sick",
          id: "sick",
        }
      };
    }

    function getCashableHours(serviceYears, usedHours) {
      var cashable = 0;
      for (var i = 0; i < amounts.length; i++) {
        if(amounts[i].minYears <= serviceYears && serviceYears <= amounts[i].maxYears) {
          cashable = findAmount(amounts[i].days, usedHours);
          break;
        }
      }
      return cashable;
    }

    function findAmount(days, usedHours) {
      var usedDays = hours.toWholeDays(usedHours);
      if (usedDays < days.length) {
        var cashableDays = days[usedDays];
        return hours.toHours(cashableDays);
      }
      return 0;
    }

    function minYears() {
      var min = amounts[0].minYears;
      for(var i = 1; i < amounts.length; i++) {
        if(amounts[i].minYears < min)
          min = amounts[i].minYears;
      }
      return min;
    }
  }
})();