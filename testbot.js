const botconfig = require("./botconfig.json");
const premium = require("./premium.json");
const Discord = require("discord.js");
const ascii = require("ascii-art");
const moment = require("moment");
const snekfetch = require("snekfetch");
const translate = require('google-translate-api');
const superagent = require('superagent');
const ytdl = require('ytdl-core');
//const fs = require('fs');
const bot = new Discord.Client({disableEveryone: true});
//bot.commands = new Discord.Collection();

//fs.readdir("./commands/", (err, file) => {
  //if(err) console.log(err);
  //let jsfile = files.filter(f => f.split(".").pop() === "js")
  //if(jsfile.length <= 0){
    //console.log("Couldn't find commands.");
    //return;
  //}

  //jsfile.forEach((f, i) =>{
    //let props = require(`./commands/${f}`);
    //console.log(`${f} loaded!`);
    //bot.commands.set(props.help.name, props);
  //});
//});

//const bot = new Discord.Client({disableEveryone: true});

const prefix = botconfig.prefix;
const premiumUser = ['396284197389729793'];

bot.on("ready", async () => {
  console.log(`Bot został włączony. Jego nick: ${bot.user.tag}, id ${bot.user.id} \nPrefix: ${prefix}`);
  bot.user.setActivity(`cb!!!help | ${bot.guilds.size} servers.`);
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  if(!oldMessage.guild) return
  if(!newMessage.guild) return
  if(oldMessage.guild.id !== '415917934268121118' && oldMessage.guild.id !== '423545059666034689') return
  const logi = oldMessage.guild.channels.find('name', 'logs');
  if(!channel) return
  if(oldMessage.content.length <= 0 ) return
  if(newMessage.content.length <= 0) return
  let embed = new Discord.RichEmbed()
  .setColor(config.embed_color)
  .setTitle("Edytowana wiadomość")
  .addField("Autor:", oldMessage.author,true)
  .addField("Kanał:", oldMessage.channel,true)
  .addField("Pierwotna wiadomość:", oldMessage.content)
  .addField("Nowa wiadomość:", newMessage.content)
  logi.send(embed).catch(error => 0);
});

bot.on("guildMemberAdd", (member) => {
  console.log(`Nowy użytkownik "${member.user.username}". Dołączył(a) na "${member.guild.name}"` );
  member.guild.channels.get("457027538712133642").send(`Hey **${member.user.username}**, dziękujemy za przybycie na **${member.guild.name}** :heart:. Zostań tu i baw się dobrze :wink:.`);
});

bot.on("guildMemberRemove", (member) => {
  console.log(`Użytkownik "${member.user.username}" opuścił(a) "${member.guild.name}"` );
  member.guild.channels.get("457027538712133642").send(`Żegnaj **${member.user.username}**. Szkoda, że odszedłeś(aś) z naszego serwera :cry:. Wróć jeszcze tu kiedyś na **${member.guild.name}** :broken_heart:`);
});

bot.on("guildCreate", guild => {
  console.log(`Nowy serwer: ${guild.name}, id: ${guild.id}. Serwer posiada ${guild.memberCount} użytkowników.`);
  let gCreateEmbed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setDescription(":hammer_pick: Server Logs")
  .addField(`Server owner:`, `${guild.owner.displayName}, id ${guild.owner.id}`)
  .addField(`Server name:`, guild.name)
  .addField(`Member count:`, guild.memberCount)
  .setFooter("Bot has been added to the server");
  bot.channels.get("461111984033628160").send(gCreateEmbed);
});

