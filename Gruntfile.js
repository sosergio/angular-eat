module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    clean: {
        build: {
            src: [ 'build' ]
        },
        dist: {
            src: [ 'dist' ]
        }
    },
    concat: {
        options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
        },
        dist: {
            // the files to concatenate
            src: ['src/**/*.js'],
            // the location of the resulting JS file
            dest: 'dist/<%= pkg.name %>.js'
        }
    },
    copy: {
      css: {
        cwd: 'src',
        src: [ '**/*.css' ],
        dest: 'dist',
        expand: true
      },
    },
    uglify: {
        options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
            files: {
            'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
        }
    },
    watch: {
      files: ['src/**/*'],
      tasks: ['less:development']
    },
    less: {
        development: {
            options: {},
            files: {
                "dist/style/style.css": "src/style/style.less",
                "dist/style/material.css": "src/style/material.less"
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  
  grunt.registerTask('default', ['less:development', 'watch']);
  grunt.registerTask('dist', ['clean:dist', 'concat', 'uglify', 'copy:css']);
  

};