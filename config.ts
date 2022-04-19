export = {
    mongo: {
        uri: "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.pzmne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        db: "sample_mflix",
        options: {
            connectTimeoutMS: 60000,
            socketTimeoutMS: 600000,
            useUnifiedTopology: true
        }
    },
    port: 3000
}