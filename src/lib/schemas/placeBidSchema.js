export default schema = {
    properies: {
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number'
                }
            },
            required: ['amount']
        }
    },
    required: ['body']
}