export class ErrorHandler{
    constructor(event) {
        this.message = event.message;
    }

    process(){
        alert(this.message);
    }
}