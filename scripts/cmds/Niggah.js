const axios = require("axios");

async function getNiggahImage(imageUrl) {
  try {
    const res = await axios.get(`http://208.84.102.89:6187/api/canvas/niggah?image=${encodeURIComponent(imageUrl)}`);
    return res.data?.image || null;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "niggah",
    aliases: ["nigga", "nig"],
    version: "1.0",
    author: "Mesbah Saxx",
    countDown: 5,
    role: 0,
    description: {
      en: "Generate a funny canvas effect with a user's avatar."
    },
    category: "fun",
    guide: {
      en: "{pn} <UID|mention|URL>"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { findUid, getStreamFromUrl } = global.utils;

    let uid;
    if (args.length > 0) {
      const firstArg = args[0];
      if (/^(http|https):\/\/[^ "]+$/.test(firstArg)) uid = await findUid(firstArg);
      else uid = parseInt(firstArg);
    } else if (event.messageReply) uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions).length > 0) uid = Object.keys(event.mentions)[0];
    else return message.reply("⚠️ Please provide a user ID, profile URL, or mention someone.");

    const imgUrl = await getNiggahImage(await usersData.getAvatarUrl(uid));
    if (!imgUrl) return message.reply("❌ Failed to generate image.");

    return message.reply({ attachment: await getStreamFromUrl(imgUrl) });
  }
};
