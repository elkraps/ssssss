require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const token = '5884276075:AAEMEPqrc26bAi8-0wRRYG4RKAxfUfyxtVw';
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {polling: true});
const WAurl = 'https://main--glistening-starship-723c56.netlify.app/';

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === '/start'){
        await bot.sendMessage(chatId, 'Thanks for your message, visit our site', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Place an order', web_app:{url: WAurl}}]
                ]
             }
         })
         await bot.sendMessage(chatId, 'Fill in the form down!', {
            reply_markup: {
            keyboard: [
                    [{text: 'Info', web_app:{url: WAurl + '/form'}}]
                ]
             }
         })
    }
    if (msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data)
            await bot.sendMessage(chatId,'Information is accepted');
            await bot.sendMessage(chatId, 'Your street is ' + data?.address);
        } catch (e) {
            console.log(e);
        }
       
    }
    
  });

  app.post('/web-data', async (req,res) => {
    const {queryId, products, totalPrice} = req.body;
        try {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Successful!',
                input_message_content: {message_text:'All done, total amount spent: ' + totalPrice}
            })
            return res.status(200).json({});
        } catch (e) {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Something went wrong',
                input_message_content: {message_text:'Something went wrong'}
            })
            return res.status(500).json({});
        }
        
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
