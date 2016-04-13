import angularMeteor from 'angular-meteor';
import todosList from '../imports/components/todosList/todosList';
import itemList from '../imports/components/itemList/itemList';
import '../imports/startup/accounts-config.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import uiRouter from 'angular-ui-router';
import 'angular-xeditable/dist/js/xeditable.js';

//Foundation
// here we import all but you can choose only plugins that you want
// foundation-sites/js (foundation.core.js is needed and maybe some other tools)
import 'foundation-sites/dist/foundation.js';


//Angular
angular.module('simple-todos', [
    angularMeteor,
    itemList.name,
    todosList.name,
    'accounts.ui',
    uiRouter,
    'xeditable'
]);

function onReady() {
    angular.bootstrap(document, ['simple-todos']);
    $(function() {
		//Foundation.Equalizer.defaults.equalizeOnStack = true;
		//Foundation.Equalizer.defaults.equalizeByRow = true;
    	$(document).foundation();
    });
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}
