// Importez  les composants simples pour construire la page
// Construire la page
// Retourner la page en question



export class Podcasts {

    html() {
        return `
        <button onclick="addPodcast()">Add a podcast</button>
        <button onclick="clearPodcasts()">Clear podcasts</button>

        <p>Podcasts list:</p>

        <ul id="listElem"></ul>      
        `
    }
    async podcastsGestion() {

        let db;

        init();

        async function init() {
            db = await idb.openDb('podcastsDb', 1, db => {
                db.createObjectStore('podcasts', { keyPath: 'name' });
            });

            list();
        }

        async function list() {
            let tx = db.transaction('podcasts');
            let podcastStore = tx.objectStore('podcasts');

            let podcasts = await podcastStore.getAll();

            if (podcasts.length) {
                listElem.innerHTML = podcasts.map(podcast => `<li> name: ${podcast.name}, author: ${podcast.author} </li>`).join('');
            } else {
                listElem.innerHTML = '<li>No podcasts yet. Please add podcasts.</li>'
            }


        }

        async function clearPodcasts() {
            let tx = db.transaction('podcasts', 'readwrite');
            await tx.objectStore('podcasts').clear();
            await list();
        }

        async function addPodcast() {
            let name = window.prompt("Podcast name?");
            let author = window.prompt("Podcast author?");

            let tx = db.transaction('podcasts', 'readwrite');

            try {
                await tx.objectStore('podcasts').add({ name, author });
                await list();
            } catch (err) {
                if (err.name == 'ConstraintError') {
                    alert("Such podcast exists already");
                    await addPodcast();
                } else {
                    throw err;
                }
            }
        }

        window.addEventListener('unhandledrejection', event => {
            alert("Error: " + event.reason.message);
        });
    }

}
