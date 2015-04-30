(function () {
  "use strict";

  angular
    .module("ataCashout.hours")
      .value("HoursInDay", 8)
      .factory("DayHours", ["HoursInDay", DayHoursFactory]);

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

})();