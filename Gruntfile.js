module.exports = function(grunt) {
  var vendor = {
    scripts: [
      "bower_components/jquery/dist/jquery.min.js",
      "bower_components/bootstrap/dist/js/bootstrap.min.js",
      "bower_components/angular/angular.min.js",
      "bower_components/angular-ui-select/dist/select.min.js"
    ],
    styles: [
      "bower_components/bootstrap/dist/css/bootstrap.min.css",
      "bower_components/angular-ui-select/dist/select.min.css"
    ]
  };

  var devTarget = "src/ataCashout.js";

  var app = [
    "src/hours/module.js",
    "src/hours/*.js",
    "src/members/module.js",
    "src/members/*.js",
    "src/**/module.js",
    "!src/calculator/module.js",
    "src/calculator/module.js",
    "!" + devTarget,
    "src/**/*.js",
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    //clean up partial build results
    clean: {
      dev: devTarget,
      dist: ["dist/*.*"]
    },
    //concatenate javascript files
    concat: {
      dev: {
        src: app,
        dest: devTarget
      },
      vendor: {
        files: [
          { src: vendor.scripts, dest: "dist/scripts/vendor.min.js" },
          { src: vendor.styles, dest: "dist/styles/vendor.min.css" }
        ]
      }
    },
    //copy static
    copy: {
      cname: {
        src: "CNAME",
        dest: "dist/CNAME"
      },
      css: {
        src: "src/styles/app.css",
        dest: "dist/styles/app.css"
      },
      fonts: {
        expand: true,
        cwd: "bower_components/bootstrap/dist/fonts/",
        src: "*.*",
        dest: "dist/fonts/"
      },
      partials: {
        expand: true,
        cwd: "src/",
        src: "**/*.html",
        dest: "dist/"
      },
    },
    //deploy to gh-pages branch on github
    'gh-pages': {
      options: {
        base: "dist",
        message: "Committed by grunt-gh-pages"
      },
      src: ['**']
    },
    //post-process HTML
    processhtml: {
      dist: {
        src: "src/index.html",
        dest: "dist/index.html"
      }
    },
    //minify
    uglify: {
      dist: {
        src: devTarget,
        dest: "dist/scripts/app.min.js"
      }
    },
    //watch for changes, and run other tasks on detection
    watch: {
      main: {
        files: ["src/**/*.html"].concat(app),
        tasks: ["default"],
        options: {
          debounceDelay: 3000,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks("grunt-processhtml");

  grunt.registerTask("dev", ["clean:dev", "concat:dev"]);
  grunt.registerTask("dist", ["clean", "concat", "uglify", "copy", "processhtml"]);
  grunt.registerTask("deploy", ["dist", "gh-pages"]);

  grunt.registerTask("default", "dev");
};