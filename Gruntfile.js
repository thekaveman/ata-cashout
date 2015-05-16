module.exports = function(grunt) {
  var srcGlobs = [
    "src/hours/module.js",
    "src/hours/*.js",
    "src/members/module.js",
    "src/members/*.js",
    "src/**/module.js",
    "!src/calculator/module.js",
    "src/calculator/module.js",
    "src/**/*.js",
  ];

  var devTarget = "src/ataCashout.js";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    //clean up partial build results
    clean: {
      def: [devTarget, "dist/*.js", "!dist/*.min.js", "dist/*.css", "!dist/*.min.css"]
    },
    //concatenate javascript files
    concat: {
      dev: {
        dest: devTarget,
        src: srcGlobs
      },
      dist: {
        dest: "dist/vendor.min.js",
        src: [
          "node_modules/jquery/dist/jquery.min.js",
          "node_modules/bootstrap/dist/js/bootstrap.min.js",
          "node_modules/angular/angular.min.js",
          "bower_components/angular-ui-select/dist/select.min.js"
        ]
      }
    },
    //copy static
    copy: {
      fonts: {
        expand: true,
        cwd: "node_modules/bootstrap/dist/fonts/",
        src: "*.*",
        dest: "dist/fonts/"
      },
      partials: {
        expand: true,
        cwd: "src/",
        src: "**/*.html",
        dest: "dist/"
      },
      styles: {
        dest: "dist/vendor.min.css",
        src: [
          "node_modules/bootstrap/dist/css/bootstrap.min.css",
          "bower_components/angular-ui-select/dist/select.min.css"
        ],
      }
    },
    //post-process HTML
    processhtml: {
      dist: {
        dest: "dist/index.html",
        src: "src/index.html"
      }
    },
    //minify
    uglify: {
      dist: {
        files: [
          { dest: "dist/app.min.js", src: srcGlobs },
          { dest: "dist/app.min.css", src: "src/app.css" }
        ]
      }
    },
    //watch for changes, and run other tasks on detection
    watch: {
      main: {
        files: ["Gruntfile.js", "karma.config.js", "src/**/*.html", "src/**/*.js"],
        tasks: ["default"],
        options: {
          debounceDelay: 3000,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask("all", ["concat:dist", "uglify", "copy", "processhtml", "clean"]);
  grunt.registerTask("default", ["clean", "concat"]);
};
