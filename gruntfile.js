// LightPad startup script for local dev

var path = require("path");

function log(err,stdout,stderr,cb) {
    //console.log('Command Successfull');
    //console.log(stdout);
    cb();
}

module.exports = function (grunt) {

    grunt.initConfig({
        express: {
            dev: {
                options: {
                    port: 3000,
                    hostname: undefined,
                    server: path.resolve('web')
                }
            }
        },

        watch: {
            reload: {
                files: ['app/views/**/**.html', 'app/js/**.**', 'app/css/**.**'],
                options: {
                    livereload: true
                }
            }

        },


    });

    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['express', 'watch']);


};
