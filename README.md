# Micronaut.js

**Micronaut.js** is designed to be a very small wrapper for the algosdk designed for edge computing.  The goal is to make the east stuff easy and the hard stuff possible with a consistent, readable, ESM standard syntax across the library.

## Get Started

Install via NPM:

`npm install @thencc/micronautjs --save`

Usage:

<pre><code class="hljs language-javascript">import Micronaut from '@thencc/micronautjs';
const micronaut = new Micronaut({
	BASE_SERVER: 'https://testnet-algorand.api.purestake.io/ps2',
	LEDGER: 'TestNet',
	PORT: '',
	API_TOKEN: { 'X-API-Key': 'YOUR_API_TOKEN' }
});

micronaut.connectAccount("a mnemonic phrase");

const txnStatus = await micronaut.sendAlgo("toAddress", 1000, "a note for the transaction");
console.log(txnStatus);</code></pre>