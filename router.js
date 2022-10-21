import {Articles} from "./views/Articles.js";
import {Podcasts} from "./views/Podcasts.js";
import {Videos} from "./views/Videos.js";
import {Register} from "./views/Register.js";


export class Router {
    routes;
    menus;
    contentContainer;

    constructor(menus, contentContainer) {
        this.routes = {
            'articles': Articles,
            'podcasts': Podcasts,
            'register': Register,
            'videos': Videos
        }
        this.menus = menus
        this.contentContainer = contentContainer;
    }

    start() {
        // affichage d'une page par défaut
        this.contentContainer.innerHTML = (new this.routes.articles).html()

        // Ecoute l'événement du click sur les menus et affiche la page correspondante
        this.menus.forEach((menu) => {
            menu.addEventListener('click', (event) => {
                this.empty(this.contentContainer)
                this.goToLink(event.target)
            })
        })
    }

    goToLink(menu) {
        switch (menu.innerText) {
            case 'Articles':
                const articles = new this.routes.articles
                this.display(articles.html())
                let request = window.indexedDB.open("articles", 1)
                request.onsuccess = (event) => {
                    console.log('success')
                }
                request.onupgradeneeded = function(event) {
                    let db = event.target.result;
                    const articles = [
                        {
                            id:1,
                            title: "mon premier article",
                            text: "ceci est le corps de l'article",
                            author: "Robert"
                        },
                        {
                            id:2,
                            title: "ceci est le 2e",
                            text: "pas mal ce corps d'article",
                            author: "moi"
                        },
                        {
                            id:3,
                            title: "le meilleur article",
                            text: "juste le boss en fait",
                            author: "le boss"
                        },

                    ]

                    // Crée un objet de stockage pour cette base de données
                    // Possibilité de générer les id avec l'option autoIncrement
                    let objectStore = db.createObjectStore("articles", { keyPath: "id" });

                    //Créer un index pour rechercher les articles par auteur
                    objectStore.createIndex("authorIndex", "author", { unique: false });

                    //Créer un index pour rechercher les articles par titre (le titre doit être unique)
                    objectStore.createIndex("titleIndex", "title", { unique: true });

                    // S'assurer que l'objet de stockage a fini de se créer avant de continuer
                    objectStore.transaction.oncomplete = function(event) {
                        // Stocker les valeurs dans le nouvel objet de stockage.
                        let transaction = db.transaction(["articles"], "readwrite")
                        let articleObjectStore = transaction.objectStore("articles");
                        for (let i in articles) {
                            articleObjectStore.add(articles[i]);
                        }
                        transaction.oncomplete = (event) => {
                            alert("All done!");
                        }
                    }
                };
                request.onerror = (event) => {
                    console.log('error')
                }
                break;
            case 'Podcasts':
                const podcasts = new this.routes.podcasts
                this.display(podcasts.html())
                podcasts.podcastsGestion()
                

                break
            case 'Vidéos':
                const videos = new this.routes.videos
                this.display(videos.html())

                function handlePermission(permission){
                    if(Notification.permission === 'denied' || Notification.permission === 'default'){
                        console.log('permission denied')
                    }else{
                        console.log('permission accepted')
                        // const img = "/asset/notifications@2x.jpg"
                        const titre = 'faire les courses'
                        const text = 'coucou ! votre tache "' + titre + '" arrive'
                        const notification = new Notification('liste de trucs a faire', {body: text})
                    }
                }
                Notification.requestPermission((permission) =>{
                    handlePermission(permission);
                })
                break
            case 's\'inscrire':
                const register = new this.routes.register
                this.display(register.html())
                register.autocomplete()
                register.picture().then(r => {})
                break
        }
    }

    empty(component) {
        component.innerHTML = ""
    }

    display(html) {
        this.contentContainer.innerHTML = html
    }
}
