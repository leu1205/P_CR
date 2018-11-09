const redis = require('redis');
const EventEmitter = require('events');
const requestid = require("./Worker");
const bluebird = require('bluebird');
const client = redis.createClient('6379', '127.0.0.1');
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", error => {
    console.log(error);
    process.exit();
});

client.on("ready", () => {
    console.log("Ready,I am Consumer", process.pid);
    consumer.emit("begin");
});

class Consumer extends EventEmitter {
    constructor() {
        super();
        this.status = "ready";
    }
}

var consumer = new Consumer();

consumer.on("pause", function () {
    if (this.status === "begin") {
        console.log("Consumer will pause");
        this.status = "pause";
    }
});

consumer.on("resume", function () {
    if (this.status === "pause") {
        this.status = "begin";
        this.emit("begin");
    }
});

consumer.on("begin", async function () {
    this.status = "begin";
    while (true) {
        var value = await client.rpopAsync("mqTest");

        let result = await Promise.race([requestid(value), timeout(10000)]);
        if (result && result != "timeout") {
            saveData(result);
        }

        if (this.status === "pause") {
            break;
        }
    }
});

function saveData(result) {
	MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, async function (err, client) {
		if (err) {
			throw err;
		}
		var db = client.db('mytestdb');
		var collection = db.collection('Pixiv');
		collection.insertOne(result, (err, result) => { 
            if (err) console.log(err);
        });//await
		let query = { Pixiv_id: result.Pixiv_id };
		collection.find(query, { projection: { _id: 0 } }).toArray(function (err, docs) {
			if (err) console.log(err);
			console.log(docs);
		});
		client.close();
	});
}

async function getListLength() {
    var length = await client.llenAsync("mqTest");

    if (length == 0 && consumer.status === "begin") {
        console.log("consumer will pause");
        producer.emit("pause");
    } else if (consumer.status === "pause" && length > 1000) {
        consumer.emit("resume");
    }
}

function timeout(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms, "timeout");
    });
}

setInterval(getListLength, 20000);