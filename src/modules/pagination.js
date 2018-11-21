export class Pagination{
    constructor(...rest){
        this.currentPage = 1;
        [this.totalResults, this.recordsPerPage, this.searchCallback] = rest;
    }
    
    init(){
        this.paginationDiv = document.getElementById("pagination");
        this.btnNext = document.getElementById("btnNext");
        this.btnPrev = document.getElementById("btnPrev");
        this.pageSpan = document.getElementById("page");
        this.pageOfSpan = document.getElementById("pageOf");
        this.btnPrev.disabled = true;
         this.btnNext.disabled = this.numPages === 1;
        this.paginationDiv.style.display = !this.totalResults ? "none" : "";
        this.pageSpan.innerHTML = this.currentPage;
        this.pageOfSpan.innerHTML = this.numPages;
        this.btnNext.onclick = this.nextPage.bind(this);
        this.btnPrev.onclick = this.prevPage.bind(this);
    }

    prevPage(){
        if (this.currentPage > 1) {
            this.currentPage--;
            this.changePage(this.currentPage);
        }
        return false;
    }

    nextPage(){
        if (this.currentPage < this.numPages) {
            this.currentPage++;
            this.changePage(this.currentPage);
        }
        return false;
    }

    changePage(page){
        this.searchCallback(page);
        this.pageSpan.innerHTML = page;
        if (page == 1){
            this.btnPrev.disabled = true;
        } else{
            this.btnPrev.disabled = false;
        }

        if (page == this.numPages){
            this.btnNext.disabled = true;
        } else{
            this.btnNext.disabled = false;
        }
    }

    get numPages(){
        return Math.ceil(this.totalResults / this.recordsPerPage);
    }
}