// Backend API link (NO TRAILING  "/" )

//const backendRoot = "https://link-shortner-xyz.herokuapp.com"
//const backendRoot = "https://us-central1-shorten-link-xyz.cloudfunctions.net/backend"
const backendRoot = ""



const urlInput = document.getElementById("fullUrlInput")
const shortIdInput  = document.getElementById("urlIdInput")
const submitBtn = document.getElementById("subBtn")
const urlValidity = document.getElementById("urlValidity")
const alertDiv = document.getElementById("alertDiv")
const pageBody = document.getElementById("bdy")
const progressBarHolder = document.getElementById('progressBarHolder')

urlInput.addEventListener('change', e => {
    if(checkUrl(urlInput.value)) {
        handleValidUrl()
    }
    else {
        handleInvalidUrl()
    }
})

submitBtn.addEventListener('click', () => {
    if (checkUrl(urlInput.value)) {
        submitShortify(urlInput.value, shortIdInput.value)
    }

    
})

pageBody.addEventListener('keypress', e => {
    if (e.keyCode == 13) {
        if(checkUrl(urlInput.value)) {
            submitShortify(urlInput.value, shortIdInput.value)

        }
    }
})

function checkUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i' // fragment locator
            );


    if (pattern.test(str)) {
        if(str.substring(0,8) === 'https://' || str.substring(0,7) === 'http://') {
            return true
        }
        else {
            return false
        }
    }
    else { 
        return false
    }

}

const validUrl = '<p class="text-center mx-auto font-weight-bold text-success"><i class="fa fa-check"></i> URL is valid</p>'
const invalidUrl = '<p class="text-center mx-auto font-weight-bold text-danger"><i class="fa fa-times"></i> URL is not valid</p>'

const loadingBar = `
    <div class="progress" style="height: 30px;" width=>
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>
    `
function addLoading() {
    progressBarHolder.innerHTML = ""
    progressBarHolder.innerHTML = loadingBar
}

function removeLoading() {
    progressBarHolder.innerHTML = ""
}

function handleValidUrl() {
    urlValidity.innerHTML = ""
    urlValidity.innerHTML = validUrl
}

function handleInvalidUrl() {
    urlValidity.innerHTML = ""
    urlValidity.innerHTML = invalidUrl    
}

function successAlert(shortId) {
    let alert = `
        <div class="alert alert-success">
            <h4 class="alert-heading">Success!</h4>
            <p>Link created: <a href="https://shortify.surajram.xyz/s/${shortId}" class="alert-link">shortify.surajram.xyz/s/${shortId}</a></p>
        </div>
    `
    return alert
}

function failedAlert() {
    let alert = `
    <div class="alert alert-danger">
        <h4 class="alert-heading">:(</h4>
        <p>Short ID taken</p>
    </div>
    `
    return alert
}

function submitShortify(fullUrl, shortId) {

    let data = {
        owner: 'human',
        fullUrl,
        shortId
    }

    let result

    fetch(`${backendRoot}/add`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        processPostData(data)

      })
      .catch((error) => {
        console.error('Error:', error);
      });

    addLoading()
}

function testGet() {
    fetch(`${backendRoot}/s/t1`)
    .then(data => {return data.json()})
    .then(data => console.log(data))
    .catch(err => console.warn(err))
}

function processPostData(data) {
    removeLoading()

    if (data.exists) {
        handleFailed(data)
    }
    else {
        handleSuccess(data)
    }
}

function handleSuccess(data) {
    alertDiv.innerHTML = ""
    alertDiv.innerHTML = successAlert(data.shortId)
}

function handleFailed() {
    alertDiv.innerHTML = ""
    alertDiv.innerHTML = failedAlert()
}