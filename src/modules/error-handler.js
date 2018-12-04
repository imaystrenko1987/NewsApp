export class ErrorHandler{
    constructor(event) {
        this.message = event.message;
    }

    process(){
        ErrorHandlerPopup.getInstance().show(this.message);
    }
}

class ErrorHandlerPopup{
    static createInstance(){
        return new ErrorHandlerPopup();
    }

    static getInstance(){
        this.errorHandlerPopup = this.errorHandlerPopup 
                ? this.errorHandlerPopup 
                : this.createInstance();
        return this.errorHandlerPopup;
    }

    show(message){
        const tmpl = `<span class="helper"></span><div><div class="popupCloseButton">x</div><p>${message}</p></div>`;
        const errorDiv = document.createElement("div");
        errorDiv.innerHTML = tmpl;
        errorDiv.className = "custom-error-popup";
        document.body.appendChild(errorDiv);
        const closeButton = document.getElementsByClassName('popupCloseButton')[0];
        closeButton.addEventListener('click', () => {
            this.hide();
        });
    }

    hide(){
        document.getElementsByClassName('custom-error-popup')[0].remove();
    }
}