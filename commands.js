const fs = require('fs');

const createNewChunk = () => {
  const pathToFile = __dirname + `/recordings/${Date.now()}.pcm`;
  return fs.createWriteStream(pathToFile);
};

exports.enter = function(msg, channelId, voiceConnection = 0) {
    let voiceChannel
    if (!fs.existsSync("./recordings")) fs.mkdirSync("./recordings");
if (voiceConnection)
    voiceChannel = voiceConnection
else
   voiceChannel = msg.guild.channels.cache.get(channelId);


  console.log(`Sliding into ${voiceChannel.name} ...`);
  voiceChannel.join()
    .then(conn => {

      // const dispatcher = conn.play(__dirname + '/../sounds/drop.mp3');
      // dispatcher.on('finish', () => { console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`); });

      const receiver = conn.receiver;
      conn.on('speaking', (user, speaking) => {
        if (speaking) {
          // console.log(`${user.username} started speaking`);
          const audioStream = receiver.createStream(user, { mode: 'pcm' });
          audioStream.pipe(createNewChunk());
          // audioStream.on('end', () => { console.log(`${user.username} stopped speaking`); });
        }
      });
    })
    .catch(err => { throw err; });
}


