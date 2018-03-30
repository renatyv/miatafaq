#!/usr/bin/env node
const TeleBot = require('telebot');
const user_added_commands_filename = 'user_commands.json';
// miatafaq_bot
// const bot = new TeleBot({
//     token:'398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk',
//     usePlugins: ['botan'],
//     pluginConfig: {
//         botan: 'ede451c4-aff9-4461-b4d4-964d3663694b'
//     }
// });
const bot = new TeleBot('398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk');

// renats_bot
// const bot = new TeleBot('584587074:AAEj3lrer4dsh21uxPBgt9M92eMHrSXLDZY');
const fs = require('fs');

const filename = '/Users/renatyuldashev/Documents/miatafaq/commands.json';

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

// user_added_commands['масло_мотор'] = 'В мотор 2.0 5w40, 5w30 4.5л\n' +
//     'В мотор 1.8 5w40, 5w30 4.2л\n' +
//     'менять раз в 8-10тыс. км\n' +
//     'Масляный фильтр SHY114302\n' +
//     '       прокладка 9956-41-400';
// user_added_commands['масло_мотор'] = 'В мотор 2.0 5w40, 5w30 4.5л\n' +
//     'В мотор 1.8 5w40, 5w30 4.2л\n' +
//     'менять раз в 8-10тыс. км\n' +
//     'Масляный фильтр SHY114302\n' +
//     '       прокладка 9956-41-400';
// user_added_commands['масло_акпп'] = 'SJ01-21-500 фильтр АКПП;\n' +
//     'SJ01-19-852 прокладка (кольцо) под фильтр АКПП;\n' +
//     'SJ01-19-835 пркладка поддона АКПП;\n' +
//     'BT24-19-859 прокладка сливной и контрольной пробок (2 шт.);\n' +
//     'JWS3309 тип жидкости АКПП (7.4л, с учетм промывки 11-12л)\n'+
//     'Замена www.drive2.ru/l/488178216003960940/';
// user_added_commands['масло_мкпп'] = 'Motul gear 300 75w90 2.1л';
// user_added_commands['масло_редуктор'] = 'GL-5 70W-90, 0.8л\n'+
//     'например Motul gear 300 LS 75w90\n' +
//     'болт сапун 073026060\n'+
//     'медное кольцо-прокладка\n'+
//     'замена раз в 50-70 тыс.км\n'+
//     'Для замены ключ на 17, на 23';
// user_added_commands['антифриз'] = 'FL22 7-8л.';
// user_added_commands['воздушный_фильтр'] = 'LFG113Z409A';
// user_added_commands['топливный_фильтр'] = 'Топливный фильтр сеточка LFB613ZE1\n' +
//     'Топливный фильтр тонкой очистки LFG113ZE0\n'+
//     'менять раз в 60-100 тыс.км\n'+
//     'инструкция: www.drive2.ru/l/456058732577555218/';
// user_added_commands['ремень'] = 'Ремень приводной LF1715909B\n' + 
//     'Ролик приводного ремня VKM64003';
// user_added_commands['свечи'] = 'Denso ITV20 или ' +
//     'NGK ILTR6A-13G 4шт.\n'+
//     'менять раз в 70тыс. км';
// user_added_commands['тормозная_жидкость'] = 'Dot 5.1, 1л\n'+
//     'менять раз в 2 года\n'+
//     'прокачка www.drive2.ru/l/453008412444198294/';
// user_added_commands['жидкость_гура'] = 'www.drive2.ru/l/464755594675355838/';
// user_added_commands['замена_цепи_грм'] = 'www.drive2.ru/l/470868329569976384/';
// user_added_commands['скрипит_салон'] = 'www.drive2.ru/l/494521573462508290/ \n'+
//     'www.drive2.ru/l/7132233/';
// user_added_commands['вода_в_салоне'] = 'Герметизация клипс: www.drive2.ru/l/494521573462508290/ '+
//     'www.drive2.ru/l/456900133850711488/\n'+
//     'чистка дренажа www.drive2.ru/l/453010061711639835/';
// user_added_commands['привод_крыши'] = 'www.drive2.ru/l/455407271938097568/ \n'+
//     'www.drive2.ru/l/476613002947199309/';
// user_added_commands['кулиса'] = 'замена масла www.drive2.ru/l/481051731388530842/ \n'+
//     'www.drive2.ru/l/481052006266438033/';
// user_added_commands['стучит_двигатель'] = 'Терпи, это тазда';
// user_added_commands['плавают_обороты_хх'] = 'Снимал клемму аккумулятора - дай тазде настроиться. Пройдет само.';
// user_added_commands['чистка_дросселя'] = 'www.drive2.ru/l/490184824724652399/';
// user_added_commands['свист_под_капотом'] = 'Изношенный ремень проскальзывает по роликам и свистит. Изношенный ролик будет шуршать.';

