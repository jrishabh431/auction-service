export default schema = {
    properies: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                }
            },
            required: ['title']
        }
    },
    required: ['body']
}