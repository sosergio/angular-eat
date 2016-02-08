(function(){
  
    angular.module("eat.components.money", [
      
    ])
    .directive("eatMoney", eatMoney)
    ;
    eatMoney.$inject = ["$eatCoreUtil"]
    function eatMoney($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            require:["ngModel", "^eatGroup"],
            scope:{},
            template:
                '<eat-input-buffet class="eat-money">'+
                    '<select ng-model="currency"><option>EUR</option><option>GBP</option></select>'+
                    '<span class="eat-money-currency-symbol">{{currency=="EUR"?"€":""}}{{currency=="GBP"?"£":""}}</span>'+
                    '<input type="number" min="0" ng-model="amount"/>'+
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
           
           var isRequired = angular.isDefined(attrs.required);
           eatGroupCtrl.setRequired(isRequired);
           
           eatGroupCtrl.setNgModel(ngModelController);
            
           // This will push the $viewValue value through the parsers
           // before it is synchronized out to the $modelValue and the ngModel
           // binding.
           scope.$watch('currency + amount', function(newValue,oldValue) {
              if(oldValue != newValue){
                    var money = {
                            currency: scope.currency, 
                            amount: scope.amount
                    };
                    ngModelController.$setTouched(true);
                    ngModelController.$setViewValue(money);
              }
           });
                    
           // ngModel --> $modelValue --> [[[ Formatters ]]] --> $viewValue --> $render().
           function formatInput(model){
               var isValid = $eatCoreUtil.isValidDate(model);
               var vm = null;
               if(model){
                   vm = {
                     day:model.amount,
                     month:model.currency
                   };
               }
               setValidity(vm);
               return vm; 
           }
           
           //this is crucial when the directive is loaded with a set model
           function renderViewValue(){
               var vm = ngModelController.$viewValue;
               if(vm){
                scope.amount   = vm.amount;
                scope.currency = vm.currency;
               };
               setValidity(vm);
           }
           
           // Widget --> $viewValue --> [[[ Parsers ]]] --> $modelValue --> ngModel.
           function parseOutput(vm){
               if(setValidity(vm)) 
                    return {amount: vm.amount, currency: vm.currency};
               return null;
           }
           
            var isErrorGetter = function() {                
                return ngModelController.$invalid && (ngModelController.$touched || eatGroupCtrl.isFormSubmitted());
            };
            scope.$watch(isErrorGetter, eatGroupCtrl.setInvalid);
           
           var _ele  = element;
           function setValidity(vm){
               var isValid = false;
               if(!isRequired && !vm){
                   isValid = true;
               }
               
               if(ngModelController.$touched || eatGroupCtrl.isFormSubmitted()){
                   var yearVal = _ele[0].querySelector("[ng-model='amount']").validity.valid;
                   var monthVal = _ele[0].querySelector("[ng-model='currency']").validity.valid;
                   isValid = isValid && yearVal && monthVal;
                   ngModelController.$setValidity("money", isValid);
                   eatGroupCtrl.setValid(isValid);
               }
               
               return isValid;
           }
           
           
           
        }

    }
    
  
        
})();