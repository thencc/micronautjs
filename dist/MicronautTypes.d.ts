import type { LogicSigAccount, Transaction, SuggestedParams, MultisigMetadata } from "algosdk";
import type { ApplicationStateSchema } from "algosdk/dist/types/client/v2/algod/models/types";
export type MicronautConfig = {
    nodeConfig?: {
        BASE_SERVER: string;
        INDEX_SERVER?: string;
        LEDGER: string;
        PORT: string;
        API_TOKEN: any;
    };
    disableLogs?: boolean;
};
export interface MicronautStateData {
    key: string;
    value: string | number | bigint;
    address: string;
}
export interface MicronautContractSchema {
    localInts: number;
    localBytes: number;
    globalInts: number;
    globalBytes: number;
}
export interface MicronautDeployArguments {
    tealApprovalCode: string;
    tealClearCode: string;
    appArgs: any[];
    schema: MicronautContractSchema;
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautUpdateAppArguments {
    appIndex: number;
    tealApprovalCode: string;
    tealClearCode: string;
    appArgs: any[];
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautDeleteAppArguments {
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautLsigDeployArguments extends MicronautDeployArguments {
    lsig: LogicSigAccount;
    noteText?: string;
}
export interface MicronautAppStateEncoded {
    key: string;
    value: {
        bytes: string;
        type: number;
        uint: number;
    };
}
export interface MicronautGetApplicationResponse {
    id: number;
    params: {
        "approval-program": string;
        "clear-state-program": string;
        creator: string;
        extraProgramPages?: number;
        "global-state"?: MicronautAppStateEncoded[];
        "global-state-schema"?: ApplicationStateSchema;
        "local-state-schema"?: ApplicationStateSchema;
    };
}
export interface MicronautAppState {
    index: number;
    hasState: boolean;
    creatorAddress: string;
    globals: MicronautStateData[];
    locals: MicronautStateData[];
}
export interface MicronautCallAppArguments {
    from?: string;
    appIndex: number;
    appArgs: any[];
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautLsigCallAppArguments extends MicronautCallAppArguments {
    lsig: LogicSigAccount;
}
export interface MicronautCreateAssetArguments {
    from?: string;
    assetName: string;
    symbol: string;
    metaBlock: string;
    decimals: number;
    amount: number;
    assetURL?: string;
    defaultFrozen?: boolean;
    assetMetadataHash?: string;
    clawback?: string;
    manager?: string;
    reserve?: string;
    freeze?: string;
    rekeyTo?: string;
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautDestroyAssetArguments {
    rekeyTo?: string;
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautSendAssetArguments {
    to: string;
    from?: string;
    assetIndex: number;
    amount: number | bigint;
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautLsigSendAssetArguments extends MicronautSendAssetArguments {
    lsig: LogicSigAccount;
}
export interface MicronautPaymentArguments {
    amount: number | bigint;
    to: string;
    from?: string;
    optionalFields?: MicronautTransactionFields;
}
export interface MicronautLsigPaymentArguments extends MicronautPaymentArguments {
    lsig: LogicSigAccount;
}
export interface MicronautTxnCallbacks {
    onSign(payload: any): void;
    onSend(payload: any): void;
    onConfirm(payload: any): void;
}
export type MicronautError = {
    message: string;
    rawError?: any;
};
export type MicronautTransactionStatus = {
    status: "success" | "fail" | "rejected";
    message: string;
    index?: number;
    txId: string;
    error?: Error;
    meta?: any;
    createdIndex?: number;
};
export type MicronautWallet = {
    address: string;
    mnemonic: string;
};
export type MicronautTransactionFields = {
    accounts?: string[];
    applications?: number[];
    assets?: number[];
    reKeyTo?: string;
    note?: string;
    closeRemainderTo?: string;
    manager?: string;
    freeze?: string;
    clawback?: string;
    reserve?: string;
    suggestedParams?: SuggestedParams;
};
export type MicronautAtomicTransaction = {
    transaction: Transaction;
    isLogigSig: boolean;
    lSig?: LogicSigAccount;
};
export type InkeySignTxnResponse = {
    success: boolean;
    reject?: boolean;
    error?: any;
    signedTxns?: Uint8Array[] | Uint8Array;
};
export type TxnForSigning = {
    txn: string;
    txnDecoded?: Transaction;
    isLogicSig?: boolean;
    isMultisig?: boolean;
    multisigMeta?: MultisigMetadata;
};
