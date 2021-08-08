import Image from "next/image";
import { imgStyle } from "../styles/index";

/** Display the awesome pi wheel gif.*/
export default function DisplayImage() {
  return (
    <>
      <Image
        src="/images/crypto_example_Pi-unrolled-720.gif"
        style={imgStyle}
        height="300"
        width="1000"
      />
      <div>
        <small style={{ fontStyle: "italic" }}>
          Seeing a sweet short film about {`\u03C0`}? It worked! Otherwise you
          would be presented with a glorious failure message.
        </small>
      </div>
    </>
  );
}
