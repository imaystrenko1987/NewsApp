import { Pagination } from './pagination'
import { HttpRequestFactory } from './http-request-factory'
import { HttpRequestProxy } from './http-request-proxy'
import * as actions from './actions';

export class NewsParser{
    constructor(apiUrl, apiKey, store) {
        this.contentElem = document.getElementById("rowContainer");
        this.channelElem =  document.getElementById("channel");
        this.recordsCountElem = document.getElementById("recordsCount");
        this.proxy = new HttpRequestProxy(new HttpRequestFactory(apiUrl, apiKey)).getProxyInstance();
        this.store = store;
    }
    
    get articleTmpl() {
        return "<img class='logo-image {{logoImageClass}}' src='{{urlToImage}}' alt='Logo image'><h2>{{title}}</h2><p>{{content}}</p>";
    }
    
    init() {
        console.log(this.store.getState().title);
        this.bindEvents();
        this.loadSources();
    }
    
    initPagination(){
        let paging = this.store.getState().paging;
        if(!paging){
            paging = new Pagination(this.totalResults, this.recordsCountElem.value, this.getNews.bind(this));
            paging.init();
            this.store.dispatch(actions.setPaging(paging));
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
            const jsonResult = await this.proxy.get("sources");
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
            const jsonResult = await this.proxy.get("everything", `pageSize=${this.recordsCountElem.value}&sources=${this.channelElem.value}${pageQsParam}`);
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