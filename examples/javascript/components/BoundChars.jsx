/** Unecessary func component to attempt a random cut off for the encrypted string
 * to display w/o css needs.
 *
 */
import { paragraphStyle } from "../styles/index";

export default function BoundChars(props) {
  const { text } = props;
  let result, supremum;
  let displayArray = [];
  const count = props?.characters ? props.characters : 40;
  for (let i = 0; i < text.length; i += count) {
    supremum = i + count;
    result = supremum > text.length ? text.slice(i) : text.slice(i, supremum);
    displayArray.push(
      <p
        style={{
          backgroundColor: "#000000",
          ...paragraphStyle,
          margin: "0",
          padding: ".41rem 0",
          justifyContent: "space-around",
        }}
        key={i}
      >
        <code style={{ color: "#999999", backgroundColor: "#000000" }}>
          {result}
        </code>
      </p>
    );
  }
  return (
    <span
      style={{ backgroundColor: "black" }}
      id="encrypted-token-display-chunks"
    >
      {displayArray}
    </span>
  );
}
