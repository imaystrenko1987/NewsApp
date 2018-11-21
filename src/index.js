"use strict";

import { NewsParser } from './modules/news-parser'

require('es6-promise').polyfill();
require('isomorphic-fetch');

const parser = new NewsParser("https://newsapi.org/v2", "c86673b92a5d4a768d8fb20b91eb795f");
parser.init();