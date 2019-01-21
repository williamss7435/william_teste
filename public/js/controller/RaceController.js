class RaceController {

    constructor(){

        this.initAllEvents();
        $('#confirm-price-race').maskMoney({
            prefix: 'R$'
        });

    }

    initAllEvents(){
        this.eventSearchDriver();
        this.eventSearchUser();
        this.selectDriver();
        this.selectUser();
        this.confirmRace();
        this.initAllEventsSearch();
        this.autoResetNewRace();
    }

    autoResetNewRace(){
        $('#modal-new-race-driver, #modal-new-race-use, #modal-new-race-confirm').on('hidden.bs.modal', (e)=> {
            this.resetForm();
        });
    }

    initAllEventsSearch(){

        $('#btn-search-race').click(event => {
            this.searchRace();
        });
        
        $('#input-search-race').keyup(e => {
                
            if(e.key == 'Enter'){
                this.searchRace();
            }

        });
            
    }

    searchRace(){

        let name = $('#input-search-race').val();
        
        Utils.showModalLoad("Procurando");

        fetch('/search-races', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                type: document.querySelector('[name=option-race-search]:checked').value
            })
        })
        .then(respond => respond.json())
        .then(races => {
            this.insertRace(races);
            Utils.hideModalLoad();
            if(races.length <= 0)
                Utils.showModalFailed('Nenhum Resultado Encontrado');

        }).catch(error => {
            console.log(error);
        });

    }

    insertRace(races){
        $('#table-result-races tbody').html('');

        [...races].forEach(race=> {
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${race.name_driver}</td>
                <td>${race.name_user}</td>
                <td>R$ ${race.price_race}</td>
            `;

            $('#table-result-races tbody').append(tr);
        });


    }

    eventSearchDriver(){
        $("#btn-race-driver").click(event => {
            this.searchDriver();
        });

        $('#input-new-race-driver').keyup(e => {
                
            if(e.key == 'Enter'){
                this.searchDriver();
            }

        });
    }

    eventSearchUser(){
        $("#btn-race-user").click(event => {
            this.searchUser();
        });

        $('#input-new-race-user').keyup(e => {
                
            if(e.key == 'Enter'){
                this.searchUser();
            }

        });
    }

    confirmRace(){
        $('#btn-confirm-race').click(event => {

            let price = $('#confirm-price-race').val();
            if(!price){
                alert("Confirme o Preço Da Corrida");
            }else{

                $('#modal-new-race-confirm').modal('hide');
                Utils.showModalLoad('Salvando');

                fetch('/save-new-race',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idUser:   $('#confirm-user-race').data('idUser'),
                        idDriver: $('#confirm-driver-race').data('idDriver'),
                        price: price.replace('R$', "") 
                    })
                }).then(resp => resp.json())
                .then(json => {
                    console.log(json);
                    Utils.hideModalLoad();
                    if(json.errno){
                        Utils.showModalFailed('Problema Com o Servidor: <br> Por Favor Tente Novamente');
                    }else{
                        Utils.showModalSuccess('Corrida Salva com Sucesso');
                    }

                }).catch(err =>{
                    Utils.hideModalLoad();
                    Utils.showModalFailed('Problema na Conexão: <br> Por Favor Tente Novamente');
                    console.log(err);
                });;
                this.resetForm();
            }

        });
    }

    searchDriver(){
        let name = $('#input-new-race-driver').val();

        this.disableButton('#btn-race-driver');
        this.resetInput();
        
        fetch('/search-driver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        })
        .then(respond => respond.json())
        .then(drivers => {
            this.addDriverItem(drivers);

            this.activateButton('#btn-race-driver');
        }).catch(error => {
            console.log(error);
        });
    }

    searchUser(){
        let name = $('#input-new-race-user').val();

        this.disableButton('#btn-race-user');
        this.resetInput();
        
        fetch('/search-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        })
        .then(respond => respond.json())
        .then(users => {
            this.addUserItem(users);

            this.activateButton('#btn-race-user');
        }).catch(error => {
            console.log(error);
        });
    }

    addDriverItem(drivers){
        $('#list-race-driver').html('');

        drivers.forEach(driver => {

            if(driver.is_active){
                let li = document.createElement('li');

                li.className = 'list-group-item';
                li.dataset.info = JSON.stringify(driver);

                $(li).click(event => {
                    $('#list-race-driver li').removeClass('active-item');
                    event.target.classList.add('active-item');
                });
                li.innerHTML = `
                    Motorista: ${driver.name_driver} -  CPF: ${driver.cpf_driver}     
                `;

                $('#list-race-driver').append(li);
            }
        });

    }
    
    addUserItem(users){
        $('#list-race-user').html('');

        users.forEach(user => {

                let li = document.createElement('li');

                li.className = 'list-group-item';
                li.dataset.info = JSON.stringify(user);

                $(li).click(event => {
                    $('#list-race-user li').removeClass('active-item');
                    event.target.classList.add('active-item');
                });
                li.innerHTML = `
                    Passageiro: ${user.name_user} -  CPF: ${user.cpf_user}     
                `;

                $('#list-race-user').append(li);
            
        });

    }

    selectDriver(){

        $('#select-race-driver').click(event => {

            let infos = $('#list-race-driver li.active-item');
            if(infos.length > 0){
                let drive = JSON.parse(infos[0].dataset.info);

                $('#confirm-driver-race').html(drive.name_driver);
                document.querySelector('#confirm-driver-race').dataset.idDriver = drive.id_driver; 

                $('#modal-new-race-driver').modal('hide');
                $('#modal-new-race-user').modal('show');
            }else{
                alert("Escolha Um Motorista");
            }
            

        });

    }

    selectUser(){

        $('#select-race-user').click(event => {

            let infos = $('#list-race-user li.active-item');
            if(infos.length > 0){
                let user = JSON.parse(infos[0].dataset.info);
                console.log(user);
                $('#confirm-user-race').html(user.name_user);
                document.querySelector('#confirm-user-race').dataset.idUser = user.id_users; 

                $('#modal-new-race-user').modal('hide');
                $('#modal-new-race-confirm').modal('show');
            }else{
                alert("Escolha Um Passageiro");
            }
            

        });

    }

    resetForm(){
        $('#list-race-driver').html('');
        $('#list-race-user').html('');
        $('#input-new-race-driver').val('');
        $('#input-new-race-user').val('')
    }

    resetInput(){
        $('#input-new-race-driver').val('');
    }

    disableButton(btn){
        $(btn).prop('disabled', true);
    }

    activateButton(btn){
        $(btn).prop('disabled', false);
    }

}