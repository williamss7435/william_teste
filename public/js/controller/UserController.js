class UserController {

    constructor(){
        
        this.initAllEvents();
        
    }

    //Inicia Todos os Eventos Da Aplicação
    initAllEvents(){
       
        this.saveUser();
        this.autoResetFormUser();
        this.initAllEventsSearch();

    }

    initAllEventsSearch(){

        $('#btn-search-user-name').click(event => {
            this.searchUser();
        });
        
        $('#input-search-user-name').keyup(e => {
                
            if(e.key == 'Enter'){
                this.searchUser();
            }

        });
            
    }

    searchUser(){

        let name = $('#input-search-user-name').val();
        this.resetInput();
        Utils.showModalLoad("Procurando");

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
            this.insertUser(users);
        
            Utils.hideModalLoad();
            if(users.length <= 0)
                Utils.showModalFailed('Nenhum Resultado Encontrado');

        }).catch(error => {
            console.log(error);
        });

    }   

    //Insere o JSON dentro da Tabela
    insertUser(users){

        $('#table-result-users tbody').html('');

        [...users].forEach(user => {
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name_user}</td>
                <td>${user.cpf_user}</td>
                <td>${(user.gender_user == 'M') ? 'Masculino' : 'Feminino'}</td>
                <td>${new Date(user.birth_user).toLocaleDateString()}</td>
            `;

            $('#table-result-users tbody').append(tr);
        });

    }

    //Reseta a barra de Pesquisa
    resetInput(){
        $('#input-search-user-name').val('');
    }

    //Reseta o Formulario ao fechar
    autoResetFormUser(){
        $('#modal-new-user').on('hidden.bs.modal', (e)=> {
            $('#form-new-user').trigger("reset");
            this.resetForm();
        });
    }

    //Salva Um Novo usuário
    saveUser(){
        //Botão Click
        $('#btn-send-new-user').click(() => {
            
           if(this.validationFormUser()){

                $('#modal-new-user').modal('hide');
                Utils.showModalLoad('Salvando');

                fetch('/save-new-user',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: $('#user-name').val(), 
                        cpf: $('#user-cpf').val(),
                        birth: $('#user-birth').val(),
                        gender: ($('#user-gender').val() == 'Masculino') ? 'M': 'F'
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
    validationFormUser(){
        this.resetForm();
        let name = $('#user-name').val();
        let cpf = $('#user-cpf').val();
        let birth = $('#user-birth').val();
        let gender = $('#user-gender').val();
    
        if(name == '' || name.length < 3){
            this.showErrorForm('#user-name', '#error-user-name');
            return false;
        }else if(cpf.length != 9){
            this.showErrorForm('#user-cpf', '#error-user-cpf');
            return false;
        }else if(birth == ''){
            this.showErrorForm('#user-birth', '#error-user-birth');
            return false;
        }else if(gender == ''){
            this.showErrorForm('#user-gender', '#error-user-gender');
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
        $('#form-new-user input').removeClass('invalid');
        $('#form-new-user small').addClass('d-none');
    }

  

}