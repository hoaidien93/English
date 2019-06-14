var Model = require('./Model');
class FirstTest extends Model{
    constructor(){
        super();
    }

    async getFirstTest(){
        var dbo = super.getDbo();
        var rs =  await dbo.collection("firstTest").find({}).toArray();
        return rs;
    }

    async getAnswerFirstTest(){
        var dbo = super.getDbo();
        var rs = await dbo.collection("answerFirstTest").find({}).toArray();
        return rs;
    }

    updateScoreFirstTest(email,level,score){
        var dbo = super.getDbo();
        let query = {email : email};
        let newVal = {
            $set :{
                level : level,
                scoreFirstTest: score,
                listeningLevel: 1,
                vocabularyLevel: 1,
                grammarLevel:1
            }
        };
        dbo.collection("user").updateOne(query,newVal);
    }
}

module.exports = FirstTest;