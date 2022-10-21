// Importez  les composants simples pour construire la page
// Construire la page
// Retourner la page en question

export class Register {
    addressInput
    datalistElem

    html() {
        return `
        <div class="d-flex justify-content-center mt-5 mb-3">
            <p>Formulaire d'inscription</p>
        </div>
        <div class="d-flex justify-content-center">
            <form action="" autocomplete="off">
                <div class="d-flex justify-content-between flex-row">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row mb-3 px-5">
                            <img class="mb-3" src="" id="photo" alt="photo" style="width: 100px; height: 100px">
                        </div>
                        <div class="d-flex flex-row mb-3">
                            <div class="d-flex flex-column mx-5">
                                <label for="lastname">Nom</label>
                                <input id="lastname" class="" type="text">       
                            </div>
                            <div class="d-flex flex-column">
                                <label for="firstname">Prénom</label>
                                <input id="firstname" class="" type="text">       
                            </div>
                        </div>  
                        <div class="d-flex flex-row mb-3 px-5">
                            <div class="d-flex flex-column flex-fill">
                                <label for="email">Email</label>
                                <input id="email" class="" type="email">       
                            </div>
                        </div>   
                        <div class="d-flex flex-row px-5">
                            <div class="d-flex flex-column flex-fill ">
                                <label for="address">Adresse</label>
                                <input list="addressList" id="address" class="" type="text" autocomplete="off">
                                <datalist id="addressList"></datalist>      
                            </div>
                        </div>      
                    </div>
                    <div class="d-flex flex-column px-5">
                        <p>photo</p>
                        <video id="video"></video>
                        <button id="startButton">Prendre une photo</button>
                        <canvas id="canvas"></canvas>
                    </div>
                </div>
            </form>
        </div>
        `
    }

    async picture() {
        let streaming = false,
            video = document.querySelector('#video'),
            cover = document.querySelector('#cover'),
            canvas = document.querySelector('#canvas'),
            photo = document.querySelector('#photo'),
            startButton = document.querySelector('#startButton'),
            width = 320,
            height = 0;

        await navigator.mediaDevices.getUserMedia({video: true}).then((mediaStream) => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        function takePicture() {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            let data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            canvas.setAttribute('style', 'display: none')
        }

        startButton.addEventListener('click', function (ev) {
            ev.preventDefault();
            takePicture();
        }, false);
    }

    autocomplete() {
        this.addressInput = document.querySelector('#address')
        this.datalistElem = document.querySelector('#addressList')
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json')
        // myHeaders.append('Access-Control-Allow-Origin', '*')
        let myInit = {
            headers: myHeaders,
            // mode: 'no-cors',
        };
        this.addressInput.addEventListener('input', (event) => {
            const url = event.target.value
            fetch(`https://api-adresse.data.gouv.fr/search/?q=${url}&type=housenumber&limit=10`, myInit)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            this.datalistElem.innerHTML = ''
                            data.features.forEach((valueOption) => {
                                const option = new Option(
                                    valueOption.properties.label,
                                    valueOption.properties.label
                                )
                                this.datalistElem.appendChild(option)
                            })
                        })
                    }
                })
            // console.log(event.target.value)
        })
    }

}
