class Pagination{
	constructor(totalResults, recordsPerPage, searchCallback){
		this.currentPage = 1;
		this.totalResults = totalResults;
		this.recordsPerPage = recordsPerPage;
		this.searchCallback = searchCallback;
	}
	
	init(){
		this.paginationDiv = document.getElementById("pagination");
		this.btnNext = document.getElementById("btnNext");
		this.btnPrev = document.getElementById("btnPrev");
		this.pageSpan = document.getElementById("page");
		this.btnPrev.style.display = "none";
		this.paginationDiv.style.display = !this.totalResults ? "none" : "";
		this.pageSpan.innerHTML = this.currentPage;
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
			this.btnPrev.style.display = "none";
		} else{
			this.btnPrev.style.display = "";
		}

		if (page == this.numPages){
			this.btnNext.style.display = "none";
		} else{
			this.btnNext.style.display = "";
		}
	}

	get numPages(){
		return Math.ceil(this.totalResults / this.recordsPerPage);
	}
}