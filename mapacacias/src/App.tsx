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
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import "./App.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { SearchIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { Places } from "./models";
import { CategoriesService, PlacesCategoryService, PlacesDefaultService } from "./service";
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [categories, setCategories] = useState(Array<string>)
  const [places, setPlaces] = useState(Array<Places>)

  const getCategories = async () => {
    const response = await CategoriesService()
    console.log(categories)
    setCategories(response)
  }

  const getPlaces = async () => {
    const response = await PlacesDefaultService()
    setPlaces(response)
  }
  
  const getPlacesByCategory = async (category: string) => {
    const response = await PlacesCategoryService(category)
    setPlaces(response)
  }

  const updateCategories = (category: string) => {
    getPlacesByCategory(category)
  }

  useEffect(() => {
    getCategories()
    getPlaces()
  }, [])
  return (
    <div className="container">
      <section className="menu">
        <Heading>Sitio de interes Acacias</Heading>
        <Select 
          placeholder="Selecionar Categoria"
          onChange={(e) => updateCategories(e.target.value)}
        >
          {categories.map((x) => {return (
            <option key={"select"+x} value={x}>{x}</option>
          )})}
        </Select>
      </section>
      <section className="map">
        <div className="search">
          <InputGroup>
            <AutoComplete openOnFocus>
              <AutoCompleteInput variant="filled" />
              <AutoCompleteList>
                {countries.map((country, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={country}
                    textTransform="capitalize"
                    onClick={() => alert(cid)}
                  >
                    {country}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
            <InputRightElement>
              <SearchIcon />
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
          {places.map((x) => {
            return (
            <Marker
            key={"Marker"+x.numero}
            position={[Number(x.latitudn), Number(x.longitudw)]}
            eventHandlers={{ click: onOpen }}
            icon={icons["hoteles"]}
          ></Marker>
          )})}
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
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard all of your notes? 44 words will be
            deleted.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
