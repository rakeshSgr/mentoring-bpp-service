'use strict'

const { requestBodyGenerator } = require('@utils/requestBodyGenerator')
const requester = require('@utils/requester')
const { createAuthorizationHeader } = require('@utils/auth')

exports.search = async (payload) => {
	console.log('SEARCH CALLBACK HANDLER')
	const requestBody = await requestBodyGenerator(
		'bap_on_search',
		payload.context.transaction_id,
		payload.context.message_id
	)
	const authorizationHeader = await createAuthorizationHeader(requestBody)
	const response = await requester.postRequest(
		payload.context.bap_uri + '/on_search',
		{ authorization: authorizationHeader },
		requestBody
	)
}

exports.init = async (payload) => {
	const response = await requester.postRequest(
		payload.context.bap_uri + '/on_init',
		{},
		await requestBodyGenerator('bap_on_init', payload.context.transaction_id, payload.context.message_id, {
			orderId: payload.message.order.id,
		})
	)
}

exports.confirm = async (payload) => {
	const response = await requester.postRequest(
		payload.context.bap_uri + '/on_confirm',
		{},
		await requestBodyGenerator('bap_on_confirm', payload.context.transaction_id, payload.context.message_id, {
			orderId: payload.message.order.id,
			selectedFulfillmentId: payload.message.order.fulfillments[0].id,
			itemId: payload.message.order.items[0].id,
		})
	)
}

exports.cancel = async (payload) => {
	const response = await requester.postRequest(
		payload.context.bap_uri + '/on_cancel',
		{},
		await requestBodyGenerator('bap_on_cancel', payload.context.transaction_id, payload.context.message_id, {
			orderId: payload.message.order.id,
		})
	)
}

exports.status = async (payload) => {
	const response = await requester.postRequest(
		payload.context.bap_uri + '/on_status',
		{},
		await requestBodyGenerator('bap_on_status', payload.context.transaction_id, payload.context.message_id, {
			orderId: payload.message.order.id,
		})
	)
}
