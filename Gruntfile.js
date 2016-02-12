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
      tasks: ['less']
    },
    less: {
        default:{
            options: {},
            files: {
                "dist/style.css": "src/style/style.less",
                "dist/material.css": "src/style/material.less"
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
  
  grunt.registerTask('default', ['clean:dist','concat', 'uglify', 'less', 'watch']);
  grunt.registerTask('dist', ['clean:dist', 'concat', 'uglify', 'less']);
  

};