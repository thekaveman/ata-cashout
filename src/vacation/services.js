(function () {
  "use strict";

  angular
    .module("ataCashout.vacation")
      .factory("VacationCashoutAmounts", VacationCashoutAmounts)
      .factory("VacationCashout", ["Members", "VacationCashoutAmounts", VacationCashoutFactory]);

  function VacationCashoutAmounts() {
    return {
      hours: 48,
      elections: [{
        deadline: { month: 11, day: 31 },
        paydate: { month: 6, day: 1 }
      },{
        deadline: { month: 11, day: 31 },
        paydate: { month: 11, day: 31 }
      }]
    };
  }

  function VacationCashoutFactory(members, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      member = members.initialize(member);

      var totalCashable = amounts.hours * amounts.elections.length;
      var cashable = Math.min(totalCashable, member.accrued.vacation);
      var diff = member.accrued.vacation - cashable;

      var thisYear = new Date().getFullYear();

      var notes = [];

      if (cashable > 0) {
        amounts.elections.forEach(function(election) {
          notes.push({
            show: true,
            text: "Elect a max of "+amounts.hours+" hours by "+deadline(thisYear, election.deadline)+" for cashout around "+paydate(thisYear, election.paydate)
          });
        });
      }

      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        banked: diff,
        notes: {
          cashable: notes
        },
        panel: {
          heading: "Vacation",
          id: "vacation",
        }
      };
    }
  }

  var formatOpts = { month: "2-digit", day: "2-digit", year: "2-digit" };

  function deadline(year, target) {
    return new Date(year, target.month, target.day).toLocaleDateString("en-US", formatOpts);
  }

  function paydate(year, target) {
    return new Date(year + 1, target.month, target.day).toLocaleDateString("en-US", formatOpts);
  }
})();
