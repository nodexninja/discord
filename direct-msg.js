module.exports = (client, trigger, reply) => {
  client.on("message", (msg) => {
    if (msg.channel.type === "dm" && msg.content.toLowerCase() === trigger.toLowerCase()) {
      msg.author.send(reply)
    }
  })
}