angular.module('plunker').controller('MainCtrl', ['$scope', '$http', '$window', '$element', function($scope, $http, $window, $element) {

  $scope.init = function() {
    $http.get('./menu.json').then(function(data) {
      $scope.contentMenu = data.data;
    })

    $http.get('./chronological_data.json').then(function(data) {
      $scope.orderedResult = data;
    });

    $http.get('./reconstructed_data.json').then(function(data) {
      $scope.reconResult = data;
    });

    $scope.fade();
  }

  $scope.redirect = function(section) {
    var e = document.getElementById(section);
    var rect = e.getBoundingClientRect();
    $window.scrollTo({
      top: rect.y-50 + $window.pageYOffset,
      left: 0,
      behavior: "smooth",
    });
  }

  $scope.fade = function() {
    var els = document.querySelectorAll('.content');
    document.addEventListener('scroll', function() {
      var interval = els[els.length-1].offsetTop;
      for(let i=0; i<els.length; i++) {
        let x = $window.pageYOffset / (interval - 1) * 2 * Math.PI;
        let opacity = Math.cos(5*x/2-(els[i].offsetTop)/2)*100;
        els[i].style.opacity = opacity + "%";
      }   
    })
  }

  $scope.img = function(e, index) {
    var imgs = ["clem", "joel", "patr", "mary", "dott"];
    var img = document.createElement("img");
    var src = "model/assets/svg_" + index + ".svg";
    img.setAttribute("src", src);
    img.setAttribute("class", "over");
    $("img").remove();
    var el = document.getElementById(imgs[index-1]);
    var rect = el.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    w = rect.width, h = rect.height;
    xx = e.clientX, yy = e.clientY;
    if(xx > rect.left && xx < rect.left + w && yy > rect.top && yy < rect.top + h) {
      img.style.top = y +"px";
      img.style.left = x + "px";
      el.appendChild(img);
    } else {
      $("img").remove();
    }
    
    
  }


  $scope.init();
  
}]);