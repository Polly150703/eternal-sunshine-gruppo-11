angular.module('plunker').directive('content', function($document) {
  return {
        restrict: 'A',
        replace:false,
        scope: {
            data: "="
        },
        controller: function($scope, $element) {
            $scope.render = function(canvas, ctx) {
                var p = canvas.width;
                var h = canvas.height;

                ctx.lineWidth = 15;
                ctx.lineCap = "round";
        
                ctx.beginPath();
                const gradient = ctx.createLinearGradient(0, 0, p, 0);

                if($scope.data !== "All") {
                    ctx.moveTo(20, h- 50);
                    ctx.lineTo(p-20, h - 50);
                    if($scope.data === "CJ") {
                        gradient.addColorStop(0, "#F07017");
                        gradient.addColorStop(0.5, "#4A96FF");
                        gradient.addColorStop(1, "#5BEC6A");
                    } else if($scope.data === "MD") {
                        gradient.addColorStop(0.5, "#FF57EB");
                        gradient.addColorStop(1, "#FFB8FF");
                    } else {
                        gradient.addColorStop(0.5, "#4D4D4D");
                        gradient.addColorStop(1, "#6C6C6C");
                    }
                } else {
                    ctx.moveTo(20, h-10);
                    ctx.lineTo(p/10, h - 110);
                    ctx.moveTo(p/10, h-110);
                    ctx.lineTo(p-10, h - 10);
                    ctx.moveTo(p-10, h - 10);
                    ctx.lineTo(p*0.9, h - 110);
                    gradient.addColorStop(0, "#FCE600");
                    gradient.addColorStop(0.102, "#FFFF7F");
                    gradient.addColorStop(0.102, "#4D4D4D");
                    gradient.addColorStop(1, "#6C6C6C");
                }
                

                ctx.strokeStyle = gradient;
                ctx.stroke();
                ctx.closePath();
            }
            $scope.init = function(data) {
                var canvas = $element[0];
                var id = canvas.id;
                var ctx = canvas.getContext("2d");

                canvas.width = $element[0].parentElement.clientWidth -20;
                canvas.height = 120;


                $scope.render(canvas, ctx, id, data);

            }

            $scope.init();
             
        },
        link: function(s, e, a, c) {

        }
    };
});