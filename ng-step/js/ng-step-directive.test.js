'use strict';

describe('ng-step', function () {

    var element,
        scope,
        controller,
        sampleData;

    beforeEach(module('demo'));
    beforeEach(module('planavsky.directive.ngStep'));
    beforeEach(module('ng-step/views/index.html'));
    beforeEach(module('mock-data/sample-data.json'));

    beforeEach(inject(function($rootScope, $compile, $injector, $httpBackend) {

        scope = $rootScope.$new();
        scope.sampleData = sampleData = $injector.get('mockDataSampleData');
        element = angular.element('<ng-step data-items="sampleData"></ng-step>');
        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('ngStep');

    }));

    it('test example 1', function () {

        expect(element.isolateScope().vm.activeId).toBe(0);

        // Arrange
        var num1 = 1;
        var num2 = 3;
        var expected = 4;

        // Act
        var result = num1 + num2;

        // Assert
        expect(result).toBe(expected);

    });

});