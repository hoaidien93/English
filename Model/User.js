var Model = require('./Model');
const table = "user";
class User extends Model{
    constructor(){
        super();
    }

    async checkLogin(email,password){
        var dbo = super.getDbo();
        var query = {
            email : email,
            password: password
        };
        var rs = await dbo.collection(table).find(query).toArray();
        return rs;
    }

    async isExistEmail(email){
        var dbo = super.getDbo();
        var query = {email: email};
        var rs = await dbo.collection(table).find(query).toArray();
        var status = rs.length !== 0 ? false : true;
		return status;
    }

    createAccount(email,name,password){
        var dbo = super.getDbo();
        let account = {email: email,name: name, password: password};
        dbo.collection(table).insertOne(account, (err, result) => {
            if (err) throw err;
        });
        return true;
    }

    async findInfoUser(email){
        var dbo = super.getDbo();
        var query = {email : email};
        var rs = await dbo.collection(table).find(query).toArray();
        return rs;
    }
}

module.exports = User;