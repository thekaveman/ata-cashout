(function () {
  "use strict";

  var app = angular.module("ataCashout");
  
  app
    .value("HoursInDay", 8);

  app
    .factory("DayHours", ["HoursInDay", DayHoursFactory])
    .factory("SickCashoutRules", SickCashoutRules)
    .factory("SickCashout", ["DayHours", "SickCashoutRules", SickCashoutFactory]);

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

  function SickCashoutRules() {
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

  function SickCashoutFactory(dayHours, rules) {
    return {
      evaluate: evaluate
    };

    function evaluate(member) {
      var cashable = getCashableHours(member.serviceYears, member.used.sick);
      return {
        accrued: member.accruals.sick,
        cashable: cashable,
        diff: member.accruals.sick - cashable
      };
    }

    function getCashableHours(serviceYears, usedHours) {
      var cashable = 0;
      for (var i = 0; i < rules.length; i++) {
        if(rules[i].minYears <= serviceYears && serviceYears <= rules[i].maxYears) {
          cashable = evaluateRuleMap(rules[i].usedToCashableDays, usedHours);
          break;
        }
      }
      return cashable;
    }

    function evaluateRuleMap(ruleMap, usedHours) {
      var usedDays = dayHours.toWholeDays(usedHours);
      if (usedDays < ruleMap.length) {
        var cashableDays = ruleMap[usedDays];
        return dayHours.toHours(cashableDays);
      }
      return 0;
    }
  }
})();
