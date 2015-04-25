(function() {
  "use strict";

  angular
    .module("ataCashout.salaries", [])
      .value("DataSourcesUrl", "https://api.github.com/repos/CityofSantaMonica/SalarySchedules.Client/contents/data")
      .factory("FilenameMatcher", FilenameMatcherFactory)
      .factory("Salaries", ["$http", "$q", "DataSourcesUrl", "FilenameMatcher", SalariesFactory]);

  function FilenameMatcherFactory() {
    return {
      parse: parse
    };

    function parse(input) {
      var result = /^salary-sched-(\d{2})-(\d{2})\.json$/i.exec(input);
      if(result === null) {
        return false;
      }
      else{
        var codes = result.slice(1,3);
        return {
          shortCode: "FY " + codes.join("/"),
          sort: codes.join("")
        }
      }
    }
  }

  function SalariesFactory($http, $q, dataUrl, fileMatcher) {
    return {
      getFiscalYears: getFiscalYears,
      getSalaries: getSalaries
    };

    function getFiscalYears() {
      return $http.get(dataUrl, { cache: true }).then(function(data) {
        return $q(function(resolve) {
          var transformed = [];

          angular.forEach(data.data, function(item) {
            var parsed = fileMatcher.parse(item.name);
            if(parsed) {
                transformed.push({
                  shortCode: parsed.shortCode,
                  sort: parsed.sort,
                  url: item.download_url
                });
            }
          });

          resolve(transformed);
        });
      });
    }

    function getSalaries(fiscalYear) {
    }
  }
})();
