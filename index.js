const Discord = require('discord.js');
const music = require('./music.js');
const Bot = new Discord.Client();
let PREFIX = '$';

let COR_BASE = '16766720';
let COR_EROU = '16766720';
let COR_ADM = '16766720';


Bot.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
    Bot.user.setPresence({ game: { name: 'Tremzinho da Alegria Simulator', type: 0 } });
});

Bot.on('guildMemberAdd', member => {

  if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "bate-papo").send(basicembed(COR_BASE, member.user.username + ' entrou no servidor!'));
});


Bot.on('guildMemberRemove', member => {
  if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "bate-papo").send(basicembed(COR_BASE, member.user.username + ' saiu do servidor!'));
});

Bot.on('guildBanAdd', member => {
  if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "bate-papo").send(basicembed(COR_ADM, member.user.username + ' FOI BANIDO! YAY'));
});

Bot.on('message', msg => {
  const message = msg.content.trim();

  // caso chame por outros prefixos além de !
  if(message.toLowerCase().startsWith(';;'||'~'||'>')) help(msg);

  if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
    // Get the command and suffix.
    const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();
    const suffix = message.substring(PREFIX.length + command.length).trim();
    // Process the commands.
    switch (command) {
      case 'say':
        return say(msg, suffix);
      case 'sorvetinho':
        return sorvetinho(msg, suffix);
      case 'gelinho':
        return gelinho(msg, suffix);
      case 'alegria':
        return alegria(msg, suffix);
      case 'só':
        return so(msg, suffix);
      case 'triste':
        return triste(msg, suffix);

    }
  }

  function say(msg, suffix) {
    msg.delete();
    msg.channel.send(basicembed(COR_BASE, suffix));
  }

  function sorvetinho(msg, suffix) {
    const mention = msg.mentions.users.first();
    const mention_other = msg.mentions.users.last();
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'https://cdn.discordapp.com/attachments/332326372494016513/336569223960854538/4496860.gif', ':icecream: ' + Bot.user + ' derramou sorvetinho no ' + mention.toString()));
  }

  function gelinho(msg, suffix) {
    const mention = msg.content.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use !gelinho @user'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'https://s-media-cache-ak0.pinimg.com/originals/ca/d8/61/cad861052f8721de300a49221d5c98c1.jpg', mention.toString() + ', me foda com um gelinho'));
  }

  function alegria(msg, suffix) {
    const mention = msg.content.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use !alegria @user'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', mention.toString() + ' entrou na dança do trenzinho da alegria'));
  }

  function so(msg, suffix) {
    const mention = msg.content.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use !alegria @user'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'http://thumbnail.egloos.net/600x0/http://pds4.egloos.com/pds/200704/20/02/e0013702_02045451.jpg', 'Pico e chico chamaram ' + mention.toString() + ' para brincar de faz de conta'));
  }

  function triste(msg, suffix) {
    const mention = msg.content.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use !triste @user'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'http://pa1.narvii.com/6513/b90bcaa652b612514a1016577338ffb20a509f97_hq.gif', mention.toString() + ', ganhou a banana do consolo, se anime!'));
  }


  function hug(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!hug** *@user*'));
    if (msg.mentions.users.size < 1) return msg.channel.send(basicembed(COR_EROU,'Use !hug @user'));

    HugArray = new Array();
    HugArray[0] = 'http://68.media.tumblr.com/a7c761fbec9eafd75f402c57ab8df2bb/tumblr_osfk8wDqsd1r2p8kno1_500.gif';
    HugArray[1] = 'http://i.imgur.com/VE8Oi5m.gif';
    HugArray[2] = '';
    HugArray[3] = '';
    HugArray[4] = '';
    HugArray[5] = '';
    HugArray[6] = '';
    HugArray[7] = '';
    HugArray[8] = '';
    HugArray[9] = '';
    HugArray[10] = '';
    var hugnum = Math.floor(Math.random() * 2);
    var hugImg = HugArray[hugnum];
    msg.channel.send(imageembed(COR_BASE,hugImg, msg.author.username + ' deu um abraço em ' + msg.mentions.users.first().username))
  }

});

music(Bot, {
	prefix: PREFIX,        // Prefix of '-'.
	global: false,      // Server-specific queues.
	maxQueueSize: 20,   // Maximum queue size of 10.
	clearInvoker: false, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
    channel: ''    // Name of voice channel to join. If omitted, will instead join user's voice channel.
});

function basicembed(color,text) {
  return {embed: {
    color: color,
    description: text
    }};
}
function imageembed(color,image,text) {
  return {embed: {
    "color": color,
    "description": text,
    "image": {
    "url": image}
    }};
}

Bot.login(process.env.token);
