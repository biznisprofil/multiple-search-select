app.directive('bsSelect', () => {
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
        template: `
                <div ng-model="attType.MachineTypeDataValues" class="c-multiselect">
                    <button class="btn btn-default dropdown-toggle form-control c-multiselect__button" data-toggle="dropdown">
                        {{currentItemLabel}}
                        <span class="caret"></span>
                    </button>

                    <div class="dropdown-menu">
                        <div class="c-multiselect__search">
                            <input type="text" class="form-control" ng-model="searchString">
                        </div>
                        <ul class="c-multiselect__options">                            
                            <li ng-repeat="item in items | searchFor:searchString" ng-click="cancelClose($event)" class="c-multiselect__item" ng-class="{hovered: hover,selected:setCheckboxChecked(item), disable: item.id === disableField}" ng-mouseenter="hover = true" ng-mouseleave="hover = false">
                                <label class="input-group c-multiselect__item-label" >
                                        <input class="hide" type="checkbox" ng-disabled="item.code === disableField" ng-checked="setCheckboxChecked(item)"  ng-click="selectVal(item,$index)">
                                        {{item[textField]}}

                                        <span ng-if="setCheckboxChecked(item)" class="glyphicon glyphicon-ok check-mark c-multiselect__item-icon"></span>
                                </label>
                            </li>
                        </ul>
                    </dv>
                </div>            
            `,
        link: (scope: any, element: any, attrs: any, ngModelCtrl: any) => {
            //added a watch to update the text of the multiselect
            scope.$watch('ngModel', (v) => {
                scope.setLabel();
            }, true);
            //
            let valueField = scope.valueField.toString().trim();
            let textField = scope.textField.toString().trim();
            let modelIsValid = false;
            let selectedItemIsValid = false;

            scope.checkModelValidity = (items) => {
                if (typeof (items) == "undefined" || !items) return false;
                if (items.length < 1) return false;
                return true;
            };
            modelIsValid = scope.checkModelValidity(scope.ngModel);
            scope.setFormValidity = () => {
                if (typeof (attrs.required) != "undefined") {
                    return modelIsValid;//modelIsValid must be set before we setFormValidity
                }
                return true;
            };
            ngModelCtrl.$setValidity('noItemsSet!', scope.setFormValidity());
            scope.checkSelectedItemValidity = (item) => {
                if (!item) return false;
                if (!item[valueField]) return false;
                if (!item[valueField].toString().trim()) return false;
                return true;
            };

            scope.getItemName = (item) => {
                return item[textField];
            };


            scope.setLabel = () => {
                if (typeof (scope.ngModel) == "undefined" || !scope.ngModel || scope.ngModel.length < 1) {

                    scope.currentItemLabel = attrs.defaultText;

                } else {
                    let allItemsString = '';
                    let selectedItemsCount = scope.ngModel.length;
                    if (selectedItemsCount < 5) {
                        angular.forEach(scope.ngModel, (item) => {
                            allItemsString += item[textField].toString() + ', ';
                        });
                    } else {
                        allItemsString = selectedItemsCount + " selected!";
                    }
                    scope.currentItemLabel = allItemsString;
                }
            };
            scope.setLabel();
            scope.setCheckboxChecked = (_item) => {
                let found = false;
                angular.forEach(scope.ngModel, (item) => {
                    if (!found) {
                        if (_item[valueField].toString() === item[valueField].toString()) {
                            found = true;
                        }
                    }
                });
                return found;
            };
            scope.selectVal = (_item) => {
                let found = false;
                if (typeof (scope.ngModel) != "undefined" && scope.ngModel) {
                    for (let i = 0, len = scope.ngModel.length; i < len; i++) {
                        if (!found) {
                            if (_item[valueField].toString() === scope.ngModel[i][valueField].toString()) {
                                found = true;
                                let index = scope.ngModel.indexOf(scope.ngModel[i]);
                                scope.ngModel.splice(index, 1);
                            }
                        }
                    }
                } else {
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

            scope.cancelClose = ($event) => {
                $event.stopPropagation();
            };
        }
    };
})
.filter('searchFor', () => {
    return (arr, searchString) => {
        if (!searchString) {
            return arr;
        }
        let result = [];

        searchString = searchString.toLowerCase();
        angular.forEach(arr, (item) => {
            if (JSON.stringify(item).toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});



