/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NetworkType } from "./NetworkType";
import { Address } from "./Address";
import { Convert } from "./Convert";
import { RawAddress } from "./format";
import { NamespaceId } from "./NamespaceId";


/**
 * @internal
 */
export class UnresolvedMapping {
    public static toUnresolvedAddressBytes(unresolvedAddress: Address, networkType: NetworkType): Uint8Array {
        if (unresolvedAddress instanceof NamespaceId) {
            // received hexadecimal notation of namespaceId (alias)
            return RawAddress.aliasToRecipient(Convert.hexToUint8((unresolvedAddress as NamespaceId).toHex()), networkType);
        } else {
            // received recipient address
            return RawAddress.stringToAddress((unresolvedAddress as Address).plain());
        }
    }
}
