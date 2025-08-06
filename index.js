require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = parseInt(process.env.API_ID);

const apiHash = process.env.API_HASH;
const stringSession = new StringSession(""); // Faylga saqlash uchun ishlatamiz

(async () => {
  console.log("Telegramga ulanmoqda...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("📱 Telefon raqamingizni kiriting (masalan, +998901234567): "),
    password: async () => await input.text("🔐 2FA parolingizni kiriting (agar kerak bo‘lsa): "),
    phoneCode: async () => await input.text("📩 SMS kodni kiriting: "),
    onError: (err) => console.log("Xatolik:", err),
  });

  console.log("✅ Muvaffaqiyatli ulandik!");
  console.log("🧠 Session string: ", client.session.save());
  console.log("📡 Kanallar yuklanmoqda...\n");

  const dialogs = await client.getDialogs();
  const channels = dialogs.filter(dialog => dialog.isChannel);

  if (channels.length === 0) {
    console.log("❗️Siz aʼzo bo‘lgan hech qanday kanal topilmadi.");
  } else {
    channels.forEach((channel, index) => {
      console.log(`📺 Kanal ${index + 1}`);
      console.log(`   Nomi     : ${channel.title}`);
      console.log(`   ID       : ${channel.id}`);
      console.log(`   Username : ${channel.entity.username || "yo‘q"}\n`);
    });
  }

  await client.disconnect();
})();
