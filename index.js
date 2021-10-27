const Discord = require("discord.js")
const fs = require("fs")
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")
const db = new Database()
const client = new Discord.Client()
const config = require('./config.json')
const querystring = require('querystring')
const prefix = "."
const devkey = ["x.", "nodex."]
const auth = 'https://discord.com/api/oauth2/authorize?client_id=902092315827515432&permissions=536837353207&scope=bot'

const dmsg = require("./direct-msg")

function md(string) {
  this.code = function() {
    return `\`${string}\``
  }
}

function code(string) {
  return `\`${string}\``
}

function filter(value) {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value)
  } else {
    return NaN
  }
}

function randint(min, max) {
  return Math.floor(Math.random() * max - min) + min
}

function addUser(id, items) {
  db.get("users").then(users => {
    people = users
    people.push(id)
    db.set("users", people)
  })
  db.get("inv").then(inv => {
    coins = inv
    coins.push(100)
    db.set("inv", coins)
  })
  return people
}

function earn(amt, person) {
  db.get("users").then(users => {
    people = users
  })
  db.get("inv").then(inv => {
    coins = inv
    coins[people.indexOf(`${person}`)] = filter(coins[people.indexOf(`${person}`)]) + amt
    db.set("inv", coins)
  })
  return coins
}

function getUsers() {
  db.get("users").then(users => {
    people = users
  });
  return people
}

function money(person) {
  db.get("inv").then(inv => {
    coins = inv
    console.log(coins)
  })
  return coins[people.indexOf(`${person}`)]
}

function reset() {
  db.set("users", [])
  db.set("inv", [])
  people = []
  coins = []
}

function sync() {
  db.get("users").then(users => {
    people = users
  });
}

var people = []
var coins = []

db.get("users").then(users => {
  if (!users || users.length < 1) {
    db.set("users", people)
  }
  people = users
});

db.get("inv").then(inv => {
  if (!inv || inv.length < 1) {
    db.set("inv", coins)
  }
  coins = inv
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity(".help")
  dmsg(client, "ping", "pong")
  dmsg(client, "hello", "Hello! I am Nodex Bot!")
  dmsg(client, "?", "Nani?")
})

