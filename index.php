<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Upreal</title>
    <link rel="stylesheet" href="/assets/css/global.min.css?v=<?=time();?>" media="screen" title="no title">
</head>
<body>
    <div id="app"></div>
    <script src="/assets/js/libs/jquery-3.1.0.min.js" charset="utf-8"></script>
    <script src="/assets/js/libs/jquery.cookie.js" charset="utf-8"></script>
    <script src="/assets/js/libs/microevent.js" charset="utf-8"></script>
    <script src="/assets/js/libs/dropzone.js" charset="utf-8"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDs36AVbmNXyHcvMEF0JY5pteca8adxg0"></script>
    <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
    <script src="http://connect.facebook.net/en_US/all.js"></script>
    <script>
        window.fbAsyncInit = function() {
            FB.init({appId: '253953341682110', status: true, cookie: true,
            xfbml: true});
        };
    </script>
    <script src="/assets/js/bundle.js?v=<?=time();?>"></script>
</body>
</html>
