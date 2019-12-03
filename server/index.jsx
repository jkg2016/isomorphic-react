import express from "express";
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';
import { argv} from 'optimist';
import {get} from 'request-promise';
import {questions, question} from '../data/api-real-url' ;
import {delay} from 'redux-saga';


const port = process.env.PORT || 3000;
const app = express();

/**
 * Get basic configuration settings from arguments
 * This can be replaced with webpack configuration or other global variables as required
 * When useServerRender is true, the application will be pre-rendered on the server. Otherwise,
 * just the normal HTML page will load and the app will bootstrap after it has made the required AJAX calls
 */
const useServerRender = argv.useServerRender === 'true';

/**
 * When useLiveData is true, the application attempts to contact Stackoverflow and interact with its actual API.
 * NOTE: Without an API key, the server will cut you off after 300 requests. To solve this, get an API key from
 * Stackoverflow (for free at https://stackapps.com/apps/oauth/register)
 * OR, just disable useLiveData
 */
const useLiveData = argv.useLiveData === 'true';

/**
 * Returns a response object with an [items] property containing a list of the 30 or so newest questions
 */
function * getQuestions (){
    let data;
    if (useLiveData) {
        /**
         * If live data is used, contact the external API
         */
        data = yield get(questions,{gzip:true});
    } else {
        /**
         * If live data is not used, read the mock questions file
         */
        data = yield fs.readFile('./data/mock-questions.json',"utf-8");
    }

    /**
     * Parse the data and return it
     */
    return JSON.parse(data);
}

/**
 * Creates an api route localhost:3000/api/questions, which returns a list of questions
 * using the getQuestions utility
 */
app.get('/api/questions',function *(req,res){
    const data = yield getQuestions();
    /**
     * Insert a small delay here so that the async/hot-reloading aspects of the application are
     * more obvious. You are strongly encouraged to remove the delay for production.
     */
    yield delay(150);
    res.json(data);
});


function * getQuestion (question_id) {
    let data;
    if (useLiveData) {
        /**
         * If live data is used, contact the external API
         */
        data = yield get(question(question_id),{gzip:true,json:true});
    } else {
        /**
         * If live data is not used, get the list of mock questions and return the one that
         * matched the provided ID
         */
        const questions = yield getQuestions();
        const question = questions.items.find(_question=>_question.question_id == question_id);
        /**
         * Create a mock body for the question
         */
        question.body = `Mock question body: ${question_id}`;
        data = {items:[question]};
    }
    return data;
}

/**
 * Special route for returning detailed information on a single question
 */
app.get('/api/questions/:id',function *(req,res){
    const data = yield getQuestion(req.params.id);
    /**
     * Remove this delay for production.
     */
    yield delay(150);
    res.json(data);
});



if (process.env.NODE_ENV === 'development')
{
    const config = require('../webpack.config.dev.babel').default;
    const compiler = webpack(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo:true
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}
app.get(['/'], function * (req, res) {
    let index = yield fs.readFile('./public/index.html',"utf-8");
    res.send(index);
})

app.listen(port, '0.0.0.0', () => console.info(`App listening on ${port}`));