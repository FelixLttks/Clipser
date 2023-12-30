import ReactGA from "react-ga4";

export const initGA = (id: string) => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(id);
  }
};
