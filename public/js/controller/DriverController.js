class DriverController {

    constructor(){
        
        this.initAllEvents();

    }

    //Inicia Todos os Eventos Da Aplicação
    initAllEvents(){
       
        this.saveDriver();
        this.autoResetFormDriver();
        this.initAllEventsSearch();

    }

    initAllEventsSearch(){

        $('#btn-search-driver-name').click(event => {
            this.searchDriver();
        });
        
        $('#input-search-driver-name').keyup(e => {
                
            if(e.key == 'Enter'){
                this.searchDriver();
            }

        });
            
    }

    searchDriver(){

        let name = $('#input-search-driver-name').val();
        this.resetInput();
        Utils.showModalLoad("Procurando");

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
            this.insertDriver(drivers);
        
            Utils.hideModalLoad();
            if(drivers.length <= 0)
                Utils.showModalFailed('Nenhum Resultado Encontrado');

        }).catch(error => {
            console.log(error);
        });

    }   

    //Insere o JSON dentro da Tabela
    insertDriver(drivers){

        $('#table-result-drivers tbody').html('');

        [...drivers].forEach(driver => {
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td><button class="btn ${(driver.is_active) ? 'btn-success' : 'btn-danger'} btn-status" data-info='${JSON.stringify({
                    id: driver.id_driver,
                    name: driver.name_driver,
                    cpf: driver.cpf_driver,
                    isActive: driver.is_active
                })}'></button></td>
                <td>${driver.name_driver}</td>
                <td>${driver.cpf_driver}</td>
                <td>${driver.model_car}</td>
                <td>${(driver.gender_driver == 'M') ? 'Masculino' : 'Feminino'}</td>
                <td>${new Date(driver.birth_driver).toLocaleDateString()}</td>
            `;

            $('#table-result-drivers tbody').append(tr);
        });

        //Evento Muda Status
        $('.btn-status').click(event => {
            let driver = JSON.parse(event.target.dataset.info);
            let msg = `Deseja realmente ${(driver.isActive == '1') ? 'Desativar' : 'Ativar'} o Motorista ${driver.name} CPF: ${driver.cpf} ?`;
            
            //Envia o dados Para a Rota, e se der tudo certo, altera a cor do botão e dataset
            if(confirm(msg)){
                
                fetch('/change-status', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(driver)
                })
                .then(results => results.json())
                .then(newDriver => {
                    console.log('New Driver: ' , newDriver);
                    if(newDriver.errno){
        
                        Utils.showModalFailed('Não Foi possivel Alterar o Status, tente novamente.');
                        console.log(newDriver);
                        
                    }else{

                        if(newDriver.isActive){
                            $(event.target).removeClass('btn-danger');
                            $(event.target).addClass('btn-success');
                        }else{
                            $(event.target).removeClass('btn-success');
                            $(event.target).addClass('btn-danger');
                        }
                        event.target.dataset.info = JSON.stringify(newDriver);
                    }
        
                }).catch(error => {

                    Utils.showModalFailed('Não Foi possivel Alterar o Status, tente novamente.');
                    console.log(error);
        
                });

            }

        });

    }

    //Reseta a barra de Pesquisa
    resetInput(){
        $('#input-search-driver-name').val('');
    }

    //Reseta o Formulario ao fechar
    autoResetFormDriver(){
        $('#modal-new-driver').on('hidden.bs.modal', (e)=> {
            $('#form-new-driver').trigger("reset");
            this.resetForm();
        });
    }

    //Salva Um Novo Motorista
    saveDriver(){
        //Botão Click
        $('#btn-send-new-driver').click(() => {
            
           if(this.validationFormDriver()){

                $('#modal-new-driver').modal('hide');
                Utils.showModalLoad('Salvando');

                fetch('/save-new-driver',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: $('#driver-name').val(), 
                        cpf: $('#driver-cpf').val(),
                        model: $('#car-model').val(),
                        birth: $('#driver-birth').val(),
                        gender: ($('#driver-gender').val() == 'Masculino') ? 'M': 'F'
                    })
                }).then(resp => resp.json())
                .then(json => {
                    console.log(json);
                    Utils.hideModalLoad();
                    if(json.errno){
                        
                        if(json.errno == 1062)
                            Utils.showModalFailed('CPF Já Cadastrado');
                        else
                            Utils.showModalFailed('Problema Com o Servidor: <br> Por Favor Tente Novamente');
    
                    }else{
                        Utils.showModalSuccess('Motorista Salvo com Sucesso');
                    }

                }).catch(err =>{
                    Utils.hideModalLoad();
                    Utils.showModalFailed('Problema na Conexão: <br> Por Favor Tente Novamente');
                    console.log(err);
                });;

           }

        });

    }

    //Validação Do Formulario
    validationFormDriver(){
        this.resetForm();
        let name = $('#driver-name').val();
        let cpf = $('#driver-cpf').val();
        let model = $('#car-model').val();
        let birth = $('#driver-birth').val();
        let gender = $('#driver-gender').val();
    
        if(name == '' || name.length < 3){
            this.showErrorForm('#driver-name', '#error-driver-name');
            return false;
        }else if(cpf.length != 9){
            this.showErrorForm('#driver-cpf', '#error-driver-cpf');
            return false;
        }else if(model == ''){
            this.showErrorForm('#driver-model', '#error-driver-model');
            return false;
        }else if(birth == ''){
            this.showErrorForm('#driver-birth', '#error-driver-birth');
            return false;
        }else if(gender == ''){
            this.showErrorForm('#driver-gender', '#error-driver-gender');
            return false;
        }else{
            return true;
        }
    }

    //Insere o Erro No Input Do Form
    showErrorForm(input, small){
        $(small).removeClass('d-none');
        $(input).addClass('invalid');
    }

    //Reseta todos os Error Do Formulario
    resetForm(){
        $('#form-new-driver input').removeClass('invalid');
        $('#form-new-driver small').addClass('d-none');
    }

}