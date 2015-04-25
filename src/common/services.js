(function () {
  "use strict";

  angular
    .module("ataCashout.common", [])
      .value("HoursInDay", 8)
       .factory("DayHours", ["HoursInDay", DayHoursFactory])
       .factory("Members", MembersFactory);

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

  function MembersFactory() {
    return {
      default: defaultMember,
      initialize: initialize
    };

    function defaultMember() {
      return {
        payRate: 0,
        serviceYears: 0,
        accrued: {
          holiday: 0,
          personal: 0,
          personalBank: 0,
          sick: 0,
          vacation: 0
        },
        used: {
          sick: 0
        }
      };
    }

    function initialize(member) {
      var def = defaultMember();

      member = member || {};
      if(!member.hasOwnProperty("payRate")) member.payRate = def.payRate;
      if(!member.hasOwnProperty("serviceYears")) member.serviceYears = def.payRate;
      member.accrued = angular.extend({}, def.accrued, member.accrued);
      member.used = angular.extend({}, def.used, member.used);

      return member;
    }
  }
})();