// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .constant('ApiEndpoint', {
    url: '/api'
  })
  .controller('MyCtrl', ['$scope', '$timeout', 'MyService', function ($scope, $timeout, MyService) {

    $scope.data = {
      showDelete: false
    };
    $scope.pageNo = 2;
    $scope.hasmore = true;

    $scope.edit = function (item) {
      alert('Edit Item: ' + item.id);
    };
    $scope.share = function (item) {
      alert('Share Item: ' + item.id);
    };

    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function (item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.onSearch = function () {
      MyService.queryProducts({
        code: $scope.params,
        name: $scope.params,
        barCode: $scope.params,
        pageNo: $scope.pageNo
      }).then(function (data) {
        $scope.items = data.content;
      });
    };
    //下拉刷新
    $scope.doRefresh = function () {
      MyService.queryProducts({
        code: $scope.params,
        name: $scope.params,
        barCode: $scope.params
      }).then(function (data) {
        $scope.items = data.content;
        $scope.pageNo = 2;
        $scope.hasmore = true;
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    //更多
    $scope.loadMore = function () {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $timeout(function () {
        if (!$scope.hasmore) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          return;
        }
        MyService.queryProducts({
          code: $scope.params,
          name: $scope.params,
          barCode: $scope.params,
          pageNo: $scope.pageNo
        }).then(function (data) {
          for (var i = 0; i < data.content.length; i++) {
            $scope.items.push(data.content[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.pageNo++;
          $scope.hasmore = data.totalPages > $scope.pageNo;
          console.log('totalPages: ', data.totalPages);
          console.log('next pageNo: ', $scope.pageNo);
          console.log('$scope.hasmore: ', $scope.hasmore);
        });
      }, 1000);
    };
    $scope.moreDataCanBeLoaded = function(){
      return $scope.hasmore;
    }

    MyService.queryProducts({}).then(function (data) {
      $scope.items = data.content;
    });

  }])
  .service('MyService', ['$http', '$q', 'ApiEndpoint', function ($http, $q, ApiEndpoint) {
    return {
      queryProducts: function (data) {
        var deferred = $q.defer();
        var url = ApiEndpoint.url + "/products";
        $http({
          method: 'GET',
          url: url,
          params: data
        }).success(
          function (data, status, header, config) {
            deferred.resolve(data);
          });
        return deferred.promise;
      }
    }
  }]);
