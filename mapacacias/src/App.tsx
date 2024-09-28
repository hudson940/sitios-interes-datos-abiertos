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
import { useRef } from "react";
import { icons } from "./Icons/icons-maps";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from "@choc-ui/chakra-autocomplete";
export interface Item {
  label: string;
  value: string;
}
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const countries = [
    "nigeria",
    "japan",
    "india",
    "united states",
    "south korea",
  ];

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
          <Marker
            position={[3.9871, -73.7649]}
            eventHandlers={{ click: onOpen }}
            icon={icons["hoteles"]}
          ></Marker>
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
