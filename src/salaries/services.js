(function() {
  "use strict";

  angular
    .module("ataCashout.salaries", [])
      .value("DataSourcesUrl", "https://api.github.com/repos/CityofSantaMonica/SalarySchedules.Client/contents/data")
      .factory("FileMatcher", FileMatcherFactory)
      .factory("JobMatcher", JobMatcherFactory)
      .factory("Salaries", ["$http", "$q", "DataSourcesUrl", "FileMatcher", "JobMatcher", SalariesFactory]);

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
          shortCode: "FY " + codes.join("/"),
          sort: codes.join("")
        };
      }
    }
  }

  function JobMatcherFactory() {
    return {
      match: match
    };

    function match(job) {
      if(job.BargainingUnit.Code === "ATA") {
        return true;
      }
      return false;
    }
  }

  function SalariesFactory($http, $q, dataUrl, fileMatcher, jobMatcher) {
    return {
      getFiscalYears: getFiscalYears,
      getJobClasses: getJobClasses
    };

    function getFiscalYears() {
      return $http.get(dataUrl, { cache: true }).then(function(data) {
        return $q(function(resolve) {
          var transformed = [];

          angular.forEach(data.data, function(item) {
            var matched = fileMatcher.match(item);
            if(matched) {
              transformed.push({
                shortCode: matched.shortCode,
                sort: matched.sort,
                url: item.download_url
              });
            }
          });

          resolve(transformed);
        });
      });
    }

    function getJobClasses(url) {
      return $http.get(url, { cache: true }).then(function(data) {
        return $q(function(resolve) {
          var jobs = [];

          angular.forEach(data.data.jobClasses, function(job) {
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
