(function() {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .filter("BargainingUnit", BargainingUnitFilter)
      .factory("JobsDecoder", ["$window", JobsDecoderFactory])
      .factory("JobClasses", ["$http", "$q", "DataUrl", "JobsDecoder", "BargainingUnitFilter", JobClassesFactory])
      .directive("jobPanel", JobPanel);

  function BargainingUnitFilter() {
    return function (jobs, unit) {
      return (jobs || []).filter(function(job) {
        if(job && job.BargainingUnit && job.BargainingUnit.Code === unit) {
          return true;
        }
        return false;
      });
    }
  }

  function JobsDecoderFactory($window) {
    return {
      decode: decode
    };

    function decode(content) {
      var decodedString = $window.atob(content);
      var data = angular.fromJson(decodedString);
      return data.JobClasses || [];
    }
  }

  function JobClassesFactory($http, $q, dataUrl, decoder, filter) {
    return {
      getAll: getAll
    };

    function getAll(file) {
      var url = [dataUrl,file].join("/");
      return $http.get(url, { cache: true }).then(function(response) {
        return $q(function(resolve) {
          var data = decoder.decode(response.data.content);
          var jobs = filter(data, "ATA");
          resolve(jobs);
        });
      });
    }
  }

  function JobPanel() {
    return {
      restrict: "E",
      scope: {
        member: "="
      },
      templateUrl: "salaries/jobPanel.html"
    };
  }

})();
