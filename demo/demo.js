(function(){
  
    angular.module("demoApp", [
        'angular-eat'
    ])
        .controller("appController", controller);

    controller.$inject = [];
    function controller() {
        
        var vm = this;
        vm.message = "test";
        
        vm.memorableDate2 = new Date(1980,2,11);
    }
    
})();