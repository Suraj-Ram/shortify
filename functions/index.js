const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const express = require('express')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(bodyParser.json());
app.use(cors())

admin.initializeApp()

let db = admin.firestore()
let colRef = db.collection('links')

app.use(express.static('../public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../public/index.html'))
})
app.get('/a/:p', (req, res) => {
    res.send(`You sent: ${req.params.p}`)
})


app.get('/s/:shortId', (req, res) => {
    let { shortId } = req.params
    console.log('Looking for the URL under ', shortId)

    shortRef = colRef.doc(shortId)
    shortRef.get()
        .then(doc => {
            if (!doc.exists) {
                // const msg = {
                //     exists: false,
                //     shortId: shortId,
                //     time: Date.now()
                // }
                // res.json(msg)
                console.log('Doesnt exist')
                res.send(`<h1>:(</h1> The short ID "<strong>${shortId}</strong>" does not exist. Please re-check and try again.`)
            }
            else {
                console.log(doc.data())
                res.redirect(doc.data().fullUrl)
            }
        })
})

app.post('/add', (req, res) => {
    let { shortId, fullUrl, owner } = req.body 
    shortRef = colRef.doc(shortId)
    shortRef.get()
        .then(doc => {
            if(doc.exists) {
                let rejectMsg = {
                    exists: true,
                    message: 'Already exists'
                }
                res.json(rejectMsg)
            }
            else {
                dataToAdd = {
                    owner,
                    fullUrl,
                    timeAdded: Date.now(),
                    visits: 0,
                    exists: true,
                    shortId
                }

                shortRef.set(dataToAdd)
                    .then(ref => res.json({
                        status: 'success', 
                        dbId: ref.id,
                        shortId
                    }))
                    .catch(err => {
                        console.error(err)
                        res.send(err)
                    })                
            }
        })

})

exports.app = functions.https.onRequest(app);