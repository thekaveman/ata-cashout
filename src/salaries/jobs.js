(function() {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .filter("BargainingUnit", BargainingUnitFilter)
      .factory("JobsDecoder", ["$window", JobsDecoderFactory])
      .factory("JobClasses", ["$http", "DataUrl", "JobsDecoder", "BargainingUnitFilter", JobClassesFactory])
      .controller("JobPanelController", ["$scope", "FiscalYears", "JobClasses", JobPanelController])
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
      return $http.get(url, {cache:true}).then(
        function(response) {
          var data = decoder.decode(response.data.content);
          return filter(data, "ATA");
        }
      );
    }
  }

  function JobPanelController($scope, fy, jobs) {
    //local data for the directive
    $scope.jobPanel = {
      jobs: [],
      selectedJob: false,
      hasSelection: hasSelection,
      onJobSelect: onJobSelect
    };
    //listen for the reset even from the parent
    $scope.$on("reset", function(event) {
      $scope.jobPanel.selectedJob = false;
    });

    //get the list of jobs from github
    fy.findClosest().then(
      function(closest) {
        jobs.getAll(closest.name).then(
          function(jobClasses) {
            $scope.jobPanel.jobs = jobClasses;
          }
        );
      }
    );

    //determine if a job has been selected
    function hasSelection() {
      return !!$scope.jobPanel.selectedJob;
    }

    //callback when job selected
    function onJobSelect($item,$model) {
      $scope.member.payRate = undefined;
    }
  }

  function JobPanel() {
    return {
      //elements only
      restrict: "E",
      //isolate scope coming from CalculatorController
      scope: {
        member: "="
      },
      //this directive's controller
      controller: "JobPanelController",
      templateUrl: "salaries/jobPanel.html"
    };
  }
})();
