angular.module('plunker').directive('graphic', function($document) {
  return {
        restrict: 'A',
        replace:false,
        scope: {
            json: "=",
            origin: "="
        },
        controller: function($scope, $element, $window) {

            var len = 110*60;
            var step = 60;

            $scope.timesteps = [];
            var detail = document.createElement("span");
            

            $scope.component = function(color, ctx) {
                return {
                    builder: function(x, y) {
                        var path = new Path2D();
                        path.rect(x, y+60, 250, 60);
                        ctx.fillStyle = color;
                        ctx.fill(path);
                        path.closePath();
                    }
                }
            }

            $scope.timeline = function(ctx, color) {
                return {
                    builder: function(i, db, p) {
                        var path = new Path2D();
                        ctx.lineWidth = 2;
                        path.moveTo(0, i+60);
                        path.lineTo(100, i+60);
                        ctx.fillStyle = color;
                        ctx.fill();
                        ctx.strokeStyle = color;
                        ctx.stroke(path);
                        ctx.font = "18px serif";
                        ctx.fillText(i/60*5, 105, 65+i*5);
                        path.closePath();
                        var obj = db.filter(function(a) { return i===a.minute})
                        $scope.timesteps.push({path:path, y:i+60, obj:obj, p:p});
                    }
                }
            }

            $scope.createGrid = function(ctx, p, h, db) {
                var path = new Path2D();
                path.roundRect(p/2-150, 40, 250, h-80, 10);
                path.roundRect(p/3-200, 40, 250, h-80, 10);
                path.roundRect(p*(2/3)-100, 40, 250, h-80, 10);
                ctx.fillStyle = "#4D4D4D";
                ctx.fill(path);
                ctx.strokeStyle = "#4D4D4D";
                ctx.stroke(path);
                path.closePath();
                for(var i=0; i<len; i += step) {
                    var timestep = $scope.timeline(ctx, "grey");
                    timestep.builder(i, db, p);          
                }
                var title = new Path2D();
                ctx.fillStyle = "#6F6F6F";
                ctx.fill(title);
                ctx.font = "40px serif"
                ctx.strokeStyle = "#4D4D4D";
                ctx.stroke(title);
                ctx.fillText("M-D", p/3-115, 30);
                ctx.fillText("J-C", p/2-55, 30);
                ctx.fillText("P-C", p*2/3, 30);
                path.closePath();
            }

            $scope.render = function(canvas, ctx, db) {
                // Preparo la griglia di base
                var p = canvas.width;
                var h = canvas.height;

                $scope.createGrid(ctx, p, h, db);

                // Disegno i componenti del grafico
                for(var i in db) {
                    var colorCJ = db[i].CJ_relationship !== 0 ? db[i].CJ_relationship : "#4D4D4D";
                    var colorMD = db[i].MD_relationship !== 0 ? db[i].MD_relationship : "#4D4D4D";
                    var colorPC = db[i].PC_relationship !== 0 ? db[i].PC_relationship : "#4D4D4D";
                    var component = $scope.component(colorCJ, ctx);
                    component.builder(p/2-150, db[i].minute);
                    var component = $scope.component(colorMD, ctx);
                    component.builder(p/3-200, db[i].minute);
                    var component = $scope.component(colorPC, ctx);
                    component.builder(p*(2/3)-100, db[i].minute);
                }

                $scope.animation(canvas, ctx);
            }

            $scope.animation = function(canvas, ctx) {
                
                canvas.onmousemove = function(e) {
                    var rect = this.getBoundingClientRect(), x, y;
                    x = e.clientX - rect.left;
                    y = e.clientY - rect.top;

                    var tooltip = document.createElement("span");
                    tooltip.setAttribute("id", "tooltip");
                    $('#tooltip').remove();
                    canvas.parentNode.parentNode.appendChild(tooltip);

                    var icons = document.createElement("div");
                    icons.setAttribute("id", "icons");
                    $('#icons').remove();
                    canvas.parentNode.parentNode.appendChild(icons);

                    var comm = document.createElement("span");
                    comm.setAttribute("id", "comment");
                    $('#comment').remove();
                    canvas.parentNode.parentNode.appendChild(comm);

                    tooltip.style.opacity = 0;
                    tooltip.style.visibility = "hidden"; 
                    icons.style.opacity = 0;
                    icons.style.visibility = "hidden";
                    comm.style.opacity = 0;
                    comm.style.visibility = "hidden";         
                    
                    $scope.timesteps.forEach(function(c, i) {
                        if(ctx.isPointInStroke(c.path, x, y)) {  
                                    
                            var pDetail = canvas.parentNode.appendChild(detail);
                            //tooltip
                            tooltip.style.opacity = 1;
                            tooltip.style.visibility = "visible";
                            tooltip.style.top = e.clientY-4+"px";
                            tooltip.appendChild(pDetail);
                            //icone
                            icons.style.opacity = 1;
                            icons.style.visibility = "visible";
                            icons.style.top = e.clientY+"px";
                            icons.style.left = c.p/2 -150 + "px";
                            icons.appendChild(pDetail);
                            //commenti
                            comm.style.opacity = 1;
                            comm.style.visibility = "visible";
                            comm.style.top = e.clientY+"px";
                            comm.style.left = c.p -250 + "px";
                            comm.appendChild(pDetail);

                            var list = [], star = [], pList = [];
                            var comments = [], pComment = [];
                            for(var i=0; i<c.obj[0].cute_frequency; i++) {
                                star.push(document.createElement("img"));
                            }
                            star.forEach(function(a) {
                                a.setAttribute("src", "model/assets/svg_4.svg");
                                list.push(a);
                            });
                            if(c.obj[0].cancellation > 0) {
                                var canc = document.createElement("img");
                                canc.setAttribute("src", "model/assets/svg_5.svg");
                                list.push(canc);
                            }
                            if(c.obj[0].flashback === 1) {
                                var flash = document.createElement("img");
                                flash.setAttribute("src", "model/assets/svg_6.svg");
                                list.push(flash);
                            }

                            if(c.obj[0].comments !== "") {
                                var p = document.createElement("p");
                                p.innerHTML = c.obj[0].comments;
                                comments.push(p);
                            }
                            list.forEach(function(a) { 
                                a.setAttribute("class", "icon");
                                pList.push(canvas.parentNode.appendChild(a));
                            });

                            comments.forEach(function(a) {
                                pComment.push(canvas.parentNode.appendChild(a))
                            })

                            $('p').remove();
                            $('#icons img.icon').remove();
                            pList.forEach(function(b) { 
                                icons.appendChild(b);
                            });

                            pComment.forEach(function(c) {
                                comm.appendChild(c);
                            })
                        }              
                    });
                };
            }

            $scope.init = function() {
                // Inizializzo l'area di disegno
                var canvas = $element[0];
                var ctx = canvas.getContext("2d");
                canvas.width = $window.innerWidth;
                canvas.height = 111*60;

                var data = $scope.json.data;
                var db_ = [], db = [];
                // Raggruppo per minuto
                for(var i=0; i<len; i+=step) {
                    var arr = [];
                    data.filter(function(a) {
                        if(i/60 === Math.floor(a.minute/60)) {
                            arr.push(a);
                        }
                    })
                   db_.push(arr);    
                }

                var exa = $scope.origin ? "#1879FF" : "#7CFF7C";

                // Aggrego le informazioni in un unico oggetto per min
                for(var i in db_) {
                    var init = {
                        "minute": 0,
                        "MD_relationship": 0,
                        "CJ_relationship": exa,
                        "PC_relationship": 0,
                        "cute_frequency": 0,
                        "cancellation": 0,
                        "flashback": 0,
                        "comments": ""
                    }
                    var obj = db_[i].reduce(function(a, b) {
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
                    db.push(obj);
                }
                // Avvio la renderizzazione
                $scope.render(canvas, ctx, db);
            }

             
        },
        link: function(s, e, a, c) {
            /*$document[0].body.onresize = function() {
                s.init();
            };*/

            s.$watch("json", function(a, b) {
                if(a) {
                    s.init();
                }  
            });
        }
    };
});