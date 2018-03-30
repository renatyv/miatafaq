#!/usr/bin/env node
const TeleBot = require('telebot');
const user_added_commands_filename = 'user_commands.json';
// miatafaq_bot
const bot = new TeleBot({
    token:'398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk',
    usePlugins: ['botan'],
    pluginConfig: {
        botan: 'ede451c4-aff9-4461-b4d4-964d3663694b'
    }
});
// const bot = new TeleBot('398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk');

const fs = require('fs');

const filename = 'commands.json';

function loadCommandsFromFile(){
    let rawdata = fs.readFileSync(filename);  
    return JSON.parse(rawdata);
}

function saveCommandsToFile(commands){
    let data = JSON.stringify(commands,(k,v)=>v,1);  
    fs.writeFile(filename, data,(err) => {
      if (err){
        console.log('File save error!.');
      }else{
        console.log('The file has been updated.');  
      }
    });
    return;
}

const reserved_commands_array=['add','faq'];
var user_added_commands = loadCommandsFromFile();

function addCommand(msg,new_command,new_command_result){
    if (reserved_commands_array.indexOf(new_command) == -1){
        console.log('command '+new_command+' is not reserved');
        var chat_id = msg.chat.id;
        var user_id = msg.from.id;
        var chat_member_promise = bot.getChatMember(msg.chat.id,msg.from.id);
        chat_member_promise.then(function(result) {
            if (result.ok){
                var chat_member = result.result;
                if (chat_member.status === 'administrator'){
                    console.log('is administrator');
                    user_added_commands[new_command]=new_command_result;
                    saveCommandsToFile(user_added_commands)
                    console.log(user_added_commands);
                    msg.reply.text(new_command+' добавлено в faq');
                }else{
                    msg.reply.text('Только админы пополняют faq');
                }    
            }else{
                console.log(result);    
            }
        }, function(err) {
            console.log(err);
        });
    }else{
        return msg.reply.text('команда '+new_command+' зарезервирована');
    }   
}

function execUserCommand(msg,props){
    console.log(msg.chat);
    command = props.match[1];
    switch(command) {
        case 'faq':
            console.log('/faq');
            // console.log(Object.keys(user_added_commands).join(', '));
            var slashed_commands = Object.keys(user_added_commands).map((command)=>'/'+command);
            var list_of_commands = slashed_commands.join(', ');
            return msg.reply.text(list_of_commands);
            break;
        case 'add':
            var new_command_string = props.match[2].trim();
            console.log('/add '+new_command_string);
            match_result = new_command_string.match(/([0-9a-zA-Zа-яА-Я_]+) (.+)$/);
            if (match_result){
                new_command = match_result[1];
                new_command_result = match_result[2];
                return addCommand(msg,new_command,new_command_result);
            }else{
                return msg.reply('/add ваша_команда__123 результат');
            }
            break;
        default:
            if (Object.prototype.hasOwnProperty.call(user_added_commands,command)){
                console.log('command /'+command+' is in the datastore');
                return msg.reply.text(user_added_commands[command]);
            }else{
                console.log('command /'+command+' is unknown');
                return msg.reply.text('Не знаю "'+command+'". Добавить так:\n'+
                    '/add '+command+' _новый_результат_');
            }
    }
}

bot.on(/^\/([0-9a-zA-Zа-яА-Я_]+)(.*)/, (msg,props) => execUserCommand(msg,props))
bot.on('/стабы', (msg) => msg.reply.photo('./rollbars.jpg'))

bot.start();