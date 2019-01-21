class Utils {

    static showModalSuccess(message){
        $('#modal-message-success').html(message);
        $('#modal-success').modal('show');
    }

    static showModalFailed(message){
        $('#modal-message-failed').html(message);
        $('#modal-failed').modal('show');
    }

    static showModalLoad(message){
        $('#modal-load-message').html(message);
        $('#modal-load').modal('show');
    }

    static hideModalLoad(){
        setInterval(()=> {
            $('#modal-load').modal('hide');
        }, 5);
    }

}