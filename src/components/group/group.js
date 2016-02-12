(function(){
  
    angular.module("eat.components.group", [])
    .directive("eatGroup", eatGroup)
    .directive("eatInputBuffet", eatInputBuffet)
    .directive("label", label)
    .directive("input", input)
    .directive("eatHelp", eatHelp)
    .directive("eatMessages", eatMessages)
    ;
    
    eatGroup.$inject= ["$eatCoreUtil"];
    function eatGroup($eatCoreUtil){
        
        return {
            restrict: 'EA',
            link: postLink,
            controller: EatGroupCtrl,
            controllerAs:"ctrl",
            require:["?^form", "eatGroup"]
        };
       
        function postLink(scope, element, attrs, ctrls) {
            var formCtrl = ctrls[0];
            var eatGroupCtrl = ctrls[1];
            if(formCtrl){
                eatGroupCtrl.formCtrl = formCtrl;
                
                if (!formCtrl.$name) {
                    //set a name on the form if it hasn't got one
                    var name = 'form_' + $eatCoreUtil.nextUid();
                    var form = $eatCoreUtil.getClosest(element[0],"form");
                    angular.element(form).attr("name",name);
                    formCtrl.$name = name;
                }
            }
            element.addClass('eat-group');
             
            
        }
        
        EatGroupCtrl.$inject = ["$animate", "$element","$scope", "$eatCoreUtil"];
        function EatGroupCtrl($animate, $element, $scope, $eatCoreUtil){
            var ctrl = this;
            //properties
            ctrl.input = null;
            ctrl.formCtrl = null;
            ctrl.isValid = false;
            ctrl.ngModel = null;
            ctrl.isRequired = false;

            //methods            
            ctrl.setInvalid = setInvalid;
            ctrl.setFocused = setFocused;
            ctrl.setRequired = setRequired;
            ctrl.setValid = setValid;
            ctrl.isFormSubmitted = isFormSubmitted;
            ctrl.setInput = setInput; 
            ctrl.setHasValue = setHasValue; 
            ctrl.setNgModel = setNgModel;
            
            function setInvalid(isInvalid) {
                ctrl.isValid = !isInvalid;
                if (isInvalid) {
                    $animate.addClass($element, 'eat-group-invalid');
                } else {
                    $animate.removeClass($element, 'eat-group-invalid');
                }
            }  
            function setValid(isValid) {
                ctrl.isValid = isValid;
                if (isValid) {
                    $animate.addClass($element, 'eat-group-valid');
                } else {
                    $animate.removeClass($element, 'eat-group-valid');
                }
            } 
            
            function setHasValue(hasValue) {
                setInvalid(ctrl.isRequired && !hasValue);
                setValid(hasValue);
                
                if (hasValue) {
                    $animate.addClass($element, 'eat-group-has-value');
                } else {
                    $animate.removeClass($element, 'eat-group-has-value');
                }
            }  
             
            function setFocused(isFocused) {
                $element.toggleClass('eat-group-focused', !!isFocused);
            }
            
            function setRequired(isRequired){
                ctrl.isRequired = isRequired;
                $element.toggleClass('eat-group-required', !!isRequired);
            }  
            
            function setInput(input){
                ctrl.input = input;
            }   
            
            function setNgModel(model){
                ctrl.ngModel = model;
                $scope.$watch(isErrorGetter, setInvalid);
            }
            
            function isFormSubmitted() {
                return ctrl.formCtrl ? ctrl.formCtrl.$submitted : false;
            };
           
            var isErrorGetter = function() {                
                return ctrl.ngModel.$invalid && (ctrl.ngModel.$touched || isFormSubmitted());
            };
            
        }

    }
    
     function eatInputBuffet(){
        
        return {
            restrict: 'EA',
            link: postLink,
            controller: EatInputBuffetCtrl,
            controllerAs:"ctrl",
            require:["^eatGroup", "eatInputBuffet"]
        };

        function postLink(scope, element, attr, ctrls) {
            element.addClass('eat-input-buffet');
            
            if(ctrls.length == 0){
                throw Error("eat-input-buffet must be inside an eat-group");   
            };
            
            var containerCtrl = ctrls[0];
            var eatInputBuffetCtrl = ctrls[1];
            eatInputBuffetCtrl.parent = containerCtrl;
        }
        
        function EatInputBuffetCtrl(){
            var ctrl = this;
        }

    }
    
    input.$inject = ["$eatCoreUtil"];
    function input($eatCoreUtil){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: InputCtrl,
            controllerAs:"ctrl",
            require:["^eatGroup", "?ngModel", "^?eatInputBuffet"]
        };

        function postLink(scope, element, attr, ctrls) {
            var eatGroupCtrl = ctrls[0];
            if(!eatGroupCtrl)throw Error("eat-input must be inside an eat-group");
            
            var ngModelCtrl = ctrls[1];
            var eatInputBuffetCtrl = ctrls[2];
            
            element.addClass('eat-input');
            var isReadonly = angular.isDefined(attr.readonly);
            var isRequired = angular.isDefined(attr.required);
            
            eatGroupCtrl.setRequired(isRequired);
            
            var id = element.attr('id'); 
            if (!id) {
                id = 'input_' + $eatCoreUtil.nextUid();
                element.attr('id', id);
            }
            if (!element.attr('name')) {
                element.attr('name', id);
            }
            
            
            if (!isReadonly) {
                element
                    .on('focus', function(ev) {
                        eatGroupCtrl.setFocused(true);
                    })
                    .on('blur', function(ev) {
                        eatGroupCtrl.setFocused(false);
                        if(!eatInputBuffetCtrl){
                            inputCheckValue();
                        }
                    });
            }
                
            if(!eatInputBuffetCtrl){
                eatGroupCtrl.setNgModel(ngModelCtrl);
                ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
                ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);
            }
            
            function ngModelPipelineCheckValue(arg) {
                eatGroupCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
                return arg;
            }

            function inputCheckValue() {
                // An input's value counts if its length > 0,
                // or if the input's validity state says it has bad input (eg string in a number input)
                //eatGroupCtrl.setInvalid(element.val().length == 0 || (element[0].validity || {}).badInput);
                eatGroupCtrl.setHasValue(element.val().length == 0 || (element[0].validity || {}).badInput);
            }
        }
        
        function InputCtrl(){
            var ctrl = this;
        }
        
        
    }
    
    function label(){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: LabelCtrl,
            controllerAs:"ctrl"
        };

        function postLink(scope, element) {
            
            element.addClass('eat-label');
        }
        
        function LabelCtrl(){
            var ctrl = this;
            
        }
    }
    
    function eatHelp(){
        
        return {
            restrict: 'E',
            link: postLink,
            controller: EatHelpCtrl
        };

        function postLink(scope, element) {
            element.addClass('eat-help');
        }
        
        function EatHelpCtrl(){
            
        }
    }
    
      function eatMessages(){
        
        return {
            restrict: 'E',
            scope:{},
            template:'<div class="eat-messages" ng-messages="errorModel"><div ng-messages-include="eat-error-messages"></div></div>',
            link:preLink,
            controller: EatMessagesCtrl,
            require:["^eatGroup"]
        };
        
        function preLink(scope, element, attrs, ctrls){
            var eatGroupCtrl = ctrls[0];
            var getter = function(){
                return eatGroupCtrl.ngModel.$touched ||
                       eatGroupCtrl.formCtrl.$submitted ? 
                            eatGroupCtrl.ngModel.$error : null;
            }
            scope.$watch(getter, function(newValue){
                scope.errorModel = newValue;
            });
            
        }
        function EatMessagesCtrl(){
            
        }
    }
        
})();