const Discord = require("discord.js");

const security = require("./cfg/security.json");
const commands = require("./cfg/commands.json");

const pyHandler = require("./src/core/pythonHandler");
const hooks = require("./src/core/hooks");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Bot successfully started.");

	//Init hooks
	hooks.init(client.channels);
});

client.on('guildMemberAdd', member => {
	//TODO allow enable and disable using config.json
	var welcomeMessage = configHandler.readJSON("config", msg.guild.id, "welcomeMessage");
	var channel = member.guild.channels.find("name", welcomeMessage.channel);

	if (!channel) return;

	channel.send(`${welcomeMessage.messagePart1} ${member} ${welcomeMessage.messagePart1}`);
});

client.on("message", msg => {
	if (msg.isMentioned(client.user)) {
		//Pre-edit message
		msg.content = msg.content.toLowerCase();
		msg.contentArray = msg.content.split(" ").splice(1, msg.content.length);

		var bAnswered = false;
		var i = 0;

		while(!bAnswered && i < commands.length) {
			var command = commands[i];
			var pattern = new RegExp(command.regex);
			if (pattern.test(msg.content)) {
				if (command.type === "js") {
					require("./" + command.path).run(msg, client);
					bAnswered = true;
				} else if (command.type === "python") {
					pyHandler.run(command.path, msg.contentArray, msg.channel);
					bAnswered = true;
				}
			}
			i++;
		}

		if (!bAnswered) {
			msg.channel.send("Sorry, I can't help you with that.");
		}
	}
});

client.login(security.token);