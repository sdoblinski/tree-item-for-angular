require('tree-item-for-angular')
angular.module('app',['tree-item-for-angular'])
	.controller('AppController', ['$scope', 'TreeItem', function($scope, TreeItem){
		$scope.humanSciences = new TreeItem('Subjects')
		
	var humanSciences = ['Philosophy', 'Politics']

	humanSciences.forEach(function(humanScience){
		$scope.humanSciences.addChild(humanScience)
	})
}])