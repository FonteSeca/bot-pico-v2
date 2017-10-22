const YoutubeDL = require('youtube-dl');
const ytdl = require('ytdl-core');
const stream = require('youtube-audio-stream');
var skipinfo = new Array();
let limitmusic = 30;

let COR_YOUTUBE = '16320777';
/**
 * Takes a discord.js client and turns it into a music bot.
 * Thanks to 'derekmartinez18' for helping.
 * 
 * @param {Client} client - The discord.js client.
 * @param {object} options - (Optional) Options to configure the music bot. Acceptable options are:
 * 							prefix: The prefix to use for the commands (default '!').
 * 							global: Whether to use a global queue instead of a server-specific queue (default false).
 * 							maxQueueSize: The maximum queue size (default 20).
 * 							anyoneCanSkip: Allow anybody to skip the song.
 * 							clearInvoker: Clear the command message.
 * 							volume: The default volume of the player.
 */
module.exports = function (client, options) {
	// Get all options.
	let PREFIX = (options && options.prefix) || '!';
	let GLOBAL = (options && options.global) || false;
	let MAX_QUEUE_SIZE = (options && options.maxQueueSize) || 20;
	let DEFAULT_VOLUME = (options && options.volume) || 50;
	let ALLOW_ALL_SKIP = (options && options.anyoneCanSkip) || false;
	let CLEAR_INVOKER = (options && options.clearInvoker) || false;

	// Create an object of queues.
	let queues = {};

	// Catch message events.
	client.on('message', msg => {
		const message = msg.content.trim();

		// Check if the message is a command.
		if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
			// Get the command and suffix.
			const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(PREFIX.length + command.length).trim();

			// Process the commands.
			switch (command) {
				case 'play':
					return play(msg, suffix);
				case 'skip':
					return newskip(msg, suffix);
				case 'queue':
					return queue(msg, suffix);
				case 'pause':
					return pause(msg, suffix);
				case 'resume':
					return resume(msg, suffix);
				case 'volume':
					return volume(msg, suffix);
				case 'leave':
					return leave(msg, suffix);
				case 'clearqueue':
					return clearqueue(msg, suffix);
				case 'tocar':
					return play(msg, suffix);
				case 'pular':
					return newskip(msg, suffix);
				case 'playlist':
					return playlist(msg, suffix);
				case 'pausar':
					return pause(msg, suffix);
				case 'tocandoagora':
					return nowplaying(msg, suffix);
				case 'agora':
					return nowplaying(msg, suffix);
				case 'nowplaying':
					return nowplaying(msg, suffix);
				case 'np':
					return nowplaying(msg, suffix);
				case 'continuar':
					return resume(msg, suffix);
				case 'vol':
					return volume(msg, suffix);
				case 'stop':
					return leave(msg, suffix);
				case 'parar':
					return leave(msg, suffix);
				case 'limparplaylist':
					return clearqueue(msg, suffix);
				case 'criarpl':
					return createPL(msg, suffix);
				case 'addmusic':
					return addMusicToPL(msg, suffix);
				case 'setdesc':
					return setDesc(msg, suffix);
				case 'addauthor':
					return addAuthor(msg, suffix);
				case 'playpl':
					return addMusicsToQueue(msg, suffix);
			}
			if (CLEAR_INVOKER) {
				msg.delete();
			}
		}
	});

	/**
	 * Checks if a user is an admin.
	 * 
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} - 
	 */
	function isAdmin(member) {
		return member.hasPermission("ADMINISTRATOR");
	}

	/**
	 * Checks if the user can skip the song.
	 * 
	 * @param {GuildMember} member - The guild member
	 * @param {array} queue - The current queue
	 * @returns {boolean} - If the user can skip
	 */
	function canSkip(member, queue) {
		if (ALLOW_ALL_SKIP) return true;
		else if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}

	/**
	 * Gets the song queue of the server.
	 * 
	 * @param {integer} server - The server id. 
	 * @returns {object} - The song queue.
	 */
	function getQueue(server) {
		// Check if global queues are enabled.
		if (GLOBAL) server = '_'; // Change to global queue.

		// Return the queue.
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	/**
	 * The command for adding a song to the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response edit.
	 */
	function play(msg, suffix) {
		// Make sure the user is in a voice channel.
		if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Você não está no chat de voz.'));

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Use **!play nome da música** ou **!play urldoyoutube**'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Playlist cheia! Espere esvaziar'));
		}
		


		// Get the video information.
		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  **Procurando: ** *' + suffix +'*')).then(response => {
			var searchstring = suffix
			if (!suffix.toLowerCase().startsWith('http')) {
				searchstring = 'gvsearch1:' + suffix;
				console.log(searchstring);
			}

			YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					console.log(info);
					return response.edit(wrap(COR_YOUTUBE,':x: :white_small_square:  **Vídeo inválido!**'));
				
				}

				info.requester = msg.author.id;
				
				const embed = {
					  "title": info.title,
					  "description": "asda",
					  "url": info.url,
					  "color": COR_YOUTUBE,
					  "timestamp": "2017-10-06T16:10:52.501Z",
					  "footer": {
					    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
					    "text": "Pico | YouTube"
					  },
					  "thumbnail": {
					    "url": info.thumbnail
					  },

					  "author": {
					    "name": "DJ Pico | " + msg.author.toString().username + " adicionou na playlist",
					    "url": "https://youtube.com",
					    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
					  },
					  "fields": [
					    {
					      "name": "Duração",
					      "value": info.duration,
					      "inline": true
					    },
					    {
					      "name": "Nhanahanh",
					      "value": util.getAuthor(name),
					      "inline": true
					    }
					  ]
				};
				// Queue the video.
				response.edit({embed}).then(() => {
					queue.push(info);
					// Play if only one element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
				}).catch(console.log);
			});
		}).catch(console.log);
	}


	/**
	 * The command for skipping a song.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function oldskip(msg, suffix, vote) {
		// Get the voice connection.

		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não há música para pular.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Get the number to skip.
		let toSkip = 1; // Default 1.
		if (!isNaN(suffix) && parseInt(suffix) > 0) {
			toSkip = parseInt(suffix);
		}
		toSkip = Math.min(toSkip, queue.length);

		// Skip.
		queue.splice(0, toSkip - 1);

		// Resume and stop playing.
		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();

		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square: **Música pulada!**. Próxima..'));
	}

	function getSkips(server) {
		// Check if global queues are enabled.
		if (GLOBAL) server = '_'; // Change to global queue.

		// Return the queue.
		if (!skipinfo[server]) {
			skipinfo[server] = [];
			skipinfo[server].users = [];
			skipinfo[server].count = 0;
		}
		return skipinfo[server];
	}

	function newskip(msg,suffix) {

		const skipinfo = getSkips(msg.guild.id);

  var connect = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Você não está no chat de voz.'));
  if (connect.length < 1) {
    msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square: Não há música para pular.'))
  } else {
    var count = Math.round((msg.member.voiceChannel.members.size - 1) / 2)
    if (skipinfo.users.indexOf(msg.author.id) > -1) {
      msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Você já votou para pular.'))
    } else {
      skipinfo.users.push(msg.author.id)
      skipinfo.count++
      if (skipinfo.count >= count) {
      	oldskip(msg,'1','SUCESSO')
    //    msg.channel.sendMessage(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Música pulada. Próxima..'))
      } else {
        msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square: **' + msg.author.username + '** votou para pular. Faltam ' + (count - skipinfo.count) + ' votos.'))
      }
    }
  }
	}

	/**
	 * The command for listing the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function queue(msg, suffix) {
		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');

		// Get the status of the queue.
		let queueStatus = 'Parado';
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection !== null) {
			const dispatcher = voiceConnection.player.dispatcher;
			queueStatus = dispatcher.paused ? 'Pausado' : 'Tocando';
		}

		// Send the queue and status.
		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Queue (' + queueStatus + '):\n' + text));
	}

	/**
	 * The command for pausing the current song.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function pause(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não há música para pausar.'));

//		if (!isAdmin(msg.member))
//			return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Este é um comando para administradores.'));

		// Pause.
		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Pausado.'));
		const dispatcher = voiceConnection.player.dispatcher;
		if (!dispatcher.paused) dispatcher.pause();
	}

	/**
	 * The command for leaving the channel and clearing the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function leave(msg, suffix) {
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não estou em nenhum canal.'));
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
		} else {
			msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não tens a permissão para usar esse comando!'));
		}
	}

	/**
	 * The command for clearing the song queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function clearqueue(msg, suffix) {
		if (isAdmin(msg.member)) {
			const queue = getQueue(msg.guild.id);

			queue.splice(0, queue.length);
			msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Playlist limpa!'));
		} else {
			msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não tens a permissão de usar este comando!'));
		}
	}

	/**
	 * The command for resuming the current song.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function resume(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não há nenhuma música na playlist.'));

//		if (!isAdmin(msg.member))
//			return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não estás autorizado a usar isto.'));

		// Resume.
		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Música de volta a ativa.'));
		const dispatcher = voiceConnection.player.dispatcher;
		if (dispatcher.paused) dispatcher.resume();
	}

	/**
	 * The command for changing the song volume.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function volume(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não há música sendo tocada.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não estás autorizado a usar este comando.'));

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Volume out of range!')).then((response) => {
			response.delete(5000);
		});

		msg.channel.send(wrap(COR_YOUTUBE,":musical_note: :white_small_square:  Volume set to " + suffix));
		dispatcher.setVolume((suffix/100));
	}

	/**
	 * Executes the next song in the queue.
	 * 
	 * @param {Message} msg - Original message.
	 * @param {object} queue - The song queue for this server.
	 * @returns {<promise>} - The voice channel.
	 */
	function executeQueue(msg, queue) {
		const skipinfo = getSkips(msg.guild.id);
		 skipinfo.count = 0;
		 skipinfo.users = [];

		// If the queue is empty, finish.
		if (queue.length === 0) {
			// msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square:  Playlist finalizada.'));

			// Leave the voice channel.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) return voiceConnection.disconnect();
		}

		new Promise((resolve, reject) => {
			// Join the voice channel if not already in one.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) {
				// Check if the user is in a voice channel.
				if (msg.member.voiceChannel) {
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
				} else {
					// Otherwise, clear the queue and do nothing.
					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {
			// Get the first item in the queue.
			const video = queue[0];
			console.log(video.webpage_url);

			// Play the video.
			msg.channel.send(wrap(COR_YOUTUBE,':arrow_forward: :white_small_square:  **Tocando agora:** *' + video.title + '*')).then(() => {
				let dispatcher = connection.playStream(stream(video.webpage_url));

				connection.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('end', () => {
					// Wait a second.
					setTimeout(() => {
						if (queue.length > 0) {
							// Remove the song from the queue.
							queue.shift();
							// Play the next song in the queue.
							executeQueue(msg, queue);
						}
					}, 1000);
				});

			}).catch((error) => {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
	}


	function nowplaying(msg) {
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(wrap(COR_YOUTUBE,':x: :white_small_square:  Não há música sendo tocada.'));

		const queue = getQueue(msg.guild.id);
		const np = queue[0];
		msg.channel.send(wrap(COR_YOUTUBE,':musical_note: :white_small_square: **Tocando agora:** *' + np.title +'* [' + np.duration + '], pedido por *<@'+ np.requester +'>*. (<' + np.webpage_url + '>)'));
	}


}

/**
 * Wrap text in a code block and escape grave characters.
 * 
 * @param {string} text - The input text.
 * @returns {string} - The wrapped text.
 */
function wrap(color,text) {
	return {embed: {
    color: color,
    description: text
    }};
}

function sleep(time,callback) {
  var now = new Date().getTime();
  while(new Date().getTime() < now + time) {
   // do nothing
  }
  callback();
}
