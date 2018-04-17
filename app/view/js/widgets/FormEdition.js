/**
 * Gestion des formulaires
 * ...
 */
const electron = require('electron');

class FormEdition{
    static setUpdateForm(form, id)
    {
        let table = $('#' + form).data('tablename');
        $('#' + form + ' :text').each((index, elem)=>{
            if(typeof $(elem).attr('name') != 'undefined')
            {
                $(elem).on('change', ()=>{
                    let field = [{name: $(elem).attr('name'), val: $(elem).val()}];
                    updateAction(table, id, field);
                    console.log('changed-> ' + $(elem).attr('name'));
                });
            }
        });

        $('#' + form + ' :input[type="number"]').each((index, elem)=>{
            if(typeof $(elem).attr('name') != 'undefined')
            {
                $(elem).on('change', ()=>{
                    let field = [{name: $(elem).attr('name'), val: $(elem).val()}];
                    updateAction(table, id, field);
                    console.log('changed-> ' + $(elem).attr('name'));
                });
            }
        });

        $('#' + form + ' textarea').each((index, elem)=>{
           if(typeof $(elem).attr('name') != 'undefined')
           {
               $(elem).on('change', ()=>{
                   let field = [{name: $(elem).attr('name'), val: $(elem).val()}];
                   updateAction(table, id, field);
                   console.log('changed-> ' + $(elem).attr('name'));
               });
           }
        });

        $('#' + form + ' select').each((index, elem)=>{
            if(typeof $(elem).attr('name') != 'undefined')
            {
                $(elem).on('change', ()=>{
                    let field = [{name: $(elem).attr('name'), val: $(elem).val()}];
                    updateAction(table, id, field);
                    console.log('changed-> ' + $(elem).attr('name'));
                });
            }
        });
    }

    static editByInputs(table, id, fields)
    {
        updateAction(table, id, fields);
    }

    static setDateNumberFormat(n)
    {
        return n <10 ? '0'+n : n;
    }

    static updateAllForm()
    {

    }

}

module.exports.FormEdition = FormEdition;

function updateAction(table, id, fields)
{
    console.log(table);
    console.log(id);
    console.log(fields);

    require('../../../class/repositories/' + table).findById(id).then(
        (row) => {
            for(let i in fields)
            {
                row[fields[i].name] = fields[i].val;
            }
            row.save();
        }
    );
}
