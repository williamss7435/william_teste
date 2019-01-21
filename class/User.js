let db = require('./db');

module.exports = {

    saveUser(user){
        return new Promise((resolve, reject) => {
            db.query(`
                INSERT INTO tb_users (name_user, cpf_user, birth_user, gender_user) 
                VALUES (?, ?, ?, ?)
            `,[
                user.name, user.cpf, user.birth, user.gender
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });
    },

    searchUser(UserName){

        return new Promise((resolve, reject)=> {

            db.query(`
                SELECT * FROM tb_users
                WHERE name_user LIKE ?
            `,[
                `%${UserName}%`
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });

    },

}