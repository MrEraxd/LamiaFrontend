import { Loader } from '@googlemaps/js-api-loader';
import { sha256 } from 'js-sha256';

export interface IPlace {
  marker: google.maps.Marker | null;
  id: string | null;
  name: string;
  lat: number;
  lng: number;
  isOpen: boolean | null;
  vicinity: string;
}

export class GoogleMaps {
  private static instance: GoogleMaps;
  private googleApiInstance: typeof google.maps | any;
  private map: google.maps.Map | any;
  places: IPlace[];

  private constructor() {
    console.log('Creted google maps');
    this.places = [];
    this.init();
  }

  public static getInstance(): GoogleMaps {
    if (!GoogleMaps.instance) {
      GoogleMaps.instance = new GoogleMaps();
    }

    return GoogleMaps.instance;
  }

  private init() {
    console.log('Init');
    this.initLocalStorage();
    this.getGoogleApiInstance().then((google) => {
      this.googleApiInstance = google.maps;
      this.loadMap();
      this.loadPlacesFromLocalStorage();
    });
  }

  private async getGoogleApiInstance() {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      libraries: ['places'],
    });

    const google = await loader.load();

    return google;
  }

  private async loadMap() {
    const mapOptions = {
      center: {
        lat: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_CENTER_LAT as string),
        lng: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_CENTER_LNG as string),
      },
      zoom: parseFloat(import.meta.env.VITE_GOOGLE_MAPS_ZOOM as string),
      gestureHandling: 'cooperative',
    };

    this.map = new this.googleApiInstance.Map(
      document.querySelector('.google-maps') as HTMLElement,
      mapOptions
    );
  }

  loadNearbyPlaces() {
    const service = new this.googleApiInstance.places.PlacesService(this.map);

    const request = {
      location: {
        lat: 60.1692842,
        lng: 24.9274009,
      },
      radius: 20000,
      type: 'point_of_interest',
    };

    service.nearbySearch(
      request,
      (res: google.maps.places.PlaceResult[] | null) => {
        if (res === null) {
          return;
        }

        res.forEach((place) => {
          this.addPlace({
            marker: null,
            id: null,
            name: place.name,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
            isOpen: place.opening_hours?.open_now,
            vicinity: place.vicinity,
          } as IPlace);
        });
      }
    );
  }

  createMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
    return new this.googleApiInstance.Marker({
      position: position,
      map: this.map,
    });
  }

  addPlace(place: IPlace, addToLocalStorage = true) {
    const newPlace = {
      marker: this.createMarker({ lat: place.lat, lng: place.lng }),
      id: sha256((place.name || '') + place.lat + place.lng + place.vicinity),
      name: place.name || '',
      lat: place.lat || 0,
      lng: place.lng || 0,
      isOpen: place.isOpen,
      vicinity: place.vicinity || '',
    };

    const index = this.places
      .map((place) => {
        return place.id;
      })
      .indexOf(newPlace.id);

    if (index === -1) {
      this.places.unshift(newPlace);

      if (addToLocalStorage) {
        this.addPlaceToLocalStorage(newPlace);
      }

      return true;
    } else {
      newPlace.marker.setVisible(false);
      throw new Error('Place is in list');
    }
  }

  removeAllPlaces() {
    this.places.forEach((place) => {
      place.marker?.setVisible(false);
    });

    this.places.length = 0;
    this.createEmptyLocalStorageStructure();
  }

  removePlace(placeToRemove: IPlace) {
    const index = this.places.indexOf(placeToRemove);
    placeToRemove.marker?.setVisible(false);
    this.places.splice(index, 1);

    this.removePlaceFromLocalStorage(placeToRemove);
  }

  reloadPlaces() {
    if (this.places.length === 0) {
      return;
    }

    const poped = this.places.pop();
    this.places.push(poped as IPlace);
  }

  centerMap(lat: number, lng: number) {
    this.map.setCenter({
      lat: lat,
      lng: lng,
    });
  }

  addPlaceToLocalStorage(place: IPlace) {
    const localStoragePlaces = JSON.parse(localStorage.getItem('places') || '');
    const { marker, ...placeCopy } = place;
    localStoragePlaces.places.push(placeCopy);

    localStorage.setItem('places', JSON.stringify(localStoragePlaces));
  }

  removePlaceFromLocalStorage(placeToRemove: IPlace) {
    const localStoragePlaces = JSON.parse(localStorage.getItem('places') || '');

    const index = localStoragePlaces.places
      .map((place: IPlace) => {
        return place.id;
      })
      .indexOf(placeToRemove.id);

    localStoragePlaces.places.splice(index, 1);

    localStorage.setItem('places', JSON.stringify(localStoragePlaces));
  }

  loadPlacesFromLocalStorage() {
    const places = JSON.parse(localStorage.getItem('places') as string).places;

    places.forEach((place: IPlace) => {
      this.addPlace(place, false);
    });
  }

  initLocalStorage() {
    const checkLocalStorageStructure = () => {
      // Check if local storage is empty
      if (localStorage.getItem('places') === null ? true : false) {
        this.createEmptyLocalStorageStructure();
        return;
      }

      // Check if local storage is string
      if (typeof localStorage.getItem('places') !== 'string') {
        this.createEmptyLocalStorageStructure();
        return;
      }

      // Check if data is corrupted
      try {
        JSON.parse(localStorage.getItem('places') as string);
      } catch (e) {
        this.createEmptyLocalStorageStructure();
        return;
      }

      // Check if data contains places
      if (
        !Array.isArray(
          JSON.parse(localStorage.getItem('places') as string).places
        )
      ) {
        this.createEmptyLocalStorageStructure();
        return;
      }

      return true;
    };

    checkLocalStorageStructure();
  }

  createEmptyLocalStorageStructure() {
    localStorage.setItem(
      'places',
      JSON.stringify({
        places: [],
      })
    );
  }
}
