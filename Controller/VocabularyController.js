var DataProvider = require('../Model/DataProvider');
var dataProvider = new DataProvider();

class VocabularyController {
    
    async Vocabulary(req,res){
        var sess = req.session;
        var renderData = [];
        renderData['name'] = sess.name;
        if (typeof sess.name === 'undefined'){
            sess.linkRD = '/Vocabulary';
            return res.redirect('/login');
        }
        //check don't have a first test
        renderData['nameTest'] = "English Proficiency Test";
        renderData['content1'] = "To evaluate your ability exactly. We prepare for you a proficiency test";
        renderData['content2'] = "Thank you for your attention!";
        renderData['link'] = "/firstTest";
        if (typeof sess.level === 'undefined'){
            return res.render('prepareTest',{
                renderData: renderData
            })
        }
        //getCurrentLevel
        var result = await dataProvider.findInfoUser(sess.email);
        //get data from result
        if (result.length === 0 ) return res.send('Something went wrong!');
        let level = result[0]['vocabularyLevel'];
        let level_FT = result[0]['level'];
        var questionInfo = await dataProvider.getQuestionsVocabulary(level_FT,level);
        return res.render('Vocabulary',{
            topic : questionInfo[0]['topic'],
            name : "Hello "+ sess.name ,
            renderData: questionInfo
        });
    }

    async prepareTestVocabulary(req,res){
        //get LevelVocabulary
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var result = await dataProvider.findInfoUser(sess.email);
        if (result.length <= 0 ) return res.send('Something went wrong!');
        let level = result[0]['vocabularyLevel'];
        var renderData = [];
        //check don't have a first test
        renderData['nameTest'] = result[0]['level']+" Vocabulary Test";
        renderData['content1'] = "Level : " + level;
        renderData['content2'] = "You have 5 second to choice answer";
        renderData['link'] = "/GoToTest/vocabulary";
        renderData['name'] = sess.name;
        return res.render('prepareTest',{
            renderData: renderData
        });
    }
    
    async testVocabulary(req,res){
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var result = await dataProvider.findInfoUser(sess.email);
        console.log(result);
        if (result.length <= 0) return res.send('Something went wrong!');
        let levelFT = result[0]['level'];
        let level = result[0]['vocabularyLevel'] || 1;
        if (level === 5) return res.send('Your level is max, You can find another our lesson to learn');
        var renderData = [];

        var testInfo = await dataProvider.getVocabularyTest(levelFT,level);
        renderData =  testInfo;
        renderData['level'] = level;
        renderData['levelFT'] = levelFT;
        return res.render('vocabularyTest',{
            name: sess.name,
            renderData: renderData
        });
    }

	async postTestVocabulary(req,res){
		var sess =  req.session;
		let data = req.body;
		let level =  req.body.level;
		let levelFT = req.body.levelFT;
        var score = 0;
        var result = await dataProvider.getAnswerVocabularyTest(levelFT,level);

        if (result.length === 0 ) return res.send('Something went wrong!');
        var i = 1;
        for (i = 1; i <= 5; i++){
            if (result[0][i] === data[i]) 
                score++;
        }
        //write score to db;
        dataProvider.updateScoreVocabulary(sess.email,level,score);
        var renderData = [];
        //check don't have a first test
        renderData['nameTest'] = levelFT +" Vocabulary Test";
        renderData['content1'] = "Your score: " + score;
        renderData['content2'] = score >= 4? "You Pass it !" : "You fail it , Try again !";
        renderData['name'] = sess.name;
        return res.render('afterTest',{
            name: sess.name,
            renderData: renderData
        });
    }

}
module.exports = VocabularyController;