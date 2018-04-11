#!/usr/bin/env node
const TeleBot = require('telebot');
// miatafaq_bot
const bot = new TeleBot({
    token:'398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk',
    usePlugins: ['botan'],
    pluginConfig: {
        botan: 'ede451c4-aff9-4461-b4d4-964d3663694b'
    }
});

const spb_miataclub_chat_id = -28715622;
const tech_chat_id = -1001145216568;
const miataclub_id = -1001095126053;
const test_bots_chat_id = -217181742;

const fs = require('fs');

function loadCommandsFromFile(filename){
    let rawdata = fs.readFileSync(filename);  
    return JSON.parse(rawdata);
}

function saveCommandsToFile(filename,commands){
    let data = JSON.stringify(commands,(k,v)=>v,1);
    fs.writeFile(filename, data,(err) => {
      if (err){
        console.log('File save error!.');
      }else{
        console.log('The file '+filename+' has been updated.');
        console.log(commands);  
      }
    });
    return;
}

const reserved_commands_array=['add','faq','мануал','стабы_рыксы'];

const default_commands_filename = 'default_commands.json';
var default_commands = loadCommandsFromFile(default_commands_filename);
const user_added_commands_filename = 'user_commands.json';
var user_added_commands = loadCommandsFromFile(user_added_commands_filename);
var commands = Object.assign(default_commands,user_added_commands);


function parseNewCommand(msg){
    regexp = /\/add ([0-9a-zA-Zа-яА-Я_ёЁ]+)/;
    match_result = msg.text.match(regexp);
    console.log(match_result);
    if (match_result){
        new_command = match_result[1].toLowerCase();
        new_command_result = msg.text.replace(regexp,'');
        return {command:new_command,result:new_command_result};
    }else{
        console.log('match error');
        return -1; 
    }
}

function addCommand(msg){
    var chat_id = msg.chat.id;
    if((chat_id === tech_chat_id)|| (chat_id === miataclub_id) || (chat_id === test_bots_chat_id)){
        var user_id = msg.from.id;
        var chat_member_promise = bot.getChatMember(msg.chat.id,msg.from.id);
        chat_member_promise.then(function(result) {
                if (result.ok){
                    var chat_member = result.result;
                    if (chat_member.status === 'administrator'){
                        console.log(chat_member.user.id+' is administrator');
                        var parsed_command = parseNewCommand(msg);
                        if (parsed_command === -1){
                            msg.reply.text('/add команда результат');
                        }else{
                            user_added_commands[parsed_command.command]=parsed_command.result;
                            commands[parsed_command.command]=parsed_command.result;
                            saveCommandsToFile(user_added_commands_filename,user_added_commands);
                            console.log('команда "'+new_command+'" добавлена в faq');
                            msg.reply.text('команда "'+new_command+'" добавлена в faq');    
                        }
                    }else{
                        msg.reply.text('Только админы пополняют faq');
                        console.log('not admin id='+chat_member.user.id+' tried to add command');
                    }    
                }else{
                    console.log(result);    
                }
            }, function(err) {
                console.log('promise error');
                console.log(err);
            });
    }else{
        console.log('wrong chat '+chat_id);
        msg.reply.text('Добавлять могут только админы в чате Miataclub.ru или техчате');
    }
}

function execUserCommand(msg,props){
    console.log(msg.chat);
    command = props.match[1].toLowerCase();
    switch(command) {
        case 'стабы_рыксы':
            msg.reply.photo('./rollbars.jpg');
            break;
        case 'мануал':
            bot.sendDocument(msg.chat.id,'BQADAgADZAEAAsZOUErgsF44EGVsdgI');
            break;
        case 'all':
        case 'start':
        case 'faq':
            console.log('/faq');
            additional_commands = ['/стабы_рыксы','/мануал']
            var slashed_commands = Object.keys(commands).map((command)=>'/'+command).concat(additional_commands);
            var list_of_commands = slashed_commands.join(', ');
            return msg.reply.text(list_of_commands);
            break;
        case 'add':
            console.log('/add');
            addCommand(msg);
            break;
        default:
            if (Object.prototype.hasOwnProperty.call(commands,command)){
                console.log('executing /'+command+' from the datastore');
                return msg.reply.text(commands[command]);
            }else{
                console.log('command /'+command+' is unknown');
                return msg.reply.text('Не знаю /'+command);
            }
    }
}

bot.on(/^\/([0-9a-zA-Zа-яА-Я_]+)(.*)/, (msg,props) => execUserCommand(msg,props))

bot.start();