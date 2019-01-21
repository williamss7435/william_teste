class WindowsController {

    constructor(windows){
        this.initAllEventsWindows();
    }

    initAllEventsWindows(){
        this.ShowModalNewDriver();
        this.ShowModalNewUser();
        this.ShowModalNewRace();
        this.showScreenDriver();
        this.showScreenUser();
        this.showScreenRace();
    }

    ShowModalNewDriver(){
        this.showModal('#btn-new-driver', '#modal-new-driver');
    }

    ShowModalNewUser(){
        this.showModal('#btn-new-user', '#modal-new-user');
    }

    ShowModalNewRace(){
        this.showModal('.btn-running', '#modal-new-race-driver');
    }

    showScreenDriver(){
        $('.btn-screen-driver').click(() => {
            this.hideScreen('.btn-screen-user', '#screen-user');
            this.hideScreen('.btn-screen-race', '#screen-race');
            this.showScreen('.btn-screen-driver', '#screen-driver');
        });
    }

    showScreenUser(){
        $('.btn-screen-user').click(() => {
            this.hideScreen('.btn-screen-driver', '#screen-driver');
            this.hideScreen('.btn-screen-race', '#screen-race');
            this.showScreen('.btn-screen-user', '#screen-user');
        });
    }

    showScreenRace(){
        $('.btn-screen-race').click(() => {
            this.hideScreen('.btn-screen-driver', '#screen-driver');
            this.hideScreen('.btn-screen-user', '#screen-user');
            this.showScreen('.btn-screen-race', '#screen-race');
        });
    }

    showModal(btn, modal){
        $(btn).click(event => {
            $(modal).modal('show');
        });
    };

    showScreen(btn, screen){
        $(btn).addClass('btn-screen-select');
        $(screen).removeClass('d-none');
    }

    hideScreen(btn, screen){
        $(btn).removeClass('btn-screen-select');
        $(screen).addClass('d-none');
    }

}