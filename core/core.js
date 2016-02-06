
var nextUniqueId = 0;

(function(){
  
    
  
    angular.module("eat.core", [])
    .factory("$eatCoreUtil", eatCoreUtil);
    
    
    function eatCoreUtil(){
        var service = {
            nextUid : nextUid,
            isValidDate: isValidDate
        };
        return service;
        
        
        function nextUid(){
            nextUniqueId++;
            return '' + nextUniqueId;
        }
        
    }
    
    function isValidDate(d){
        if ( Object.prototype.toString.call(d) === "[object Date]" ) {
            // it is a date
            if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false
        }
    }
})();