client.on("message", async msg => {
  sync()
  if (msg.author.bot) {
    return
  }
  if (msg.content.startsWith(prefix)) {
    const params = msg.content.slice(prefix.length).trim().split(/ +/)
    const command = params.shift().toLowerCase()
    console.log(command)
    console.log(params)
    if (command === "help") {
      if (!params[0]) {
        const embed = new Discord.MessageEmbed()
          .setColor("#0064ff")
          .setTitle(`Help Page`)
          .setDescription(`Here are a few pages to get you started!`)
          .addField(`General`, code(`${prefix}help general`), false)
          .addField(`Scratch`, code(`${prefix}help scratch`), true)
          .addField(`GitHub`,code(`${prefix}help github`), true)
          .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_60x60.png`,`https://scratch.mit.edu/users/nodexninja`)
        msg.reply(embed)
      }
      if (params[0] === "scratch") {
        const embed = new Discord.MessageEmbed()
          .setColor("#FDB826")
          .setTitle(`Scratch Commands`)
          .addField(`${prefix}s p \`username\``,`Fetch a user\'s profile data!`, true)
          .addField(`${prefix}s s \`key words\``,`Search for scratch projects!`, true)
          .addField(`${prefix}s q \`key words\``,`Project quick search!`, true)
          .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_60x60.png`,`https://scratch.mit.edu/users/nodexninja`)
        msg.reply(embed)
      }
      if (params[0] === "github") {
        const embed = new Discord.MessageEmbed()
          .setColor("#000000")
          .setTitle(`GitHub Commands`)
          .addField(`${prefix}g u \`username\``,`Fetch a user\'s profile data!`, true)
          .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_60x60.png`,`https://scratch.mit.edu/users/nodexninja`)
        msg.reply(embed)
      }
      if (params[0] === "general") {
        const embed = new Discord.MessageEmbed()
          .setColor("#0064ff")
          .setTitle(`Nodex`)
          .addField(`${prefix}dm \`username\` \`message\``,`Direct message a mentioned user with the bot!`, true)
          .addField(`${prefix}beg`,`Beg for coins :thinking:.`, true)
          .addField(`${prefix}balance`,`See how much money you have.`, true)
          .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_60x60.png`,`https://scratch.mit.edu/users/nodexninja`)
        msg.reply(embed)
      }
    }
    if (command === "s") {
      if (params[0] === "p") {
        fetch('https://api.scratch.mit.edu/users/' + params[1])
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`${data.username}`)
            .addField(`Bio`,`${data.profile.bio}`)
            .addField(`Work`, `${data.profile.status}`)
            .addField(`Country`, `${data.profile.country}`)
            .setImage(`https://cdn2.scratch.mit.edu/get_image/user/${data.id}_90x90.png`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_60x60.png`,`https://scratch.mit.edu/users/nodexninja`)
          fetch('https://scratchdb.lefty.one/v3/user/info/' + params[1])
          .then(res => res.text())
          .then(text => {
            const sub = JSON.parse(text)
            embed.addField(`Stats`, `:bust_in_silhouette: ${sub.statistics.followers}\n:eye: ${sub.statistics.views}\n:heart: ${sub.statistics.loves}\n:star: ${sub.statistics.favorites}\n:speech_left: ${sub.statistics.comments}`, true)
            embed.addField(`Global Ranks`, `:bust_in_silhouette: #${sub.statistics.ranks.followers}\n:eye: #${sub.statistics.ranks.views}\n:heart: #${sub.statistics.ranks.loves}\n:star: #${sub.statistics.ranks.favorites}\n:speech_left: #${sub.statistics.ranks.comments}`, true)
            embed.addField(`Country Ranks`, `:bust_in_silhouette: #${sub.statistics.ranks.country.followers}\n:eye: #${sub.statistics.ranks.country.views}\n:heart: #${sub.statistics.ranks.country.loves}\n:star: #${sub.statistics.ranks.country.favorites}\n:speech_left: #${sub.statistics.ranks.country.comments}`, true)
            embed.addField(`Links`, `[Visit Profile](https://scratch.mit.edu/users/${data.username})`)
            msg.reply(embed)
          })
        })
      }
      if (params[0] === "q") {
        var search = []
        for (i=1;i<params.length;i++) {
          search.push(params[i])
        }
        console.log(search)
        var string = search.join("%20")
        fetch('https://api.scratch.mit.edu/search/projects?q=' + string)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          console.log(data[0])
          const desc = data[0].description
          if(desc.length > 1024) {
            const desc = desc.substring(0, 1024)
          }
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`${data[0].title}`)
            .addField(`Notes`,`${desc}`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_90x90.png`,`https://scratch.mit.edu/users/nodexninja`)
          msg.reply(embed)
        })
      }
      if (params[0] === "s") {
        var search = []
        for (i=1;i<params.length;i++) {
          search.push(params[i])
        }
        console.log(search)
        var string = search.join("%20")
        fetch('https://api.scratch.mit.edu/search/projects?q=' + string)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          console.log(data[0])
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`Popular Projects`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_90x90.png`,`https://scratch.mit.edu/users/nodexninja`)
          for (i=0;i<data.length;i++) {
            embed.addField(`${data[i].title}`,`by [@${data[i].author.username}](https://scratch.mit.edu/users/${data[i].author.username})\n[View on Scratch](https://scratch.mit.edu/projects/${data[i].id})\nID: ${data[i].id}\n${data[i].stats.views} :eye:, ${data[i].stats.loves} :heart:, ${data[i].stats.favorites} :star:, ${data[i].stats.remixes} :low_brightness:`, true)
          }
          msg.reply(embed)
        })
      }
      if (params[0] === "proj") {
        fetch(`https://scratchdb.lefty.one/v3/project/info/${params[1]}`)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          console.log(data)
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`${data.title}`)
            .addField(`Instructions`,`${data.instructions}`)
            .addField(`Project ID`,`${data.id}`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_90x90.png`,`https://scratch.mit.edu/users/nodexninja`)
            .setFooter(`Project by ${data.username}`)
          msg.reply(embed)
        })
      }
      if (params[0] === "fav") {
        fetch(`https://api.scratch.mit.edu/users/${params[1]}/favorites`)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          console.log(data)
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`${params[1]}\'s Favourites`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_90x90.png`,`https://scratch.mit.edu/users/nodexninja`)
          for (i=0;i<data.length;i++) {
            embed.addField(`${data[i].title}`,`${data[i].id}`, true)
          }
          msg.reply(embed)
        })
      }
      if (params[0] === "t") {
        var search = []
        for (i=1;i<params.length;i++) {
          search.push(params[i])
        }
        console.log(search)
        var string = search.join("%20")
        fetch('https://api.scratch.mit.edu/search/projects?mode=trending&q=' + string)
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          console.log(data[0])
          const embed = new Discord.MessageEmbed()
            .setColor("#0064ff")
            .setTitle(`Trending Projects`)
            .setAuthor(`Nodex Ninja`, `https://cdn2.scratch.mit.edu/get_image/user/79397968_90x90.png`,`https://scratch.mit.edu/users/nodexninja`)
          for (i=0;i<data.length;i++) {
            embed.addField(`${data[i].title}`,`by [@${data[i].author.username}](https://scratch.mit.edu/users/${data[i].author.username})\n[View on Scratch](https://scratch.mit.edu/projects/${data[i].id})\nID: ${data[i].id}\n${data[i].stats.views} :eye:, ${data[i].stats.loves} :heart:, ${data[i].stats.favorites} :star:, ${data[i].stats.remixes} :low_brightness:`, true)
          }
          msg.reply(embed)
        })
      }
    }
    if (command === "dm") {
      const u = msg.mentions.users.first().id
      if (msg.mentions.users.first()) {

      } else {
        msg.reply(`No users were mentioned!`)
        u = msg.author.id
        return
      }
      var txt = []
      for (i=1;i<params.length;i++) {
        txt.push(params[i])
      }
      txt = txt.join(" ")
      const embed = new Discord.MessageEmbed()
        .setColor("#0064ff")
        .setTitle(`New Message!`)
        .setDescription(`${txt}`)
        .setAuthor(`${msg.author.tag}`)
      client.users.fetch(u).then((user) => {user.send(embed)})
    }
    if (command === "beg") {
      console.log(getUsers())
      if (!people.includes(msg.author.id)) {
        addUser(msg.author.id)
        const embed = new Discord.MessageEmbed()
        embed
          .setColor("#0064ff")
          .setTitle("Beg Command")
          .setDescription(`You need to register your account with \`${prefix}play\``)
        msg.reply(embed)
      } else {
        const embed = new Discord.MessageEmbed()
        const luck = randint(0,10)
        if (luck === 0) {
          embed
            .setColor("#ff0032")
            .setTitle(`Imagine Begging!`)
            .setDescription(`You got no coins lol.`)
        } else {
          const beg = randint(0,100)
          embed
            .setColor("#00b428")
            .setTitle(`Impossible!`)
            .setDescription(`You received **$${beg}** after begging!`)
            .addField(`Account`, `:moneybag: You now have **$${coins[people.indexOf(msg.author.id)] + beg}** in your account!`)
          earn(beg, msg.author.id)
        }
        msg.reply(embed)
      }
    }
    if (command === "money") {
      money()
    }
    if (command === "users") {
      console.log(getUsers())
    }
    if (command === "reset" && msg.author.id === "896643867749810188") {
      reset()
    }
    if (command === "invite") {
      msg.reply(`Invite me to your server with: https://discord.com/api/oauth2/authorize?client_id=902092315827515432&permissions=536837353207&scope=bot`)
    }
    if (command === "play") {
      console.log(people)
      if (!people.includes(msg.author.id)) {
        addUser(msg.author.id)
        const embed = new Discord.MessageEmbed()
          .setTitle(`Great!`)
          .setDescription(`Your account has been registered!`)
          .setColor(`#00b428`)
        msg.reply(embed)
      } else {
        const embed = new Discord.MessageEmbed()
          .setTitle(`Calm Down`)
          .setDescription(`You have already registered an account.`)
          .addField(`Errors`, `The server could have been reset by the admins a while ago. Try ${prefix}play again!`)
          .setColor(`#ff0032`)
        msg.reply(embed)
      }
    }
    if (command === "bal" || command === "balance") {
      const embed = new Discord.MessageEmbed()
        .setTitle(`${msg.author.tag}\'s Balance`)
        .setDescription(`:moneybag: You have **$${coins[people.indexOf(msg.author.id)]}**. Amazing!`)
        .setColor(`#0064ff`)
      msg.reply(embed)
    }
    if (command === "code") {
      const text = new md(params[0]).code()
      msg.reply(text)
    }
    if (command === "g") {
      if (params[0] === "u") {
        fetch('https://api.github.com/users/' + params[1])
        .then(res => res.text())
        .then(text => {
          const data = JSON.parse(text)
          const embed = new Discord.MessageEmbed()
            .setAuthor(`${data.login}`, `${data.avatar_url}`, `https://github.com/${data.login}`)
            .setColor(`#0064ff`)
            .setTitle(`${data.name}`)
            .setDescription(`${data.bio}`)
            .addField(`Followers`, `${data.followers}`, true)
            .addField(`Following`, `${data.following}`, true)
            .addField(`Website`, `[${data.blog}](${data.blog})`)
          if (data.company) {
            embed.addField(`Other`, `:earth_americas: ${data.location}\n:office: [${data.company}](https://github.com/${data.company.slice(1)})`)
          }
          msg.reply(embed)
        })
      }
    }
  } else if (msg.content.startsWith(devkey[0]) || msg.content.startsWith(devkey[1])) {
    /* 
    This area will include complicated evaluated string commands to help programmers use this bot to its maximum capacity...
    */
    var params = msg.content.slice(devkey[0].length).trim().split(/[,]+/)
    if (msg.content.startsWith(devkey[0])) {
      params = msg.content.slice(devkey[0].length).trim().split(/[,]+/)
    } else {
      params = msg.content.slice(devkey[1].length).trim().split(/[,]+/)
    }
    const command = params.shift().toLowerCase()
    console.log(command)
    console.log(params)
    if (command === "help") {
      msg.reply(`You are using special nodex dev syntax.`)
    }
  }
})
keepAlive()
client.login(process.env.TOKEN)