angular.module('plunker').directive('miniGraphic', function($document) {
  return {
        restrict: 'A',
        replace:false,
        scope: {
            jsonOrder: "=",
            jsonRecon: "="
        },
        controller: function($scope, $element, $window) {

            var len = 110*20;
            var step = 20;           

            $scope.component = function(color, ctx) {
                return {
                    builder: function(x, y) {
                        var path = new Path2D();
                        path.rect(x, y+60, 100, 20);
                        ctx.fillStyle = color;
                        ctx.fill(path);
                        path.closePath();
                    }
                }
            }

            $scope.timeline = function(ctx) {
                return {
                    builder: function(i, p) {
                        var path = new Path2D();
                        ctx.lineWidth = 2;
                        path.moveTo(p/2-50, i+60);
                        path.lineTo(p/2+50, i+60);
                        ctx.fillStyle = "grey";
                        ctx.fill();
                        ctx.strokeStyle = "grey";
                        ctx.stroke(path);
                        ctx.font = "18px serif";
                        ctx.textAlign = "right";
                        ctx.fillText(i/20*5, p/2-55, 65+i*5);
                        ctx.textAlign = "left";
                        ctx.fillText(i/20*5, p/2+55, 65+i*5);
                        path.closePath();
                    }
                }
            }

            $scope.createGrid = function(ctx, p, h) {
                var path = new Path2D();
                path.roundRect(p/3, 40, 100, h-120, 10);
                path.roundRect(p/3-150, 40, 100, h-120, 10);
                path.roundRect(p/3-300, 40, 100, h-120, 10);
                path.roundRect(p*2/3-100, 40, 100, h-120, 10);
                path.roundRect(p*2/3+50, 40, 100, h-120, 10);
                path.roundRect(p*2/3+200, 40, 100, h-120, 10);
                ctx.fillStyle = "#4D4D4D";
                ctx.fill(path);
                ctx.strokeStyle = "#4D4D4D";
                ctx.stroke(path);
                path.closePath();
                for(var i=0; i<len; i += step) {
                    var timestep = $scope.timeline(ctx, "grey");
                    timestep.builder(i, p);          
                }
            }

            $scope.render = function(canvas, ctx, dbOrder, dbRecon) {
                // Preparo la griglia di base
                var p = canvas.width;
                var h = canvas.height;

                $scope.createGrid(ctx, p, h);

                // Disegno i componenti del grafico
                for(var i in dbOrder) {
                    var colorCJO = dbOrder[i].CJ_relationship !== 0 ? dbOrder[i].CJ_relationship : "#4D4D4D";
                    var colorMDO = dbOrder[i].MD_relationship !== 0 ? dbOrder[i].MD_relationship : "#4D4D4D";
                    var colorPCO = dbOrder[i].PC_relationship !== 0 ? dbOrder[i].PC_relationship : "#4D4D4D";
                    var colorCJR = dbRecon[i].CJ_relationship !== 0 ? dbRecon[i].CJ_relationship : "#4D4D4D";
                    var colorMDR = dbRecon[i].MD_relationship !== 0 ? dbRecon[i].MD_relationship : "#4D4D4D";
                    var colorPCR = dbRecon[i].PC_relationship !== 0 ? dbRecon[i].PC_relationship : "#4D4D4D";
                    var component1 = $scope.component(colorPCO, ctx);
                    component1.builder(p/3, dbOrder[i].minute/3);
                    var component2 = $scope.component(colorCJO, ctx);
                    component2.builder(p/3-150, dbOrder[i].minute/3);
                    var component3 = $scope.component(colorMDO, ctx);
                    component3.builder(p/3-300, dbOrder[i].minute/3);
                    var component4 = $scope.component(colorMDR, ctx);
                    component4.builder(p*2/3-100, dbRecon[i].minute/3);
                    var component5 = $scope.component(colorCJR, ctx);
                    component5.builder(p*2/3+50, dbRecon[i].minute/3);
                    var component6 = $scope.component(colorPCR, ctx);
                    component6.builder(p*2/3+200, dbRecon[i].minute/3);
                    //cute frequency
                    if(dbRecon[i].cute_frequency > 0) {
                        $scope.starBuilder(dbRecon[i], ctx, p, p*2/3+50);
                    }
                    if(dbOrder[i].cute_frequency > 0) {
                        $scope.starBuilder(dbOrder[i], ctx, p, p/3-150);
                    }
                    //cancellation
                    if(dbRecon[i].cancellation > 0) {
                        $scope.cancBuilder(dbRecon[i], ctx, p, p*2/3+50);
                    }
                    if(dbOrder[i].cancellation > 0) {
                        $scope.cancBuilder(dbOrder[i], ctx, p, p/3-150);
                    }
                    // flashback
                    if(dbRecon[i].flashback > 0) {
                        $scope.flashBuilder(dbRecon[i], ctx, p, p*2/3+50);
                    }
                    if(dbOrder[i].flashback > 0) {
                        $scope.flashBuilder(dbOrder[i], ctx, p, p/3-150);
                    }
                    //comments
                    if(dbRecon[i].comments !== "") {
                        $scope.commBuilder(dbRecon[i], ctx, p, p-150, "right");
                    }
                    if(dbOrder[i].comments !== "") {
                        $scope.commBuilder(dbOrder[i], ctx, 0, 150, "left");
                    }
                }
            }

            $scope.starBuilder = function(c, ctx, p, x) {
                var l = c.cute_frequency
                var arr = [];
                for(var i=0; i<l; i++) {  
                    arr.push(new Image());  
                }

                arr.forEach(function(a, i) {
                    a.src = "model/assets/svg_4.svg";
                    a.onload = function () {
                        ctx.drawImage(a, x+(100/(l+1)*(i+1)-10), c.minute/3+60, 20, 20);
                    };
                })
                
            }

            $scope.cancBuilder = function(c, ctx, p, x) {
                var img = new Image();
                img.src="model/assets/svg_5.svg";
                img.onload = function() {
                    ctx.drawImage(img, x+70, c.minute/3+60, 15, 20);
                }
            }

            $scope.flashBuilder = function(c, ctx, p, x) {
                var img = new Image();
                img.src="model/assets/svg_6.svg";
                img.onload = function() {
                    ctx.drawImage(img, x+10, c.minute/3+60, 25, 15);
                }
            }

            $scope.commBuilder = function(c, ctx, p, d, l) {
                var path = new Path2D();
                path.moveTo(p, c.minute/3+60);
                path.lineTo(d, c.minute/3+60);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.strokeStyle = "white";
                ctx.stroke(path);
                ctx.font = "14px serif";
                ctx.textAlign = l;
                ctx.fillText(c.comments, p, c.minute/3+55);
                path.closePath();
            }
            

            $scope.init = function() {
                // Inizializzo l'area di disegno
                var canvas = $element[0];
                var ctx = canvas.getContext("2d");
                canvas.width = $window.innerWidth;
                canvas.height = 111*21;

                var dataOrder = $scope.jsonOrder.data;
                var dataRecon = $scope.jsonRecon.data;
                var db_order = [], db_recon = [], dbOrder = [], dbRecon = [];
                // Raggruppo per minuto
                for(var i=0; i<len; i+=step) {
                    var arrOrder = [], arrRecon = [];
                    dataOrder.filter(function(a) {
                        if(i/20 === Math.floor(a.minute/60)) {
                            arrOrder.push(a);
                        }
                    });
                    db_order.push(arrOrder);
                    dataRecon.filter(function(a) {
                        if(i/20 === Math.floor(a.minute/60)) {
                            arrRecon.push(a);
                        }
                    });
                   db_recon.push(arrRecon);    
                }
                // Aggrego le informazioni in un unico oggetto per min
                
                for(var i in db_order) { 
                  var init = {
                        "minute": 0,
                        "MD_relationship": 0,
                        "CJ_relationship": "#1879FF",
                        "PC_relationship": 0,
                        "cute_frequency": 0,
                        "cancellation": 0,
                        "flashback": 0,
                        "comments": ""
                    }   
                    var objOrder = db_order[i].reduce(function(a, b) {
                        a.minute = i*60;
                        a.MD_relationship = b.MD_relationship;
                        a.CJ_relationship = b.CJ_relationship;
                        a.PC_relationship = b.PC_relationship;
                        a.cute_frequency += b.cute_frequency;
                        a.cancellation += b.cancellation;
                        a.flashback += b.flashback;
                        a.comments += b.comments;
                        return a;
                    }, init);
                    dbOrder.push(objOrder);
                    
                  }
                  for(var i in db_recon) {
                    var init = {
                        "minute": 0,
                        "MD_relationship": 0,
                        "CJ_relationship": "#7CFF7C",
                        "PC_relationship": 0,
                        "cute_frequency": 0,
                        "cancellation": 0,
                        "flashback": 0,
                        "comments": ""
                    }  
                    var objRecon = db_recon[i].reduce(function(a, b) {
                        a.minute = i*60;
                        a.MD_relationship = b.MD_relationship;
                        a.CJ_relationship = b.CJ_relationship;
                        a.PC_relationship = b.PC_relationship;
                        a.cute_frequency += b.cute_frequency;
                        a.cancellation += b.cancellation;
                        a.flashback += b.flashback;
                        a.comments += b.comments;
                        return a;
                    }, init);
                    dbRecon.push(objRecon);

                }

                // Avvio la renderizzazione
                $scope.render(canvas, ctx, dbOrder, dbRecon);
                
          }

             
        },
        link: function(s, e, a, c) {
            /*$document[0].body.onresize = function() {
                s.init();
            };*/

            s.$watch("jsonOrder", function(a, b) {
                if(a) {
                    s.init();
                }  
            });
            
        }
    };
});