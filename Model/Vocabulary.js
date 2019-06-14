var Model = require('./Model');
const table = "Vocabulary";
class Vocabulary extends Model{
    constructor(){
        super();
    }

    async getQuestionsVocabulary(LevelFT,Level){
        var dbo = super.getDbo();
        var query = {
            levelFT: LevelFT,
            level: Level.toString()
        }
        var rs = await dbo.collection(table).find(query).toArray();
        return rs;
    }

    async getVocabularyTest(levelFT,level){
        var dbo = super.getDbo();
        var query = {levelFT: levelFT , level : level};
        var rs = await dbo.collection('vocabularyTest').find(query).toArray();
        return rs;
    }

    async getAnswerVocabularyTest(levelFT,level){
        var dbo = super.getDbo();
        var query = {LevelFT: levelFT , Level : level};
        var rs = await dbo.collection('answer_Vocabulary').find(query).toArray();
        return rs;
    }

    updateScoreVocabulary(email,level,score){
        var dbo = super.getDbo();
        var query = {email: email};
        var obj= {};
        obj["scoreVocabulary."+level] = score;
        let newVal = {$set : obj};
        if (score >= 4) obj['vocabularyLevel'] = parseInt(level)+1;
        dbo.collection("user").updateOne(query,newVal);
    }
}

module.exports = Vocabulary;