// user_added_commands['шум_сзади'] = 'скорее всего у вас изношена задняя ступица';
// user_added_commands['центральный_замок'] = 'www.drive2.ru/l/471715503279178766/';
// user_added_commands['вентилятор_печки'] = 'www.drive2.ru/l/8387454/';
// user_added_commands['растет_температура_ОЖ'] = 'www.drive2.ru/l/486646871184375880/';
// user_added_commands['aux'] = 'www.drive2.ru/l/7504469/';
// user_added_commands['запчасти_от_rx8'] = 'www.drive2.ru/l/8434727/';
// user_added_commands['открыть_крышу_находу'] = 'smart top: MODS4CARS \n'+
//     'ROOFER www.drive2.ru/l/10572846/ www.drive2.ru/l/10426980/';
// user_added_commands['отклик_на_газ'] = 'www.drive2.ru/l/471730346686152983/';
// user_added_commands['подвеска_KONI'] = 'www.drive2.ru/l/472495606779085229/';
// user_added_commands['подвеска_Bilstein'] = 'www.drive2.ru/l/469473049314328709/';
// user_added_commands['стабы_rx8'] = 'www.drive2.ru/l/4539212/';
// user_added_commands['главная_пара'] = 'www.drive2.ru/l/288230376152728457/';
// user_added_commands['тюнячка'] = 'ilmotorsport.de/en/ \n'+
//     'www.carbonmiata.com\n'+
//     'www.good-win-racing.com';
// user_added_commands['рулевая_тяга'] = 'NE51-32-240';
// user_added_commands['тормоза'] = 'Передние колодки NFY73328Z9C\n' +
//     'Задние колодки NFY72648ZA\n' +
//     'В городе TRW перед GDB 3401\n'+
//     'В городе TRW зад GDB 3401\n'+
//     'Колодки для трека (скрипят) HAWK HP+: перед HB522N.565 зад HB523N.539\n'+
//     'Диск передний N12Y3325XB\n' +
//     'Диск задний N12326251A\n'+
//     'Ремкомплект переднего суппорта B2YD-33-26Z\n'+
//     'Подробнее www.drive2.ru/l/486917351044809228/';
// user_added_commands['сцепление'] = 'Комплект 6ст. Exedy MZK1006\n' +
//     'Корзина: ZC13T либо MZC649 (также c минимальными переделками MZC619)\n'+
//     'Диск: ZD13H либо LF0416460B (также c минимальными переделками MDB001U)\n'+
//     'Выжимной подшипник: BRG708\n'+
//     'Подшипник вала: YF0911303\n'+
//     'Комплект 5ст. Exedy MZK1005\n'+
//     'где найти www.drive2.ru/l/498203837903930168/';
// user_added_commands['стойки'] = 'Стойка стаба перед левая F189-34-170\n' +
//     'Стойка стаба перед правая F189-34-150\n' +
//     'Втулка стаба перед NG20-34-156\n' +
//     'Стойка стаба зад F151-28-170\n' +
//     'Втулка стаба зад NF53-28-156B\n';
// user_added_commands['диски'] = '17\" 5x114.3 ширина 7 вылет 55 цо 67.1';
// user_added_commands['сайлентблоки'] = 'Оригинал или полиуретан\n'+
//     'Например Energy Suspension 11.18104';
bot.on('/стабы', (msg) => msg.reply.photo('./rollbars.jpg'))

bot.start();