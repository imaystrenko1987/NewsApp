(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./src/modules/news-parser.js":
/*!************************************!*\
  !*** ./src/modules/news-parser.js ***!
  \************************************/
/*! exports provided: NewsParser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewsParser", function() { return NewsParser; });
/* harmony import */ var _pagination__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pagination */ "./src/modules/pagination.js");

class NewsParser {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.contentElem = document.getElementById("rowContainer");
    this.channelElem = document.getElementById("channel");
    this.recordsCountElem = document.getElementById("recordsCount");
  }

  get articleTmpl() {
    return "<img class='logo-image {{logoImageClass}}' src='{{urlToImage}}' alt='Logo image'><h2>{{title}}</h2><p>{{content}}</p>";
  }

  init() {
    this.bindEvents();
    this.loadSources();
  }

  initPagination() {
    if (!this.paging) {
      this.paging = new _pagination__WEBPACK_IMPORTED_MODULE_0__["Pagination"](this.totalResults, this.recordsCountElem.value, this.getNews.bind(this));
      this.paging.init();
    }
  }

  clearContent() {
    this.contentElem.innerHTML = "";
  }

  setContent(text) {
    this.contentElem.innerHTML = text;
  }

  onFilterChange() {
    this.paging = null;
    this.getNews();
  }

  bindEvents() {
    this.channelElem.onchange = this.onFilterChange.bind(this);
    this.recordsCountElem.onchange = this.onFilterChange.bind(this);
  }

  async loadSources() {
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
    } catch (err) {
      this.setContent(jsonResult.message);
      this.initPagination();
    }
  }

  async getNews(pageNumber) {
    this.clearContent();
    let pageQsParam = pageNumber ? `&page=${pageNumber}` : "";

    try {
      const response = await fetch(`${this.apiUrl}/everything?apiKey=${this.apiKey}&pageSize=${this.recordsCountElem.value}&sources=${this.channelElem.value}${pageQsParam}`);
      const jsonResult = await response.json();
      this.totalResults = jsonResult.totalResults;
      let articles = jsonResult.articles;

      if (articles.length === 0) {
        this.setContent("Try another category.");
        return;
      }

      articles.forEach(article => {
        this.createArticle(article);
      });
      this.initPagination();
    } catch (err) {
      this.setContent(jsonResult.message);
      this.initPagination();
    }
  }

  createArticle(articleJson) {
    let replaceItems = new Map();
    replaceItems.set("{{urlToImage}}", articleJson.urlToImage ? articleJson.urlToImage : "");
    replaceItems.set("{{logoImageClass}}", articleJson.urlToImage ? "" : "hidden");
    replaceItems.set("{{content}}", articleJson.content ? articleJson.content : "comming soon...");
    replaceItems.set("{{title}}", articleJson.title);

    let replacer = templStr => {
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

/***/ }),

/***/ "./src/modules/pagination.js":
/*!***********************************!*\
  !*** ./src/modules/pagination.js ***!
  \***********************************/
/*! exports provided: Pagination */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pagination", function() { return Pagination; });
class Pagination {
  constructor(...rest) {
    this.currentPage = 1;
    [this.totalResults, this.recordsPerPage, this.searchCallback] = rest;
  }

  init() {
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

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changePage(this.currentPage);
    }

    return false;
  }

  nextPage() {
    if (this.currentPage < this.numPages) {
      this.currentPage++;
      this.changePage(this.currentPage);
    }

    return false;
  }

  changePage(page) {
    this.searchCallback(page);
    this.pageSpan.innerHTML = page;

    if (page == 1) {
      this.btnPrev.disabled = true;
    } else {
      this.btnPrev.disabled = false;
    }

    if (page == this.numPages) {
      this.btnNext.disabled = true;
    } else {
      this.btnNext.disabled = false;
    }
  }

  get numPages() {
    return Math.ceil(this.totalResults / this.recordsPerPage);
  }

}

/***/ })

}]);
//# sourceMappingURL=0.4f366fc86188221e8aa2.async.js.map