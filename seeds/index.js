const mongoose = require('mongoose');
const cities = require('country-state-city').City.getCitiesOfCountry("IN");
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Database connected!!")
    })
    .catch(err => {
        console.log(" MOngo Error!!");
        console.log(err);
    });

//function to get random values from an array:
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//getting random Campground details to fill in the db using cities.js and seedHelpers.js files
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const randomInt = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6532d8a9ae5e57ebf68b8fc9',
            location: `${cities[randomInt].name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe dolorem officia inventore reprehenderit adipisci. Perspiciatis neque id ex doloribus amet animi quia minima, laborum optio maiores, soluta deleniti quasi quis!",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomInt].longitude,
                    cities[randomInt].latitude
                ]
            },
            price: price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close(); //to close right after running in cmd(git bash)
})