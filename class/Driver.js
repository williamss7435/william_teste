let db = require('./db');

module.exports = {

    saveDriver(driver){
        return new Promise((resolve, reject) => {
            db.query(`
                INSERT INTO tb_drivers (name_driver, cpf_driver, model_car, birth_driver, gender_driver) 
                VALUES (?, ?, ?, ?, ?)
            `,[
                driver.name, driver.cpf, driver.model, driver.birth, driver.gender
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });
    },

    searchDriver(driverName){

        return new Promise((resolve, reject)=> {

            db.query(`
                SELECT * FROM tb_drivers
                WHERE name_driver LIKE ?
            `,[
                `%${driverName}%`
            ],(error, results) => {

                if(error)
                    reject(error);
                else
                    resolve(results);

            });

        });

    },

    changeStatus(driver){

        return new Promise((resolve, reject) => {
            let newStatus = (driver.isActive) ? 0 : 1;

            db.query(`
                UPDATE tb_drivers set is_active=? WHERE id_driver = ?
            `,[
                newStatus, driver.id
            ], (err, results) => {

                if(err)
                    reject(err);
                else {
                    driver.isActive = newStatus;
                    resolve(driver);
                }

            });

        });

    }

}