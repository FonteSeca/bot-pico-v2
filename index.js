const Discord = require('discord.js');
const music = require('./music.js');
const Sequelize = require('sequelize');
const Bot = new Discord.Client();


// const fs = require("fs");

// let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

let COR_BASE = '16766720';
let COR_LOVE = '16711875';
let COR_FRIEND = '41471';
let COR_EROU = '40447';
let COR_ADM = '16711680';

const sequelize = new Sequelize(process.env.DATABASE_URL);

let PREFIX = "$";

module.exports = () => ({
  date: new Date
})

Bot.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
    Bot.user.setPresence({ game: { name: 'Tremzinho da Alegria Simulator', type: 0 } });
});

Bot.on('guildMemberAdd', member => {

  // if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(imageembed(COR_BASE, 'https://media.giphy.com/media/vMPLHjgfHirAs/giphy.gif', '**' + member.user.username + '** foi batizado por Pico-sama, agora você faz parte deste recinto do amor.'));
});


Bot.on('guildMemberRemove', member => {
  //  if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(basicembed(COR_BASE, '**' + member.user.username + '** saiu do servidor!'));
});

Bot.on('guildBanAdd', member => {
  // if(member.guild.id !== ''){return;}
  member.guild.channels.find("name", "avisos").send(basicembed(COR_BASE, '**' + member.user.username + '** MORREU MUAHAUH!'));
});

