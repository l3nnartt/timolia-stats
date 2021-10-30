const fs = require('fs');
const { Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

//Intents
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS);

//Partials
const myPartials = [];
myPartials.push('MESSAGE', 'GUILD_MEMBER', 'CHANNEL');

const client = new Client({ intents: myIntents, partials: myPartials });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//Command Handler
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Event Handler
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		const reply = new MessageEmbed()
			.setTitle(`${client.user.username} • Error`)
			.setTimestamp(interaction.createdAt)
			.setFooter(`${client.user.username}`, client.user.displayAvatarURL())
			.setDescription(`An error has occurred. Please contact <@398101340322136075>!\n\n Error:\n \`\`\`${error}\`\`\``)
			.setColor("#4680FC");
		return interaction.reply({ephemeral: true, embeds: [reply]});
	}
});

client.login(token);