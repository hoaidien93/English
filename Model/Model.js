var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:maiyeu0510@ds151453.mlab.com:51453/hd_mongo";
var dbo;

class Model{
    constructor(){
        //Ket noi dtb:
        MongoClient.connect(url,{useNewUrlParser: true },(err,db)=> {
            if (err) throw  err;
            dbo = db.db("hd_mongo");
        });
    }

    getDbo(){
        return dbo;
    }
}

module.exports = Model;
