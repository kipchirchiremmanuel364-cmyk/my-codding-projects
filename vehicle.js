let map;
let vehicleMarkers = [];
let vehicles = {
    1: { lat: 40.730610, lng: -73.935242, fuel: 100, health: 100, speed: 0.0005, isMoving: false, marker: null },
};

let fuelDisplay = document.getElementById('fuel1');
let healthDisplay = document.getElementById('health1');
let positionDisplay = document.getElementById('position1');
let statusDisplay = document.getElementById('status');

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.730610, lng: -73.935242 },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create vehicle markers
    Object.keys(vehicles).forEach((id) => {
        let vehicle = vehicles[id];
        let marker = new google.maps.Marker({
            position: { lat: vehicle.lat, lng: vehicle.lng },
            map: map,
            title: `Vehicle ${id}`,
            icon: {
                url: 'https://www.svgrepo.com/show/47719/car.svg',
                scaledSize: new google.maps.Size(30, 30),
            },
        });
        vehicle.marker = marker;
    });

    // Start and Stop Journey Button Listeners
    document.getElementById('startBtn').addEventListener('click', startJourney);
    document.getElementById('stopBtn').addEventListener('click', stopJourney);
}

function updateVehiclePosition(vehicleId) {
    let vehicle = vehicles[vehicleId];

    if (vehicle.fuel <= 0) {
        stopJourney();
        alert("Vehicle is out of fuel!");
        return;
    }

    if (vehicle.health <= 0) {
        stopJourney();
        alert("Vehicle is damaged!");
        return;
    }

    let marker = vehicle.marker;
    marker.setPosition({ lat: vehicle.lat, lng: vehicle.lng });

    // Update UI
    positionDisplay.textContent = `Position: (Lat: ${vehicle.lat.toFixed(6)}, Lng: ${vehicle.lng.toFixed(6)})`;
    fuelDisplay.textContent = `Fuel: ${vehicle.fuel.toFixed(2)}%`;
    healthDisplay.textContent = `Health: ${vehicle.health.toFixed(2)}%`;
}

function moveVehicle(vehicleId, direction) {
    let vehicle = vehicles[vehicleId];

    if (!vehicle.isMoving) return; // Prevent movement if not active

    switch (direction) {
        case 'up':
            vehicle.lat += vehicle.speed;
            break;
        case 'down':
            vehicle.lat -= vehicle.speed;
            break;
        case 'left':
            vehicle.lng -= vehicle.speed;
            break;
        case 'right':
            vehicle.lng += vehicle.speed;
            break;
    }

    vehicle.fuel -= 0.1; // Decrease fuel
    vehicle.health -= 0.05; // Decrease health due to wear/tear

    // Update position
    updateVehiclePosition(vehicleId);
}

function startJourney() {
    let vehicle = vehicles[1];
    vehicle.isMoving = true;
    statusDisplay.textContent = "Status: Moving";

    // Simulate vehicle movement every second
    setInterval(() => {
        if (vehicle.isMoving) {
            moveVehicle(1, 'right'); // Example: Moving right
        }
    }, 1000);
}

function stopJourney() {
    let vehicle = vehicles[1];
    vehicle.isMoving = false;
    statusDisplay.textContent = "Status: Stopped";
}

// Example of a collision detection method
function checkForCollisions() {
    let vehicle1 = vehicles[1];
    let vehicle2 = vehicles[2]; // Assuming you have a second vehicle
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
        vehicle1.marker.getPosition(), vehicle2.marker.getPosition()
    );

    if (distance < 10) { // Collision threshold
        alert("Collision detected! Vehicles are too close.");
        // Handle collision (stop movement, reduce health, etc.)
    }
}

// Use Directions API to create routes for vehicles
function setRoute(vehicleId, startLat, startLng, endLat, endLng) {
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    let request = {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        }
    });
}

// Example route for vehicle 1
setRoute(1, 40.730610, -73.935242, 40.740610, -73.925242);
