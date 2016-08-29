import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Items } from '../../api/items.js';
import template from './itemList.html';

class ItemListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('items');

        this.hideUnavailable = true;
        this.showOnlyMyItems = false;
        this.hideMyItems = true;
        this.newItem = {};
        this.newItem.photoURLs = ['//lorempixel.com/270/135/technics'];

        this.helpers({
            currentUser() {
                return Meteor.user();
            },
            items() {
                const selector = {};

                // If hide completed is checked, filter items
                if (this.getReactively('hideUnavailable')) {
                    selector.available = {
                        $ne: false
                    };
                }
                // If show my items is checked, filter items
                if (this.getReactively('showOnlyMyItems')) {
                    selector.owner = Meteor.userId();
                }

                if (this.getReactively('hideMyItems')) {
                    selector.owner = {
                        $ne: Meteor.userId()
                    };
                }
                // Show most rented items at the top
                return Items.find(selector, {
                    sort: {
                        timesRented: -1
                    }
                });
            }//,
            //availableCount() {
                /*return Items.find({
                    available: true
                }).count();*/
           // }
        });
    }
    availableCount() {
        return this.items.count;
    }
    addItem(newItem) {
        // Insert a item into the collection
        Meteor.call('items.insert', newItem);

        // Clear form
        this.newItem = {};
        this.newItem.photoURLs[0] = '//lorempixel.com/270/135';
        $('#newItemModal').foundation('close');
    }

    editTitle(itemId, newTitle) {
        Meteor.call('items.editTitle', itemId, newTitle);
    }

    editDescription(itemId, newDescription) {
        Meteor.call('items.editDescription', itemId, newDescription);
    }

    editHourlyRate(itemId, newHourlyRate) {
        Meteor.call('items.editHourlyRate', itemId, newHourlyRate);
    }

    editDailyRate(itemId, newDailyRate) {
        Meteor.call('items.editDailyRate', itemId, newDailyRate);
    }

    editPurchasePrice(itemId, newPurchasePrice) {
        Meteor.call('items.editPurchasePrice', itemId, newPurchasePrice);
    }

    toggleAvailability(itemId, currentAvailability) {
        Meteor.call('items.toggleAvailability', item._id, !currentAvailability);
    }

    toggleSold(itemId, currentSoldStatus) {
        Meteor.call('items.toggleSold', itemId, !currentSoldStatus);
    }

    removeItem(item) {
        Meteor.call('items.remove', item._id);
    }

}

export default angular.module('itemList', [
    angularMeteor
    ])
    .component('itemList', {
        templateUrl: 'imports/components/itemList/itemList.html',
        controller: ['$scope', ItemListCtrl]
    });
