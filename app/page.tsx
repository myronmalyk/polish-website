import VantaPolish from "./components/VantaPolish";

export default function Home() {
  // These mirror the design-time props exposed by the original Claude Design file.
  // Swap them to explore the built-in variants:
  //   emblemStyle: "rings" | "monogram" | "crest"
  //   heroImage:   "front" | "side"
  //   heroLayout:  "left"  | "center"
  return <VantaPolish emblemStyle="rings" heroImage="front" heroLayout="left" />;
}
