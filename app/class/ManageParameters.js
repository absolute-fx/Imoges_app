const fs = require('fs');
class ManageParameters{
    static getParameters()
    {
        return new Promise (function(resolve, reject){
            let appParameters;
            if (!fs.existsSync(__dirname + '/../parameters.json')){
                appParameters = {
                    system: {
                        root_path: 'E:/JOBS/Imoges - Site V3/files_holder'
                    },
                    user:{
                        login: 'manu@absolute-fx.com',
                        password: 'manux88'
                    },
                    park:{
                        project_phases: [{id: 1, label: 'Fondations'}],
                        projects_categories: [{label: 'Plans'}, {label: 'Cahier des charges'}],
                        realties_categories: [{label: 'Plans'}]
                    },
                    logs:{
                        max_logs_display: 200,
                        max_logs_stored: 10000
                    }
                };
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
                        resolve(appParameters);
                    }
                });
            }
        });
    }
}

module.exports = ManageParameters;