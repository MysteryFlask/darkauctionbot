const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content === '!prices') {
    const items = [
      'MIDAS_SWORD',
      'SPIRIT_MASK',
      'ENDER_ARTIFACT',
      'WITHER_ARTIFACT',
      'NETHER_ARTIFACT',
      'PET_PARROT_EPIC',
      'PET_PARROT_LEGENDARY',
      'PET_TURTLE_EPIC',
      'PET_TURTLE_LEGENDARY',
      'PET_JELLYFISH_EPIC',
      'PET_JELLYFISH_LEGENDARY',
      'DARK_AUCTION',
      'DYE_PURPLE:5',
      'PAINTING_MISC:3'
    ];

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Lowest BIN Auction Prices in Hypixel Skyblock (Today)')
      .setDescription('Prices are updated every 5 minutes.');

    const now = Date.now();
    const today = new Date(now).toISOString().split('T')[0];

    for (const item of items) {
      const response = await fetch(`https://api.hypixel.net/skyblock/auction?key=HYPIXEL_API_KEY&item_name=${encodeURIComponent(item)}&page=0`);
      const data = await response.json();

      if (data.success && data.auctions.length > 0) {
        const lowestBinToday = data.auctions.reduce((min, auction) => {
          if (auction.bin && auction.bin < min && new Date(auction.end).toISOString().split('T')[0] === today) {
            return auction.bin;
          } else {
            return min;
          }
        }, Number.MAX_SAFE_INTEGER);

        if (lowestBinToday !== Number.MAX_SAFE_INTEGER) {
          const price = lowestBinToday.toLocaleString();
          embed.addField(item, `${price} coins`, true);
        }
      }
    }

    msg.channel.send(embed);
  }
});

client.login(BOT_TOKEN);
