const mailSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                id_template: {
                    type: 'string',
                    minLength: 1
                },
                email_info: {
                    type: 'object',
                    properties: {
                        from_description: {
                            type: 'string',
                            minLength: 1
                        },
                        to: {
                            type: 'string',
                            format: 'email',
                            minLength: 1
                        },
                        subject: {
                            type: 'string',
                            minLength: 1
                        }
                    }
                },
                list_params: {
                    type: 'object',
                    properties: {
                        params: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        minLength: 1
                                    },
                                    value: {
                                        type: 'string',
                                        minLength: 1
                                    }
                                },
                                required: ['name', 'value']
                            }
                        }
                    },
                    required: ['params']
                }
            },
            required: ['id_template', 'email_info', 'list_params']
        }
    },
    required: ['data']
};

module.exports = mailSchema;
