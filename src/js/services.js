(function () {
  "use strict";

  angular
    .module("ataCashout")
    .value("HoursInDay", 8)
    .value("CashableHolidayHours", 8)
    .value("ProfessionalIncentiveHours", 8)
    .factory("DayHours", ["HoursInDay", DayHoursFactory])
    .factory("SickCashoutAmounts", SickCashoutAmounts)
    .factory("PersonalCashoutAmounts", ["DayHours", "ProfessionalIncentiveHours", PersonalCashoutAmounts])
    .factory("SickCashout", ["DayHours", "SickCashoutAmounts", SickCashoutFactory])
    .factory("VacationCashout", ["DayHours", VacationCashoutFactory])
    .factory("HolidayCashout", ["CashableHolidayHours", HolidayCashoutFactory])
    .factory("PersonalCashout", ["PersonalCashoutAmounts", PersonalCashoutFactory]);

  function DayHoursFactory(hoursInDay) {
    return {
      toWholeDays: toWholeDays,
      toHours: toHours
    };

    function toWholeDays(hours) {
      return Math.floor(hours / hoursInDay);
    }

    function toHours(days) {
      return days * hoursInDay;
    }
  }

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

  function SickCashoutFactory(dayHours, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
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

  function VacationCashoutFactory(dayHours) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      var cashable = dayHours.toHours(dayHours.toWholeDays(member.accrued.vacation));
      return {
        accrued: member.accrued.vacation,
        cashable: cashable,
        diff: member.accrued.vacation - cashable
      };
    }
  }

  function HolidayCashoutFactory(cashableHolidayHours) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      var cashable = member.accrued.holiday < cashableHolidayHours
                   ? member.accrued.holiday
                   : cashableHolidayHours;
      return {
        accrued: member.accrued.holiday,
        cashable: cashable,
        diff: member.accrued.holiday - cashable
      };
    }
  }

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

  function PersonalCashoutFactory(amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
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
