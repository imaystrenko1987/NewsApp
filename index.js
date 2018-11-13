"use strict";
(function (){
	class NewsParser{
		constructor(apiUrl, apiKey) {
			this.apiUrl = apiUrl;
			this.apiKey = apiKey;
			this.contentElem = document.getElementById("rowContainer");
			this.channelElem =  document.getElementById("channel");
			this.recordsCountElem = document.getElementById("recordsCount");
		}
		
		get articleTmpl() {
			return "<img class='logo-image {{logoImageClass}}' src='{{urlToImage}}' alt='Logo image'><h2>{{title}}</h2><p>{{content}}</p>";
		}
		
		init() {
			this.bindEvents();
			this.loadSources();
		}
		
		initPagination(){
			if(!this.paging){
				let callbacks = [this.getNews.bind(this)]
				this.paging = new Pagination(this.totalResults, this.recordsCountElem.value, ...callbacks);
				this.paging.init();
			}
		}
		
		clearContent(){
			this.contentElem.innerHTML = "";
		}
		
		setContent(text){
			this.contentElem.innerHTML = text;
		}
		
		bindEvents(){
			this.channelElem.onchange = this.loadSources.bind(this);
			this.recordsCountElem.onchange = this.loadSources.bind(this);
		}
		
		loadSources(){
			this.paging = null;
			let errorHappens = false;
			let req = new Request(`${this.apiUrl}/sources?apiKey=${this.apiKey}`);
			fetch(req)
			.then(r => {
				if (!r.ok) {
					errorHappens = true;
				}
				return r;
			})
			.then(response => response.json())
			.then(jsonResult => {
				if(errorHappens){
					this.setContent(jsonResult.message);
					this.initPagination();
					return;
				}
				let channelElem = document.getElementById("channel");
				let sources = jsonResult.sources;
				sources.forEach(source => {
					let option = document.createElement("option");
					option.text = source.name;
					option.value = source.id;
					channelElem.appendChild(option);
				});
				this.getNews();
			});	
		}
		
		getNews(pageNumber){
			this.clearContent();
			let count, channel;
			[count, channel] = [this.recordsCountElem.value, this.channelElem.value];
			let pageQsParam = pageNumber ? `&page=${pageNumber}` : "";
			let req = new Request(`${this.apiUrl}/everything?apiKey=${this.apiKey}&pageSize=${count}&sources=${channel}${pageQsParam}`);
			let errorHappens = false;
			fetch(req)
			.then(r => {
				if (!r.ok) {
					errorHappens = true;
				}
				return r;
			})
			.then(response => response.json())
			.then(jsonResult => {
				if(errorHappens){
					this.setContent(jsonResult.message);
					this.initPagination();
					return;
				}
				this.totalResults = jsonResult.totalResults;
				let articles = jsonResult.articles;
				if(articles.length === 0){
					this.setContent("Try another category.");
					return;
				}
				
				articles.forEach(article => {
					this.createArticle(article);
				});
			})
			.then(()=> this.initPagination());
		}
		
		createArticle(articleJson){
			let replaceItems = new Map();
			replaceItems.set("{{urlToImage}}", articleJson.urlToImage ? articleJson.urlToImage : "");
			replaceItems.set("{{logoImageClass}}", articleJson.urlToImage ? "" : "hidden");
			replaceItems.set("{{content}}", articleJson.content ? articleJson.content : "comming soon...");
			replaceItems.set("{{title}}", articleJson.title);
			
			let replacer = (templStr) => { 
				replaceItems.forEach((value, key) => {
					templStr = templStr.replace(key, value);
				});
				return templStr; 
			};
			
			let article = document.createElement("div");
			article.className = "col-lg-4";
			article.innerHTML = replacer(this.articleTmpl);
			this.contentElem.append(article);
		}
	}
		
	class Pagination{
		constructor(totalResults, recordsPerPage, ...callbacks){
			this.currentPage = 1;
			this.totalResults = totalResults;
			this.recordsPerPage = recordsPerPage;
			[this.searchCallback] = callbacks;
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
	
	const parser = new NewsParser("https://newsapi.org/v2", "c86673b92a5d4a768d8fb20b91eb795f");
	parser.init();
})();