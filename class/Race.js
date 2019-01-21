let db = require('./db');

module.exports = {

    saveRace(race){
        return new Promise((resolve, reject) => {

            db.query(`
                INSERT INTO tb_races (price_race, id_driver, id_user) 
                VALUES (?, ?, ?)
            `,[
                race.price, race.idDriver, race.idUser
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });
    },

    searchRace(raceInfo){

        return new Promise((resolve, reject)=> {
            let sql = `
                SELECT price_race, name_driver, name_user
                FROM tb_races
                INNER JOIN tb_drivers ON tb_races.id_driver = tb_drivers.id_driver
                INNER JOIN tb_users ON tb_races.id_user = tb_users.id_users
            `;
            sql += (raceInfo.type == 'driver') ? 'WHERE name_driver LIKE ?' : 'WHERE name_user LIKE ? ';
            console.log(sql);
            db.query(sql,[
                `%${raceInfo.name}%`
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });

    }

}