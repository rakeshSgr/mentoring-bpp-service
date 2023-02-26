'use strict'
const mongoose = require('mongoose')

const db = require('@configs/mongodb')

const sessionTranscript = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
	},
	transcriptId: {
		type: String,
		required: true,
	},
	sessionTranscript: {
		type: String,
		required: false,
	},
	summary: {
		type: String,
		required: false,
	},
	recordingURL: {
		type: String,
		required: false,
	},
})

const model = db.model('sessionTranscript', sessionTranscript)

module.exports = model
