// index.jsx

import React from "react";
import DisplayPiGif from "../components/DisplayPiGif";
import { encrypt, createBytesKey } from "@musicfox/mfcrypt";
import { containerStyle, paragraphStyle } from "../styles/index.js";

/** Unecessary func to attempt a random cut off for the encrypted string
 * to display w/o css needs.
 *
 */
function BoundChars(props) {
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
export default function index(props) {
  return (
    <>
      <div style={containerStyle}>
        <h1 style={{ fontSize: "2em" }}>
          {" "}
          Encryption between node.js and Python.{" "}
        </h1>
        <p style={paragraphStyle}>
          <strong>{`Data to encrypt: `}</strong>
        </p>
        <p style={paragraphStyle}>{`${props.plaintext}`}</p>
        <p style={paragraphStyle}>
          <strong>{`Encrypted result: `}</strong>
        </p>
        <BoundChars text={props?.encrypted} />
        <p style={paragraphStyle}>
          <strong>{`Backend unencrypted result: `}</strong>
        </p>
        <p style={paragraphStyle}>{`${props?.result}`}</p>
        {props.result !== props.plaintext ? (
          <p
            style={paragraphStyle}
          >{`Decoded string is not equal to the ${props.plaintext}`}</p>
        ) : (
          <DisplayPiGif />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  // base url to python routes
  const baseUrl = "http://localhost:8080";
  // your shared (between JavaScript and Python) password string
  const passphrase = "a randomly generated string hash";
  // the unique, random shared (between JavaScript and Python) salt
  // for this encryption event
  const salt = "salt";
  // your text to encrypt
  const plaintext =
    "Trump fumbled COVID. Shhh! No one should know this. TOP SECRET!";
  // create your key in bytes
  const binKey = await createBytesKey(passphrase, salt);
  // encrypt the plaintext using your bytes key
  const encrypted = await encrypt(plaintext, binKey);
  // construct the url and hit the Python server to decrypt
  const url = new URL(
    `${baseUrl}/decrypt?data=${encodeURIComponent(encrypted)}`
  );
  const res = await fetch(url, {
    method: "POST",
  });
  let result = "";
  if (res.ok) {
    result = await res.text();
  }
  // send along the results of the call + other data
  return {
    props: {
      plaintext: plaintext,
      encrypted: encrypted,
      result: result,
    },
  };
}
