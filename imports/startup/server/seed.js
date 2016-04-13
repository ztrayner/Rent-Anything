import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Meteor.users.find().count() === 0) {
            Accounts.createUser({
                username: 'testUser',
                email: 'test@test.com',
                password: 'password'
            });
        }
        if (Items.find().count() === 0) {
            const firstUser = Meteor.users.findOne();
            const seedItem = {
                "title": "Jackhammer",
                "photoURLs": ["http://placehold.it/100x45", "http://placehold.it/100x45"],
                "description": "This is my jackhammer. I would be willing to rent it out for $100/day or $40/hour.",
                "hourlyRate": 40,
                "dailyRate": 100,
                "owner": firstUser._id,
                "username": firstUser.username,
                "streetAddress": "123 Test St",
                "streetAddressTwo": "",
                "city": "orem",
                "state": "UT",
                "zip": "84097",
                "purchasePrice": 300,
                "reviews": [{
                    "firstName": "Ron",
                    "lastName": "Swanson",
                    "rating": 5,
                    "reviewText": "This jackhammer is great and Zach was super helpful when I didn't know how to use it."
                }],
                "available": true,
                "sold": false,
                "created": "new Date('12 Jan 2016');",
                "lastRental": "new Date('15 Jan 2016');",
                "timesRented": 23
            };
            Items.insert(seedItem);
        }
    });
}
