(function(){
  
    angular.module("eat.components.memorableDate", [
      
    ])
    .directive("eatMemorableDate", eatMemorableDate)
    ;
    eatMemorableDate.$inject = ["$eatCoreUtil"]
    function eatMemorableDate($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            require:["ngModel", "^eatGroup"],
            scope:{},
            template:
                '<eat-input-buffet>'+
                    '<input type="number" max-length="2" min="1" max="31" ng-model="day"/>'+
                    '<input type="number" max-length="2" min="1" max="12" ng-model="month"/>'+
                    '<input type="number"  max-length="4" min="1850" ng-model="year"/>'+
                '</eat-input-buffet>'
        };

        function postLink(scope, element, attrs, ctrls) {
           element.removeAttr('label');
           element.removeAttr('type');
           element.removeAttr('help');
           var eatGroupCtrl = ctrls[1];
           var ngModelController = ctrls[0];
           ngModelController.$formatters.push(formatInput);
           ngModelController.$render = renderViewValue;
           ngModelController.$parsers.push(parseOutput);
           
           // This will push the $viewValue value through the parsers
           // before it is synchronized out to the $modelValue and the ngModel
           // binding.
           scope.$watch('day + month + year', function() {
              var date = {
                    year: scope.year, 
                    month: scope.month, 
                    day:scope.day
              };
              ngModelController.$setViewValue(date);
           });
                    
           // ngModel --> $modelValue --> [[[ Formatters ]]] --> $viewValue --> $render().
           function formatInput(model){
               var isValid = $eatCoreUtil.isValidDate(model);
               var vm = null;
               if(isValid){
                   vm = {
                     day:model.getDay(),
                     month:model.getMonth()+1,
                     year:model.getFullYear()  
                   };
               }
               setValidity(vm);
               return vm; 
           }
           
           //this is crucial when the directive is loaded with a set model
           function renderViewValue(){
               var vm = ngModelController.$viewValue;
               if(vm){
                scope.day   = vm.day;
                scope.month = vm.month;
                scope.year  = vm.year;
               };
               setValidity(vm);
           }
           
           // Widget --> $viewValue --> [[[ Parsers ]]] --> $modelValue --> ngModel.
           function parseOutput(vm){
               if(setValidity(vm)) 
                    return new Date(vm.year,vm.month-1,vm.day);
               return null;
           }
           
           function setValidity(vm){
               if(!ngModelController.$dirty) return true;
               
               var isValid = false;
               if(vm && vm.day && vm.month && vm.year){
                   var date = new Date(vm.year,vm.month-1,vm.day);
                   isValid= $eatCoreUtil.isValidDate(date);
               }
               ngModelController.$setValidity("date", isValid);
               eatGroupCtrl.setInvalid(!isValid);
               return isValid;
           }
        }

    }
    
  
        
})();