const mongoose = require("mongoose");
const initData = require("./data1.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"6a041ed4ed9ab62a1a9c94d0"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

};

initDB();

