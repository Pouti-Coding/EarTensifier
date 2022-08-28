const { EmbedBuilder } = require('discord.js');

const DatabaseHelper = require('../../helpers/DatabaseHelper');
const Event = require('../../structures/Event');
const formatDuration = require('../../utils/music/formatDuration');

module.exports = class TrackEnd extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(player, track, finished) {
        player.queue.previous = track;

        const shouldSend = await DatabaseHelper.shouldSendNowPlayingMessage(player.textChannel.guild);

        try {
            // if (player.nowPlayingMessageInterval) {
            //     clearInterval(player.nowPlayingMessageInterval);
            //     player.nowPlayingMessageInterval = null;
            // }
            if (!shouldSend || !player.nowPlayingMessage) return;

            const parsedDuration = formatDuration(track.duration);

            const newNowPlayingEmbed = EmbedBuilder.from(player.nowPlayingMessage.embeds[0])
                .setAuthor({ name: track.author, iconURL: 'https://eartensifier.net/images/cd.png', url: track.url });

            if (finished) newNowPlayingEmbed.setDescription(`${parsedDuration}  ${this.client.config.emojis.progress1}${this.client.config.emojis.progress2.repeat(13)}${this.client.config.emojis.progress8}  ${parsedDuration}`);

            await player.nowPlayingMessage.edit({ components: [], embeds: [newNowPlayingEmbed] });
        }
        catch (e) {
            this.client.logger.error(e);
        }
    }
};