Bot.on('message', msg => {

  
  const message = msg.content.trim();
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

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
      case 'ship':
        return ship(msg, suffix);
      case 'poke':
        return poke(msg, suffix);
      case 'slap':
        return slap(msg,suffix);
      case 'treta':
        return treta(msg,suffix);

      case 'info':
        return info(msg, suffix);

      case 'teste':
        return teste(msg,suffix);

      case 'ban':
        return ban(msg, suffix);
      case 'kick':
        return kick(msg, suffix);
      case 'purge':
        return purge(msg, suffix);
      case 'help':
        return help(msg, suffix);
      case 'fdp':
        return fdp(msg, suffix);

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
      const mention = msg.mentions.users.first();
      msg.channel.send(imageembed(COR_BASE,'https://s-media-cache-ak0.pinimg.com/originals/ca/d8/61/cad861052f8721de300a49221d5c98c1.jpg', '**' + mention.username + '**, se fodeu com gelinho.'));
    } else {
      const mention = msg.mentions.users.first();
      msg.channel.send(imageembed(COR_BASE,'https://s-media-cache-ak0.pinimg.com/originals/ca/d8/61/cad861052f8721de300a49221d5c98c1.jpg', '**' + mention.username + '**, me foda com um gelinho.'));
    }

  }

  function alegria(msg, suffix) {
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) {
      msg.channel.send(basicembed(COR_EROU, 'Use **!alegria** *@user*'));
    } else if (msg.mentions.users.first() == msg.author) {
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + mention.username + '** entrou na trenzinho da alegria com chico e coco.'));
    } else {
      const mention = msg.mentions.users.first();
      msg.channel.send(imageembed(COR_BASE,'http://static1.fjcdn.com/thumbnails/comments/There+are+no+regrets+in+the+pico+train+_b3152066afcf56723758cf921a6720ca.png', '**' + Bot.user.username + '** convidou *' + mention.username + '* para a dança do trenzinho da alegria.'));

    }
  }

  function so(msg, suffix) {
    const mention = msg.mentions.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use **!so** *@user*'));
    msg.channel.send(imageembed(COR_BASE,'http://thumbnail.egloos.net/600x0/http://pds4.egloos.com/pds/200704/20/02/e0013702_02045451.jpg', '**' + Bot.user.username + '** e chico chamaram *' + mention.username + '* para brincar de faz de conta'));
  }

  function triste(msg, suffix) {
    const mention = msg.mentions.users.first();
    if (msg.mentions.users.size < 1 || msg.mentions.users.size > 1 ) return msg.channel.send(basicembed(COR_EROU, 'Use **!triste** *@user*'));

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
    HugArray[6] = 'https://images-ext-2.discordapp.net/external/W47oCn1qPzu5YWrKWBLX68ABV-jU084Wv9Cj0xrzps4/https/rra.ram.moe/i/rykbHkf9l.gif';
    HugArray[7] = 'https://images-ext-2.discordapp.net/external/V9fsd7kcjML6St2jIpmZxgh2Tnce57__MR1P-fd2l_g/https/rra.ram.moe/i/r1lABJfce.gif';
    HugArray[8] = '';
    HugArray[9] = '';
    HugArray[10] = '';
    var hugnum = Math.floor(Math.random() * 5);
    var hugImg = HugArray[hugnum];
    msg.channel.send(imageembed(COR_FRIEND, hugImg, '**' + msg.author.username + '** deu um abraço em *' + msg.mentions.users.first().username + '*'));
  }

  function poke(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!poke** *@user*'));
    if (msg.mentions.users.size < 1) return msg.channel.send(basicembed(COR_EROU,'Use !poke @user'));

    PokeArray = new Array();
    PokeArray[0] = 'https://tenor.com/view/pokenose-poke-nose-gif-5607667';
    PokeArray[1] = 'http://gifimage.net/wp-content/uploads/2017/09/anime-poke-gif-8.gif';
    PokeArray[2] = 'https://media.giphy.com/media/WvVzZ9mCyMjsc/giphy.gif';
    PokeArray[3] = 'https://thumbs.gfycat.com/EnlightenedInferiorAfricanaugurbuzzard-max-1mb.gif';
    PokeArray[4] = 'https://media.tenor.com/images/309a6a62342923c2e406bde613d68299/tenor.gif';
    PokeArray[5] = 'https://i.pinimg.com/originals/e5/bd/ea/e5bdea33daa43791fb17f8575c059779.gif';
    PokeArray[6] = 'https://68.media.tumblr.com/913f6c8b397a28cce5d739d9e5440f13/tumblr_on0ks5LR3P1ridyfoo1_500.gif';
    PokeArray[7] = 'http://pa1.narvii.com/5776/633e12dd89546aa678f875bd746b4a33b670620a_hq.gif';
    PokeArray[8] = '';
    PokeArray[9] = '';
    PokeArray[10] = '';
    var pokenum = Math.floor(Math.random() * 7);
    var pokeImg = PokeArray[pokenum];
    msg.channel.send(imageembed(COR_FRIEND, pokeImg, '**' + msg.author.username + '** cutucou *' + msg.mentions.users.first().username + '*'));
  }

  function slap(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!slap** *@user*'));
    if (msg.mentions.users.size < 1) return msg.channel.send(basicembed(COR_EROU,'Use !slap @user'));

    SlapArray = new Array();
    SlapArray[0] = 'https://tenor.com/view/pokenose-poke-nose-gif-5607667';
    SlapArray[1] = 'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif';
    SlapArray[2] = 'https://media.giphy.com/media/oL7evncYvZ9II/giphy.gif';
    SlapArray[3] = 'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif';
    SlapArray[4] = 'https://media.giphy.com/media/LB1kIoSRFTC2Q/giphy.gif';
    SlapArray[5] = 'http://i.imgur.com/dzefPFL.gif';
    SlapArray[6] = 'https://media.tenor.com/images/1cf84bf514d2abd2810588caf7d9fd08/tenor.gif';
    SlapArray[7] = 'https://media.giphy.com/media/L7iHfUrBk3cqY/giphy.gif';
    SlapArray[8] = 'https://gifimage.net/wp-content/uploads/2017/07/anime-slap-gif-18.gif';
    SlapArray[9] = 'http://gifimage.net/wp-content/uploads/2017/07/anime-slap-gif-8.gif';
    SlapArray[10] = 'https://media.giphy.com/media/VEmm8ngZxwJ9K/giphy.gif';
    SlapArray[11] = 'https://static.fjcdn.com/gifs/Bitch+slap+4+more+here+wwwyoutubecom+user+squabanime+and+here+thesquabnestcom+and+here+wwwfacebookcom+pages+squab+220040661488110+sk+timeline_161012_5187244.gif';
    var slapnum = Math.floor(Math.random() * 11);
    var slapImg = SlapArray[slapnum];
    msg.channel.send(imageembed(COR_FRIEND, slapImg, '**' + msg.author.username + '** deu um tapa em *' + msg.mentions.users.first().username + '*'));
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
    msg.channel.send(imageembed(COR_LOVE, kissImg, '**' + msg.author.username + '** deu um beijo em *' + msg.mentions.users.first().username + '*'));
  }

  function ship(msg, suffix) {
    var chanceship = Math.floor(Math.random() * 100);
    const shipname = msg.mentions.users.first().username.replace(/[^a-z1-90]/gi, '').charAt(0).toUpperCase() + msg.mentions.users.first().username.replace(/[^a-z1-90]/gi, '').slice(1).slice(0,(msg.mentions.users.first().username.length / 2 + 1)).trim().toLowerCase() + msg.mentions.users.last().username.replace(/[^a-z1-90]/gi, '').slice(msg.mentions.users.last().username.length/2 - 2).trim().toLowerCase()
    for (i = 1; chanceship == 0; i++) { 

    }
    const embed = {
  "title": "asd",
  "description": "asdd",
  "color": COR_LOVE,
  "thumbnail": {
    "url": Bot.user.avatarURL
  },
  "author": {
    "name": Bot.user.username,
    "icon_url": Bot.user.avatarURL
  },
  "fields": [
    {
      "name": "Ship",
      "value": msg.mentions.users.first().username,
      "inline": true
    },
    {
      "name": "Ship",
      "value": msg.mentions.users.last().username,
      "inline": true
    },
    {
      "name": "Ship",
      "value": shipname,
      "inline": true
    },
    {
      "name": "Ship",
      "value": chanceship + "/100",
      "inline": true
    }
  ]
};
    msg.channel.send({embed});

  }

  function userInfo(user) {
    var asdasd = '';
    asdasd = '**' + user.username + "**, **ID **" + user.id;
    return asdasd;
  }

  function info(msg, suffix) {
    msg.channel.send(userInfo(msg.author));
    msg.channel.send(msg.mentions.users.first().username);
    msg.channel.send(msg.mentions.users.first().nickname);
    msg.channel.send(msg.mentions.users.first().createdAt);
    msg.channel.send(msg.mentions.users.first().joinedAt);
  }

  function treta(msg, suffix) {
    if (!suffix) return msg.channel.send(basicembed(COR_EROU, 'Use **' + PREFIX + 'treta** * *@user*'));
// pra alterar as mensgens padrões e repetidas do embed
const configmsgs = {
  'max_life':100, // máximo de vida
  'sleeptime':1000, // tempo de espera entre os edits
  'beforelifename': ':heart: ', // mensagem antes do nome da pessoa (um coração pra representar vida)
  'title':'TRETA! TRETA!!', // mensagem titulo
  'url':'https://twist.moe/a/bokunopico/1', // url qualquer
  'color':COR_FRIEND, // cor da embed
  'timestamp':new Date(), // data da trta
  'footer_icon':Bot.user.avatarURL, // icon do footer
  'footer_text':'© Pico | Treta News', // texto do footer
  'author_name':Bot.user.username, // autor do embed
  'author_icon':Bot.user.avatarURL // icone do author do embed
}

// os dados dos participantes
var info = {
  1: {'name':msg.author.username,'life':configmsgs.max_life},
  2: {'name':msg.mentions.users.first().username,'life':configmsgs.max_life},
}

// primeira mensagem
const embed = {
  "title": configmsgs.title,
  "description": ":white_circle: **"+info[1].name+"** chamou *"+info[2].name+"* pro PAU!",
  "url": configmsgs.url,
  "color": configmsgs.color,
  "timestamp": configmsgs.timestamp,
  "footer": {
    "icon_url": configmsgs.footer_icon,
    "text": configmsgs.footer_text
  },
  "author": {
    "name": configmsgs.author_name,
    "icon_url": configmsgs.author_icon
  },
  "fields": [
    {
      "name": configmsgs.beforelifename + info[1].name,
      "value": info[1].life + "/" + configmsgs.max_life,
      "inline": true
    },
    {
      "name": configmsgs.beforelifename + info[2].name,
      "value": info[2].life + "/" + configmsgs.max_life,
      "inline": true
    }
  ]
};
msg.channel.send({embed}).then(resposta => {

for (i = 1; info[1].life>0||info[2].life>0; i++) { 

  // sleep zzzzzzzzz
  var now = new Date().getTime();
  while(new Date().getTime() < now + configmsgs.sleeptime) {}

  // se rolar ganhador
  if(info[1].life<=0||info[2].life<=0) {
    var winner = info[1].life<0 ? info[2].name : info[1].name; 
          const embed = {
            "title": configmsgs.title,
            "description": ":medal: **"+winner+"** ganhou a batalha!",
            "url": configmsgs.url,
            "color": configmsgs.color,
            "timestamp": configmsgs.timestamp,
            "footer": {
              "icon_url": configmsgs.footer_icon,
              "text": configmsgs.footer_text
            },
            "author": {
              "name": configmsgs.author_name,
              "icon_url": configmsgs.author_icon
            },
            "fields": [
              {
                "name": configmsgs.beforelifename + info[1].name,
                "value": info[1].life + "/" + configmsgs.max_life,
                "inline": true
              },
              {
                "name": configmsgs.beforelifename + info[2].name,
                "value": info[2].life + "/" + configmsgs.max_life,
                "inline": true
              }
            ]
          };
    return resposta.edit({embed})}

    if(info[1].life>0||info[2].life>0) {
      var dano = Math.floor(Math.random() * 30);
      if (i%2 == 0) {
        info[1].life -= dano;


          const embed = {
            "title": configmsgs.title,
            "description": ":red_circle: **"+info[2].name+"** tirou __"+dano+"__ de *"+info[1].name+"*",
            "url": configmsgs.url,
            "color": configmsgs.color,
            "timestamp": configmsgs.timestamp,
            "footer": {
              "icon_url": configmsgs.footer_icon,
              "text": configmsgs.footer_text
            },
            "author": {
              "name": configmsgs.author_name,
              "icon_url": configmsgs.author_icon
            },
            "fields": [
              {
                "name": configmsgs.beforelifename + info[1].name,
                "value": info[1].life + "/" + configmsgs.max_life,
                "inline": true
              },
              {
                "name": configmsgs.beforelifename + info[2].name,
                "value": info[2].life + "/" + configmsgs.max_life,
                "inline": true
              }
            ]
          };
        resposta.edit({embed})
      } else if (i%2 == 1) {
        info[2].life -= dano;
        

          const embed = {
            "title": configmsgs.title,
            "description": ":red_circle: **"+info[1].name+"** tirou __"+dano+"__ de *"+info[2].name+"*",
            "url": configmsgs.url,
            "color": configmsgs.color,
            "timestamp": configmsgs.timestamp,
            "footer": {
              "icon_url": configmsgs.footer_icon,
              "text": configmsgs.footer_text
            },
            "author": {
              "name": configmsgs.author_name,
              "icon_url": configmsgs.author_icon
            },
            "fields": [
              {
                "name": configmsgs.beforelifename + info[1].name,
                "value": info[1].life + "/" + configmsgs.max_life,
                "inline": true
              },
              {
                "name": configmsgs.beforelifename + info[2].name,
                "value": info[2].life + "/" + configmsgs.max_life,
                "inline": true
              }
            ]
          };
        resposta.edit({embed})
      }
    }


 }
});
  }


  // TESTES POAR

  function yay() {
    const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

// force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
  }
  function teste(msg, suffix) {
    sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    teste();
    User.findAll().then(users => {
      console.log(users)
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  }

  // COMANDOS Administrativos

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
      msg.channel.send(basicembed(COR_ADM, '*' + msg.author.username + '* não possui permissão'))
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
      msg.channel.send(basicembed(COR_ADM, '*' + msg.author.username + '* não possui permissão'))
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

  function help(msg, suffix) {
    msg.author.send(basicembed(COR_BASE, 'çalksça'));
  }

  function fdp(msg, suffix) {

    msg.author.send(basicembed(COR_BASE, 'çalksça'));
  }


  function kkiss(msg,suffix){
    if (!suffix) return msg.channel.send(basicembed(COR_EROU,'Use **!kiss** *@user*'));
    KissArray = new Array();
    KissArray[0] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629430320693248/unnamed_2.gif';
    KissArray[1] = 'https://cdn.discordapp.com/attachments/334145215399067648/335635401559638020/KH1CTZtw1iP3W.gif';
    KissArray[2] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629429305540608/unnamed_1.gif';
    KissArray[3] = 'https://cdn.discordapp.com/attachments/300826546359369729/358629429305540609/unnamed.gif';
    KissArray[4] = 'https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif';
    KissArray[5] = 'https://media.giphy.com/media/CTo4IKRN4l4SA/giphy.gif';
    KissArray[6] = 'https://media.giphy.com/media/OSq9souL3j5zW/giphy.gif';
    KissArray[7] = 'https://media.giphy.com/media/Y9iiZdUaNRF2U/giphy.gif';
    KissArray[8] = 'https://media.tenor.com/images/b9aad4870d7d402047260952873c3213/tenor.gif';
    KissArray[9] = 'https://media.giphy.com/media/ll5leTSPh4ocE/giphy.gif';
    KissArray[10] = 'https://media.tenor.com/images/d1a11805180742c70339a6bfd7745f8d/tenor.gif';
    KissArray[11] = '';
    KissArray[11] = '';
    KissArray[13] = '';
    KissArray[14] = '';
    KissArray[15] = '';
    KissArray[16] = '';
    KissArray[17] = '';
    KissArray[18] = '';
    KissArray[19] = '';
    KissArray[20] = '';

    var kissnum = Math.floor(Math.random() * 10);
    var kissImg = KissArray[kissnum];
    msg.channel.send(imageembed(COR_BASE, kissImg, '**' + msg.author.username + '** deu um beijo em *' + msg.mentions.users.first().username + '*'));
  };

  // if (!points[msg.author.id]) points[msg.author.id] = {
  //   points: 0,
  //   level: 0
  // };
  // let userData = points[msg.author.id];
  // userData.points++;

  // let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));

  // if (userData.points > 20) {
  //   userData.points = 0;
  //   userData.Level++;
  //   msg.reply(`Parabains! **${curLevel}**!`);
  // }
  // if (curLevel > userData.level) {
  //   // Level up!
  //   userData.level = curLevel;
  //   msg.reply(`Parabains! **${curLevel}**!`); 
  // }

  // if (msg.content.startsWith(PREFIX + "level")) {
  //   msg.reply(`Você está com ${userData.level}, com ${userData.points} pontos.`);
  // }
  // fs.writeFile("./points.json", JSON.stringify(points), (err) => {
  //   console.log("The file was saved!");
  //   if (err) console.error(err)
  // });


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
