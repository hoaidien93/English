var express = require('express');
var router = express.Router();
var path = require("path");

let ctl = require('../Controller/FrontController');
var Controller = new ctl();
let VocabularyController = require('../Controller/VocabularyController');
let vocabularyController = new VocabularyController();
let ListeningController = require('../Controller/ListeningController');
let listeningController = new ListeningController();

//Route index
router.get('/',Controller.Home);
router.get('/webAnimation.css',(req,res)=>{
    var rootModule = path.resolve('./');
	res.sendFile(path.join(rootModule+'/webAnimation.css'));
});
router.get('/slide-doctor-bg.jpg',(req,res)=>{
    var rootModule = path.resolve('./');
	res.sendFile(path.join(rootModule+'/slide-doctor-bg.jpg'));
});
router.get('/4.png',(req,res)=>{
    var rootModule = path.resolve('./');
	res.sendFile(path.join(rootModule+'/4.png'));
})
router.get('/img/:name',(req,res)=>{
    var rootModule = path.resolve('./');
	res.sendFile(path.join(rootModule + '/img/' + req.params.name));
});
//end index
router.get('/register',(req,res)=>{
    var rootModule = path.resolve('./');
    res.render('register',{
        linkcss : rootModule+'/webAnimation.css'
    });
});
router.get('/login',(req,res)=>{
    res.render('login');
});
router.post('/login',Controller.Login);
router.post('/register',Controller.Register);
router.get('/logout',Controller.Logout);
router.get('/profile',Controller.MyProfile);
router.get('/firstTest',Controller.firstTest);
router.post('/firstTest',Controller.postfirstTest);



// Vocabulary
router.get('/Vocabulary',vocabularyController.Vocabulary);
router.get('/PrepareTest/vocabulary',vocabularyController.prepareTestVocabulary);
router.get('/GoToTest/vocabulary',vocabularyController.testVocabulary);
router.post('/GoToTest/vocabulary',vocabularyController.postTestVocabulary);
// Listening
router.get('/Listening',listeningController.getListening);
router.get('/Pre-Listening',listeningController.prepareTestListening);
router.get('/GoToTest/listening',listeningController.testListening);
router.post('/GoToTest/listening',listeningController.postTestListening);


router.post('/ajax/register',Controller.checkEmail);
router.get('/chatbox.js',(req,res)=>{
    var rootModule = path.resolve('./');
   res.sendFile(path.join(rootModule + '/chatbox.js'));
});
router.get('/sound/:name',(req,res)=>{
    var rootModule = path.resolve('./');
    res.sendFile(path.join(rootModule+'/sound/'+ req.params.name));
});


module.exports = router;
