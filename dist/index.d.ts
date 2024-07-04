import { Buffer } from 'buffer';
import algosdk, { Account as AlgosdkAccount, Algodv2, Indexer, LogicSigAccount, Transaction, Account } from 'algosdk';
import type { MicronautConfig, MicronautWallet, MicronautTransactionStatus, MicronautAtomicTransaction, MicronautTransactionFields, MicronautAppState, MicronautStateData, MicronautError, MicronautTxnCallbacks, MicronautCreateAssetArguments, MicronautSendAssetArguments, MicronautCallAppArguments, MicronautDeployArguments, MicronautLsigDeployArguments, MicronautLsigCallAppArguments, MicronautLsigSendAssetArguments, MicronautPaymentArguments, MicronautLsigPaymentArguments, MicronautUpdateAppArguments, MicronautAppStateEncoded } from './MicronautTypes';
export * from './MicronautTypes';
export type AlgoTxn = Transaction;
export declare class Micronaut {
    algodClient: Algodv2;
    indexerClient: undefined | Indexer;
    nodeConfig: {
        BASE_SERVER: string;
        INDEX_SERVER?: string;
        LEDGER: string;
        PORT: string;
        API_TOKEN: any;
    };
    libConfig: {
        disableLogs: boolean;
    };
    sdk: typeof algosdk;
    mnemonic: null | string;
    address: null | string;
    account: null | Account;
    /**
     * Instantiates Micronaut.js.
     *
     * @example
     * Usage:
     *
     * ```js
     * import { Micronaut } from '@thencc/micronautjs';
     * const Micronaut = new Micronaut({
     * 		nodeConfig: {
     *	 		BASE_SERVER: 'https://testnet-algorand.api.purestake.io/ps2',
     *	 		INDEX_SERVER: 'https://testnet-algorand.api.purestake.io/idx2'
     *	 		LEDGER: 'TestNet',
     *	 		PORT: '',
     *	 		API_TOKEN: { 'X-API-Key': 'YOUR_API_TOKEN' }
     * 		}
     * });
     * ```
     *
     * @param config config object
     */
    constructor(config?: MicronautConfig);
    setLibConfig(config?: MicronautConfig): void;
    /**
     * checks if config obj is valid for use
     * @param nodeConfig Micronaut config for network + signing mode
     * @returns boolean. true is good.
     */
    isValidNodeConfig(nodeConfig?: MicronautConfig['nodeConfig']): boolean;
    /**
     * sets config for use (new algod, indexerClient, etc)
     * @param nodeConfig Micronaut config for network + signing mode
     * 		- will throw Error if config is lousy
     */
    setNodeConfig(nodeConfig?: MicronautConfig['nodeConfig'] | 'mainnet' | 'testnet'): void;
    /**
     * @returns nodeConfig object or `false` if no nodeConfig is set
     */
    getNodeConfig(): MicronautConfig['nodeConfig'] | boolean;
    /**
     * Checks status of Algorand network
     * @returns Promise resolving to status of Algorand network
     */
    checkStatus(): Promise<any | MicronautError>;
    /**
     * Connects an account from mnemonic phrase
     * @returns void
     */
    connectAccount(mnemonic: string): Promise<void>;
    /**
     * General purpose method to await transaction confirmation
     * @param txId a string id of the transacion you want to watch
     * @param limitDelta how many rounds to wait, defaults to 50
     * @param log set to true if you'd like to see "waiting for confirmation" log messages
     */
    waitForConfirmation(txId: string, limitDelta?: number, log?: boolean): Promise<MicronautTransactionStatus>;
    /**
     * Creates a LogicSig from a base64 program string.  Note that this method does not COMPILE
     * the program, just builds an LSig from an already compiled base64 result!
     * @param base64ProgramString
     * @returns an algosdk LogicSigAccount
     */
    generateLogicSig(base64ProgramString: string): LogicSigAccount;
    atomicOptInAsset(assetIndex: number, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautAtomicTransaction>;
    /**
     * Opt-in the current account for the a token or NFT Asset.
     * @param assetIndex number of asset to opt-in to
     * @param callbacks `MicronautTxnCallbacks`, passed to {@link sendTransaction}
     * @returns Promise resolving to confirmed transaction or error
     */
    optInAsset(assetIndex: number, callbacks?: MicronautTxnCallbacks, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautTransactionStatus>;
    /**
     * You can be opted into an asset but still have a zero balance. Use this call
     * for cases where you just need to know the address's opt-in state
     * @param args object containing `account` and `assetId` properties
     * @returns boolean true if account holds asset
     */
    isOptedIntoAsset(args: {
        account: string;
        assetId: number;
    }): Promise<boolean>;
    /**
     * Sync function that returns a correctly-encoded argument array for
     * an algo transaction
     * @param args must be an any[] array, as it will often need to be
     * a mix of strings and numbers. Valid types are: string, number, and bigint
     * @returns a Uint8Array of encoded arguments
     */
    encodeArguments(args: any[]): Uint8Array[];
    /**
     * Create asset transaction
     * @param args : MicronautCreateAssetArguments obj must contain: `assetName`, `symbol`, `decimals`, `amount`.
     * @returns atomic txn to create asset
     */
    atomicCreateAsset(args: MicronautCreateAssetArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Create asset
     * @param args MicronautCreateAssetArguments. Must pass `assetName`, `symbol`, `decimals`, `amount`.
     * @param callbacks MicronautTxnCallbacks
     * @returns asset index
     */
    createAsset(args: MicronautCreateAssetArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    atomicDeleteAsset(assetId: number, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautAtomicTransaction>;
    /**
     * Deletes asset
     * @param assetId Index of the ASA to delete
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to confirmed transaction or error
     */
    deleteAsset(assetId: number, callbacks?: MicronautTxnCallbacks, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautTransactionStatus>;
    /**
     * Creates send asset transaction.
     *
     * IMPORTANT: Before you can call this, the target account has to "opt-in"
     * to the ASA index.  You can't just send ASAs to people blind!
     *
     * @param args - object containing `to`, `assetIndex`, and `amount` properties
     * @returns Promise resolving to `MicronautAtomicTransaction`
     */
    atomicSendAsset(args: MicronautSendAssetArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Sends asset to an address.
     *
     * IMPORTANT: Before you can call this, the target account has to "opt-in"
     * to the ASA index.  You can't just send ASAs to people blind!
     *
     * @param args - object containing `to`, `assetIndex`, and `amount` properties
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to confirmed transaction or error
     */
    sendAsset(args: MicronautSendAssetArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Get info about an asset
     * @param assetIndex
     * @returns
     */
    getAssetInfo(assetIndex: number): Promise<any>;
    /**
     * Creates transaction to opt into an app
     * @param args MicronautCallAppArgs
     * @returns MicronautAtomicTransaction
     */
    atomicOptInApp(args: MicronautCallAppArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Opt-in the current account for an app.
     * @param args Object containing `appIndex`, `appArgs`, and `optionalFields`
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to confirmed transaction or error
     */
    optInApp(args: MicronautCallAppArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Returns atomic transaction that deletes application
     * @param appIndex - ID of application
     * @returns Promise resolving to atomic transaction that deletes application
     */
    atomicDeleteApp(appIndex: number, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautAtomicTransaction>;
    /**
     * Deletes an application from the blockchain
     * @param appIndex - ID of application
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to confirmed transaction or error
     */
    deleteApp(appIndex: number, callbacks?: MicronautTxnCallbacks, optionalTxnArgs?: MicronautTransactionFields): Promise<MicronautTransactionStatus>;
    atomicCallApp(args: MicronautCallAppArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Call a "method" on a stateful contract.  In TEAL, you're really giving
     * an argument which branches to a specific place and reads the other args
     * @param args Object containing `appIndex`, `appArgs`, and `optionalFields` properties
     */
    callApp(args: MicronautCallAppArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    atomicCallAppWithLSig(args: MicronautLsigCallAppArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Returns an atomic transaction that closes out the user's local state in an application.
     * The opposite of {@link atomicOptInApp}.
     * @param args Object containing `appIndex`, `appArgs`, and `optionalFields` properties
     * @returns Promise resolving to atomic transaction
     */
    atomicCloseOutApp(args: MicronautCallAppArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Closes out the user's local state in an application.
     * The opposite of {@link optInApp}.
     * @param args Object containing `appIndex`, `appArgs`, and `optionalFields` properties
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to atomic transaction
     */
    closeOutApp(args: MicronautCallAppArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Get an application's escrow account
     * @param appId - ID of application
     * @returns Escrow account address as string
     */
    getAppEscrowAccount(appId: number | bigint): string;
    /**
     * Get info about an application (globals, locals, creator address, index)
     *
     * @param appId - ID of application
     * @returns Promise resolving to application state
     */
    getAppInfo(appId: number): Promise<MicronautAppState>;
    /**
     * Create and deploy a new Smart Contract from TEAL code
     *
     * @param args MicronautDeployArguments
     * @param callbacks optional MicronautTxnCallbacks
     * @returns MicronautTransactionStatus
     */
    createApp(args: MicronautDeployArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Create an atomic transaction to deploy a
     * new Smart Contract from TEAL code
     *
     * @param args MicronautDeployArguments
     * @returns MicronautAtomicTransaction
     */
    atomicCreateApp(args: MicronautDeployArguments): Promise<MicronautAtomicTransaction>;
    /**
     * deploys a contract from an lsig account
     * keep in mind that the local and global byte and int values have caps,
     * 16 for local and 32 for global and that the cost of deploying the
     * app goes up based on how many of these slots you want to allocate
     *
     * @param args MicronautLsigDeployArguments
     * @returns
     */
    deployTealWithLSig(args: MicronautLsigDeployArguments): Promise<MicronautTransactionStatus>;
    /**
     * Updates an application with `makeApplicationUpdateTxn`
     * @param args MicronautUpdateAppArguments
     * @returns atomic transaction that updates the app
     */
    atomicUpdateApp(args: MicronautUpdateAppArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Sends an update app transaction
     * @param args MicronautUpdateAppArguments
     * @param callbacks optional callbacks: `onSign`, `onSend`, `onConfirm`
     * @returns transaction status
     */
    updateApp(args: MicronautUpdateAppArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Compiles TEAL source via [algodClient.compile](https://py-algorand-sdk.readthedocs.io/en/latest/algosdk/v2client/algod.html#v2client.algod.AlgodClient.compile)
     * @param programSource source to compile
     * @returns Promise resolving to Buffer of compiled bytes
     */
    compileProgram(programSource: string): Promise<Uint8Array>;
    atomicSendAlgo(args: MicronautPaymentArguments): Promise<MicronautAtomicTransaction>;
    /**
     * Sends ALGO from own account to `args.to`
     *
     * @param args `MicronautPaymentArgs` object containing `to`, `amount`, and optional `note`
     * @param callbacks optional MicronautTxnCallbacks
     * @returns Promise resolving to transaction status
     */
    sendAlgo(args: MicronautPaymentArguments, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     * Fetch full account info for an account
     * @param address the accress to read info for
     * @returns Promise of type AccountInfo
     */
    getAccountInfo(address: string): Promise<any>;
    /**
     * Checks Algo balance of account
     * @param address - Wallet of balance to check
     * @returns Promise resolving to Algo balance
     */
    getAlgoBalance(address: string): Promise<any>;
    /**
     * Checks token balance of account
     * @param address - Wallet of balance to check
     * @param assetIndex - the ASA index
     * @returns Promise resolving to token balance
     */
    getTokenBalance(address: string, assetIndex: number): Promise<number>;
    /**
     * Checks if account has at least one token (before playback)
     * Keeping this here in case this is a faster/less expensive operation than checking actual balance
     * @param address - Address to check
     * @param assetIndex - the index of the ASA
     */
    accountHasTokens(address: string, assetIndex: number): Promise<boolean>;
    /**
     * Gets global state for an application.
     * @param applicationIndex - the applications index
     * @returns {object} object representing global state
     */
    getAppGlobalState(applicationIndex: number): Promise<any>;
    /**
     * Gets account local state for an app. Defaults to AnyWallets.activeAddress unless
     * an address is provided.
     * @param applicationIndex the applications index
     */
    getAppLocalState(applicationIndex: number, address?: string): Promise<MicronautAppState | void>;
    atomicAssetTransferWithLSig(args: MicronautLsigSendAssetArguments): Promise<MicronautAtomicTransaction>;
    atomicPaymentWithLSig(args: MicronautLsigPaymentArguments): Promise<MicronautAtomicTransaction>;
    normalizeTxns(txnOrTxns: Transaction | MicronautAtomicTransaction | MicronautAtomicTransaction[]): Uint8Array[];
    /**
     * Signs a transaction or multiple w the correct wallet according to AW (does not send / submit txn(s) to network)
     * @param txnOrTxns Either an array of atomic transactions or a single transaction to sign
     * @returns Promise resolving to MicronautTransactionStatus
     */
    signTransaction(txnOrTxns: MicronautAtomicTransaction[] | Transaction | MicronautAtomicTransaction): Promise<Uint8Array[]>;
    signTransactions(transactions: Uint8Array[], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    /**
     * Sends a transaction or multiple w the correct wallet according to AW
     * @param txnOrTxns Either an array of atomic transactions or a single transaction to sign
     * @param callbacks Optional object with callbacks - `onSign`, `onSend`, and `onConfirm`
     * @returns Promise resolving to MicronautTransactionStatus
     */
    sendTransaction(txnOrTxns: MicronautAtomicTransaction[] | Transaction | MicronautAtomicTransaction, callbacks?: MicronautTxnCallbacks): Promise<MicronautTransactionStatus>;
    /**
     *
     * @param str string
     * @param enc the encoding type of the string (defaults to utf8)
     * @returns string encoded as Uint8Array
     */
    toUint8Array(str: string, enc?: BufferEncoding): Uint8Array;
    /**
     * @deprecated use toUint8Array instead.
     * @param str string
     * @param enc the encoding type of the string (defaults to utf8)
     * @returns string encoded as Uint8Array
     */
    to8Arr(str: string, enc?: BufferEncoding): Uint8Array;
    /**
     * Helper function to turn `globals` and `locals` array into more useful objects
     *
     * @param stateArray State array returned from functions like {@link getAppInfo}
     * @returns A more useful object: `{ array[0].key: array[0].value, array[1].key: array[1].value, ... }`
     * TODO add correct typing for this method
     */
    stateArrayToObject(stateArray: object[]): any;
    /**
     * Used for decoding state
     * @param encoded Base64 string
     * @returns Human-readable string
     */
    b64StrToHumanStr(encoded: string): string;
    /**
     * @deprecated Use b64StrToHumanStr instead
     * @param encoded Base64 string
     * @returns Human-readable string
     */
    fromBase64(encoded: string): string;
    /**
     * Decodes a Base64-encoded Uint8 Algorand address and returns a string
     * @param encoded An encoded Algorand address
     * @returns Decoded address
     */
    valueAsAddr(encoded: string): string;
    /**
     * Decodes app state into a human-readable format
     * @param stateArray Encoded app state
     * @returns Array of objects with key, value, and address properties
     */
    decodeStateArray(stateArray: MicronautAppStateEncoded[]): MicronautStateData[];
    /**
     * Does what it says on the tin.
     * @param txn base64-encoded unsigned transaction
     * @returns transaction object
     */
    decodeBase64UnsignedTransaction(txn: string): Transaction;
    /**
     * Describes an Algorand transaction, for display in Inkey
     * @param txn Transaction to describe
     */
    txnSummary(txn: Transaction): string;
    /**
     * Creates a wallet address + mnemonic from account's secret key.
     * Changed in 0.3: this does NOT set Micronaut.account.
     * @returns MicronautWallet Object containing `address` and `mnemonic`
     */
    createWallet(): MicronautWallet;
    /**
     * Recovers account from mnemonic
     * Changed in 0.3: this does NOT set Micronaut.account.
     * @param mnemonic Mnemonic associated with Micronaut account
     * @returns If mnemonic is valid, returns algosdk account (.addr, .sk). Otherwise, throws an error.
     */
    recoverAccount(mnemonic: string): AlgosdkAccount;
    /**
     * txn(b64) -> txnBuff (buffer)
     * @param txn base64-encoded unsigned transaction
     * @returns trransaction as buffer object
     */
    txnB64ToTxnBuff(txn: string): Buffer;
    /**
     * Converts between buff -> b64 (txns)
     * @param buff likely a algorand txn as a Uint8Array buffer
     * @returns string (like for inkey / base64 transmit use)
     */
    txnBuffToB64(buff: Uint8Array): string;
    /**
     * Does what it says on the tin.
     * @param txn algorand txn object
     * @returns string (like for inkey / base64 transmit use)
     */
    txnToStr(txn: algosdk.Transaction): string;
}
export default Micronaut;
export declare const buffer: BufferConstructor;
