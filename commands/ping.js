const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Misst die Latenz zwischen Bot und Discord API'),
	async execute(interaction, client) {
		const embed = new MessageEmbed()
			.setTitle(`${client.user.username} • Ping`)
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
			.setTimestamp(interaction.createdAt)
			.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		interaction.reply({embeds: [embed]});
	},
};