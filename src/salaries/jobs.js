(function() {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .factory("JobsDecoder", ["$window", JobsDecoderFactory])
      .factory("JobMatcher", JobMatcherFactory)
      .factory("JobClasses", ["$http", "$q", "DataUrl", "JobsDecoder", "JobMatcher", JobClassesFactory]);

  function JobsDecoderFactory($window) {
    return {
      decode: decode
    };

    function decode(content) {
      var decodedString;

      try {
         decodedString = $window.atob(content);
      }
      catch (e) {
        console.error(e);
        decodedString = "";
      }

      var data = angular.fromJson(decodedString);

      return data.JobClasses || [];
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

  function JobClassesFactory($http, $q, dataUrl, decoder, matcher) {
    return {
      getAll: getAll
    };

    function getAll(file) {
      var url = [dataUrl,file].join("/");
      return $http.get(url, { cache: true }).then(function(response) {
        return $q(function(resolve) {
          var data = decoder.decode(response.data.content);
          var jobs = [];

          angular.forEach(data, function(job) {
            if(matcher.match(job)) {
              jobs.push(job);
            }
          });

          resolve(jobs);
        });
      });
    }
  }
})();
