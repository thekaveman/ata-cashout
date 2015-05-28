(function () {
  "use strict";

  angular
    .module("ataCashout.personal")
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

      var cashable = Math.min(result.cashable, member.accrued.personal),
          noncashable = Math.min(result.carryover, member.accrued.personal - cashable),
          loss = member.accrued.personal - cashable - noncashable;

      return {
        accrued: member.accrued.personal,
        banked: noncashable,
        cashable: cashable,
        lost: loss,
        notes: {
          cashable: [{
            show: member.accrued.personal >= result.cashable,
            text: "Maximum "+result.cashable+" cashable Personal Leave hours",
          }],
          banked: [{
            show: loss > 0,
            text: "Maximum "+result.carryover+" Personal Leave hours carryover"
          }]
        },
        panel: {
          heading: "Personal Leave",
          id: "personal"
        }
      };
    }

    function getAmounts(serviceYears) {
      var amt = {
        cashable: 0,
        carryover: 0
      };
      for(var i = 0; i < amounts.length; i++) {
        if(amounts[i].minYears <= serviceYears && serviceYears <= amounts[i].maxYears) {
          amt = amounts[i].amounts;
          break;
        }
      }
      return amt;
    }
  }
})();