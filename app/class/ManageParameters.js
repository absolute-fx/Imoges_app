const fs = require('fs');
const editJsonFile = require("edit-json-file");
const devVersion = 6;
const  prodVersion = 0;

class ManageParameters{
    static getParameters()
    {
        return new Promise (function(resolve, reject){
            let appParameters;
            if (!fs.existsSync(__dirname + '/../parameters.json')){
                appParameters = ManageParameters.getDefaultParams();
                fs.writeFile(__dirname + '/../parameters.json', JSON.stringify(appParameters), 'utf8', (err) =>{
                    if(!err)
                    {
                        resolve(appParameters);
                    }
                    else
                    {
                        reject(err);
                    }
                });

            }
            else
            {
                fs.readFile(__dirname + '/../parameters.json', 'utf8', (err, data) =>{
                    if (err){
                        reject(err);
                    } else {
                        appParameters = JSON.parse(data);
                        // Si version de dev a changé
                        if(appParameters.dev_version < devVersion)
                        {
                            // suppression du fichier
                            fs.unlink(__dirname + '/../parameters.json', (errorUnlink)=> {
                                if(! errorUnlink)
                                {
                                    let login = appParameters.user.login;
                                    let pswd = appParameters.user.password;
                                    let rP = appParameters.system.root_path;
                                    appParameters = ManageParameters.getDefaultParams();
                                    appParameters.user.login = login;
                                    appParameters.user.password = pswd;
                                    appParameters.system.root_path = rP;
                                    // Création du nouveau
                                    fs.writeFile(__dirname + '/../parameters.json', JSON.stringify(appParameters), 'utf8', (err) =>{
                                        if(!err)
                                        {
                                            resolve(appParameters);
                                        }
                                        else
                                        {
                                            reject(err);
                                        }
                                    });
                                }
                                else {
                                    reject(errorUnlink);
                                }

                            });
                        }
                        else {
                            resolve(appParameters);
                        }
                    }
                });
            }
        });
    }
    static setParameters(params){
        return new Promise (function(resolve, reject) {
            let file = editJsonFile(__dirname + '/../parameters.json');
            for (var i in params)
            {
                file.set(params[i].node, params[i].value);
                console.log(params[i].node + ' - ' + params[i].value)
            }
            file.save();
            resolve(file);
        });
    }

    static setMultipleParameters(params)
    {
        return new Promise (function(resolve, reject) {
            fs.writeFileSync(__dirname + '/../parameters.json', JSON.stringify(params));
            resolve(params);
        });
    }

    static getDefaultParams()
    {
        let appParameters;
        appParameters = {
            dev_version: devVersion,
            prod_version: prodVersion,
            system: {
                root_path: '',
                upload_path: 'http://imoges.afxlab.be/upload.php',
                cloud_library_path:"",
                projects_dirs: {
                    default: {libraries: 'Bibliothèque', realties: 'Biens'},
                    user_defined: []
                },
                realties_dirs: {
                    default: {library: 'Bibliothèque'},
                    user_defined: []
                }
            },
            user:{
                login: '',
                password: '',
                licence_key:''
            },
            project: {
                project_phases: [],
                projects_categories: []
            },
            realty:{
                realties_categories: []
            },
            logs:{
                max_logs_display: 200,
                max_logs_stored: 10000
            }
        };
        return appParameters;
    }
}

module.exports = ManageParameters;