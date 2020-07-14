import tmi from 'tmi.js';
import { addLog, resetSongs } from './helpers';

const startElement = document.querySelector('.start');

const songs = new Map(JSON.parse(localStorage.songs || '[]').map(song => [song.url, song]));
const allowedDomains = ['www.youtube.com', 'youtube.com', 'youtu.be'];

resetSongs(songs);

const startBot = () => {
    if (!location.hash) {
        location.hash = prompt('What channel?');
    }

    const channel = location.hash.slice(1);
    addLog(`Starting the bot in @${channel}'s chat...`);

    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true,
        },
        channels: [channel],
    });

    client.connect().then(() => addLog(`Bot started in ${channel}'s channel.`));

    client.on('message', (_, tags, message) => {
        const [command, ...args] = message.split(' ');

        if (command.toLowerCase() === '!sr' && args.length === 1) {
            let url;

            try {
                url = new URL(args[0]);
            } catch (error) {
                console.error(error);
                addLog(`Failed to parse ${args[0]}`);
                return;
            }

            if (url && allowedDomains.includes(url.hostname)) {
                const song = { user: tags.username, url };
                songs.set(url.toString(), song);
                resetSongs(songs);
            }
        }
    });
};

startElement.addEventListener('click', startBot);

document.body.addEventListener('click', event => {
    if (event.target.closest('.remove')) {
        const { parentElement } = event.target;
        const { url } = event.target.dataset;
        const { innerText: title } = parentElement.lastElementChild;

        const confirmation = confirm(`Are you sure you want to remove ${title} (${url})?`);
        if (confirmation) {
            songs.delete(url);
            resetSongs(songs);
        }
    }
});
