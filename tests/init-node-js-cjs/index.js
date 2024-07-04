// const Micronaut = require('@thencc/Micronautjs').default; // this works
// const { default: Micronaut } = require('@thencc/micronautjs'); // AND this works
const { Micronaut } = require("@thencc/micronautjs"); // AND this works
console.log("Micronaut", Micronaut);

(async () => {
  console.log("started");

  const Micronaut = new Micronaut({
    nodeConfig: {
      BASE_SERVER: process.env.NCC_BASE_SERVER,
      INDEX_SERVER: process.env.NCC_INDEX_SERVER,
      LEDGER: process.env.NCC_LEDGER,
      PORT: process.env.NCC_PORT,
      API_TOKEN: {
        [process.env.NCC_API_TOKEN_HEADER]: process.env.NCC_API_TOKEN,
      },
    },
  });
  // console.log('Micronaut', Micronaut);

  // gaction-test-1 acct - BJVIWIXUZYEEL2WGAPKVUGZIVWJ5DTFOROJZY5CBGL25WJIR74MFJP2QJU
  const memo =
    "abuse uphold tourist sadness deer seat apple spider taxi senior priority upset skirt slush under skirt globe retire damp sing beauty share crime abandon long";
  Micronaut.authWithMnemonic(memo);

  // test api call
  // Micronaut.getAppInfo(49584323).then(bricksInfo => {
  // 	console.log('bricksInfo');
  // 	console.log(bricksInfo);
  // });

  Micronaut.getAssetInfo(94345442).then((assetInfo) => {
    console.log("assetInfo", assetInfo);
  });

  console.log("finished");
  // throw new Error('bewm');
})();
