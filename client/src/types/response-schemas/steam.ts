export type SteamGame = {
  appid: string;
  name: string;
  install_dir: string;
  executable: string;
  images: Images;
};

export type Images = {
  library: string;
  libraryHero: string;
  logo: string;
  portrait: string;
};
