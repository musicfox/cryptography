// index.jsx

import React from "react";
import DisplayPiGif from "../components/DisplayPiGif";
import BoundChars from "../components/BoundChars";
import { encrypt } from "@musicfox/mfcrypt";

import { containerStyle, paragraphStyle } from "../styles/index.js";

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
  // encrypt the plaintext using your bytes key
  const encrypted = await encrypt(plaintext, passphrase, salt);
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
