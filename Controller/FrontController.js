var DataProvider = require('../Model/DataProvider');
var dataProvider = new DataProvider();
class FrontController{
    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Home(req,res){
        var sess = req.session;
        var mess;
        if (typeof sess.mess !== 'undefined') {
            mess = ""+ sess.mess ;
        }
        else mess = undefined;

        //set empty mess after send
        sess.mess = undefined;

        return res.render('index',{
            mess : mess,
            name: sess.name
        });
    }
    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Login(req,res){
        let email = req.body.email;
        let password = req.body.password;
        //check database
        dataProvider.checkLogin(email,password).then(function(result){
            if (result.length > 0) {
                var sess = req.session;
                sess.name = result[0]['name'] ;
                sess.email = result[0]['email'];
                sess.level = result[0]['level'];
                var linkRD;//link redirect
                if (typeof sess.linkRD !== 'undefined') {
                    linkRD = ""+ sess.linkRD ;
                }
                else linkRD = undefined;
                //set empty link redirect
                sess.linkRD = undefined;
                if (typeof  linkRD !== 'undefined') return res.redirect(linkRD);
                return res.redirect('/');
            }
            else{
                return res.render('login',{
                    status: "Username or password is incorrect"
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
              
    }

	checkEmail(req,res){
		let email = req.body.email;
		dataProvider.isExistEmail(email).then(function(status){
            return res.send({
                status: status
            });
        });
    }
    
    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Register(req,res) {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let pw_Rp = req.body.password_repeat;
        var renderData = [];
        var create = true;
        if (password !== pw_Rp) {
            renderData['status_password'] = "Repeated password not same";
            create = false;
        }
        //Connect MongoDB to check username !;
        dataProvider.isExistEmail(email).then(function(res)
        {
            if (!res) {
                renderData['status_email'] = "Email is existed!";
            }
            else {
                if (create === true) {
                    dataProvider.createAccount(email,name,password);
                    var sess = req.session;
                    sess.name = name;
                    sess.email = email;
                    return res.redirect('/');

                }
            }
            return res.render('register', {
                status_email: renderData['status_email'],
                status_password: renderData['status_password']
            });
            });
    }

    Logout(req,res) {
        req.session.destroy(function (err) {
            if (err) throw err;
        });
        return res.redirect('/');
    }

    Vocabulary(req,res){
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
        dataProvider.findInfoUser(sess.email).then(function(result)
        {
            //get data from result
            if (result.length === 0 ) return res.send('Something went wrong!');
            let level = result[0]['vocabularyLevel'];
            let level_FT = result[0]['level'] === "Beginer" ? "Level1" : "Level2";
            let table = "Vocabulary_"+level_FT+"_"+level;
            dataProvider.getQuestions(table).then(function(questionInfo){
                return res.render('Vocabulary',{
                    topic : questionInfo[0]['topic'],
                    name : "Hello "+ sess.name ,
                    renderData: questionInfo
                });
            });
        });
    }

    async MyProfile(req,res){
        var sess = req.session;
        var renderData =  [];
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        renderData['name'] = sess.name;
        var result = await dataProvider.getProfile(sess.email);
        //get data from result
        if (result.length === 0 ) return res.send('Something went wrong!');
        renderData = result[0];
        return res.render('profile',{
            renderData: renderData
        });
    }
    async firstTest(req,res){
        var sess = req.session;
        if (typeof sess.name === 'undefined'){
            sess.linkRD = '/firstTest';
            return res.redirect('/login');
        }
        var result = await dataProvider.getFirstTest();
        return res.render('firstTest',{
            name : "Hello "+ sess.name ,
            renderData: result
        });
    }
    async postfirstTest(req,res){
        var result = await dataProvider.getAnswerFirstTest();
        var score = 0;
        var i = 1;
        for (i=1;i<=20;i++){
            if (result[0][i.toString()] === req.body[i.toString()])
                score++;
        }
        var renderData = [];
        renderData.name = "Hello "+ req.session.name;
        renderData.score = score;
        renderData.level = score >= 15? "Intermediate":"Beginer";
        var sess=req.session;
        sess.level = renderData.level;
        //add to db
        dataProvider.updateScoreFirstTest(sess.email,renderData.level,score);
        return res.render('thanks',{
            renderData: renderData
        });
    }
    async prepareTestVocabulary(req,res){
        //get LevelVocabulary
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var result = await dataProvider.getProfile(sess.email);
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
        var result = await dataProvider.getProfile(sess.email);
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
        if (score >= 4) return res.send('You pass it');
        else res.send('Sorry!');
    }
    getListening(req,res){
        
    }
}

module.exports = FrontController;