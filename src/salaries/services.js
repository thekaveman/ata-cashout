(function() {
  "use strict";

  angular
    .module("ataCashout.salaries", [])
      .value("DataUrl", "https://api.github.com/repos/CityofSantaMonica/SalarySchedules.Client/contents/data")
      .factory("FileMatcher", FileMatcherFactory)
      .factory("FiscalYearMatcher", FiscalYearMatcherFactory)
      .factory("JobMatcher", JobMatcherFactory)
      .factory("Salaries", [
        //data request services
        "$window", "$http", "$q", "DataUrl",
        //helper services
        "FileMatcher", "FiscalYearMatcher", "JobMatcher",
        //this service definition
        SalariesFactory
      ]);

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

  function FiscalYearMatcherFactory() {
    return {
      match: match
    };

    function match(years) {
      if(years == null || years.length == 0)
        return null;

      years.sort(function(a, b) {
        if(a.sort < b.sort) return -1;
        if(a.sort > b.sort) return 1;
        else return 0;
      });

      var last = years.length - 1;
      var today = new Date();

      //getMonth() returns 0-based month number
      if(today.getMonth() >= 6)
        return years[last];

      var fyBefore = [today.getFullYear() - 2001, today.getFullYear() - 2000].join("");

      for(var i = last; i >= 0; i--) {
        if(years[i].sort === fyBefore)
          return years[i];
      }

      return years[last];
    }
  }

  function JobMatcherFactory() {
    return {
      match: match
    };

    function match(job) {
      if(job && job.BargainingUnit && job.BargainingUnit.Code === "ATA") {
        return true;
      }
      return false;
    }
  }

  function SalariesFactory($window, $http, $q, dataUrl, fileMatcher, fiscalYearMatcher, jobMatcher) {
    return {
      getFiscalYears: getFiscalYears,
      getClosestFiscalYear: getClosestFiscalYear,
      getJobClasses: getJobClasses
    };

    function getFiscalYears() {
      return $http.get(dataUrl, { cache: true }).then(function(response) {
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

    function getClosestFiscalYear(years) {
      return fiscalYearMatcher.match(years);
    }

    function getJobClasses(path) {
      var url = [dataUrl,path].join("/");
      return $http.get(url, { cache: true }).then(function(response) {
        return $q(function(resolve) {
          var data = angular.fromJson($window.atob(response.data.content));
          var jobs = [];

          angular.forEach(data.JobClasses, function(job) {
            if(jobMatcher.match(job)) {
              jobs.push(job);
            }
          });

          resolve(jobs);
        });
      });
    }
  }
})();
