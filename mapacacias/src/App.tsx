import { Heading, Input, InputGroup, InputRightElement, Select } from "@chakra-ui/react";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { SearchIcon } from "@chakra-ui/icons";
function App() {
  return (
    <div className="container">
      <section className="menu">
        <Heading>Sitio de interes Acacias</Heading>
        <Select placeholder="Selecionar Categoria">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </section>
      <section className="map">
        <div className="search">
          <InputGroup>
            <Input placeholder="Buscar" backgroundColor="white" />
            <InputRightElement>
              <SearchIcon/>
            </InputRightElement>
          </InputGroup>
        </div>
        <MapContainer
          center={[3.9871, -73.7649]}
          zoom={16}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[3.9871, -73.7649]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </section>
    </div>
  );
}

export default App;
