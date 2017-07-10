#!/usr/bin/env node
const TeleBot = require('telebot');
const bot = new TeleBot('398889955:AAFxjVgOxWPhxO7S-xKy_sc6A90mFZpQ6Rk');

bot.on('/масло', (msg) => msg.reply.text('В мотор Motul excess 5w40 4.2л\n' +
    '       прокладка 9956-41-400 \n' +
    'В коробку Motul gear 300 75w90 2.1л\n' +
    'В редуктор Motul gear 300 LS 75w90 0.8л\n' +
    '       болт сапун 073026060'))
bot.on('/маслоакпп', (msg) => msg.reply.text('SJ01-21-500 фильтр АКПП;\n' +
    'SJ01-19-852 прокладка (кольцо) под фильтр АКПП;\n' +
    'SJ01-19-835 пркладка поддона АКПП;\n' +
    'BT24-19-859 прокладка сливной и контрольной пробок (2 шт.);\n' +
    'JWS3309 тип жидкости АКПП (7.4л, с учетм промывки 11-12л).'))

bot.on('/антифриз', (msg) => msg.reply.text('FL22 7-8л.'))
bot.on('/фильтр', (msg) => msg.reply.text('Масляный фильтр SHY114302\n' +
    'Воздушный фильтр LFG113Z409A\n' +
    'Топливный фильтр сеточка LFB613ZE1\n' +
    'Топливный фильтр тонкой очистки LFG113ZE0'))
bot.on(['/ремень','/ролик'], (msg) => msg.reply.text('Ремень приводной LF1715909B\n' +
                                            'Ролик приводного ремня VKM64003'))
bot.on('/свечи', (msg) => msg.reply.text('Denso ITV20 или ' +
    'NGK ILTR6A-13G 4шт.'))
bot.on('/тормозуха', (msg) => msg.reply.text('Motul Dot 5.1 1л'))
bot.on(['/тормоза','/колодки'], (msg) => msg.reply.text('Передние колодки NFY73328Z9C\n' +
    'Задние колодки NFY72648ZA\n' +
    'Диск передний N12Y3325XB\n' +
    'Диск задний N12326251A\n'))
bot.on(['/сцепление','/сцепа'], (msg) => msg.reply.text('Комплект 6ст. Exedy MZK1006\n' +
    'Комплект 5ст. Exedy MZK1005'))
bot.on(['/стойки','/втулки'], (msg) => msg.reply.text('Стойка стаба перед левая F189-34-170\n' +
    'Стойка стаба перед правая F189-34-150\n' +
    'Втулка стаба перед NG20-34-156\n' +
    'Стойка стаба зад F151-28-170\n' +
    'Втулка стаба зад NF53-28-156B\n'))
bot.on('/диски', (msg) => msg.reply.text('17\" 5x114.3 ширина 7 вылет 55 цо 67.1'))
bot.on('/стабы', (msg) => msg.reply.photo('./rollbars.jpg'))

bot.on('/faq', (msg) => msg.reply.text('/масло\n' +
    '/маслоакпп\n' +
    '/антифриз\n' +
    '/фильтр\n' +
    '/ремень /ролик\n' +
    '/свечи\n' +
    '/тормозуха\n' +
    '/тормоза /колодки\n' +
    '/сцепа /сцепление\n' +
    '/стойки /втулки\n' +
    '/диски\n' +
    '/стабы\n'))

bot.start();