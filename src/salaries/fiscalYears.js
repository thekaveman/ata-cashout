(function() {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .factory("FileMatcher", FileMatcherFactory)
      .factory("ClosestFiscalYear", ClosestFiscalYearFactory)
      .factory("FiscalYears", ["$http", "$q", "DataUrl", "FileMatcher", "ClosestFiscalYear", FiscalYearsFactory])

  function ClosestFiscalYearFactory() {
    return {
      filter: filter
    };

    function filter(years) {
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
    }
  }

  function FileMatcherFactory() {
    return {
      match: match
    };

    function match(input) {
      var result = /(\d{2})-(\d{2})/gi.exec(input.name);
      if(result === null) {
        return false;
      }
      else {
        var codes = result.slice(1,3);
        return {
          code: codes.join(""),
          fy: "FY " + codes.join("/")
        };
      }
    }
  }

  function FiscalYearsFactory($http, $q, dataUrl, fileMatcher, closestFY) {
    return {
      getAll: getAll,
      filterClosest: filterClosest
    };

    function getAll() {
      return $http.get(dataUrl).then(function(response) {
        return $q(function(resolve) {
          var transformed = [];

          angular.forEach(response.data, function(item) {
            var matched = fileMatcher.match(item);
            if(matched) {
              transformed.push({
                code: matched.code,
                fy: matched.fy,
                name: item.name
              });
            }
          });

          resolve(transformed);
        });
      });
    }

    function filterClosest(years) {
      return closestFY.filter(years);
    }
  }
})();
