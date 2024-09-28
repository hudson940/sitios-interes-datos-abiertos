import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  InputGroup,
  InputRightElement,
  List,
  ListIcon,
  ListItem,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import "./App.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { CheckIcon, SearchIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { Places } from "./models";
import {
  CategoriesService,
  PlacesCategoryService,
  PlacesDefaultService,
} from "./service";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from "@choc-ui/chakra-autocomplete";
import { Icon, LatLngExpression } from "leaflet";

interface Props {
  center: LatLngExpression;
  zoom: number;
}
const ChangeView = ({ center, zoom }: Props) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [categories, setCategories] = useState(Array<string>);
  const [places, setPlaces] = useState(Array<Places>);
  const [place, setPlace] = useState<Places>();
  const allPlaceRef = useRef<Array<Places>>([]);

  const [coor, setCoor] = useState<LatLngExpression>([3.9871, -73.7649]);
  const [zoom, setZoom] = useState(16);
  const getCategories = async () => {
    const response = await CategoriesService();
    console.log(categories);
    setCategories(response);
  };

  const getPlaces = async () => {
    const response = await PlacesDefaultService();
    allPlaceRef.current = [...response];
    setPlaces(response);
  };

  const getPlacesByCategory = async (category: string) => {
    const response = await PlacesCategoryService(category);
    setPlaces(response);
  };

  const updateCategories = (category: string) => {
    getPlacesByCategory(category);
    setZoom(16);
  };

  const selectSiteAutoComplete = (latitudn: number, longitudw: number) => {
    setCoor([latitudn, longitudw]);
    const place = allPlaceRef.current.filter(
      (p) => Number(p.latitudn) == latitudn && Number(p.longitudw) == longitudw
    );
    setPlaces([...place]);
    setZoom(100);
  };

  const showAllPlace = (text: string) => {
    if (text.length == 0) {
      setPlaces([...allPlaceRef.current]);
    }
  };

  const openDetailsPlace = (place: Places) => {
    setPlace(place);
    setCoor([Number(place.latitudn),Number(place.longitudw)])
    setZoom(100)
    setTimeout(() =>  onOpen(),500)
  };
  
  const normaliceText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  useEffect(() => {
    getCategories();
    getPlaces();
  }, []);



  return (
    <div className="container">
      <section className="menu">
        <Heading>Sitio de interes Acacias</Heading>
        <Select
          placeholder="Selecionar Categoria"
          onChange={(e) => updateCategories(e.target.value)}
        >
          {categories.map((x) => {
            return (
              <option key={"select" + x} value={x}>
                {x}
              </option>
            );
          })}
        </Select>
      </section>
      <section className="map">
        <div className="search">
          <InputGroup>
            <AutoComplete openOnFocus>
              <AutoCompleteInput
                variant="filled"
                onChange={(e) => showAllPlace(e.target.value)}
                onFocus={() => setPlaces([...allPlaceRef.current])}
              />
              <AutoCompleteList>
                {places.map((place, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={place.nombre}
                    textTransform="capitalize"
                    onClick={() =>
                      selectSiteAutoComplete(
                        Number(place.latitudn),
                        Number(place.longitudw)
                      )
                    }
                  >
                    {place.nombre}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
            <InputRightElement>
              <SearchIcon />
            </InputRightElement>
          </InputGroup>
        </div>
        <MapContainer center={coor} zoom={zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          {places.map((x,index) => {
            return (
              <Marker
                key={index}
                position={[Number(x.latitudn), Number(x.longitudw)]}
                eventHandlers={{ click: () => openDetailsPlace(x) }}
                icon={new Icon({
                  iconUrl: `${normaliceText(x?.categoria)}.png`,
                  iconSize: [40, 40], // size of the icon
                  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
                })}
              ></Marker>
            );
          })}
          <ChangeView center={coor} zoom={zoom} />
        </MapContainer>
      </section>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>{place?.nombre}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
             <p style={{marginBottom: 10}}>{place?.horarioatencion}</p>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                 <strong>Dirección</strong>:{place?.direccion}
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                <strong>Email</strong>:{place?.email ?? 'No hay dato'}
              </ListItem>
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                <strong>Whatsapp</strong>:{place?.whatsapp}
              </ListItem>
              {/* You can also use custom icons from react-icons */}
              <ListItem>
                <ListIcon as={CheckIcon} color="green.500" />
                <strong>Categoria</strong>: {place?.categoria}
              </ListItem>
            </List>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Aceptar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
