module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['app/class/*.js', 'app/view/js/page/*.js', 'app/view/js/widgets/*.js', 'app/view/js/menuData.js', 'app/view/js/menuTemplate.js', 'app/view/js/app.js'],
            options: {
                esnext: true
            }
        },
        clean: {
            contents: ['dist/*'],
        },
        rename: {
            main: {
                files: [
                    {src: ['dist/Imoges_app Setup *.*'], dest: 'dist/Imoges_app-Setup-<%= pkg.version %>.exe'},
                ]
            }
        },
        "github-release": {
            "tag_name": "v<%= pkg.version %>",
            "name": "v<%= pkg.version %>",
            draft: true,
            options: {
                repository: 'absolute-fx/Imoges_app', // Path to repository
                auth: {   // Auth credentials
                    user: 'Proglab',
                    password: 'lapin324468'
                },
            },
            files: {
                src: ['dist/*.*']
            }

        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('before', ['jshint','clean']);
    grunt.loadNpmTasks('grunt-rename-util');
    grunt.loadNpmTasks('grunt-github-releaser');
    grunt.registerTask('after', ['rename', 'github-release']);
};