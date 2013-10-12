/**
 * @fileOverview Grunt configuration file
 */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Clean the dist folder
    clean: {
      dist: {
        // folders to clean (NOTE: deletes everything inside)
        src: ['dist/*']
      }
    },
    // run r.js
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "config.js",
          out: "app/scripts/eduphil.js"
        }
      }
    },
    // Filewatchers
    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: ['app/*.html', 'app/styles/*.css', 'app/scripts/*.js']
      },
      scripts: {
        files: ['app/scripts/*.js'],
        tasks: ['requirejs'],
        options: {
          spawn: true, // spawn task in a child process
        }
      },
      styles: {
        files: ['app/styles/*.css'],
        tasks: ['requirejs'],
        options: {
          spawn: true // spawn task in a child process
        }
      }
    },
    // Development server
    connect: {
      server: {
        options: {
          keepalive: true,
          livereload: true,
          port: 9000,
          base: 'app'
        }
      }
    },
    // run multiple tasks... "concurrently"
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: ['watch:livereload', 'connect']
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'scripts/vendor/es5-shim/**/*.{js,css}',
              'scripts/vendor/json3/**/*.{js,css}',
              'img/{,*/}*.*',
              'styles/fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/img',
            src: [
              'generated/*'
            ]
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build', ['clean', 'requirejs']);
  grunt.registerTask('server', ['concurrent:dev']);

};
