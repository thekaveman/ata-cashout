(function () {
  "use strict";

  angular
    .module("ataCashout.vacation")
      .factory("VacationCashoutAmounts", VacationCashoutAmounts)
      .factory("VacationCashoutElection", VacationCashoutElection)
      .factory("VacationCashout", ["DayHours", "Members", "VacationCashoutAmounts", "VacationCashoutElection", VacationCashoutFactory]);

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

  function VacationCashoutElection() {
    //0-based month
    return {
      deadline: {
        month: 11,
        day: 31
      },
      paydate: {
        month: 6,
        day: 1
      }
    };
  }

  function VacationCashoutFactory(hours, members, amounts, election) {
    return {
      evaluate: evaluate
    };

    var formatOpts = { month: "2-digit", day: "2-digit", year: "2-digit" };

    function evaluate(member) {
      member = members.initialize(member);
      var amount = findAmount(member.serviceYears);
      var cashable = Math.min(amount, member.accrued.vacation);
      var diff = member.accrued.vacation - cashable;

      var thisYear = new Date().getFullYear();
      var deadline = new Date(thisYear, election.deadline.month, election.deadline.day).toLocaleDateString("en-US", formatOpts);
      var paydate = new Date(thisYear + 1, election.paydate.month, election.paydate.day).toLocaleDateString("en-US", formatOpts);

      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        banked: diff,
        notes: {
          cashable: [{
            show: member.accrued.vacation > amount,
            text: "Maximum "+amount+" cashable Vacation hours",
          },{
            show: cashable > 0,
            text: "Elect by "+deadline+" for cashout on or after "+paydate,
          }]
        },
        panel: {
          heading: "Vacation",
          id: "vacation",
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