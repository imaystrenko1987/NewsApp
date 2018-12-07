"use strict";

require('es6-promise').polyfill();
require('isomorphic-fetch');
import { createStore } from 'redux';
import reducer from './modules/reducer';

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

document.title = store.getState().title;

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
                const parser = new module.NewsParser("https://newsapi.org/v2", "c86673b92a5d4a768d8fb20b91eb795f", store);
                parser.init();
                const filterContainer = document.querySelector('#filterContainer');
                filterContainer.style.display = "";
            })
    });
    
    const errorButton = document.querySelector('#tryErrorBtn');
    errorButton.addEventListener('click', () => {debugger; throw new Error("test error") });
});