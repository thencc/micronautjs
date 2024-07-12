# Micronaut.js

**Micronaut.js** is designed to be a very small wrapper for the algosdk designed for edge computing. The goals are to make the easy stuff easy and the hard stuff possible with a consistent, clear, well-typed syntax across the library.

## Get Started

Install via NPM:

`npm install @thencc/micronautjs --save`

Usage:

<pre><code class="hljs language-javascript">import Micronaut from '@thencc/micronautjs';
const micronaut = new Micronaut({
  nodeConfig: {
    BASE_SERVER: https://testnet-api.algonode.cloud,
    INDEX_SERVER: https://testnet-idx.algonode.cloud,
    LEDGER: "TestNet",
    PORT: "443",
    API_TOKEN: "",
  },
});

micronaut.connectAccount("a mnemonic phrase");

const txnStatus = await micronaut.sendAlgo("toAddress", 1000, "a note for the transaction");
console.log(txnStatus);</code></pre>
