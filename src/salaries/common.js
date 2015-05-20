(function () {
  "use strict";

  angular
    .module("ataCashout.salaries")
      .value("DataUrl", "https://api.github.com/repos/CityofSantaMonica/SalarySchedules.Client/contents/data");
})();