module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    //clean up partial build results
    clean: {
      dist: ["dist/js/*.js", "!dist/js/*.min.js", "dist/css/*.css", "!dist/css/*.min.css"]
    },
    //concatenate javascript files
    concat: {
      dist: {
        files: [
          {
            src: [
              "node_modules/bootstrap/dist/css/bootstrap.min.css"
            ],
            dest: "dist/css/vendor.min.css"
          },
          {
            src: [
              "src/css/app.css"
            ],
            dest: "dist/css/app.min.css"
          },
          {
            src: [
              "node_modules/jquery/dist/jquery.min.js",
              "node_modules/bootstrap/dist/js/bootstrap.min.js",
              "node_modules/angular/angular.min.js",
              "node_modules/angular-*/angular-*.min.js",
            ],
            dest: "dist/js/vendor.min.js"
          },
          {
            src: "src/js/*.js",
            dest: "dist/js/app.js"
          }
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
        cwd: "src/partials",
        src: "*.html",
        dest: "dist/partials/"
      }
    },
    //post-process HTML
    processhtml: {
      dist: {
        files: {
          "dist/index.html": "src/index.html"
        }
      }
    },
    //minify javascript files
    uglify: {
      dist: {
        files: [
          {
            src: "dist/js/app.js",
            dest: "dist/js/app.min.js"
          }
        ]
      }
    },
    //watch for changes, and run other tasks on detection
    watch: {
      main: {
        files: ["Gruntfile.js", "src/**/*.html", "src/js/*.js"],
        tasks: ["all"],
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

  grunt.registerTask("all", ["concat", "uglify", "processhtml", "copy", "clean"])
  grunt.registerTask("default", ["all"]);
};
