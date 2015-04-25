(function () {
  "use strict";

  angular
    .module("ataCashout.personal", ["ataCashout.common"])
      .value("ProfessionalIncentiveHours", 8)
      .factory("PersonalCashoutAmounts", ["DayHours", "ProfessionalIncentiveHours", PersonalCashoutAmounts])
      .factory("PersonalCashout", ["Members", "PersonalCashoutAmounts", PersonalCashoutFactory]);

  function PersonalCashoutAmounts(dayHours, incentive) {
    var base = {
      cashable: dayHours.toHours(5),
      carryover: dayHours.toHours(3),
    };

    return [{
      minYears: 0,
      maxYears: 14,
      amounts: base
    },{
      minYears: 15,
      maxYears: Number.MAX_VALUE,
      amounts: angular.extend({}, base, { cashable: base.cashable + incentive })
    }];
  }

  function PersonalCashoutFactory(members, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);
      var result = getAmounts(member.serviceYears);
      return {
        accrued: {
          personal: member.accrued.personal,
          personalBank: member.accrued.personalBank
        },
        carryover: result.carryover || 0,
        cashable: result.cashable || 0,
        diff: computeDiff(member.accrued.personal, member.accrued.personalBank, result.cashable)
      };
    }

    function getAmounts(serviceYears) {
      for(var i = 0; i < amounts.length; i++) {
        if(amounts[i].minYears <= serviceYears && serviceYears <= amounts[i].maxYears) {
          return amounts[i].amounts;
        }
      }
      return {};
    }

    function computeDiff(personal, personalBank, cashable) {
      var moreCashable = personal < cashable;
      return {
          personal: moreCashable ? 0 : personal - cashable,
          personalBank: moreCashable ? (personal + personalBank) - cashable
                                     : personalBank
        };
    }
  }
})();
