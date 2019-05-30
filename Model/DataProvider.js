var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:maiyeu0510@ds151453.mlab.com:51453/hd_mongo";
var dbo;

class DataProvider{
    constructor(){
        //Ket noi dtb:
        MongoClient.connect(url,{useNewUrlParser: true },(err,db)=> {
            if (err) throw  err;
            dbo = db.db("hd_mongo");
        });
    }

    async checkLogin(email,password){
        var query = {email : email, password: password};
        var rs = await dbo.collection("user").find(query).toArray();
        console.log(rs);
        return rs;
    }

    async isExistEmail(email){
        var query = {email: email};
        var rs = await dbo.collection("user").find(query).toArray();
        var status = rs.length !== 0 ? false : true;
		return status;
    }

    createAccount(email,name,password){
        let account = {email: email,name: name, password: password};
        dbo.collection("user").insertOne(account, (err, result) => {
            if (err) throw err;
        });
        return true;
    }

    async findInfoUser(email){
        var query = {email : email};
        var rs = await dbo.collection("user").find(query).toArray();
        return rs;
    }

    async getQuestions(table){
        var rs = await dbo.collection(table).find({}).toArray();
        return rs;
    }

    async getProfile(email){
        let query = {email : email};
        var rs = await dbo.collection('user').find(query).toArray();
        return rs;
    }

    async getFirstTest(){
        var rs =  await dbo.collection("firstTest").find({}).toArray();
        return rs;
    }

    async getAnswerFirstTest(){
        var rs = await dbo.collection("answerFirstTest").find({}).toArray();
        return rs;
    }

    updateScoreFirstTest(email,level,score){
        let query = {email : email};
        let newVal = {$set :{level : level, scoreFirstTest: score,listeningLevel: 1, vocabularyLevel: 1, grammarLevel:1}};
        dbo.collection("user").updateOne(query,newVal);

    }

    async getVocabularyTest(levelFT,level){
        var query = {levelFT: levelFT , level : level};
        var rs = await dbo.collection('vocabularyTest').find(query).toArray();
        return rs;
    }

    async getAnswerVocabularyTest(levelFT,level){
        var query = {LevelFT: levelFT , Level : level};
        var rs = await dbo.collection('answer_Vocabulary').find(query).toArray();
        return rs;
    }

    updateScoreVocabulary(email,level,score){
        var query = {email: email};
        var obj= {};
        obj["scoreVocabulary."+level] = score;
        let newVal = {$set : obj};
        if (score >= 4) obj['vocabularyLevel'] = parseInt(level)+1;
        dbo.collection("user").updateOne(query,newVal);
    }
}

module.exports = DataProvider;