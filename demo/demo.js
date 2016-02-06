(function(){
  
    angular.module("demoApp", [
        'angular-eat'
    ])
        .controller("appController", controller);

    controller.$inject = [];
    function controller() {
        
        var vm = this;
        vm.message = "Please register using the form below.";
        vm.user = {};
        vm.submit = function(){
            
        }
    }
    
})();