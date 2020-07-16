const logsElement = document.querySelector('.logs');
const songsElement = document.querySelector('.songs');

export const addLog = message => {
    const log = document.createElement('span');
    log.innerText = message;
    logsElement.append(log);
};

const addSong = async ({ user, url }) => {
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

    songsElement.append(container);
};

export const resetSongs = async songs => {
    localStorage.songs = JSON.stringify([...songs.values()]);
    songsElement.innerHTML = '';

    for (const [, song] of songs) {
        await addSong(song);
    }
};
