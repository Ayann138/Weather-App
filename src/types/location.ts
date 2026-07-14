export type SelectedLocation = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
};

export type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
};

export type NominatimSearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
  address?: NominatimAddress;
};

export type LocationSearchProps = {
  onSelect: (location: SelectedLocation) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
};
