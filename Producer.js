const redis = require('redis');
const EventEmitter = require('events');
const bluebird = require('bluebird');
const client = redis.createClient('6379', '127.0.0.1');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", (error) => {
    console.log(error);
    process.exit();
});


var StartID = 1000000;

client.on("ready", async () => {
    console.log("Ready,I am Producer");
    var CurrentID = await client.rpopAsync("mqTest");
    if (CurrentID) {
        StartID = CurrentID;
    } else {
        StartID = producer.id;
    }
    await client.lpushAsync("mqTest", StartID);

    var length = await getListLength();
    if (length < 100000) {
        producer.emit("begin");
    }
});

class Producer extends EventEmitter {
    constructor() {
        super();
        this.status = "ready";
        this.id = 1000000;
    };
}

var producer = new Producer();

producer.on("pause", function () {
    if (this.status === "begin") {
        console.log("Producer will pause,current id:", this.id);
        this.status = "pause";
    }
});

producer.on("resume", function () {
    if (this.status === "pause") {
        this.emit("begin");
    }
});

producer.on("begin", async function () {
    this.status = "begin";
    console.log("Producer will begin");
    while (true) {
        if (this.status === "pause") {
            break;
        }
        var msg = this.id;
        //console.log(msg);
        await client.lpushAsync("mqTest", msg);

        ++this.id;
    }
});

async function getListLength() {
    var length = await client.llenAsync("mqTest");

    if (length > 100000 && producer.status === "begin") {
        producer.emit("pause");
    } else if (length < 100000 && producer.status === "pause") {
        producer.emit("resume");
    }
    return length;
}

setInterval(getListLength, 5000);