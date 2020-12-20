const schema = {
    properties: {
      body: {
        type: 'string',
        minLength: 1,
        pattern: '\=$' 
      },
    },
    required: ['body'],
  };
  
// in pattern a regex is defined to say that the string should end with a = sign,
//  all base64 strings end with =
  export default schema;