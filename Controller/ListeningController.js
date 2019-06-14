var DataProvider = require('../Model/DataProvider');
var dataProvider = new DataProvider();

class ListeningController{
    async getListening(req,res){
        var sess = req.session;
        var renderData = [];
        renderData['name'] = sess.name;
        if (typeof sess.name === 'undefined'){
            sess.linkRD = '/Listening';
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
        let level = result[0]['listeningLevel'];
        let level_FT = result[0]['level'];
        var listeningData = await dataProvider.getQuestionsListening(level_FT,level);
        return res.render('listening',{
            topic : listeningData[0]['topic'],
            name : "Hello "+ sess.name ,
            renderData: listeningData
        });
    }

    async prepareTestListening(req,res){
        //get LevelVocabulary
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var result = await dataProvider.findInfoUser(sess.email);
        if (result.length <= 0 ) return res.send('Something went wrong!');
        let level = result[0]['listeningLevel'];
        var renderData = [];
        //check don't have a first test
        renderData['nameTest'] = result[0]['level']+" Listening Test";
        renderData['content1'] = "Level : " + level;
        renderData['content2'] = "You have 5 second to choice answer and You only listening three times";
        renderData['link'] = "/GoToTest/listening";
        renderData['name'] = sess.name;
        return res.render('prepareTest',{
            renderData: renderData
        });
    }

    async testListening(req,res){
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var result = await dataProvider.findInfoUser(sess.email);
        if (result.length <= 0) return res.send('Something went wrong!');
        let levelFT = result[0]['level'];
        let level = result[0]['listeningLevel'] || 1;
        if (level === 5) return res.send('Your level is max, You can find another our lesson to learn');
        var renderData = [];

        var testInfo = await dataProvider.getListeningTest(levelFT,level);
        renderData =  testInfo;
        renderData['level'] = level;
        renderData['levelFT'] = levelFT;

        return res.render('listeningTest',{
            name: sess.name,
            renderData: renderData
        });
    }

    async postTestListening(req,res){
        var sess =  req.session;
		let data = req.body;
		let level =  req.body.level;
        let levelFT = req.body.levelFT;
        var score = 0;
        var result = await dataProvider.getAnswerListeningTest(levelFT,level);
        if (result.length === 0 ) return res.send('Something went wrong!');
        for (var i = 1; i <= 5; i++){
            if (result[0][i] === data[i]) 
                score++;
        }
        dataProvider.updateScoreListening(sess.email,level,score);
        var renderData = [];
        //check don't have a first test
        renderData['nameTest'] = levelFT +" Listening Test";
        renderData['content1'] = "Your score: " + score;
        renderData['content2'] = score >= 4? "You Pass it !" : "You fail it , Try again !";
        renderData['name'] = sess.name;
        return res.render('afterTest',{
            name: sess.name,
            renderData: renderData
        });
    }
}

module.exports = ListeningController;