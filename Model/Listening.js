var Model = require('./Model');
const table = "Listening";
class Listening extends Model{
    constructor(){
        super();
    }

    async getQuestionsListening(levelFT,level){
        var dbo = super.getDbo();
        var query = {
            levelFT: levelFT,
            level : level.toString()
        };
        var rs = await dbo.collection(table).find(query).toArray();
        return rs;
    }

    async getListeningTest(levelFT,level){
        var dbo = super.getDbo();
        var query = {
            levelFT: levelFT,
            level : level.toString()
        };
        var rs = await dbo.collection('ListeningTest').find(query).toArray();
        return rs;
    }

    async getAnswerListeningTest(levelFT,level){
        var dbo = super.getDbo();
        var query = {LevelFT: levelFT , Level : level};
        var rs = await dbo.collection('answer_Listening').find(query).toArray();
        return rs;
    }

    updateScoreListening(email,level,score){
        var dbo = super.getDbo();
        var query = {email: email};
        var obj= {};
        obj["scoreListening."+level] = score;
        let newVal = {$set : obj};
        if (score >= 4) obj['listeningLevel'] = parseInt(level)+1;
        dbo.collection("user").updateOne(query,newVal);
    }
}

module.exports = Listening;