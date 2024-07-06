export type SteamGameInfo = {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  dlc: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website: string;
  pc_requirements: Requirements;
  mac_requirements: Requirements;
  linux_requirements: Requirements;
  developers: string[];
  publishers: string[];
  packages: number[];
  package_groups: PackageGroup[];
  platforms: Platforms;
  categories: Category[];
  genres: Genre[];
  screenshots: Screenshot[];
  movies: Movie[];
  recommendations: Recommendations;
  achievements: Achievements;
  release_date: ReleaseDate;
  support_info: SupportInfo;
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: Ratings;
};

export type Achievements = {
  total: number;
  highlighted: Highlighted[];
};

export type Highlighted = {
  name: string;
  path: string;
};

export type Category = {
  id: number;
  description: string;
};

export type ContentDescriptors = {
  ids: number[];
  notes: string;
};

export type Genre = {
  id: string;
  description: string;
};

export type Requirements = {
  minimum: string;
  recommended: string;
};

export type Movie = {
  id: number;
  name: string;
  thumbnail: string;
  webm: Media;
  mp4: Media;
  highlight: boolean;
};

export type Media = {
  '480': string;
  max: string;
};

export type PackageGroup = {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: Sub[];
};

export type Sub = {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: number;
};

export type Platforms = {
  windows: boolean;
  mac: boolean;
  linux: boolean;
};

export type Ratings = {
  usk: Agcom;
  agcom: Agcom;
  cadpa: Cadpa;
  dejus: Agcom;
};

export type Agcom = {
  rating: string;
  descriptors: string;
};

export type Cadpa = {
  rating: string;
};

export type Recommendations = {
  total: number;
};

export type ReleaseDate = {
  coming_soon: boolean;
  date: string;
};

export type Screenshot = {
  id: number;
  path_thumbnail: string;
  path_full: string;
};

export type SupportInfo = {
  url: string;
  email: string;
};
