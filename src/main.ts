import { TransferTransaction } from "./TransferTransaction"
import { Deadline } from "./Deadline"
import { LocalDateTime} from "js-joda"
import { Address } from "./Address"
import { Mosaic } from "./Mosaic"
import { UInt64 } from "./UInt64"
import { Message } from "./Message"
import { NetworkType } from "./NetworkType"
import { Convert } from "./Convert"
import { MosaicId } from "./MosaicId"

const transactionJson = {
  "type": 16724,
  "network": 152,
  "version": 38913,
  "maxFee": "50000",
  "deadline": "12476333688",
  "signature": "",
  "recipientAddress": {
    "address": "TCOVEND5NFSWP33YDUKRTEELH7Y3ILOHX7GV23FV",
    "networkType": 152
  },
  "mosaics": [
    {
      "amount": "0",
      "id": "747B276C30626442"
    }
  ],
  "message": {
    "type": 0,
    "payload": ""
  }
}
const account = {
  "address": {
    "address": "TCOVEND5NFSWP33YDUKRTEELH7Y3ILOHX7GV23FV",
    "networkType": 152
  },
  "keyPair": {
    "privateKey": {
      "0": 85,
      "1": 181,
      "2": 3,
      "3": 205,
      "4": 236,
      "5": 90,
      "6": 10,
      "7": 135,
      "8": 213,
      "9": 39,
      "10": 23,
      "11": 213,
      "12": 43,
      "13": 39,
      "14": 244,
      "15": 227,
      "16": 75,
      "17": 219,
      "18": 193,
      "19": 156,
      "20": 143,
      "21": 180,
      "22": 177,
      "23": 72,
      "24": 95,
      "25": 58,
      "26": 164,
      "27": 143,
      "28": 216,
      "29": 81,
      "30": 254,
      "31": 87
    },
    "publicKey": {
      "0": 87,
      "1": 95,
      "2": 202,
      "3": 173,
      "4": 36,
      "5": 87,
      "6": 201,
      "7": 134,
      "8": 207,
      "9": 79,
      "10": 168,
      "11": 153,
      "12": 151,
      "13": 58,
      "14": 95,
      "15": 146,
      "16": 8,
      "17": 111,
      "18": 221,
      "19": 99,
      "20": 120,
      "21": 7,
      "22": 121,
      "23": 196,
      "24": 171,
      "25": 16,
      "26": 19,
      "27": 155,
      "28": 84,
      "29": 52,
      "30": 193,
      "31": 65
    }
  }
}
const isObject = (prop) => {
  return typeof prop === 'object'
}
let x = 1;
//initDeadline
let deadline=new Deadline(LocalDateTime.now());
//initRecipientAddress
let recipientAddress=new Address(transactionJson.recipientAddress.address,transactionJson.recipientAddress.networkType)
//initMosaics
let mosaics:Mosaic[]=[];
transactionJson.mosaics.forEach((mosaic)=>{
  const mosaicId=new MosaicId(mosaic.id)
  const _mosaic=new Mosaic(mosaicId,UInt64.fromNumericString(mosaic.amount));
  mosaics.push(_mosaic)
})
let message:Message={
  type:transactionJson.message.type,
  payload:transactionJson.message.payload,
  toDTO:()=>{
    return {
      type:transactionJson.message.type,
      payload:transactionJson.message.payload
    }
  }
}
let networkType=152
let generationHash='44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C'
let transferTransaction = TransferTransaction.create(deadline,recipientAddress,mosaics,message,networkType)
const payload = transferTransaction.serialize(account,generationHash)
console.log(payload)
let _transaction=TransferTransaction.createFromPayload(payload,false)
console.log(_transaction)
 