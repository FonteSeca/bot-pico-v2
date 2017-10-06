const YoutubeDL = require('youtube-dl');
const ytdl = require('ytdl-core');
var skipinfo = new Array();
let limitmusic = 30;
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
		if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não está no chat de voz.'));

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use **!play nome da música** ou **!play urldoyoutube**'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.channel.send(wrap('16766720',':x: :white_small_square:  Playlist cheia! Espere esvaziar'));
		}
		


		// Get the video information.
		msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  **Procurando: ** *' + suffix +'*')).then(response => {
			var searchstring = suffix
			if (!suffix.toLowerCase().startsWith('http')) {
				searchstring = 'gvsearch1:' + suffix;
				console.log(searchstring);
			}

			YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					console.log(info);
					return response.edit(wrap('16766720',':x: :white_small_square:  **Vídeo inválido!**'));
				
				}

				info.requester = msg.author.id;
				const embed = {
					  "title": info.title,
					  "description": ".",
					  "url": suffix,
					  "color": 16320777,
					  "timestamp": "2017-10-06T16:10:52.501Z",
					  "footer": {
					    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
					    "text": "Pico | YouTube"
					  },
					  "thumbnail": {
					    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
					  },
					  "image": {
					    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
					  },
					  "author": {
					    "name": "Pico",
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
					      "name": "Carinha que botou a musica",
					      "value": msg.author.toString(),
					      "inline": true
					    },
					    {
					      "name": "asd",
					      "value": "Seraaa",
					      "inline": true
					    }
					  ]
				};
				// Queue the video.
				response.edit(wrap('16766720',':musical_note: :white_small_square:  **Adicionado na playlist:** *' + info.title + '*')).then(() => {
					queue.push(info);
					msg.channel.send({embed});
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
		if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há música para pular.'));

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

		msg.channel.send(wrap('16766720',':musical_note: :white_small_square: **Música pulada!**. Próxima..'));
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
		if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não está no chat de voz.'));
  if (connect.length < 1) {
    msg.channel.send(wrap('16766720',':x: :white_small_square: Não há música para pular.'))
  } else {
    var count = Math.round((msg.member.voiceChannel.members.size - 1) / 2)
    if (skipinfo.users.indexOf(msg.author.id) > -1) {
      msg.channel.send(wrap('16766720',':x: :white_small_square:  Você já votou para pular.'))
    } else {
      skipinfo.users.push(msg.author.id)
      skipinfo.count++
      if (skipinfo.count >= count) {
      	oldskip(msg,'1','SUCESSO')
    //    msg.channel.sendMessage(wrap('16766720',':musical_note: :white_small_square:  Música pulada. Próxima..'))
      } else {
        msg.channel.send(wrap('16766720',':musical_note: :white_small_square: **' + msg.author.username + '** votou para pular. Faltam ' + (count - skipinfo.count) + ' votos.'))
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
		msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Queue (' + queueStatus + '):\n' + text));
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
		if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há música para pausar.'));

//		if (!isAdmin(msg.member))
//			return msg.channel.send(wrap('16766720',':x: :white_small_square:  Este é um comando para administradores.'));

		// Pause.
		msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Pausado.'));
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
			if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não estou em nenhum canal.'));
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
		} else {
			msg.channel.send(wrap('16766720',':x: :white_small_square:  Não tens a permissão para usar esse comando!'));
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
			msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Playlist limpa!'));
		} else {
			msg.channel.send(wrap('16766720',':x: :white_small_square:  Não tens a permissão de usar este comando!'));
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
		if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há nenhuma música na playlist.'));

//		if (!isAdmin(msg.member))
//			return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não estás autorizado a usar isto.'));

		// Resume.
		msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Música de volta a ativa.'));
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
		if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há música sendo tocada.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não estás autorizado a usar este comando.'));

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Volume out of range!')).then((response) => {
			response.delete(5000);
		});

		msg.channel.send(wrap('16766720',":musical_note: :white_small_square:  Volume set to " + suffix));
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
			// msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Playlist finalizada.'));

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
			msg.channel.send(wrap('16766720',':arrow_forward: :white_small_square:  **Tocando agora:** *' + video.title + '*')).then(() => {
				let dispatcher = connection.playStream(ytdl(video.webpage_url, {filter: 'audioonly'}), {seek: 0, volume: (DEFAULT_VOLUME/100)});

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
		if (voiceConnection === null) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há música sendo tocada.'));

		const queue = getQueue(msg.guild.id);
		const np = queue[0];
		msg.channel.send(wrap('16766720',':musical_note: :white_small_square: **Tocando agora:** *' + np.title +'* [' + np.duration + '], pedido por *<@'+ np.requester +'>*. (<' + np.webpage_url + '>)'));
	}


/**
*	
*	Sistema de playlists
*
*/

const request = require('request');
const fs = require('fs');

let urlbase = 'http://sebasbot.uphero.com/';
let jsonfolder = 'json/';
let playlistsfolder = 'pl/lists/'


function playlist(msg,suffix) {
		const action = suffix.split(/[ \n]/)[0].toLowerCase().trim();
		const sufixo = suffix.substring(' '.length + action.length).trim();
			// Process the commands.
			switch (action) {
				case 'criar':
					return createPL(msg, sufixo);
				case 'add':
					return addMusicToPL(msg, sufixo);
				case 'desc':
					return setDesc(msg, sufixo);
				case 'addautor':
					return addAuthor(msg, sufixo);
				case 'removerautor':
					return removeAuthor(msg, sufixo);
				case 'play':
					return addMusicsToQueue(msg, sufixo);
				case 'info':
					return pl_info(msg, sufixo);
				case 'icon':
					return setIcon(msg, sufixo);
				case 'teste':
					return teste(msg, sufixo);
				case 'remove':
					return deleteMusic(msg, sufixo);
				case 'musicas':
					return listMusics(msg, sufixo);
				case 'apagar':
					return msg.channel.send(wrap('16766720',':x: :white_small_square: Desculpe, mas esse comando está desativado no momento.'));
			}
}


var getPL = function(plname, callback) {
    request(urlbase + jsonfolder + playlistsfolder + plname + '.json', function(error, response, body) {
        if(!error && response.statusCode == 200) {
            body;
        } else {
            console.log("Error: "+ error);
        }
        callback(error, body);
    });
};

	function addMusicsToQueue(msg,suffix) {
		if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não está no chat de voz.'));
		const queue = getQueue(msg.guild.id);
		const plname = suffix.toLowerCase();

		msg.channel.send(wrap('16766720',':musical_note: :white_small_square: Adicionando playlist ao queue...')).then(resposta => {
		//chama a função para getar pl
	    getPL(plname, function(err, data) {

	    	// verifica se tem a pl
	        if(data == '404notfound') {
	        console.log('playlist n existe po')
	        resposta.edit(wrap('16766720',':x: :white_small_square:  Essa playlist não existe!'));
	        return;
	        }

	        // prepara a massinha  
	    const json = JSON.parse(data);
	    	// verifica se tem música na playlist
	    	if(json['musics'].length <= 0) {
	    	resposta.edit(wrap('16766720',':x: :white_small_square:  Não há músicas nessa playlist'));
	    	return;
	    	}

	    	// tudo certo. hora do show.
	    	for (i = 0; i < json['musics'].length; i++) {

			sleep(i * 40,function() {YoutubeDL.getInfo('http://youtube.com/watch?v='+json['musics'][i]['url'], ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.

				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					return console.log('ERRO AO COLOCAR PL ('+plname+'):'+err)
				}

				info.playlistname = plname;
				info.requester = msg.author.id;

				// Queue the video.
					queue.push(info);
					resposta.edit(wrap('16766720',':musical_note: :white_small_square:  Adicionando a playlist **'+ plname +'** ao queue. Música `'+i+'/'+json['musics'].length+'`'));
					// Play if only one element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
					if(json['musics'].length < i) return resposta.edit(wrap('16766720',':musical_note: :white_small_square:  **Playlist '+ plname +'** adicionada ao Queue'));
				});
			})

			}
		
	})
	})
}

	function createPL(msg,suffix) {
		if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist criar nome_da_playlist`'));
		//verifica se a plname é alphanumerica
		if(!/^\w+$/.test(suffix)){
	    return msg.channel.send(wrap('16766720',':x: :white_small_square: A playlist deve haver apenas caracteres alfanuméricos. Exemplos:`playlistsuperduper`,`colecaoyurionice`,`top10melhoresukes`..'));
		}
	const plname = suffix.toLowerCase();
	const member = msg.author.id;
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'createpl',member:member,plname:plname}}, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        	console.log('"'+ body +'"')
        	if(body == 'plalreadyexists') return msg.channel.send(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** já existe.'));
	    	if(body == 'success') msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Playlist **'+ plname +'** criada com sucesso.'));
        } else {
            console.log("Error: "+ error);
        }
    });
};


	function addMusicToPL(msg,suffix) {
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist add nome_da_playlist  nome da música ou URL`'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const musicsearch = suffix.split(plname + ' ')[1];
	if (!musicsearch) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist add nome_da_playlist  nome da música ou URL`'));
	const member = msg.author.id;
	// primeiro, procura no youtube se tem música e pá

		msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  **Procurando...**')).then(response => {
			var searchstring = musicsearch;
			if (!searchstring.startsWith('http')) {
				searchstring = 'gvsearch1:' + musicsearch;
			}
			YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					return response.edit(wrap('16766720',':x: :white_small_square:  **Vídeo inválido ou não encontrado! Use a URL do vídeo.**'));
				}
				console.info(info)
				// ADICIONA NA PLAYLIST PAPAI
				const musicurl = info.webpage_url.split('v=')[1].trim()
				console.info(musicurl)
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'addmusic',member:member,plname:plname,music:musicurl,musicname:info.title}}, function(error, respo, body) {
        if(!error && respo.statusCode == 200) {
        	console.log('"'+ body +'"')
        	if(body == 'pldontexist') return response.edit(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
        	if(body == 'noperm') return response.edit(wrap('16766720',':x: :white_small_square:  Você não tem permissão para adicionar músicas na playlist '+ plname +'.'));
	    	if(body == 'success') response.edit(wrap('16766720',':musical_note: :white_small_square:  A música '+ info.title +' foi adicionada na playlist **'+ plname +'** com sucesso.'));
        } else {
            console.log("Error: "+ error);
        }
    })

				})
			});


};

	function addAuthor(msg,suffix) {
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist addautor nome_da_playlist @autor`'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
	if (suffix.substring(plname.length).trim() == 'publico') {author == 'public'} else {author = msg.mentions.users.first();};
	if (!author) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist addautor nome_da_playlist @autor`'));
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'addauthor',member:member,plname:plname,author:author.id}}, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        	console.log('"'+ body +'"')
        	if(body == 'pldontexist') return msg.channel.send(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
        	if(body == 'noperm') return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não tem permissão para adicionar autores na playlist **'+ plname +'**.'));
        	if(body == 'authoralreadyadded') return msg.channel.send(wrap('16766720',':x: :white_small_square:  '+ author.username +' já foi adicionado na playlist .'));
	    	if(author == 'public' && body == 'success') return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  A playlist **'+ plname +'** agora é colaborativa.'));
	    	if(body == 'success') msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  **'+ author.username +'** foi adicionado na playlist **'+ plname +'**.'));
        } else {
            console.log("Error: "+ error);
        }
    });
};

	function removeAuthor(msg,suffix) {
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist removerautor nome_da_playlist @autor`'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
	if (suffix.substring(plname.length).trim() == 'publico') {author == 'public'} else {author = msg.mentions.users.first();};
	if (!author) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist removerautor nome_da_playlist @autor`'));
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'removeauthor',member:member,plname:plname,author:author.id}}, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        	console.log('"'+ body +'"')
        	if(body == 'pldontexist') return msg.channel.send(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
        	if(body == 'noperm') return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não tem permissão para remover autores na playlist **'+ plname +'**.'));
        	if(body == 'donthave') return msg.channel.send(wrap('16766720',':x: :white_small_square:  '+ author.username +' não é um autor da playlist '+ plname +'.'));
        	if(body == 'noremovecreator') return msg.channel.send(wrap('16766720',':x: :white_small_square: Você não pode se retirar como autor, pois és o criador da playlist. (para apagar a playlist, use `!playlist apagar '+ plname +'`)'));
	    	if(author == 'public' && body == 'success') return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  A playlist **'+ plname +'** não é mais colaborativa.'));
	    	if(body == 'success') msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  **'+ author.username +'** foi removido da playlist **'+ plname +'**.'));
        } else {
            console.log("Error: "+ error);
        }
    });
};

	function setDesc(msg,suffix) {
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist desc nome_da_playlist  Descrição muito loca`'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
	const desc = suffix.substring(plname.length).trim();
	if (!desc) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist desc nome_da_playlist  Descrição muito loca`'));
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'setdesc',member:member,plname:plname,desc:desc}}, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        	console.log('"'+ body+'"')
        	if(body == 'pldontexist') return msg.channel.send(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
        	if(body == 'noperm') return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não tem permissão para alterar a descrição da playlist **'+ plname +'**.'));
	    	if(body == 'success') msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  A descrição da playlist **'+ plname +'** foi alterada.'));
        } else {
            console.log("Error: "+ error);
        }
    });
};

	function setIcon(msg,suffix) {
	msg.delete()
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist icon nome_da_playlist  O icone anexado ou a URL da foto.` (apenas .jpg, .jpeg, .png, e talvez .gif)'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
	const iconurl = suffix.substring(plname.length).trim();

	 if(msg.attachments.size > 1) {return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist icon nome_da_playlist  O icone anexado ou a URL da foto.` (apenas .jpg, .jpeg, .png, e talvez .gif)'));}
	 if(msg.attachments.size < 1 && !iconurl) {return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist icon nome_da_playlist  O icone anexado ou a URL da foto.` (apenas .jpg, .jpeg, .png, e talvez .gif)'));}
	 if(msg.attachments.size == 1){icon = msg.attachments.first().url;} else if (msg.attachments.size < 1 && iconurl){icon = iconurl};
	 const fileformat = Array(icon.split('.').pop());
	 if(!fileformat.some(function(format){return format == 'png'||'jpg'||'jpeg'||'gif';})){return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist icon nome_da_playlist  O icone anexado ou a URL da foto.` (apenas .jpg, .jpeg, .png, e talvez .gif)'));}

	if (!icon) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist icon nome_da_playlist  O icone anexado ou a URL da foto` (apenas .jpg, .jpeg, .png, e talvez .gif)'));
    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'seticon',member:member,plname:plname,icon:icon}}, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        	console.log('"'+ body +'"')
        	if(body == 'pldontexist') return msg.channel.send(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
        	if(body == 'noperm') return msg.channel.send(wrap('16766720',':x: :white_small_square:  Você não tem permissão para alterar o ícone da playlist **'+ plname +'**.'));
	    	if(body == 'success') msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  O ícone da playlist **'+ plname +'** foi alterado.'));
        } else {
            console.log("Error: "+ error);
        }
    });
};

	function teste(msg,suffix) {
		authors = ':white_small_square: Para *deletar*, use o comando `!playlist delete vocaloid  IDdaMúsica`.\n\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '**[a]** THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';
		authors += '`[a]` THERE IS A HOUSE IN NEW ORLEANS, THEY CALL THE RISING SUN, ITS BEEN\n';


			const embed = {
			  "description": authors,
			  "color": 16766720,
			  "footer": {
			    "icon_url": "https://cdn.discordapp.com/icons/333771592704196609/a3f655e12a211a0d05f46a21a9917702.jpg",
			    "text": "Yaoi's Society - http://discord.me/yaoisocietybr"
			  },
			  "author": {
			    "name": "Playlist | ",
			    "icon_url": 'https://cdn.discordapp.com/icons/333771592704196609/a3f655e12a211a0d05f46a21a9917702.jpg'
			  }
			};
		msg.channel.send({embed})
	}

	function pl_info(msg,suffix) {
		if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist info nome_da_playlist`'));
		const plname = suffix.toLowerCase();
		//chama a função para getar pl
	    getPL(plname, function(err, data) {

	    	// verifica se tem a pl
	        if(data == '404notfound') {
	        console.log('playlist n existe po')
	        msg.channel.send(wrap('16766720',':x: :white_small_square: A playlist '+ plname +' não foi encontrada.'));
	        return;
	        }

	        // prepara a massinha  
	    const json = JSON.parse(data);
	    //tirando o primeiro
	    const authorsWOcreator = json['authors'].shift();
	    // verifica quantos autores tem, ou se é publico.
	    if (json['authors'].length < 1) {authors = 'Não há outros autores'}
	    	else if (json['authors'].some(function(value){return value == 'public';})) {authors = 'A playlist é colaborativa/pública. Todos podem adicionar música nessa playlist.'}
	    	else {authors = json['authors'].map(function(u){return client.users.get(u).username}).join(", ")};
	    	// monta embed delicia
			const embed = {
			  "description": json['desc'],
			  "color": 16766720,
			  "footer": {
			    "icon_url": "https://cdn.discordapp.com/icons/333771592704196609/a3f655e12a211a0d05f46a21a9917702.jpg",
			    "text": "Yaoi's Society - http://discord.me/yaoisocietybr"
			  },
			  "thumbnail": {
			    "url": json['icon']
			  },
			  "author": {
			    "name": "Playlist | " + plname,
			    "icon_url": client.users.get(json['creator']).avatarURL
			  },
			  "fields": [
			    {
			      "name": "Quem criou a playlist?",
			      "value": client.users.get(json['creator']).username,
			      "inline": true
			    },
			    {
			      "name": "Músicas",
			      "value": "Há "+ json['musics'].length +" músicas na playlist.",
			      "inline": true
			    },
			    {
			      "name": "Outros autores",
			      "value": authors
			    }
			  ]
			};
			msg.channel.send({embed})
				


	})
}


	function listMusics(msg,suffix){
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist musicas  nome_da_playlist`'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
			    getPL(plname, function(err, data) {
			    	// verifica se tem a pl
			        if(data == '404notfound') {
			        console.log('playlist n existe po')
			        msg.channel.send(wrap('16766720',':x: :white_small_square:  Essa playlist não existe!'));
			        return;
			        }

			        // prepara a massinha  
			    const json = JSON.parse(data);
			    	// verifica se tem música na playlist
			    	if(json['musics'].length <= 0) {
			    	return msg.channel.send(wrap('16766720',':x: :white_small_square:  Não há músicas nessa playlist'));
			    	}
			    	console.log(json['musics'])
			   		// primeiro, monta a array de lista.
			   		musiclist = []; 	
					descmsg = ':white_small_square: Para *deletar*, use o comando `!playlist delete ' + plname + '  IDdaMúsica`.\n\n';

			    	// tudo certo. hora do show.
			    	for (i = 0; i < json['musics'].length; i++) {

						//vai pra array das musiquinhas
						var length = 63;
						var trimmedTitle = json['musics'][i]['title'].length > length ? 
                    	json['musics'][i]['title'].substring(0, length - 3) + "..." : 
                    	json['musics'][i]['title'];

						//musiclist[i].title = trimmedTitle; // talvez seja necessário usar array.push
						musiclist.push(trimmedTitle);

							//bota na pica e pica na bota	
							descmsg += '**[' + (i+1) + ']** *' + trimmedTitle +'*\n';
							console.log(descmsg);
					}

						const embed = {
						  "description": descmsg,
						  "color": 16766720,
						  "footer": {
						    "icon_url": "https://cdn.discordapp.com/icons/333771592704196609/a3f655e12a211a0d05f46a21a9917702.jpg",
						    "text": "Yaoi's Society - http://discord.me/yaoisocietybr"
						  },
						  "author": {
						    "name": "Playlist | " + plname,
						    "icon_url": client.users.get(json['creator']).avatarURL
						  }
						};
					msg.channel.send({embed})
			})
	}

	function deleteMusic(msg,suffix){
	if (!suffix) return msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  Use `!playlist delete nome_da_playlist  O icone anexado ou a URL da foto.` (apenas .jpg, .jpeg, .png, e talvez .gif)'));
	const plname = suffix.split(/[ \n]/)[0].toLowerCase().trim();
	const member = msg.author.id;
	const musicsearch = suffix.split(plname + ' ')[1]
	if (!musicsearch) return listMusics(msg,suffix);
		if(Array(musicsearch).some(function(value){return value > 1 && value < limitmusic})) {

			    getPL(plname, function(err, data) {
			    	// verifica se tem a pl
			        if(data == '404notfound') {
			        console.log('playlist n existe po')
			        msg.channel.send(wrap('16766720',':x: :white_small_square:  Essa playlist não existe!'));
			        return;
			        }

			        // prepara a massinha  
			    const json = JSON.parse(data);
			    	// verifica se tem música na playlist
			    	if(json['musics'].length <= 0) {
			    	return msg.channel.send(wrap('16766720',':x: :white_small_square:  Ocorreu um erro no listamento. (err: `nomusicsonpl`)'));
			    	}

			    	const musicurl = json['musics'][musicsearch-1]['url'];
		    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'removemusic',member:member,plname:plname,musicid:musicurl}}, function(error, respo, body) {
		        if(!error && respo.statusCode == 200) {
		        	console.log('"'+ body +'"')
		        	if(body == 'pldontexist') return response.edit(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
		        	if(body == 'noperm') return response.edit(wrap('16766720',':x: :white_small_square:  Você não tem permissão para remover músicas na playlist '+ plname +'.'));
		        	if(body == 'donthave') return response.edit(wrap('16766720',':x: :white_small_square: Essa música não está na playlist.'));
			    	if(body == 'success') response.edit(wrap('16766720',':musical_note: :white_small_square:  A música foi removida da playlist **'+ plname +'** com sucesso.'));
		        } else {
		            console.log("Error: "+ error);
		        }
		    })

			})

		} else {
			// então, modo de pesquisa agora é pelo título do vídeo

				msg.channel.send(wrap('16766720',':musical_note: :white_small_square:  **Procurando...**')).then(response => {
					var searchstring = musicsearch;
					if (!searchstring.startsWith('http')) {
						searchstring = 'gvsearch1:' + musicsearch;
					}
					YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
						// Verify the info.
						if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
							return response.edit(wrap('16766720',':x: :white_small_square:  **Vídeo inválido ou não encontrado! Use a URL do vídeo ou use `!playlist remover nome_da_playlist  id_da_música` (os ids estão disponíveis ao digitar `!playlist remover nome_da_playlist`).**'));
						}

						// 
						const musicurl = info.webpage_url.split('v=')[1].trim();
						console.log('member: ' + member + ', plname: ' + plname + ', music: ' + musicurl);
		    request.post({url:urlbase + 'api/playlist.php', form: {api:'playlist',action:'removemusic',member:member,plname:plname,musicid:musicurl}}, function(error, respo, body) {
		        if(!error && respo.statusCode == 200) {
		        	console.log('"'+ body +'"')
		        	if(body == 'pldontexist') return response.edit(wrap('16766720',':x: :white_small_square:  A playlist **'+ plname +'** não existe.'));
		        	if(body == 'noperm') return response.edit(wrap('16766720',':x: :white_small_square:  Você não tem permissão para remover músicas na playlist '+ plname +'.'));
		        	if(body == 'donthave') return response.edit(wrap('16766720',':x: :white_small_square: *'+ info.title +'* não está na playlist.'));
			    	if(body == 'success') response.edit(wrap('16766720',':musical_note: :white_small_square:  A música '+ info.title +' foi removida da playlist **'+ plname +'** com sucesso.'));
		        } else {
		            console.log("Error: "+ error);
		        }
		    })

						})
					});


		}
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
