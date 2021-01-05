"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.createBytesKey=createBytesKey;exports.encrypt=encrypt;exports.decrypt=decrypt;var _cryptoJs=_interopRequireDefault(require("crypto-js"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}async function encrypt(data,secretKeyBytes){const iv=_cryptoJs.default.enc.Hex.parse(secretKeyBytes.toString().slice(0,32));const key=_cryptoJs.default.enc.Hex.parse(secretKeyBytes.toString().slice(32,96));if(isNotString(data)){return _cryptoJs.default.AES.encrypt(JSON.stringify(data),key,{iv:iv}).toString()}else return _cryptoJs.default.AES.encrypt(data,key,{iv:iv}).toString()}async function decrypt(data,secretKeyBytes,typeHint="string"){const iv=_cryptoJs.default.enc.Hex.parse(secretKeyBytes.toString().slice(0,32));const key=_cryptoJs.default.enc.Hex.parse(secretKeyBytes.toString().slice(32,96));if(typeHint!=="string"){return JSON.parse(_cryptoJs.default.AES.decrypt(data,key,{iv:iv}).toString(_cryptoJs.default.enc.Utf8))}else{return _cryptoJs.default.AES.decrypt(data,key,{iv:iv}).toString(_cryptoJs.default.enc.Utf8)}}async function createBytesKey(passphrase,salt,iterations=128){return _cryptoJs.default.PBKDF2(passphrase,salt,{keySize:48,iterations:iterations})}function isNotString(data){return typeof data!=="string"}