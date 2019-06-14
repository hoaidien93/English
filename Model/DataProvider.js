var User = require('./User');
var user = new User();
var Vocabulary = require('./Vocabulary');
var vocabulary = new Vocabulary();
var Listening = require('./Listening');
var listening = new Listening();
var FirstTest = require('./FirstTest');
var firstTest = new FirstTest();

class DataProvider{
    async checkLogin(email,password){
        return await user.checkLogin(email,password);
    }

    async isExistEmail(email){
        return await user.isExistEmail(email);
    }

    createAccount(email,name,password){
        return user.createAccount(email,name,password);
    }

    async findInfoUser(email){
        return user.findInfoUser(email);
    }

    async getQuestionsVocabulary(LevelFT,Level){
        return await vocabulary.getQuestionsVocabulary(LevelFT,Level);
    }

    async getFirstTest(){
        return await firstTest.getFirstTest();
    }

    async getAnswerFirstTest(){
        return await firstTest.getAnswerFirstTest();
    }

    updateScoreFirstTest(email,level,score){
        return firstTest.updateScoreFirstTest(email,level,score);
    }

    async getVocabularyTest(levelFT,level){
       return await vocabulary.getVocabularyTest(levelFT,level);
    }

    async getAnswerVocabularyTest(levelFT,level){
        return await vocabulary.getAnswerVocabularyTest(levelFT,level);
    }

    updateScoreVocabulary(email,level,score){
        return vocabulary.updateScoreVocabulary(email,level,score);
    }

    async getQuestionsListening(levelFT,level){
        return await listening.getQuestionsListening(levelFT,level);
    }

    async getListeningTest(levelFT,level){
        return await listening.getListeningTest(levelFT,level);
    }

    async getAnswerListeningTest(levelFT,level){
        return await listening.getAnswerListeningTest(levelFT,level);
    }

    updateScoreListening(email,level,score){
        return listening.updateScoreListening(email,level,score);
    }
}

module.exports = DataProvider;