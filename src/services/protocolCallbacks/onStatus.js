'use strict'

const { internalRequests } = require('@helpers/requests')
const { contextBuilder } = require('@utils/contextBuilder')
const { onStatusRequestDTO } = require('@dtos/onStatusRequest')
const { externalRequests } = require('@helpers/requests')
const sessionQueries = require('@database/storage/sessions/queries')
const sessionTranscriptQueries = require('@database/storage/sessionTranscript/queries')

exports.onStatus = async (callbackData) => {
	try {
		const context = await contextBuilder(
			callbackData.transactionId,
			callbackData.messageId,
			process.env.ON_STATUS_ACTION,
			callbackData.bapId,
			callbackData.bapUri
		)
		const response = await internalRequests.catalogGET({
			route: process.env.CATALOG_GET_STATUS_BODY_ROUTE,
			pathParams: {
				sessionId: callbackData.sessionId,
				fulfillmentId: callbackData.fulfillmentId,
			},
		})
		//const sessionDetails = await sessionQueries.findBySessionId(callbackData.sessionId)
		const sessionDetails = await sessionQueries.findSessionById(callbackData.sessionId)
		const sessionTranscript = await sessionTranscriptQueries.findOne({ sessionId: callbackData.sessionId })

		const fulfillmentTags = [
			{
				display: true,
				descriptor: {
					code: 'sessionSummary',
					name: 'Session Summary',
				},
				list: [
					{
						descriptor: {
							code: 'sessionSummary',
							name: sessionDetails.summary,
						},
					},
				],
			},
			{
				display: true,
				descriptor: {
					code: 'discordInviteLink',
					name: 'Discord Invite Link',
				},
				list: [
					{
						descriptor: {
							code: 'discordInviteLink',
							name: sessionDetails?.inviteLink,
						},
					},
				],
			},
			{
				display: true,
				descriptor: {
					code: 'sessionVideoURL',
					name: 'Downloadable session video URL ',
				},
				list: [
					{
						descriptor: {
							code: 'sessionVideoURL',
							name: sessionTranscript?.recordingURL,
						},
					},
				],
			},
			{
				display: true,
				descriptor: {
					code: 'sessionTranscript',
					name: 'Session transcript',
				},
				list: [
					{
						descriptor: {
							code: 'sessionTranscript',
							name: sessionTranscript?.sessionTranscript,
						},
					},
				],
			},
		]
		const statusBody = response.statusBody
		const onStatusRequest = await onStatusRequestDTO(
			context,
			fulfillmentTags,
			statusBody.providers[0],
			callbackData.orderId,
			callbackData.status
		)
		await externalRequests.callbackPOST({
			baseURL: callbackData.bapUri,
			route: process.env.ON_STATUS_ROUTE,
			body: onStatusRequest,
		})
	} catch (err) {
		console.log('OnStatus.ProtocolCallbacks.services: ', err)
	}
}
