app.directive('bsSelect', function () {
    return {
        restrict: 'E',
        require: '^ngModel',
        scope: {
            items: '=',
            textField: '@',
            valueField: '@',
            disableField: '=',
            ngModel: '='
        },
        template: "\n                <div ng-model=\"attType.MachineTypeDataValues\" class=\"c-multiselect\">\n                    <button class=\"btn btn-default dropdown-toggle form-control c-multiselect__button\" data-toggle=\"dropdown\">\n                        {{currentItemLabel}}\n                        <span class=\"caret\"></span>\n                    </button>\n\n                    <div class=\"dropdown-menu\">\n                        <div class=\"c-multiselect__search\">\n                            <input type=\"text\" class=\"form-control\" ng-model=\"searchString\">\n                        </div>\n                        <ul class=\"c-multiselect__options\">                            \n                            <li ng-repeat=\"item in items | searchFor:searchString\" ng-click=\"cancelClose($event)\" class=\"c-multiselect__item\" ng-class=\"{hovered: hover,selected:setCheckboxChecked(item), disable: item.id === disableField}\" ng-mouseenter=\"hover = true\" ng-mouseleave=\"hover = false\">\n                                <label class=\"input-group c-multiselect__item-label\" >\n                                        <input class=\"hide\" type=\"checkbox\" ng-disabled=\"item.id === disableField\" ng-checked=\"setCheckboxChecked(item)\"  ng-click=\"selectVal(item,$index)\">\n                                        {{item[textField]}}\n\n                                        <span ng-if=\"setCheckboxChecked(item)\" class=\"glyphicon glyphicon-ok check-mark c-multiselect__item-icon\"></span>\n                                </label>\n                            </li>\n                        </ul>\n                    </dv>\n                </div>            \n            ",
        link: function (scope, element, attrs, ngModelCtrl) {
            //added a watch to update the text of the multiselect
            scope.$watch('ngModel', function (v) {
                scope.setLabel();
            }, true);
            //
            var valueField = scope.valueField.toString().trim();
            var textField = scope.textField.toString().trim();
            var modelIsValid = false;
            var selectedItemIsValid = false;
            scope.checkModelValidity = function (items) {
                if (typeof (items) == "undefined" || !items)
                    return false;
                if (items.length < 1)
                    return false;
                return true;
            };
            modelIsValid = scope.checkModelValidity(scope.ngModel);
            scope.setFormValidity = function () {
                if (typeof (attrs.required) != "undefined") {
                    return modelIsValid; //modelIsValid must be set before we setFormValidity
                }
                return true;
            };
            ngModelCtrl.$setValidity('noItemsSet!', scope.setFormValidity());
            scope.checkSelectedItemValidity = function (item) {
                if (!item)
                    return false;
                if (!item[valueField])
                    return false;
                if (!item[valueField].toString().trim())
                    return false;
                return true;
            };
            scope.getItemName = function (item) {
                return item[textField];
            };
            scope.setLabel = function () {
                if (typeof (scope.ngModel) == "undefined" || !scope.ngModel || scope.ngModel.length < 1) {
                    scope.currentItemLabel = attrs.defaultText;
                }
                else {
                    var allItemsString_1 = '';
                    var selectedItemsCount = scope.ngModel.length;
                    if (selectedItemsCount < 5) {
                        angular.forEach(scope.ngModel, function (item) {
                            allItemsString_1 += item[textField].toString() + ', ';
                        });
                    }
                    else {
                        allItemsString_1 = selectedItemsCount + " selected!";
                    }
                    scope.currentItemLabel = allItemsString_1;
                }
            };
            scope.setLabel();
            scope.setCheckboxChecked = function (_item) {
                var found = false;
                angular.forEach(scope.ngModel, function (item) {
                    if (!found) {
                        if (_item[valueField].toString() === item[valueField].toString()) {
                            found = true;
                        }
                    }
                });
                return found;
            };
            scope.selectVal = function (_item) {
                var found = false;
                if (typeof (scope.ngModel) != "undefined" && scope.ngModel) {
                    for (var i = 0, len = scope.ngModel.length; i < len; i++) {
                        if (!found) {
                            if (_item[valueField].toString() === scope.ngModel[i][valueField].toString()) {
                                found = true;
                                var index = scope.ngModel.indexOf(scope.ngModel[i]);
                                scope.ngModel.splice(index, 1);
                            }
                        }
                    }
                }
                else {
                    scope.ngModel = [];
                }
                if (!found) {
                    scope.ngModel.push(_item);
                }
                modelIsValid = scope.checkModelValidity(scope.ngModel);
                selectedItemIsValid = scope.checkSelectedItemValidity(_item);
                ngModelCtrl.$setValidity('noItemsSet!', scope.setFormValidity() && selectedItemIsValid);
                scope.setLabel();
                ngModelCtrl.$setViewValue(scope.ngModel);
            };
            scope.cancelClose = function ($event) {
                $event.stopPropagation();
            };
        }
    };
})
    .filter('searchFor', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            if (JSON.stringify(item).toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});
