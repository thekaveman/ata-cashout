(function () {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .filter("ClosestFiscalYear", ClosestFiscalYearFilter)
      .filter("DataFile", DataFileFilter)
      .factory("FiscalYears", ["$http", "DataUrl", "DataFileFilter", "ClosestFiscalYearFilter", FiscalYearsFactory])

  function ClosestFiscalYearFilter() {
    return function(years) {
      if(years == null || years.length == 0)
        return null;

      years.sort(function(a, b) {
        if(a.code < b.code) return -1;
        if(a.code > b.code) return 1;
        else return 0;
      });

      var last = years.length - 1;
      var today = new Date();

      //getMonth() returns 0-based month number
      //if today is July or later
      if(today.getMonth() >= 6) {
        //return the most recent
        return years[last];
      }

      //this won't work in the year 2100
      var fyBefore = [today.getFullYear() - 2001, today.getFullYear() - 2000].join("");

      //look from the end for the previous fiscal year data
      for(var i = last; i >= 0; i--) {
        if(years[i].code === fyBefore) {
          return years[i];
        }
      }

      //otherwise just return the most recent
      return years[last];
    };
  }

  function DataFileFilter() {

    return function(files) {
      var results = [];

      angular.forEach(files, function(file) {
        var result = /(\d{2})-(\d{2}).*\.json/gi.exec(file.name);
        if(result) {
          var codes = result.slice(1,3);
          results.push({
            code: codes.join(""),
            fy: "FY " + codes.join("/"),
            name: file.name
          });
        }
      });

      return results;
    };
  }

  function FiscalYearsFactory($http, dataUrl, dataFileFilter, closestFilter) {
    return {
      findClosest: findClosest
    };

    function findClosest() {
      return $http.get(dataUrl, {cache:true}).then(
        function(response) {
          var years = dataFileFilter(response.data);
          return closestFilter(years);
        }
      );
    }
  }
})();