'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROUTES

app.get('/', function (req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAtZCGqNTR24BAOW2ZBKJaqHe4tMv0qLqRScoXGmWV4CXgHZBZAbonR7esJq0nHuDRq3RVMOhIShgkRPu3vWH9vn0RwkaNLrW4YcGBCQbsuGT2ZCbLJ0yskfBaEVzIAIRkcir5hYLfZBEDiuqP2slZCy14HD12l5ltljUHQ5uxFwAZDZD"

// Facebook
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === "baldbytes") {
		console.log("validado token");
		res.send(req.query['hub.challenge'])
	}
	console.log("token não validado");
	res.send("Wrong token")
})

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			let txtEnvio = "Text echo: " + text.substring(0, 100)

			if (text == '1') {
				txtEnvio = "você escolheu a opção 1";
			}
			sendText(sender, txtEnvio)
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = { text: text }
	request({
		url: "https://graph.facebook.com/v10.0/me/messages",
		qs: { access_token: token },
		method: "POST",
		json: {
			recipient: { id: sender },
			message: messageData,
		}
	}, function (error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function () {
	console.log("running: port")
})