const logsElement = document.querySelector('.logs');
const songsElement = document.querySelector('.songs');

export const addLog = message => {
    const log = document.createElement('span');
    log.innerText = message;
    logsElement.append(log);
};

const getSongData = async ({ user, url }) => {
    const response = await fetch(`https://embtr.now.sh/scrape?url=${url}`);
    const { title } = await response.json();

    const remove = document.createElement('span');
    remove.innerHTML = '&times;';
    remove.dataset.url = url;
    remove.classList.add('remove');

    const userElement = document.createElement('span');
    userElement.innerText = `${user}:`;
    userElement.classList.add('user');

    const anchor = document.createElement('a');
    anchor.innerText = title;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer noopener';

    const container = document.createElement('span');
    container.classList.add('song');
    container.append(remove, userElement, anchor);

    return container;
};

export const resetSongs = async songs => {
    localStorage.songs = JSON.stringify([...songs.values()]);

    const songData = await Promise.all([...songs.values()].map(getSongData));
    songsElement.innerHTML = '';

    for (const songContainer of songData) {
        songsElement.append(songContainer);
    }
};
