(function () {
  "use strict";

  var app = angular.module("ataCashout");
  
  app
    .value("HoursInDay", 8)
    .value("SickCashoutRules", sickCashoutRules);

  var sickCashoutRules = [
    {
      minYears: 0,
      maxYears: 9,
      usedToCashableDays: [6,6,6,5,4,3,2,1]
    },{
      minYears: 10,
      maxYears: Number.MAX_VALUE,
      usedToCashableDays: [12,12,12,11,10,9,8,7,6,5,4,3,2,1]
   }];

})();
