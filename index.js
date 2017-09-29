const Discord = require('discord.js');
const music = require('./music.js');
const Bot = new Discord.Client();
let PREFIX = '$';

let COR_BASE = '16766720';
let COR_EROU = '40447';
let COR_ADM = '16711680';


Bot.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
    Bot.user.setPresence({ game: { name: 'Tremzinho da Alegria Simulator', type: 0 } });
});

Bot.on('guildMemberAdd', member => {

  // if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(basicembed(COR_BASE, member.user.username + ' entrou no servidor!'));
});


Bot.on('guildMemberRemove', member => {
  //  if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(basicembed(COR_BASE, member.user.username + ' saiu do servidor!'));
});

Bot.on('guildBanAdd', member => {
  // if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(basicembed(COR_BASE, member.user.username + ' MORREU MUAHAUH!'));
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
      case 'so':
        return so(msg, suffix);
      case 'triste':
        return triste(msg, suffix);
      case 'spi':
        return spi(msg, suffix);
      case 'luar':
        return luar(msg, suffix);		   

      case 'hug':
        return hug(msg, suffix);
      case 'kiss':
          return kiss(msg, suffix);

      case 'ban':
        return ban(msg, suffix);
      case 'kick':
        return kick(msg, suffix);
	case 'purge':
	return purge(msg, suffix);

    }
  }


  function isAdmin(member) {
		return member.hasPermission("ADMINISTRATOR");
	}

  function say(msg, suffix) {
    msg.channel.send(suffix);
  }

  function sorvetinho(msg, suffix) {
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) {
      msg.channel.send(basicembed(COR_EROU,'Use **!sorvetinho** *@user*'));
    } else {
      const mention = msg.mentions.users.first();
      const mention_other = msg.mentions.users.last();
      msg.channel.send(imageembed(COR_BASE,'https://cdn.discordapp.com/attachments/332326372494016513/336569223960854538/4496860.gif', '**' + Bot.user.username + '** derramou sorvetinho no *' + mention.username + '*'));
    }
  }

  function gelinho(msg, suffix) {
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) {
      msg.channel.send(basicembed(COR_EROU, 'Use **!gelinho** *@user*'));
    } else if (msg.author.toString() == msg.mentions.users.first.toString()) {
      msg.channel.send(imageembed(COR_BASE,'https://s-media-cache-ak0.pinimg.com/originals/ca/d8/61/cad861052f8721de300a49221d5c98c1.jpg', '*' + mention.username + '*, se fodeu com gelinho.'));
    } else {
      msg.channel.send(imageembed(COR_BASE,'https://s-media-cache-ak0.pinimg.com/originals/ca/d8/61/cad861052f8721de300a49221d5c98c1.jpg', '*' + mention.username + '*, me foda com um gelinho.'));
    }
    msg.delete();
  }

  function alegria(msg, suffix) {
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) {
      msg.channel.send(basicembed(COR_EROU, 'Use **!alegria** *@user*'));
    } else if (msg.mentions.users.first() == msg.author) {
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + mention.username + '** entrou na trenzinho da alegria com chico e coco.'));
    } else {
      const mention = msg.mentions.users.first();
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + Bot.user.username + '** convidou *' + mention.username + '* para a dança do trenzinho da alegria.'));
    msg.delete();
    }
  }

  function so(msg, suffix) {
    const mention = msg.mentions.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use **!so** *@user*'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'http://thumbnail.egloos.net/600x0/http://pds4.egloos.com/pds/200704/20/02/e0013702_02045451.jpg', '**' + Bot.user.username + '** e chico chamaram *' + mention.username + '* para brincar de faz de conta'));
  }

  function triste(msg, suffix) {
    const mention = msg.mentions.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use **!triste** *@user*'));
    msg.delete();
    msg.channel.send(imageembed(COR_BASE,'http://pa1.narvii.com/6513/b90bcaa652b612514a1016577338ffb20a509f97_hq.gif', '**' + mention.username + '**, ganhou a banana do consolo, se anime!'));
  }

  function spi(msg, suffix) {
    const mention = msg.mentions.users.first();
    msg.channel.send(imageembed(COR_BASE, 'http://pa1.narvii.com/6513/b90bcaa652b612514a1016577338ffb20a509f97_hq.gif','**' + mention.username + '** foi convidado para o spinner do amor.'))
  }
  function luar(msg, suffix) {
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) {
      msg.channel.send(basicembed(COR_EROU, 'Use **!luar** *@user*'));
    } else if (msg.mentions.users.first() == msg.author) {
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + mention.username + '** entrou na trenzinho da alegria com chico e coco.'));
    } else {
      const mention = msg.mentions.users.first();
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + Bot.user.username + '** convidou *' + mention.username + '* para a dança do trenzinho da alegria.'));
    msg.delete();
    }
  }

  function hug(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!hug** *@user*'));
    if (msg.mentions.users.size < 1) return msg.channel.send(basicembed(COR_EROU,'Use !hug @user'));

    HugArray = new Array();
    HugArray[0] = 'https://media.tenor.com/images/08de7ad3dcac4e10d27b2c203841a99f/tenor.gif';
    HugArray[1] = 'https://media.tenor.com/images/42922e87b3ec288b11f59ba7f3cc6393/tenor.gif';
    HugArray[2] = 'https://i.pinimg.com/originals/49/a2/1e/49a21e182fcdfb3e96cc9d9421f8ee3f.gif';
    HugArray[3] = 'http://gifimage.net/wp-content/uploads/2017/06/anime-hug-gif-11.gif';
    HugArray[4] = 'https://media.tenor.com/images/5c35f9a6052b30442d05a855fc76b5de/tenor.gif';
    HugArray[5] = 'https://media.giphy.com/media/ba92ty7qnNcXu/giphy.gif';
    HugArray[6] = '';
    HugArray[7] = '';
    HugArray[8] = '';
    HugArray[9] = '';
    HugArray[10] = '';
    var hugnum = Math.floor(Math.random() * 5);
    var hugImg = HugArray[hugnum];
    msg.channel.send(imageembed(COR_BASE, hugImg, '**' + msg.author.username + '** deu um abraço em *' + msg.mentions.users.first().username + '*'));
  }

  function ban(msg, suffix) {

    if(isAdmin(msg.member)) {
      if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 || msg.author.toString() == msg.mentions.users.first().toString()) {
        msg.channel.send(basicembed(COR_EROU,'Use **!ban** *@user*'));
      } else {
        let banMember = msg.guild.member(msg.mentions.users.first());
        msg.guild.member(banMember).ban();
        msg.channel.send(imageembed(COR_ADM,'https://66.media.tumblr.com/588ae4ae98fa9ab56afb8e482ce34f40/tumblr_nyhaxppJAy1unvqljo6_500.gif' , msg.mentions.users.first().toString() + ' levou martelão.'))
      }
    } else {
      msg.channel.send(basicembed(COR_ADM, '*' + msg.author.toString().username + '* não possui permissão'))
    }
  }
	
  function kick(msg, suffix) {

    if(isAdmin(msg.member)) {
      if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 || msg.author.toString() == msg.mentions.users.first().toString()) {
        msg.channel.send(basicembed(COR_EROU,'Use **!kick** *@user*'));
      } else {
        let kickMember = msg.guild.member(msg.mentions.users.first());
        msg.guild.member(kickMember).kick();
        msg.channel.send(imageembed(COR_ADM,'https://66.media.tumblr.com/588ae4ae98fa9ab56afb8e482ce34f40/tumblr_nyhaxppJAy1unvqljo6_500.gif' , msg.mentions.users.first().toString() + ' saiu do servidor na força énoz.'))
      }
    } else {
      msg.channel.send(basicembed(COR_ADM, '*' + msg.author.toString().username + '* não possui permissão'))
    }
  }
	
	function purge(msg, suffix) {
	        if (msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.fetchMessages()
               .then(function(list){
                    msg.channel.bulkDelete(list);
                }, function(err){msg.channel.send("ERROR: ERROR CLEARING CHANNEL.")})                        
        }
	}

  
  function kiss(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!kiss** *@user*'));
    KissArray = new Array();
    KissArray[0] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629430320693248/unnamed_2.gif';
    KissArray[1] = 'https://cdn.discordapp.com/attachments/334145215399067648/335635401559638020/KH1CTZtw1iP3W.gif';
    KissArray[2] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629429305540608/unnamed_1.gif';
    KissArray[3] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629429305540609/unnamed.gif';
    KissArray[4] = 'https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif';
    KissArray[5] = 'https://media.giphy.com/media/CTo4IKRN4l4SA/giphy.gif';
    KissArray[6] = 'https://media.giphy.com/media/OSq9souL3j5zW/giphy.gif';
    KissArray[7] = '';
    KissArray[8] = '';
    KissArray[9] = '';
    KissArray[10] = '';
    var kissnum = Math.floor(Math.random() * 6);
    var kissImg = KissArray[kissnum];
    msg.channel.send(imageembed(COR_BASE, kissImg, '**' + msg.author.username + '** deu um beijo em *' + msg.mentions.users.first().username + '*'));
  };


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
