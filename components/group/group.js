(function(){
  
    angular.module("eat.components.group", [])
    .directive("eatGroup", eatGroup)
    .directive("eatInputBuffet", eatInputBuffet)
    .directive("label", label)
    .directive("input", input)
    .directive("eatHelp", eatHelp)
    ;
    
    function eatGroup(){
        
        return {
            restrict: 'EA',
            link: postLink,
            controller: EatGroupCtrl,
            controllerAs:"ctrl"
        };

        function postLink(scope, element) {
            
            element.addClass('eat-group');
        }
        
        EatGroupCtrl.$inject = ["$animate", "$element"];
        function EatGroupCtrl($animate, $element){
            var ctrl = this;
            ctrl.__eat_ctrl_name = "EatGroupController";
            ctrl.setInvalid = function(isInvalid, id) {
                if (isInvalid) {
                    $animate.addClass($element, 'eat-group-invalid');
                    $animate.removeClass($element, 'eat-group-valid');
                } else {
                    $animate.addClass($element, 'eat-group-valid');
                    $animate.removeClass($element, 'eat-group-invalid');
                }
            };  
            
            ctrl.setFocused = function(isFocused) {
                $element.toggleClass('eat-group-focused', !!isFocused);
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
            if(ctrls.length == 0)throw Error("eat-input must be inside an eat-group");
            
            var eatGroupCtrl = ctrls[0];
            var ngModelCtrl;
            var eatInputBuffetCtrl;
            
            if(ctrls[1]){
                ngModelCtrl = ctrls[1];
            }
            if(ctrls[2]){
                eatInputBuffetCtrl = ctrls[2];   
            }
            //pant!
            
            element.addClass('eat-input');
            var isReadonly = angular.isDefined(attr.readonly);
            var isRequired = angular.isDefined(attr.required);
            
            if (isRequired) {
                eatGroupCtrl.addClass('eat-group-required');
            }
            if (!element.attr('id')) {
                element.attr('id', 'input_' + $eatCoreUtil.nextUid());
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
                ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
            }
             
            
            //eatGroup or inputBuffet
            /*var containerCtrl;
            if(eatInputBuffetCtrl){
                eatInputBuffetCtrl.addInput(element[0]);
                containerCtrl = eatInputBuffetCtrl;
            }else{
                eatGroupCtrl.input = element[0];
                containerCtrl = eatGroupCtrl;
            }
            */
            function ngModelPipelineCheckValue(arg) {
                eatGroupCtrl.setInvalid(ngModelCtrl.$isEmpty(arg), element[0].id);
                return arg;
            }

            function inputCheckValue() {
                // An input's value counts if its length > 0,
                // or if the input's validity state says it has bad input (eg string in a number input)
                eatGroupCtrl.setInvalid(element.val().length == 0 || (element[0].validity || {}).badInput, element[0].id);
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
            element.addClass('eat-label');
        }
        
        function EatHelpCtrl(){
            
        }
    }
        
})();