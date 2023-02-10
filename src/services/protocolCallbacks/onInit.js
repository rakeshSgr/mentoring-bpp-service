'use strict'

const { contextBuilder } = require('@utils/contextBuilder')
const { onInitRequestDTO } = require('@dtos/onInitRequest')
const crypto = require('crypto')
const { externalRequests } = require('@helpers/requests')

exports.onInit = async (callbackData) => {
	try {
		const context = await contextBuilder(
			callbackData.transactionId,
			callbackData.messageId,
			process.env.ON_INIT_ACTION,
			callbackData.bapId,
			callbackData.bapUri
		)
		const orderId = crypto.randomUUID()
		const onInitRequest = await onInitRequestDTO(context, orderId)
		await externalRequests.callbackPOST({
			baseURL: callbackData.bapUri,
			route: process.env.ON_INIT_ROUTE,
			body: onInitRequest,
		})
	} catch (err) {
		console.log('OnSearch.ProtocolCallbacks.services: ', err)
	}
}