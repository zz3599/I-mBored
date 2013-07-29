$(document).ready(function(){
    var placesurl = 'http://api.citygridmedia.com/content/places/v2/search/latlon';
    var map, marker, currentLocation, markers = [], herewindow;
    var createInfoWindow = function(marker, data, type){
        var website = "No website", image = "No image<br>", offers = data.offers || 'No offers';
        if(data.website)
            website = "<div class='truncate'><a href='" + data.website + "'>" + data.website + "</a></div>";
        if(data.image) 
            image = "<img src='" + data.image  + "' height='100' width='100'>";
        google.maps.event.addListener(marker, 'click', function(){
            var infoWindow = new google.maps.InfoWindow({
                content: data.name + "<br>" + type + "<br>" + image + "<br><br>Website: " + website
            }).open(map, marker);
        });
        
    };
    navigator.geolocation.getCurrentPosition(function(pos){
        var lat = pos.coords.latitude, long = pos.coords.longitude;
        currentLocation = new google.maps.LatLng(lat, long);
        var mapOptions = {
            zoom : 15,
            center : currentLocation,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        marker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            title: "You're here",
            icon: 'green_MarkerH.png'
        });
        herewindow = new google.maps.InfoWindow({
            content: "You're here"
        }).open(map, marker);


        var query = placesurl + "?lat=" + lat + "&lon=" + long + "&radius=10&format=json&publisher=test&tag=1023";
        //fuck cell phone companies
        var ignores = {527: true, 528: true, 10487: true, 1425: true};
        $.ajax({
            url: query,
            dataType: "jsonp",
            contentType: "application/json",
            success: function(data){
                console.log(data);
                $.each(data.results.locations, function(i, e){
                    console.log(e.name);
                    var useless = false, type;
                    $.each(e.tags, function(ix, ex){
                        if(ex.id in ignores){
                            useless = true;
                        }
                        if(ex.primary){
                            type = ex.name;
                        }
                    });
                    if(useless) {
                        console.log('ignored');
                        return true;//equivalent of continue
                    }
                    var eventmarker = new google.maps.Marker({
                        position: new google.maps.LatLng(e.latitude, e.longitude),
                        map: map,
                        title: e.name + "(" + type + ")",
                        animation: google.maps.Animation.DROP
                    });
                    markers.push(eventmarker);
                    createInfoWindow(eventmarker, e, type);
                });

            }
        });
    });

	
});
