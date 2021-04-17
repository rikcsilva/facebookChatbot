'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAtZCGqNTR24BADnHx43I1aMZC6ZCv5ZB6bc7sSyYREdWLFSy5yaZAZBhVFEWLMU6KAf0cZBNPX63cLjHUlijHJzaHLGUK32Mn1709a6pLPmjijsBa9ZAZA2ZAWUBpcYXxzCsIlw5uOyIoMNXl0dyLdnBKzB9ZBXtZBeMEIEKhfKR4KzuQZDZD"

// Facebook

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "baldbytes") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

ap.post('/webhook', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Text echo: " + text.substring(0,100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v10.0/me/messages",
		qs : {access_token : token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
			if (error) {
				console.log("sending error")			 
			} else if (response.body.error) {
				console.log("response body error")
			}
	})
}

app.listen(app.get('port'), function() {
	console.log("runing: port")
})