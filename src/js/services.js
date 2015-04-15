(function () {
  "use strict";

  var app = angular.module("ataCashout");

  app
    .value("HoursInDay", 8)
    .factory("DayHours", ["HoursInDay", DayHoursFactory])
    .factory("SickCashoutAmounts", SickCashoutAmounts)
    .factory("SickCashout", ["DayHours", "SickCashoutAmounts", SickCashoutFactory])
    .factory("VacationCashout", ["DayHours", VacationCashoutFactory]);

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
      usedToCashableDays: [6,6,6,5,4,3,2,1]
    },{
      minYears: 10,
      maxYears: Number.MAX_VALUE,
      usedToCashableDays: [12,12,12,11,10,9,8,7,6,5,4,3,2,1]
   }];
  }

  function SickCashoutFactory(dayHours, amounts) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      var cashable = member.accruals.sick < 12 ? 0 : getCashableHours(member.serviceYears, member.used.sick);
      return {
        accrued: member.accruals.sick,
        cashable: cashable,
        diff: member.accruals.sick - cashable
      };
    }

    function getCashableHours(serviceYears, usedHours) {
      var cashable = 0;
      for (var i = 0; i < amounts.length; i++) {
        if(amounts[i].minYears <= serviceYears && serviceYears <= amounts[i].maxYears) {
          cashable = findAmount(amounts[i].usedToCashableDays, usedHours);
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
      var cashable = dayHours.toHours(dayHours.toWholeDays(member.accruals.vacation));
      return {
        accrued: member.accruals.vacation,
        cashable: cashable,
        diff: member.accruals.vacation - cashable
      };
    }
  }
})();
