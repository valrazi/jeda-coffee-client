"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icon
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Fix marker issue by explicitly setting the icon
const customIcon = new L.Icon({
  iconUrl: "/markericon.png", // Ensure this file exists in /public folder
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor bottom center
  popupAnchor: [1, -34], // Popup above the marker
  shadowSize: [41, 41],
});

export default function MapComponent({ lat, lng, changeLocation }) {
  const [position, setPosition] = useState({ lat, lng });

  useEffect(() => {
    setPosition({ lat, lng });
  }, [lat, lng]);

  const handleDragEnd = (e) => {
    const newLat = e.target.getLatLng().lat;
    const newLng = e.target.getLatLng().lng;
    setPosition({ lat: newLat, lng: newLng });

    changeLocation({ lat: newLat, lng: newLng });
  };

  function ClickHandler({ setPosition, changeLocation }) {
    useMapEvents({
      click(e) {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        setPosition({ lat: newLat, lng: newLng });
  
        changeLocation({ lat: newLat, lng: newLng });
      },
    });
    return null;
  }
  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
         <ClickHandler setPosition={setPosition} changeLocation={changeLocation} />

        {/* Fixed Marker with Custom Icon */}
        <Marker eventHandlers={{dragend: handleDragEnd}} draggable={true} position={[position.lat, position.lng]} icon={customIcon}>
          <Popup>Latitude: {position.lat}, Longitude: {position.lng}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
