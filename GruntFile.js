module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['app/class/*.js', 'app/view/js/page/*.js', 'app/view/js/widgets/*.js', 'app/view/js/menuData.js', 'app/view/js/menuTemplate.js', 'app/view/js/app.js'],
            options: {
                esnext: true
            }
        },
        clean: {
            contents: ['dist/*'],
        },
        "github-release": {
            options: {
                repository: 'absolute-fx/Imoges_app', // Path to repository
                auth: {   // Auth credentials
                    user: 'Proglab',
                    password: 'lapin324468'
                }
            },
            files: {
                src: ['dist/*.*']
            }

        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('before', ['jshint','clean']);
    grunt.loadNpmTasks('grunt-github-releaser');
    grunt.registerTask('after', ['github-release']);
};