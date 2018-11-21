import { Pagination } from './pagination'

export class NewsParser{
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
    
    onFilterChange(){
        this.paging = null;
        this.getNews();
    }
    
    bindEvents(){
        this.channelElem.onchange = this.onFilterChange.bind(this);
        this.recordsCountElem.onchange = this.onFilterChange.bind(this);
    }
    
    async loadSources(){
        this.paging = null;
        try {
            const response = await fetch(`${this.apiUrl}/sources?apiKey=${this.apiKey}`);
            const jsonResult = await response.json();
            let channelElem = document.getElementById("channel");
            let sources = jsonResult.sources;
            sources.forEach(source => {
                let option = document.createElement("option");
                option.text = source.name;
                option.value = source.id;
                channelElem.appendChild(option);
            });
            
            await this.getNews();
            
        }
        catch (err){
            this.setContent(jsonResult.message);
            this.initPagination();
        }
            
    }
    
    async getNews(pageNumber){
        this.clearContent();
        let pageQsParam = pageNumber ? `&page=${pageNumber}` : "";
        try {
            const response = await fetch(`${this.apiUrl}/everything?apiKey=${this.apiKey}&pageSize=${this.recordsCountElem.value}&sources=${this.channelElem.value}${pageQsParam}`);
            const jsonResult = await response.json();
            this.totalResults = jsonResult.totalResults;
            let articles = jsonResult.articles;
            if(articles.length === 0){
                this.setContent("Try another category.");
                return;
            }
            
            articles.forEach(article => {
                this.createArticle(article);
            });
            this.initPagination();
        }
        catch (err){
            this.setContent(jsonResult.message);
            this.initPagination();
        }
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
        this.contentElem.appendChild(article);
    }
}