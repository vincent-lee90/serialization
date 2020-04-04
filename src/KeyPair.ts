import * as nacl from 'tweetnacl';
import { Convert } from './Convert';
import { Utility } from './Utility';

export class KeyPair {
  /**
 * Signs a data buffer with a key pair.
 * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
 * @param {Uint8Array} data The data to sign.
 * @returns {Uint8Array} The signature.
 */
  public static sign(keyPair, data: Uint8Array): Uint8Array {
    const secretKey = new Uint8Array(64);
    secretKey.set(keyPair.privateKey);
    secretKey.set(keyPair.publicKey, 32);
    return nacl.sign.detached(data, secretKey);
  }
  public static createKeyPairFromPrivateKeyString(privateKeyString: string) {
    const privateKey = Convert.hexToUint8(privateKeyString);
    if (Utility.Key_Size !== privateKey.length) {
      throw Error(`private key has unexpected size: ${privateKey.length}`);
    }
    const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
    return {
      privateKey,
      publicKey: keyPair.publicKey,
    };
  }
      /**
     * Verifies a signature.
     * @param {Uint8Array} publicKey The public key to use for verification.
     * @param {Uint8Array} data The data to verify.
     * @param {Uint8Array} signature The signature to verify.
     * @returns {boolean} true if the signature is verifiable, false otherwise.
     */
    public static verify(publicKey: Uint8Array, data: Uint8Array, signature: Uint8Array): boolean {
      return nacl.sign.detached.verify(data, signature, publicKey);
  }
}