const moment = require('moment')
const {inicial, final} = require('../database/package-home.json')

module.exports.analise = function () {

diaini = moment(inicial).get('D')
mesini = moment(inicial).get('M')
mesini = mesini + 1
anoini = moment(inicial).get('Y')

diafin = moment(final).get('D')
mesfin = moment(final).get('M')
mesfin = mesfin + 1
anofin = moment(final).get('Y')

try{

    if(inicial == final){
        pasta = mesini+'-'+anoini+'('+diaini+')';
    }
    else if(diaini == 1 && diafin == 31 && mesini == mesfin && anoini == anofin){
        pasta = mesini+'-'+anoini;
    }
    else if(diaini == 1 && diafin == 30 && mesini == mesfin && anoini == anofin){
        pasta = mesini+'-'+anoini;
    }
    else if(mesini != mesfin && anoini == anofin){
        pasta = mesini+'-'+anoini+'@'+mesfin+'-'+anofin+'('+diaini+'-'+diafin+')';
    }
    else if(diaini == diafin && mesini == mesfin && anoini != anofin){
        pasta = mesini+'-'+anoini+'('+diaini+'-'+diafin+')';
    }
    else if(mesini == mesfin && anoini == anofin){
        pasta = mesini+'-'+anoini+'('+diaini+'-'+diafin+')';
    }
    else if(mesini != mesfin && anoini != anofin){
        pasta = mesini+'-'+anoini+'@'+mesfin+'-'+anofin+'('+diaini+'-'+diafin+')';
    }
    else if(mesini != mesfin && anoini != anofin){
        pasta = mesini+'-'+anoini+'@'+mesfin+'-'+anofin+'('+diaini+'-'+diafin+')';
    }
    else{
        err = 'Houve algum problema na Indexação'
        M.toast({html: err})
        console.log(err)
    }
    
    }catch(err){
        if(err.code == 'Não foi possivel realizar a Indexação'){
            eri = 'Indexação já existente'
            M.toast({html: eri})
            console.log(eri);
        }else{
            console.log(err);
        }
    }
}