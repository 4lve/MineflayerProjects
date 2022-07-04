const mineflayer = require('mineflayer')
const antiafk = require("mineflayer-antiafk");
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const botOwner = '4LVE'

const rl = readline.createInterface({ input, output });


const bot = mineflayer.createBot({
    host: 'factions.nftworlds.com',
    username: '...',
    password: '...',
    auth: '...'
})





rl.on('line', (answer) => {
    if(answer.startsWith('.')) {
        switch (answer){
        case '.tpa':
            bot.chat('/tpa ' + botOwner)
            break;
        case '.afk':
            bot.afk.start();
            break;
        case '.stopafk':
            bot.afk.stop();
            break;
        default:
            console.log('Invalid Command')
            break;
        }
    }else {
        bot.chat(answer)
    }
});

bot.on('inject_allowed', () => {
    bot.loadPlugin(antiafk);
    bot.afk.setOptions({
        chatMessages: ['/captcha'],
        chatInterval: 120000,
        maxWalkingTime: 16000
    })
})

bot.on('login', () => {
    bot.chat('/queue FactionsGreen')
    bot.afk.start();
})

bot.on('whisper', (username, message) => {
    if(username == '4LVE') {
        switch (message){
            case 'tpa':
                bot.chat('/tpa 4LVE')
                break;
            case 'afk':
                bot.afk.start();
                break;
            case 'stopafk':
                bot.afk.stop();
                break;
        }

    }
})

bot.on('windowOpen', () => {
    setTimeout(() => {
        doCaptcha()
    }, 1000);
})

bot.on('message', (message) => {
    console.log(message.toAnsi())
    if(message == '✗ Failed captcha'){
        for (let i = 0; i < 9; i++) {
            bot.clickWindow(i, 0, 0)
        }
    }else if (message == '✔ Completed captcha') {
        console.log('Captcha Done')
    }
})

bot.on('death', () => {
    bot.afk.stop();
    setTimeout(() => {
        bot.chat('/f home')
    }, 1000);
    setTimeout(() => {
        bot.afk.start();
    }, 10000);
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)


async function doCaptcha() {

    let minecraftColors = {
        "White": "#f9ffff",
        "Light Gray": "#9c9d97",
        "Gray": "#474f52",
        "Black": "#1d1c21",
        "Yellow": "#ffd83d",
        "Orange": "#f9801d",
        "Red": "#b02e26",
        "Brown": "#825432",
        "Lime": "#80c71f",
        "Green": "#5d7c15",
        "Light Blue": "#3ab3da",
        "Cyan": "#169c9d",
        "Blue": "#3c44a9",
        "Pink": "#f38caa",
        "Magenta": "#c64fbd",
        "Purple": "#8932b7"
    }

    var nearestColor = require('nearest-color').from(minecraftColors);

    let guiTitleColor = (JSON.parse(bot.currentWindow.title).extra[0].color)
    let slots = []
    for (let i = 0; i < 9; i++) {
        slots.push(bot.currentWindow.slots[i])
    }

    let itemName = (nearestColor(guiTitleColor).name + ' Stained Glass Pane')

    slots.forEach((item, slot) => {
        if(item.displayName == itemName) {
            console.log(itemName)
            bot.clickWindow(slot, 0, 0)
        }
    })
}
