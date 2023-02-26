'use strict'

exports.onStatusRequestDTO = async (context, fulfillmentTags, statusBody, orderId, status) => {
	return {
		context,
		message: {
			order: {
				id: orderId,
				state: status,
				type: 'DEFAULT',
				provider: statusBody,
				fulfillments: {
					tags: fulfillmentTags,
				},
			},
		},
	}
}
