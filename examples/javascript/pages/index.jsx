// index.jsx

import React from "react";
import { encrypt, createBytesKey } from "../../../src/javascript/mfcrypt";

export default function index(props) {
  const paragraphStyle = {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "1em",
    fontWeight: "normal",
    margin: ".41em 0",
    textAlign: "left",
  };
  const containerStyle = {
    wordWrap: "break-word",
    textAlign: "center",
    margin: "5em 5em 5em 5em",
    padding: "2em 6em ",
    backgroundColor: "#e9e9e9",
    flexWrap: "true",
  };
  const imgStyle = {
    padding: "3rem 0",
    width: "100%",
  };
  const isEqual = () => {
    const BLOCK_SIZE = 16;
    return props?.result.slice(BLOCK_SIZE).trim() === props.plaintext;
  };
  function DisplayImage() {
    return isEqual() ? (
      <>
        <img
          src="/images/crypto_example_Pi-unrolled-720.gif"
          style={imgStyle}
        />
        <span>
          <small style={{ textDecoration: "italic" }}>
            Seeing a sweet short film about {`\u03C0`}? It worked! Otherwise you
            would be presented with a glorious failure message.
          </small>
        </span>
      </>
    ) : (
      <p style={paragraphStyle}>{`Not equal ${isEqual()}`}</p>
    );
  }
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
        <p style={paragraphStyle}>{`${props?.result.slice(16)}`}</p>
        <DisplayImage />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const baseUrl = "http://localhost:8080";
  const passphrase = "a randomly generated string hash";
  const salt = "salt";
  const plaintext =
    "Some type of secret. Trump fumbled COVID. Shhh! No one should know this. TOP SECRET!";
  const binKey = await createBytesKey(passphrase, salt);
  const encrypted = await encrypt(plaintext, binKey);
  const res = await fetch(`${baseUrl}/decrypt?data=${encrypted}`, {
    method: "POST",
  });
  let result;
  if (res.ok) {
    result = await res.text();
  }
  return {
    props: {
      plaintext: plaintext,
      encrypted: encrypted,
      result: result,
    },
  };
}