bot.on("guildDelete", guild => {
  console.log(`Wyrzucony z: ${guild.name}, id: ${guild.id}.`);
  let gDeleteEmbed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setDescription(":hammer_pick: Server logs")
  .addField(`Server owner:`, `${guild.owner.displayName}, id ${guild.owner.id}`)
  .addField(`Server name:`, guild.name)
  .setFooter(`Bot was kicked out of the server`);
  bot.channels.get("461111984033628160").send(gDeleteEmbed);
});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let msg = message.content.startsWith;
  let args = messageArray.slice(1);

  if(cmd === `${prefix}ascii`){
    ascii.font(args.join(' '), 'Doom', function(rendered) {
      rendered = rendered.trimRight();

      if(rendered.length > 2000) return message.channel.send(':x: The message is too long!');
      message.channel.send(rendered, {
        code: 'md'
      });
    })
  }

  if(cmd === `${prefix}off`){
    message.channel.send(`Wyłączam się, pa kurwa!`);
  }

  if(cmd === `${prefix}play`){
    if(!message.member.voiceChannel) return message.channel.send(':x: Please connect to a voice channel.');
    if(message.guild.me.voiceChannel) return message.channel.send(':x: Sorry, the bot is already connected to the server.');
    if(!args[0]) return message.channel.send(':x: Sorry, please input a url following the command.');

    let validate = await ytdl.validateURL(args[0]);
    
    if(!validate) return message.channel.send(':x: Sorry, please input a **valid** url following the command.');

    let info = await ytdl.getInfo(args[0]);
    let connection = await message.member.voiceChannel.join();
    let dispatcher = await connection.play(ytdl(args[0], { filter: 'audioonly' }));

    message.channel.send(`Now playing: ${info.title}`);
  }

  if(cmd === `${prefix}join`){
    if(!message.guild.voiceConnection) message.member.voiceChannel.join();
  }

  if(cmd === `${prefix}staty`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Musisz byc administratorem aby to wykonac!");

    bot.channels.get("460664617996386304").edit({name: `🎑 Użytkownicy: ${message.guild.memberCount}`});
    message.channel.send(':wink: Odswiezono ilosc uzytkownikow serwera na kanale <#457940571919482891>.');
  }

  if(cmd === `${prefix}statsrefresh`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You must be an administrator to do this!");
    
    bot.channels.get("458612338275385364").edit({name: `Serwery: ${bot.guilds.size}`});
    bot.channels.get("458612270281392129").edit({name: `Użytkownicy: ${bot.users.size}`});
    bot.channels.get("460478987928338433").edit({name: `Servers: ${bot.guilds.size}`});
    bot.channels.get("460479055356231680").edit({name: `Users: ${bot.users.size}`});
    message.channel.send(":wink: The bot's statistics have been refreshed!");
  }

  if(cmd === `${prefix}emojify`){
    message.channel.send(args.join(" ").toUpperCase().replace(/A/g, "🇦 ").replace(/B/g, "🇧 ").replace(/C/g, "🇨 ").replace(/D/g, "🇩 ").replace(/E/g, "🇪 ").replace(/F/g, "🇫 ").replace(/G/g, "🇬 ").replace(/H/g, "🇭 ").replace(/I/g, "🇮 ").replace(/J/g, "🇯 ").replace(/K/g, "🇰 ").replace(/L/g, "🇱 ").replace(/M/g, "🇲 ").replace(/N/g, "🇳 ").replace(/O/g, "🇴 ").replace(/P/g, "🇵 ").replace(/Q/g, "🇶 ").replace(/R/g, "🇷 ").replace(/S/g, "🇸 ").replace(/T/g, "🇹 ").replace(/U/g, "🇺 ").replace(/V/g, "🇻 ").replace(/W/g, "🇼 ").replace(/X/g, "🇽 ").replace(/Y/g, "🇾 ").replace(/Z/g, "🇿 "))
  }

  if(cmd === `${prefix}hastebin`){
    if(!args[0]) return message.channel.send(":x: What do you want to post to Hastebin?");
    snekfetch.post("https://hastebin.com/documents").send(args.slice(0).join(" ")).then(body => {
      message.channel.send(":heavy_check_mark: Posted text to Hastebin at this URL: https://hastebin.com/" + body.body.key);
 
    });
  }

  if(cmd === `${prefix}lyrics`){
    let body = await superagent
    .get(`https://some-random-api.glitch.me/lyrics/?title=${args.join("+")}`)
    let embed = new Discord.RichEmbed()
    .setTitle("Tekst")
    .addField("Tytuł", body.title)
    .addField("Autor", body.author)
    .addField("Tekst", body.lyrics)
    .setColor(config.embed_color)
    message.channel.send({embed})
  }

  if(cmd === `${prefix}achievement`){
    let embed = new Discord.RichEmbed()
    .setTitle("Minecraft achievement")
    .setColor("RANDOM")
    .setImage(`https://www.minecraftskinstealer.com/achievement/a.php?i=2&h=Achievement+Get%21&t=${args.join("+")}`)
    message.channel.send(embed)
  }

  if(cmd === `${prefix}serverlist`){
    const guildArray = bot.guilds.map((guild) => {
      return `${guild.name}`
    })
  
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("List of bot servers:", guildArray.join("\n"))
    .setFooter(`Total bot is on ${bot.guilds.size} servers.`)
    
    message.channel.send(embed);
  
  }

  if(cmd === `${prefix}awans`){
    let name = args.join(" ");
    let role = message.guild.roles.find("name", name);

    // Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
    let member = message.mentions.members.first();

    // or the person who made the command: let member = message.member;

    // Add the role!
    member.addRole(role).catch(console.error);
  }


  if(cmd === `${prefix}partners`){
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Bot partners:", `None`)
    message.channel.send(embed);
  }

  if(cmd === `${prefix}eval`){
    if(message.author.id !== '396284197389729793') return message.channel.send(":x: You do not have permission to use this! You must have `developer` permissions, check them using `cb!perms`.")
    if(!args[0]) return message.channel.send(":x: You must provide the correct code.")
    let result = eval(args.join(" ")).toString()
      let embed = new Discord.RichEmbed()
      //.setTitle("Eval")
      .addField(":inbox_tray: INPUT", "```"+args.join(" ")+"```")
      .addField(":outbox_tray: OUTPUT", "```"+result+"```")
      .setColor("RANDOM")
      .setFooter(`Lexiu's code eval`, `https://cdn.discordapp.com/emojis/316264057659326464.png?v=1`)
      message.channel.send(embed);
  }
  
  if(cmd === `${prefix}t1t`){
    if(!message.channel.nsfw) return message.channel.send("Kanał musi być nsfw!");

    let reaction = [ '🎈', '🎊', '🎉', '🎃', '🎁', '🔮', '🎀', '🎐', '🏮' ];
    reaction = reaction[Math.floor(Math.random() * reaction.length)];
    let messageTested = await message.channel.send(`Test randomowych reakcji.`);
    messageTested.react(reaction);
    message.delete();
  }

  if(cmd === `${prefix}avatar123`){
    let aUser = message.mentions.users.first() || message.author;
    message.channel.send(`**Avatar ${aUser.username}:** ${aUser.displayAvatarURL}`);
    return;
  }

  if(cmd === `${prefix}perms`){
    if(message.author.id === '396284197389729793') return message.channel.send(`${bot.emojis.find(`name`, 'Admin')} ${bot.emojis.find(`name`, 'CEO')} ${bot.emojis.find(`name`, 'Technik')} ${bot.emojis.find(`name`, 'RooT')} ` + '| :flag_pl: **Twój poziom uprawnień bota to:** `Developer` (7) \n \n' + `${bot.emojis.find(`name`, 'Admin')} ${bot.emojis.find(`name`, 'CEO')} ${bot.emojis.find(`name`, 'Technik')} ${bot.emojis.find(`name`, 'RooT')} ` + '| :flag_us: **Your level of permissions of the bot:** `Developer` (7)')
    if(message.author.id === '358901906170445835') return message.channel.send(`${bot.emojis.find(`name`, 'Admin')}` + '| :flag_pl: **Twój poziom uprawnień bota to:** `Beta Tester` (4) \n \n' + `${bot.emojis.find(`name`, 'Admin')} ` + '| :flag_us: **Your level of permissions of the bot:** `Beta Tester` (4)');
    if(message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(':flag_pl: **Twój poziom uprawnień na serwerze to:** `Administrator` (2) \n \n:flag_us: **Your permission level on the server:** `Administrator` (2)');
    //if(message.author.id === '358901906170445835') return message.channel.send(`${bot.emojis.find(`name`, 'Admin')}` + '**Twój poziom uprawnień bota to:** `Beta Tester`.');
    message.channel.send(':flag_pl: **Twój poziom uprawnień na serwerze to:** `Użytkownik` (0) \n \n:flag_us: **Your permission level on the server:** `User` (0)');
  }
  
  if(cmd === `${prefix}obywatel`){
    let aUser = message.mentions.users.first() || message.author;
    message.channel.send(`:flag_us: You have granted American citizenship for ${aUser}. \n \n:flag_pl: Przyznałeś amerykańskie obywatelstwo dla ${aUser}.`);
  }

  if(cmd === `${prefix}hello`){
    message.channel.send(`Hello **${message.author}** :sweat_smile:!`);
  }

  if(cmd === `${prefix}avatar`){
    let aUser = message.mentions.users.first() || message.author || message.user.id;
    let avEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    //.setDescription(`Avatar ${aUser.username}:`)
    //.setThumbnail(aUser.displayAvatarURL)
    .setDescription(`**User avatar:** ${aUser.username}:`)
    .setImage(aUser.displayAvatarURL)
    .setFooter(`Avatar checked the ${message.author.tag}`, `https://cdn.discordapp.com/avatars/458569537286176768/cd75aa8cd57765b5522fc140ef937e5c.png?size=2048`);
    message.channel.send(avEmbed);
    return;
  }

  if(cmd === `${prefix}help`){
    let helpEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setDescription(`**Prefix:** "${prefix}"`)
    .addField(`Category: Basic`, `**${prefix}help** - bot's help commands \n**${prefix}info** - version information and author of the bot \n**${prefix}thanks** - list of people we thank for your help. \n**${prefix}help <command>** - displays information and use of the given command. \n**${prefix}supporthelp** - sends a request for help to bot administration.`)
    .addField(`Category: Server`, `**${prefix}report @mention reason** - reports to the server administration (there must be a channel #reports) \n**${prefix}serverinfo** - will display information about the server \n**${prefix}userinfo** - displays information about a given user`)
    .addField(`Category: Administrative`, `**${prefix}ban <@user> <reason>** - blocking the user on the server \n**${prefix}kick <@user> <reason>** - will throw the given user out of the server \n**${prefix}vote <text>** - creates a survey on the server \n**${prefix}purge <quantity>** - clears the given number of messages`)
    .addField(`Category: FUN`, `**${prefix}8ball question** - Ask the bot for something and he will answer you \n**${prefix}ascii <tex>** - creates text using the ascii style \n**${prefix}reverse <text>** - reverses the given text \n**${prefix}cat** - sends a random cat photo \n**${prefix}warte** - displays facts about subject \n**${prefix}hastebin** <text> - adds the entered text to the hastebin \n**${prefix}emojify <text>** - displays the given text in the emoticons \n**${prefix}achievement <text>** - displays the minecraft achievement of the given in the text \n**${prefix}choose <a>;<b>** - chooses one of the two given texts \n**${prefix}lays <pack>** - displays information about a given packs of lays \n**${prefix}emb <field> | <footer> | <color/RANDOM>** - creates its own embed with the given field, footer and color`)
    .addField(`Category: NSFW`, `**${prefix}porngif** - sends a photo of nsfw in gif`)
    .setFooter(`You have used the "${prefix}help" command on the "${message.guild.name}" server`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);

    if(!args[0]) return message.channel.send(helpEmbed);
    if(args[0] == 'avatar') return message.reply("Use: `cb!avatar [mention]` \n \n**WHAT IT DOES?** \nDisplays your avatar, or specified in @mention user.")
    if(args[0] == 'say') return message.reply("Use: `cb!say <tekst>` \n \n**WHAT IT DOES?** \nBot wysyła wcześniej podaną wiadomość.")
    if(args[0] == 'embed') return message.reply("Use: `cb!embed <tekst>` \n \n**WHAT IT DOES?** \nThe bot sends the previously specified message, it will be sent in embed.")
    if(args[0] == 'pomoc') return message.reply("Use: `cb!pomoc` \n \n**WHAT IT DOES?** \nThe bot sends a list of bot commands in a private message.")
    if(args[0] == 'porngif') return message.reply("Use: `cb!porngif` **__in nsfw channel!!__** \n \n**WHAT IT DOES?** \nThe bot sends a nsfw photo in gif.");
    if(message.author.id === "396284197389729793"){
      if(args[0] == 'rich') return message.reply("Use: `cb!rich <game/stream/listen/watch/reset> <text>` \n \n**WHAT IT DOES?** \nBot sets a new status for the rich bot.");
    }
  }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}spal`){
      let sUser = message.mentions.users.first();
      message.channel.send(`:fire: :fire: :fire: :fire: Spaliłeś użytkownika **${sUser}** HAHHAH :fire: :fire: :fire: :fire: `);
      return;
    }
  }

  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setThumbnail(sicon)
    //.setDescription(":flag_pl: The current language of the bot is Polish, soon will be different.")
    .addField("Name:", message.guild.name)
    .addField("Created:", `${message.guild.createdAt.getHours()}:${message.guild.createdAt.getMinutes()} | ${message.guild.createdAt.getDay()}.${message.guild.createdAt.getMonth()}.${message.guild.createdAt.getFullYear()}`)
    .addField("You joined:",`${message.member.joinedAt.getHours()}:${message.member.joinedAt.getHours()} | ${message.member.joinedAt.getDay()}.${message.member.joinedAt.getMonth()}.${message.member.joinedAt.getFullYear()}`)
    .addField("Users:", message.guild.memberCount)
    .addField("Region:", message.guild.region)
    .addField("Text channels:", message.guild.channels.findAll("type", "text").length)
    .addField("Voice channels:", message.guild.channels.findAll("type", "voice").length)
    .addField("Roles:", message.guild.roles.size)
    .addField("Emotes:", message.guild.emojis.size)
    .addField("Owner:", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`)
    .setFooter(`Bot created by xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);

    message.channel.send(serverembed);
  }

  if(cmd === `${prefix}ankieta` || cmd === `${prefix}vote`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You do not have sufficient permissions to create a survey.");
    const ankietaMessage = args.join(" ");
    //let ankieta = await message.channel.send(ankietaEmbed);
    let ankietaEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setDescription(ankietaMessage)
    .setFooter(`A survey created by ${message.author.tag}`);

    let ankieta = await message.channel.send(ankietaEmbed);
    ankieta.react(bot.emojis.find(`name`, 'gtick'));
    ankieta.react(bot.emojis.find(`name`, 'gcross'));
    message.delete();
    return;
  }

  if(cmd === `${prefix}podziekowania` || cmd === `${prefix}thanks`){
    let podziekowania = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setDescription(`**@Spyte#3976** - help in code`)
    .setFooter(`Thank you to everyone mentioned above!`);

    message.channel.send(podziekowania);
    return;
  }

  if(cmd === `${prefix}pomoc`){
    let pomocEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setDescription(`**Prefix:** "${prefix}"`)
    .addField(`=-= Podstawowe =-=`, `**${prefix}pomoc** - komendy pomocy bota \n**${prefix}info** - informacje o wersji i autorze bota \n**${prefix}podziekowania** - lista osob, ktorym dziekujemy za pomoc. \n**${prefix}help <komenda>** - wyświetla informacje i użycie danej komendy.`)
    .addField(`=-= Serwer =-=`, `**${prefix}zglos @mention powód** - zgłasza użytkownika do administracji serwera \n**${prefix}ban @mention powód** - banuje użytkownika na serwerze \n**${prefix}kick @mention powód** - wyrzuci podanego użytkownika z serwera \n**${prefix}serverinfo** - wyświetli informacje o serwerze \n**${prefix}8ball pytanie** - zapytaj bota o coś, a on Ci odpowie \n**${prefix}ankieta** - tworzy ankietę na serwerze`)
    .setFooter(`Bot stworzony przez xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/c90052a12cb45e9cbc23c113e7802786.png?size=2048`);

    let pDevEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setDescription(`**Prefix:** "${prefix}"`)
    .addField(`=-= Wszystkie komendy DEV =-=`, `**${prefix}rich <game/watch/stream/listen> <text>** - ustawia rich presence bota. \n**${prefix}botsetname <text>** - ustawia nazwę dla bota. \n**${prefix}botsetavatar <link>** - ustawia nowy avatar dla bota. \n**${prefix}eval <kod>** - evaluje dany kod.`)
    .setFooter(`Bot stworzony przez xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);

    if(message.author.id === "396284197389729793"){
      if(args[0] == 'dev') return message.author.send(pDevEmbed), message.channel.send(":book: The bot's programmer's help was sent to pw.");
    }
    //message.react(bot.emojis.find(`name`, 'gtick'));
    message.channel.send(":x: Komenda w budowie i w wersji: `PL` pojawi się niebawem.")
    //message.author.send(pomocEmbed);
    return;

  }

  if(cmd === `${prefix}supporthelp`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Pomoc możesz wezwać podczas, gdy jesteś administratorem(ką) serwera.");
    let helpArg = args.join(" ");
    //let serwerPomocy = bot.channels.get("458647891578454062") || bot.channels.get("458647891578454062")
    message.channel.createInvite()
      .then(invite => bot.channels.get("462239475670581249").send(`**Invite:** https://discord.gg/${invite.code}`))
      .catch(console.error);
    message.channel.createInvite()
      .then(invite => bot.channels.get("458647891578454062").send(`**Zaproszenie:** https://discord.gg/${invite.code}`))
      .catch(console.error);
    message.channel.send(":book: A request for help was sent to the lexiu administration!")
    const supporthelp = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL}`)
    .addField(`Użytkownik:`, `${message.author.tag}`)
    .addField(`Serwer:`, `${message.guild.name}`)
    .addField(`Treść pomocy:`, `${helpArg}`)
    .setFooter(`Pomoc została wezwana przez ${message.author.tag}`);

    const senhelp = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL}`)
    .addField(`User:`, `${message.author.tag}`)
    .addField(`Server:`, `${message.guild.name}`)
    .addField(`Help Content:`, `${helpArg}`)
    .setFooter(`Help was called by ${message.author.tag}`);

    //bot.channels.get("458647891578454062").send(`**NOWA PROŚBA O POMOC** \n**Użytkownik:** ${message.author.tag} \n**Serwer:** ${message.guild.name} \n**Treść:** ${helpArg}`);
    bot.channels.get("458647891578454062").send(supporthelp);
    bot.channels.get("462239475670581249").send(senhelp);
    return;

  }

  if(cmd === `${prefix}reverse`){
    if(!args[0]) return message.channel.send(':x: You must enter some text!');

    function reverseString(str) {
        return str.split("").reverse().join("");
    }
    let sreverse = reverseString(args.join(' '))
    //if(sreverse === '@here' || sreverse === '@everyone' || sreverse === `https://discord.gg/${invite.code}`) return message.channel.send("Nie możesz tego odwrócić!")
    if(args[0] === sreverse) {
    sreverse = `${args.join(' ')} :upside_down:`
    }
    message.reply(`${sreverse} :upside_down:`);
  }

  if(cmd === `${prefix}userinfo1`){
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    const member = message.guild.member(user);
    const embed = new Discord.RichEmbed()
		.setColor(config.embed_color)
		.setTitle(`${user.username}#${user.discriminator}`)
		.addField("ID:", `${user.id}`, true)
		.addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
		.addField("Created At:")
		.addField("Joined Server:")
		.addField("Bot:", `${user.bot}`, true)
		.addField("Status:", `${user.presence.status.replace("dnd", "Do Not Distrub")}`, true)
		.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
		.addField("Roles:", member.roles.map(roles => `${roles.name}`).join(', '), true)
		.setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
     message.channel.send(embed);
  }

  if(cmd === `${prefix}test1k2`){
    message.channel.send(`${message.author.roles.map(roles => `${roles.name}`).join(', ')}`);
  }

  if(cmd === `${prefix}userinfo`){
    let aUser = message.mentions.users.first() || message.author;
    const userinfo = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${aUser.username}'s information`, `${aUser.displayAvatarURL}`)
    .setThumbnail(aUser.displayAvatarURL)
    .addField("ID:", `${aUser.id}`)
    .addField("Nickname:", `${aUser.nickname ? aUser.nickname : "None"}`)
    .addField("Created At:", `${moment.utc(aUser.createdAt).format('dd, Do MM YYYY')}`)
    .addField("Joined Server:", `${moment.utc(aUser.joinedAt).format('dd, Do MM YYYY')}`)
    .addField("Bot:", `${aUser.bot}`)
    .addField("Status:", `${aUser.presence.status.replace("dnd", "Do Not Distrub")}`)
    .addField("Game:", `${aUser.presence.game ? aUser.presence.game.name : 'He does not play anything'}`)
    .setFooter(`The command used by ${message.author.username}#${message.author.discriminator}`)
    message.channel.send(userinfo);
  }

  if(cmd === `${prefix}choose`){
    var odp = Math.floor(Math.random() *2) + 1
    var a = args.join(" ").split(";")[0]
    var b = args.join(" ").split(";")[1]
    var odp2
    switch(odp) {
      case 1:
      odp2 = a;
      break;
  
      case 2:
      odp2 = b;
    }
    message.channel.send(`:thinking: **I choose:** ${odp2}`)
  }

  if(cmd === `${prefix}emb`){
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setColor(args.join(" ").split(" | ")[2] || "RANDOM")
    .setDescription(args.join(" ").split(" | ")[0] )
    .setThumbnail(args.join(" ").split(" | ")[3])
    .setFooter(args.join(" ").split(" | ")[1])
    message.channel.send(embed);

}

  if (cmd === `${prefix}zglos` || cmd === `${prefix}report`){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send(":x: You must provide the correct user!");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`${rUser.user.tag}, ${rUser.id}`, `${rUser.user.displayAvatarURL}`)
    .addField("By:", `${message.author}, id ${message.author.id}`)
    .addField("Channel:", message.channel)
    .addField("Reason:", reason)
    .setFooter("User reported for offenses")

    let rchannel = message.guild.channels.find(`name`, "reports");
    if(!rchannel) return message.channel.send(":x: Channel not found: 'reports'");

    message.channel.send(`:ok_hand: You have reported **${rUser}** for **${reason}**.`)
    //message.delete().catch(O_o=>{});
    rchannel.send(reportEmbed);

    return;
  }

  if(cmd === `${prefix}kick`){
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send(":no_entry: | Musisz oznaczyć poprawnego użytkownika!");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: You do not have permission to use this!");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: This user can not be kicked out!");

    let kickEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("By:", `<@${message.author.id}>, id ${message.author.id}`)
    .addField("Channel:", message.channel)
    .addField("Reason:", kReason)
    .setFooter("The user has been kicked from the server")
    .setAuthor(`${kUser.user.tag}, ${kUser.id}`, `${kUser.user.displayAvatarURL}`);

    let kickChannel = message.guild.channels.find(`name`, "modlogs");
    if(!kickChannel) return message.channel.send(":x: Channel not found: 'modlogs'");

    message.channel.send(`:heavy_check_mark: User **${kUser}** was kicked out for **${kReason}**!`);
    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;
  }

  if(cmd === `${prefix}say`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You do not have permissions, the administrator is required.");
    const sayMessage = args.join(" ");
      message.delete().catch();
      message.channel.send(sayMessage);
      let logiKomend = bot.channels.get("458569305341296641");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **say** na serwerze ${message.guild.name}, jako treść dał: **${sayMessage}**.`);
    return;
  }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}admin`){
      const sayMessage = args.join(" ").slice(3)
    
      if(args[0] == "say") return message.channel.send(sayMessage);
    }
  }


  if(cmd === `${prefix}porngif`){
    if(!message.channel.nsfw) return message.channel.send(":x: The channel must be nsfw!")
    let pornlinks = ["https://images.sex.com/images/pinporn/2018/05/29/620/19538508.gif", "https://images.sex.com/images/pinporn/2018/06/04/460/19562507.gif", "https://images.sex.com/images/pinporn/2018/06/02/460/19555925.gif", "https://images.sex.com/images/pinporn/2018/06/25/460/19642645.gif"];
    let math = Math.floor((Math.random() * pornlinks.length));
    let porngifEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(":peach: Sex / porngif | Good Job :wink::")
    .setImage(pornlinks[math])
    .setFooter(`${message.author.tag} | ${message.createdAt.getHours()}:${message.createdAt.getMinutes()}`)

    message.channel.send(porngifEmbed);
  }

  if(cmd === `${prefix}cat`){
    let catlinks = ["https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", "https://media.giphy.com/media/l1J3pT7PfLgSRMnFC/giphy.gif", "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", "https://media.giphy.com/media/6uMqzcbWRhoT6/giphy.gif", "https://media.giphy.com/media/nNxT5qXR02FOM/giphy.gif", "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif", "https://media.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif", "https://media.giphy.com/media/Q56ZI04r6CakM/giphy.gif"];
    let math = Math.floor((Math.random() * catlinks.length));
    let catEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(":cat: Lexiu's random cat:")
    .setImage(catlinks[math])
    .setFooter(`${message.author.tag} | ${message.createdAt.getHours()}:${message.createdAt.getMinutes()}`);

    message.channel.send(catEmbed);
  }

  if(cmd === `${prefix}lays`){
    //let laysp = ["http://www.fritolay.com/images/default-source/blue-bag-image/lays-barbecue.png?sfvrsn=591e563a_6"];
    //let math = Math.floor((Math.random() * laysp.length));
    let barbecue = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Barbecue", "**Calories**: 150 | Calories from Fat: 80 \n \n**Total Fat**: 9g | 15% \nSaturated Fat: 1.5g | 7% \nTrans Fat: 0g \n \n**Cholesterol**: 0mg | 0% \n \n**Sodium**: 150mg | 6% \n \n**Total Carbohydrate**: 16g | 5% \nDietary Fiber: 1g | 5% \nSugars: 2g \n \n**Protein**: 2g \n \nVitamin A 0%, Calcium 0%, Thiamin 4%, Vitamin C 10%, Iron 2%, Vitamin B6 8%.")
    .setImage("http://www.fritolay.com/images/default-source/blue-bag-image/lays-barbecue.png?sfvrsn=591e563a_6");

    let flaminhot = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Flamin' hot", "**Calories**: 160 | Calories from Fat: 90 \n \n**Total Fat**: 10g | 15% \nSaturated Fat: 1.5g | 7% \nTrans Fat: 0g \n \n**Cholesterol**: 0mg | 0% \n \n**Sodium**: 190mg | 8% \n**Potassium**: 320mg | 9% \n \n**Total Carbohydrate**: 15g | 5% \nDietary Fiber: 1g | 5% \nSugars: 1g \n \n**Protein**: 2g \n \nVitamin A 0%, Calcium 0%, Vitamin E 6%, Vitamin C 10%, Iron 2%, Vitamin B6 8%, Niacin 4%, Magnesium 4%.")
    .setImage("http://www.fritolay.com/images/default-source/blue-bag-image/lays-flamin-hot.png?sfvrsn=4d1e563a_2");

    let saltvinegar = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Salt & Vinegar", "**Calories**: 160 | Calories from Fat: 90 \n \n**Total Fat**: 10g | 15% \nSaturated Fat: 1.5g | 7% \nTrans Fat: 0g \n \n**Cholesterol**: 0mg | 0% \n \n**Sodium**: 220mg | 9% \n**Potassium**: 320mg | 9% \n \n**Total Carbohydrate**: 15g | 5% \nDietary Fiber: 1g | 5% \nSugars less than: 1g \n \n**Protein**: 2g \n \nVitamin A 0%, Calcium 0%, Thiamin 4%, Phosphorus 2%, Vitamin C 10%, Iron 2%, Niacin 6%, Magnesium 4%.")
    .setImage("http://www.fritolay.com/images/default-source/blue-bag-image/lays-salt-vinegar.png?sfvrsn=411e563a_2");

    if(!args[0]) return message.channel.send("To see a list of lays packs, enter `cb!lays --packs`");
    if(args[0] == "--packs") return message.channel.send("```LEXIU'S LAYS PACKS: \n1. barbecue \n2. flamin'hot \n3. Salt&Vinegar \n \nUse: cb!lays <pack>```")
    if(args[0] == "barbecue") return message.channel.send(barbecue);
    if(args[0] == "flamin'hot") return message.channel.send(flaminhot);
    if(args[0] == "Salt&Vinegar") return message.channel.send(saltvinegar);
  }

  if(cmd === `${prefix}warte`){
    let wartenute = [":flag_us: Napoleon and Hitler are responsible for the world's nutella addiction. \n \n:flag_pl: Napoleon i Hitler są odpowiedzialni za światowe uzależnienie od nutella.", ":flag_us: Its predecessor was named after a character from italian commedia dell'arte. \n \n:flag_pl: Jej poprzednik został nazwany po postaci z włoskiej commedia dell'arte.", ":flag_us: It orifinally came in the form of a loaf. \n \n:flag_pl: Wyszła ona pierwotnie w formie bochenka."];
    let fortnitewarte = [":flag_us: Fortnite was developed by Epic Games using their Unreal 4 game engine. Epic Games is also the company behind popular video game titles such as Unreal Tournament, Gears of War and Infinity Blade. \n \n:flag_pl: Fortnite został opracowany przez Epic Games przy użyciu silnika gry Unreal 4. Epic Games to także firma stojąca za popularnymi grami wideo, takimi jak Unreal Tournament, Gears of War i Infinity Blade.", ':flag_us: Fortnite tells the story of a world in which 98% of the human population has disappeared and those that remain are under constant threat from zombies, called “husks,” that descend upon the earth from overhead storms. \n \n:flag_pl: Fortnite opowiada o świecie, w którym zniknęło 98% ludzkiej populacji, a te, które pozostają, są stale zagrożone przez zombie, zwane "łuskami", które zstępują na ziemię z napowietrznych sztormów.', ":flag_us: As a player, you are one of the remaining humans and your task is to complete various objectives such as protecting other survivors from the husks and rebuilding aspects of civilization. \n \n:flag_pl: Jako gracz jesteś jednym z pozostałych ludzi, a Twoim zadaniem jest realizacja różnych celów, takich jak ochrona innych ocalałych przed łuskami i odbudowa aspektów cywilizacji.", ":flag_us: Epic Games first announced Fortnite way back in 2011. A series of delays and testing periods saw the actual release of the game pushed back to 2017. Although officially announced as a free-to-play title, the game was released in July 2017 under a paid early-access deal. Gamers that purchased the game were afforded special features that would continue once the game became free. \n \n:flag_pl: Epic Games pierwszy raz ogłosił Fortnite w 2011 roku. Seria opóźnień i okresów testowych sprawiła, że faktyczna premiera gry została przeniesiona na rok 2017. Choć oficjalnie ogłoszona tytułem free-to-play, gra została wydana w lipcu 2017 roku pod płatna oferta wczesnego dostępu. Gracze, którzy kupili grę, otrzymali specjalne funkcje, które będą kontynuowane po uwolnieniu gry.", ":flag_us: By the end of its release month of July 2017, Epic Games announced that they had sold over 500,000 digital copies of Fortnite. By the next month, the game’s player count exceeded one million. \n \n:flag_pl: Pod koniec miesiąca premiery lipca 2017 r. Epic Games ogłosiło, że sprzedało ponad 500 000 cyfrowych kopii Fortnite. Do następnego miesiąca liczba graczy przekroczyła milion.", ":flag_us: Although Fortnite amassed a large following upon release, its popularity was surpassed by that of a Steam title called PlayerUnknown’s Battlegrounds, commonly called PUBG. PUBG uses a battle royale concept (inspired by the 2000 Japanese film Battle Royale), in which the objective is to be defeat all other competitors and be the last person standing. \n \n:flag_pl: Mimo, że Fortnite zgromadził dużą liczbę zwolenników po premierze, jego popularność przewyższała popularność tytułu Steam zwanego Battlegrounds PlayerUnknown, potocznie zwanego PUBG. PUBG wykorzystuje koncepcję walki królewskiej (inspirowaną japońskim filmem Battle Royale z 2000 roku), w której celem jest pokonanie wszystkich innych zawodników i stanie się ostatnią osobą stojącą.", ":flag_us: Epic Games decided to capitalize on the popularity of this style of gameplay, and the result was Fortnite Battle Royale, which was released as a free standalone game in late 2017 and quickly became the game’s most popular iteration. \n \n:flag_pl: Epic Games postanowił wykorzystać popularność tego stylu rozgrywki, czego rezultatem był Fortnite Battle Royale, który został wydany jako darmowa samodzielna gra pod koniec 2017 roku i szybko stał się najpopularniejszą iteracją gry."];
    let mathf = Math.floor((Math.random() * fortnitewarte.length));
    let math = Math.floor((Math.random() * wartenute.length));
    let wartenutee = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor("Nutella", "http://fc07.deviantart.net/fs70/f/2013/036/6/0/nutella_vector_by_anonymousfemalebrony-d5tzf74.png")
    //.setDescription(wartenute[math])
    .addField("FACT", wartenute[math])
    //.setImage("http://moziru.com/images/nutella-clipart-logo-20.jpg")
    .setFooter(`Nutella facts`);

    let wartef = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor("Fortnite", "https://res.cloudinary.com/teepublic/image/private/s--s9xwYfdl--/t_Preview/b_rgb:5e366e,c_limit,f_jpg,h_630,q_90,w_630/v1525585848/production/designs/2658865_2.jpg")
    .addField("FACT", fortnitewarte[mathf])
    .setFooter(`Fortnite facts`)

    if(!args[0]) return message.channel.send("To see a list of topics, enter `cb!warte --list`")
    if(args[0] == "--list") return message.channel.send("```ALL TOPICS: \n1. nutella \n2. fortnite \n \nUse: cb!warte <topic>```")
    if(args[0] == "nutella") return message.channel.send(wartenutee);
    if(args[0] == "fortnite") return message.channel.send(wartef);
  }

  if(cmd === `${prefix}8ball`){
    if(!args[2]) return message.channel.send(":x: You must provide a full 8ball question!");
    let replies = ["Yes of course...", "Sorry but no...", "How can I know that?", "You can ask later?"];

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(0).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
    .setColor("RANDOM")
    .setDescription(question)
    //.addField("Pytanie", question)
    .addField("Answer:", replies[result])
    .setFooter(`Bot created by xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);

    message.channel.send(ballembed);
    let logiKomend = bot.channels.get("458569305341296641");
    logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **8ball** na serwerze **${message.guild.name}**, zapytał się: **${question}**.`);
    return;
  }

  if(cmd === `${prefix}purge`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You do not have permission to clean messages on this server.");

    let messagecount = parseInt(args.join(' '));
    message.channel.fetchMessages({
      limit: messagecount
    }).then(messages => message.channel.bulkDelete(messages));
    let fajnie = await message.channel.send(`:heavy_check_mark: **${messagecount}** messages were cleared.`);
    fajnie.delete({
      timeout: 999999
    });
    let logiKomend = bot.channels.get("458569305341296641");
    logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **purge** na serwerze **${message.guild.name}**, wyczyścił **${messagecount}** wiadomości.`);
  }

  if(cmd === `${prefix}ping1`){
    message.channel.send(':ping_pong: Ping!')
    .then(message => {
      message.edit(`:ping_pong: Pong! (took: ${message.createdTimestamp})`)
    });
    let logiKomend = bot.channels.get("458569305341296641");
    logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **ping** na serwerze **${message.guild.name}**.`);
  }

  if(cmd === `${prefix}ping`){
    const m = await message.channel.send("Ping :ping_pong: ");
    m.edit(`:ping_pong: Pong! ${m.createdTimestamp - message.createdTimestamp}ms. API is ${Math.round(bot.ping)}ms`);
  }

  if(cmd === `${prefix}kdodaj` || cmd === `${prefix}channeladd`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: | Nie możesz dodawać kanałów!");
      const nazwaKanalu = args.join(" ");
      message.guild.createChannel(nazwaKanalu)
      message.channel.send(`:grin:  Kanał **${nazwaKanalu}** został poprawnie dodany!`);
      let logiKomend = bot.channels.get("458569305341296641");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **kdodaj** na serwerze **${message.guild.name}**, dodał kanał: **${nazwaKanalu}**.`);
    return;
  }

  if(cmd === `${prefix}embed`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
      const sayMessage = args.join(" ");
      let sayEmbed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setDescription(`${sayMessage}`)
      .setFooter(`Bot created by xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);
      message.delete().catch();
      message.channel.send(sayEmbed);
      let logiKomend = message.guild.channels.find(`id`, "450352667114340364");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **embed**, jako treść dał: **${sayMessage}**.`);
    return;
  }

  if(cmd === `${prefix}ban`){
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send(":x: You must mark the correct user!");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: You do not have permission to use this!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: This user can not be banned!");

    let banEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("By:", `<@${message.author.id}>, id ${message.author.id}`)
    .addField("Channel:", message.channel)
    .addField("Reason:", bReason)
    .setFooter("A user banned on the server")
    .setAuthor(`${bUser.user.tag}, ${bUser.id}`, `${bUser.user.displayAvatarURL}`);

    let modlogi = message.guild.channels.find(`name`, "modlogs");
    if(!modlogi) return message.channel.send("Channel not found: 'modlogs'");
    
    message.channel.send(`:heavy_check_mark: User ${bUser} has been banned for ${bReason}`)
    message.guild.member(bUser).ban(bReason);
    modlogi.send(banEmbed);

    let logiKomend = bot.channels.get("458569305341296641");
    logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **ban** na serwerze **${message.guild.name}**, zbanował **${bUser}** za **${bReason}**.`);
    return;
  }

  if(cmd === `${prefix}info`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setTitle("Information about the bot")
    .setColor("RANDOM")
    .setThumbnail(bicon)
    .addField("Bot name:", bot.user.username)
    .addField("Created:", bot.user.createdAt)
    .addField("Number of servers:", `${bot.guilds.size} servers`)
    .addField("Number of users:", `${bot.users.size} users`)
    .setFooter(`Bot created by xCookieTM#9613`, `https://cdn.discordapp.com/avatars/396284197389729793/f441c05797950fb647c0d275aa01016e.png?size=2048`);

    message.channel.send(botembed);

    let logiKomend = bot.channels.get("458569305341296641");
    logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **info** na serwerze **${message.guild.name}**`);
    return;
  }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}language`){

      let langembed = new Discord.RichEmbed()
      .setTitle("LANGUAGE MENU")
      .setColor("RANDOM")
      .setDescription(":flag_pl: `55%` Polski (PL): cb!lang pl \n:flag_us: `50%` English (EN): cb!lang en \n:flag_de: `0%` Deutsch (DE): cb!lang de")
      .setFooter(`To choose a language, enter cb!lang <language>.`);

      message.channel.send(langembed);

      let logiKomend = bot.channels.get("458569305341296641");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **language** na serwerze **${message.guild.name}**`);
      return;
    }
  }


  if(cmd === `${prefix}invite`){
    message.channel.send(`To invite a bot to your server, use https://discordapp.com/api/oauth2/authorize?client_id=458569537286176768&permissions=8&scope=bot \n \nTo get help from the support go here: https://discord.gg/AkfhSCw`);
  }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}botsetname`){
      let nowaNazwa = args.join(" ");
      bot.user.setUsername(nowaNazwa);
      console.log(`Nick został zmieniony.`);
      message.channel.send(`:wink: Nazwa bota została zmieniona na **${nowaNazwa}**.`);
      let logiKomend = bot.channels.get("458569305341296641");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nZmienił(a) nazwę bota poprzez **botsetname** na serwerze **${message.guild.name}**, nowa nazwa: **${nowaNazwa}**.`);
    }
  }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}botsetavatar`){
      let nowyAvatar = args.join(" ");
      bot.user.setAvatar(nowyAvatar);
      console.log(`Avatar został zmieniony.`);
      message.channel.send(`:wink: Avatar bota został zmieniony na **${nowyAvatar}**.`);
      let logiKomend = bot.channels.get("458569305341296641");
      logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nZmienił(a) avatar bota poprzez **botsetavatar** na serwerze **${message.guild.name}**, nowy avatar: **${nowyAvatar}**.`);
    }
  }

    if(cmd === `${prefix}kedit`){
      if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: | Nie masz uprawnień do edytowania nazwy kanału!");
      let kedit = args.join(" ");
      message.channel.edit({ name: `${kedit}` })
      message.channel.send(`:wink: Nazwa kanału została zmieniona na **${kedit}**.`)
    }

  if(message.author.id === "396284197389729793"){
    if(cmd === `${prefix}rich`){
      //if(message.author.id !== "396284197389729as93") return message.channel.send("Nie tego!");
    let stream = args.slice(1).join(" ");
    let game = args.slice(1).join(" ");
    let listen = args.slice(1).join(" ");
    let watch = args.slice(1).join(" ");
    let reset = args.slice(1).join(" ");
      if(!args[0]) return message.channel.send(':x: You must provide a value! Correct use: `cb!rich <game/stream/watch/listen> <text>`');
      if(args[0] == 'game') return bot.user.setActivity(game),  message.channel.send(`:wink: Bot started playing in **${game}**.`);
        //message.channel.send(`:wink: Bot zaczął grać w **${game}**.`);
    //let stream = args.slice(1).join(" ");
      if(args[0] == 'stream') return bot.user.setGame(`${stream}`, 'https://twitch.tv/xcookietm'), message.channel.send(`${bot.emojis.find(`name`, 'WTF')} Bot started broadcasting live **${stream}**.`);
        //message.channel.send(`:wink: Bot zaczął nadawać na żywo **${stream}**.`);
      if(args[0] == 'listen') return bot.user.setActivity(`${listen}`, {type: 'LISTENING'}), message.channel.send(`${bot.emojis.find(`name`, 'WTF')} Bot started to listen **${listen}**.`);
      if(args[0] == 'watch') return bot.user.setActivity(`${watch}`, {type: 'WATCHING'}), message.channel.send(`${bot.emojis.find(`name`, 'WTF')} Bot began to watch **${watch}**.`);
      if(args[0] == 'reset') return bot.user.setActivity(`${reset}`), message.channel.send(`${bot.emojis.find(`name`, 'WTF')} The status of the bot has been reset.`);
      if(args[0] == 'servers') return bot.user.setActivity(`${bot.guilds.size} servers`), message.channel.send(`${bot.emojis.find(`name`, 'WTF')} The status of the bot has been set to the number of servers.`);
    }
  }

});

bot.login(process.env.TOKEN);
