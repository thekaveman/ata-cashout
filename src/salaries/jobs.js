(function() {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .filter("BargainingUnit", BargainingUnitFilter)
      .factory("JobsDecoder", ["$window", JobsDecoderFactory])
      .factory("JobClasses", ["$http", "DataUrl", "JobsDecoder", "BargainingUnitFilter", JobClassesFactory])
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

  function JobClassesFactory($http, dataUrl, decoder, filter) {
    return {
      getAll: getAll
    };

    function getAll(file) {
      var url = [dataUrl,file].join("/");
      return $http.get(url).then(
        function(response) {
          var data = decoder.decode(response.data.content);
          return filter(data, "ATA");
        }
      );
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
