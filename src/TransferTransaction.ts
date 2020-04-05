import {
  AmountDto,
  EmbeddedTransactionBuilder,
  EmbeddedTransferTransactionBuilder,
  GeneratorUtils,
  KeyDto,
  SignatureDto,
  TimestampDto,
  TransferTransactionBuilder,
  UnresolvedAddressDto,
  UnresolvedMosaicBuilder,
  UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Transaction } from './Transaction';
import { TransactionType } from './TransactionType';
import { UnresolvedMapping } from './UnresolvedMapping';
import { NetworkType } from './NetworkType';
import { Deadline } from './Deadline';
import { UInt64 } from './UInt64';
import { Address } from './Address';
import { MessageType } from './MessageType';
import * as Long from 'long';
import { Convert } from './Convert';
import { TransactionInfo } from './TransactionInfo';
import { PublicAccount } from './PublicAccount';
import { Message } from './Message';
import { Mosaic } from './Mosaic';
import { NamespaceId } from './NamespaceId';
import { TransactionVersion } from './TransactionVersion';

export class TransferTransaction extends Transaction {
  constructor(networkType?: NetworkType,
    version?: number,
    deadline?: Deadline,
    maxFee?: UInt64,
    /**
     * The address of the recipient address.
     */
    public readonly recipientAddress?: Address | NamespaceId,
    /**
     * The array of Mosaic objects.
     */
    public readonly mosaics?: Mosaic[],
    /**
     * The transaction message of 2048 characters.
     */
    public readonly message?: Message,
    signature?: string,
    signer?: PublicAccount,
    transactionInfo?: TransactionInfo) {
    super(TransactionType.TRANSFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    this.validate();
  }
  public static create(deadline: Deadline,
    recipientAddress: Address | NamespaceId,
    mosaics: Mosaic[],
    message: Message,
    networkType: NetworkType,
    maxFee: UInt64 = new UInt64([0, 0])): TransferTransaction {
    return new TransferTransaction(networkType,
      TransactionVersion.TRANSFER,
      deadline,
      maxFee,
      recipientAddress,
      mosaics,
      message);
  }




  protected generateBytes(): Uint8Array {
    const signerBuffer = new Uint8Array(32);
    const signatureBuffer = new Uint8Array(64);

    const transactionBuilder = new TransferTransactionBuilder(
      new SignatureDto(signatureBuffer),
      new KeyDto(signerBuffer),
      this.versionToDTO(),
      this.networkType.valueOf(),
      TransactionType.TRANSFER.valueOf(),
      new AmountDto(this.maxFee.toDTO()),
      new TimestampDto(this.deadline.toDTO()),
      new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.networkType)),
      this.sortMosaics().map((mosaic) => {
        return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()),
          new AmountDto(mosaic.amount.toDTO()));
      }),
      this.getMessageBuffer(),
    );
    return transactionBuilder.serialize();
  }

  /**
   * Return sorted mosaic arrays
   * @internal
   * @returns {Mosaic[]}
   */
  public sortMosaics(): Mosaic[] {
    return this.mosaics.sort((a, b) => {
      const long_a = Long.fromBits(a.id.id.lower, a.id.id.higher, true);
      const long_b = Long.fromBits(b.id.id.lower, b.id.id.higher, true);
      return long_a.compare(long_b);
    });
  }


  /**
 * Validate Transfer transaction creation with provided message
 * @internal
 */
  protected validate() {
    if (this.message.type === MessageType.PersistentHarvestingDelegationMessage) {
      if (this.mosaics.length > 0) {
        throw new Error('PersistentDelegationRequestTransaction should be created without Mosaic');
      } else if (!/^[0-9a-fA-F]{208}$/.test(this.message.payload)) {
        throw new Error('PersistentDelegationRequestTransaction message is invalid');
      }
    }
  }
  /**
  * Return message buffer
  * @internal
  * @returns {Uint8Array}
  */
  public getMessageBuffer(): Uint8Array {
    const messgeHex = this.message.type === MessageType.PersistentHarvestingDelegationMessage ?
      this.message.payload : Convert.utf8ToHex(this.message.payload);
    const payloadBuffer = Convert.hexToUint8(messgeHex);
    const typeBuffer = GeneratorUtils.uintToBuffer(this.message.type, 1);
    return this.message.type === MessageType.PersistentHarvestingDelegationMessage ?
      payloadBuffer : GeneratorUtils.concatTypedArrays(typeBuffer, payloadBuffer);
  }
}

