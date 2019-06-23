#!/usr/bin/env node
const TeleBot = require('telebot');
const miatafaq_token = '398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk';
// test token
const renats_bot_token = '584587074:AAEj3lrer4dsh21uxPBgt9M92eMHrSXLDZY';
const bot = new TeleBot(renats_bot_token);


const spb_miataclub_chat_id = -28715622;
const tech_chat_id = -1001145216568;
const miataclub_id = -1001095126053;
const test_bots_chat_id = -217181742;

const fs = require('fs');

function loadMapFromFile(filename){
    let rawdata = fs.readFileSync(filename);  
    return JSON.parse(rawdata);
}

var requests_answers_map = loadMapFromFile('text_commands.json');
console.log('loading request maps\n'+Object.keys(requests_answers_map));

function execUserCommand(msg,props){
    // console.log(props);
    try{
        request = props.match[1].toLowerCase();
        console.log(request);
        switch(request) {
            // non text commands
            case 'крюк_крыши':
                msg.reply.text('мануал по подтягиванию крюка крыши');
                var promise = bot.sendDocument(msg.chat.id,'./roof-manual.pdf');
                promise.then(function(result){
                    console.log('roof manual sent');
                },function(error){
                    console.log(error);
                })
                break;
            case 'стабы_рыксы':
                msg.reply.photo('./rollbars.jpg');
                break;
            case 'мануал':
                msg.reply.text('#manual');
                var promise = bot.sendDocument(msg.chat.id,'./workshop_repair_manual.pdf');
                promise.then(function(result){
                    console.log('manual sent');
                },function(error){
                    console.log(error);
                })
                break;
            // list all commands
            case 'all':
            case 'start':
            case 'faq':
                non_text_requests = ['/стабы_рыксы','/мануал']
                var slashed_requests = Object.keys(requests_answers_map).map((request)=>'/'+request).concat(non_text_requests);
                var list_of_requests = slashed_requests.join(', ');
                return msg.reply.text(list_of_requests);
                break;
            // text commands
            default:
                if (Object.prototype.hasOwnProperty.call(requests_answers_map,request)){
                    console.log('answering /'+request+' from the text map');
                    return msg.reply.text(requests_answers_map[request]);
                }else{
                    console.log('command /'+request+' is unknown');
                    return msg.reply.text('Не знаю /'+request);
                }
            }
    }catch(err){
        console.log(err);
    }
}

bot.on(/^\/([0-9a-zA-Zа-яА-Я_]+)(.*)/, (msg,props) => execUserCommand(msg,props))

bot.start();