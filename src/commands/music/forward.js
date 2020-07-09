const Command = require('../../structures/Command');


const fastForwardNum = 10;

module.exports = class Forward extends Command {
	constructor(client) {
		super(client, {
			name: 'forward',
			description: 'Fast forwards a song (default 10 seconds).',
			cooldown: '4',
			usage: '<seconds>',
			aliases: ['ff', 'fastforward'],
			inVoiceChannel: true,
			sameVoiceChannel: true,
			playing: true,
		});
	}
	async run(client, message, args) {
		const player = client.music.players.get(message.guild.id);
		const currentSongLength = player.queue.current.length;

		if (args[0] && !isNaN(args[0])) {
			if ((player.position + args[0] * 1000) < currentSongLength) {
				const newDur = client.formatDuration(player.position + args[0] * 1000);
				player.seek(player.position + args[0] * 1000);
				return message.channel.send(`Fast-forwarded to ${newDur}`);
			}
			else { return message.channel.send('Cannot forward beyond the song\'s duration.'); }
		}
		else if (args[0] && isNaN(args[0])) { return message.reply(`Invalid argument, must be a number.\nCorrect Usage: \`${client.settings.prefix}forward <seconds>\``); }

		if (!args[0]) {
			if ((player.position + fastForwardNum * 1000) < currentSongLength) {
				const newDur = client.formatDuration(player.position + fastForwardNum * 1000);
				player.seek(player.position + fastForwardNum * 1000);
				return message.channel.send(`Fast-forwarded to ${newDur}`);
			}
			else {
				return message.channel.send('Cannot forward beyond the song\'s duration.');
			}
		}
	}
};
