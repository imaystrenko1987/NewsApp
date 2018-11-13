"use strict";

class NewsParser{
	constructor(apiUrl, apiKey) {
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;
		this.contentElem = document.getElementById("content");
		this.channelElem =  document.getElementById("channel");
		this.recordsCountElem = document.getElementById("recordsCount");
		this.searchButton = document.getElementById("searchButton");
	}
	
	get articleTmpl() {
		return "<h1>{{title}}</h1> <div> <img alt='' class='logo-image {{logoImageClass}}' src='{{urlToImage}}'/> <p>{{content}}</p> </div>";
	}
	
	init() {
		this.bindEvents();
		this.loadSources();
	}
	
	initPagination(){
		if(!this.paging){
			this.paging = new Pagination(this.totalResults, this.recordsCountElem.value, this.getNews.bind(this));
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
		searchButton.onclick = this.loadSources.bind(this);
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
		let count = this.recordsCountElem.value;
		let channel = this.channelElem.value;
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
		
		let article = document.createElement("article");
		article.innerHTML = replacer(this.articleTmpl);
		this.contentElem.append(article);
	}
}
