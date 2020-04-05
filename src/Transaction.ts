import { Convert } from "./Convert";
import { KeyPair } from "./KeyPair";
import { TransferTransaction } from "./TransferTransaction";
import { TransactionType } from "./TransactionType";
import { NetworkType } from "./NetworkType";
import { Deadline } from "./Deadline";
import { UInt64 } from "./UInt64";
import { TransactionInfo } from "./TransactionInfo";
import { PublicAccount } from "./PublicAccount";

export abstract class Transaction {
  /**
 * @constructor
 * @param type
 * @param networkType
 * @param version
 * @param deadline
 * @param maxFee
 * @param signature
 * @param signer
 * @param transactionInfo
 */
  constructor(/**
      * The transaction type.
      */
    public readonly type?: number,
    /**
     * The network type.
     */
    public readonly networkType?: NetworkType,
    /**
     * The transaction version number.
     */
    public readonly version?: number,
    /**
     * The deadline to include the transaction.
     */
    public readonly deadline?: Deadline,
    /**
     * A sender of a transaction must specify during the transaction definition a max_fee,
     * meaning the maximum fee the account allows to spend for this transaction.
     */
    public readonly maxFee?: UInt64,
    /**
     * The transaction signature (missing if part of an aggregate transaction).
     */
    public readonly signature?: string,
    /**
     * The account of the transaction creator.
     */
    public readonly signer?: PublicAccount,
    /**
     * Transactions meta data object contains additional information about the transaction.
     */
    public readonly transactionInfo?: TransactionInfo) {
  }
  serialize(account, generationHash?) {
    const generationHashBytes = Array.from(Convert.hexToUint8(generationHash));
    const byteBuffer = Array.from(this.generateBytes());
    const signingBytes = this.getSigningBytes(byteBuffer, generationHashBytes);
    const keyPairEncoded = KeyPair.createKeyPairFromPrivateKeyString(account.privateKey);
    const signature = Array.from(KeyPair.sign(keyPairEncoded, new Uint8Array(signingBytes)));


    const signedTransactionBuffer = byteBuffer
      .splice(0, 8)
      .concat(signature)
      .concat(Array.from(keyPairEncoded.publicKey))
      .concat(Array.from(new Uint8Array(4)))
      .concat(byteBuffer
        .splice(64 + 32 + 4, byteBuffer.length));
    const payload = Convert.uint8ToHex(signedTransactionBuffer);
    return payload
  }
  /**
 * Generate signing bytes
 * @param payloadBytes Payload buffer
 * @param generationHashBytes GenerationHash buffer
 */
  public getSigningBytes(payloadBytes: number[], generationHashBytes: number[]) {
    const byteBufferWithoutHeader = payloadBytes.slice(4 + 64 + 32 + 8);
    if (this.type === TransactionType.AGGREGATE_BONDED || this.type === TransactionType.AGGREGATE_COMPLETE) {
      return generationHashBytes.concat(byteBufferWithoutHeader.slice(0, 52));
    } else {
      return generationHashBytes.concat(byteBufferWithoutHeader);
    }
  }
  public versionToDTO(): number {
    return (this.networkType << 8) + this.version;
  }
  /**
      * @internal
      */
  protected abstract generateBytes(): Uint8Array;
}


