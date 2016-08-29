import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'

export const Items = new Mongo.Collection('items', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
    ////All items, excluding some fields from the results
    Meteor.publish('items', function itemsPublication() {
        return Items.find({
            /*$or: [
              {
                  private: {
                      $ne: true
                  }
              }, 
              {
                  owner: this.userId
              }, 
            ],*/
            //streetAdress:false,
            //streetAdressTwo:false
        });
    });
}

Meteor.methods({
    'items.insert' (newItem) {
        check(newItem, Object);

        // Make sure the user is logged in before inserting a item
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Items.insert({
            title: newItem.title,
            description: newItem.description,
            sold: false,
            available: true,
            created: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            purchasePrice: newItem.purchasePrice,
            hourlyRate: newItem.hourlyRate,
            dailyRate: newItem.dailyRate,
            photoURLs: newItem.photoURLs
        });
    },
    'items.remove' (itemId) {
        console.log(itemId);
        check(itemId, Meteor.Collection.ObjectID);

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            // If the item is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Items.remove(itemId);
    },
    'items.editTitle' (itemId, newTitle) {
        check(itemId, Meteor.Collection.ObjectID);
        check(newTitle, String);

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.update(itemId, {
            $set: {
                title: newTitle
            }
        });
    },
    'items.editDescription' (itemId, newDescription) {
        check(itemId, Meteor.Collection.ObjectID);
        check(newDescription, String);

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.update(itemId, {
            $set: {
                description: newDescription
            }
        });
    },
    'items.editHourlyRate' (itemId, newHourlyRate) {
        check(itemId, Meteor.Collection.ObjectID);
        newHourlyRate = parseFloat(newHourlyRate);
        check(newHourlyRate, Number);

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.update(itemId, {
            $set: {
                hourlyRate: newHourlyRate
            }
        });
    },
    'items.editDailyRate' (itemId, newDailyRate) {
        check(itemId, Meteor.Collection.ObjectID);
        newDailyRate = parseFloat(newDailyRate);
        check(newDailyRate, Number);

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.update(itemId, {
            $set: {
                dailyRate: newDailyRate
            }
        });
    },
    'items.editPurchasePrice' (itemId, newPurchasePrice) {
        check(itemId, Meteor.Collection.ObjectID);
        newPurchasePrice = isNaN(parseFloat(newPurchasePrice)) ? null : parseFloat(newPurchasePrice);
        check(newPurchasePrice, Match.Maybe(Number));

        const item = Items.findOne(itemId);
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.update(itemId, {
            $set: {
                purchasePrice: newPurchasePrice
            }
        });
    },
    'items.toggleAvailability' (itemId, newAvailability) {
        check(itemId, Meteor.Collection.ObjectID);
        check(newAvailability, Boolean);

        const item = Items.findOne(itemId);
        if (item.private && item.owner !== Meteor.userId()) {
            // If the item is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Items.update(itemId, {
            $set: {
                available: newAvailability
            }
        });
    },
    'items.toggleSold' (itemId, newSold) {
        check(itemId, Meteor.Collection.ObjectID);
        check(newSold, Boolean);

        const item = Items.findOne(itemId);

        // Make sure only the item owner can make a item private
        if (item.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Items.update(itemId, {
            $set: {
                sold: newSold
            }
        });
    },
});
