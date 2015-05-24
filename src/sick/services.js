(function () {
  "use strict";

  angular
    .module("ataCashout.sick")
      .factory("SickCashoutAmounts", SickCashoutAmounts)
      .factory("SickCashoutBank", SickCashoutBank)
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
      amounts: [6,6,6,5,4,3,2,1]
    },{
      minYears: 10,
      maxYears: Number.MAX_VALUE,
      amounts: [12,12,12,11,10,9,8,7,6,5,4,3,2,1]
   }];
  }

  function SickCashoutBank() {
    return {
      minBalance: 12
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
        cashable: cashable,
        noncashable: diff,
        config: {
          heading: "Sick",
          id: "sick",
          noncashable: {
            show: diff > 0,
            type: "bank"
          }
        }
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
      var usedDays = hours.toWholeDays(usedHours);
      if (usedDays < amounts.length) {
        var cashableDays = amounts[usedDays];
        return hours.toHours(cashableDays);
      }
      return 0;
    }
  }
})();