"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');

window.addEventListener("error", (event) => {
    import('./modules/error-handler')
    .then(module => {
        new module.ErrorHandler(event).process();
    })
});

document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector('#showNewsBtn');
    button.addEventListener('click', () => {
        import('./modules/news-parser')
            .then(module => {
                const parser = new module.NewsParser("https://newsapi.org/v2", "c86673b92a5d4a768d8fb20b91eb795f");
                parser.init();
                const filterContainer = document.querySelector('#filterContainer');
                filterContainer.style.display = "";
                
            })
    });
});