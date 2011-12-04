navigator.geolocation.getCurrentPosition(function (location) {
	var p1from = new LatLon(Geo.parseDMS(location.coords.latitude), Geo.parseDMS(location.coords.longitude));
	var p2to = new LatLon(Geo.parseDMS(f.lat2.value), Geo.parseDMS(f.lon2.value));
	var dist = p1from.distanceTo(p2to));			// in km                                             
	var brng = p1from.bearingTo(p2to);            	// in degrees clockwise from north
	alert("you are "+dist+"km from your destination, bearing: "+brng+" degrees");
});



