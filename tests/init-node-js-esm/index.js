// works
import { Micronaut } from "@thencc/Micronautjs";

// works
// import MicronautJS from '@thencc/Micronautjs';
// console.log('MicronautJS', MicronautJS);
// const Micronaut = MicronautJS.default;

// this SHOULD work but doesnt...
// import { default as Micronaut } from '@thencc/Micronautjs';

// test instance
console.log("Micronaut", Micronaut);

// works
import { buffer } from "@thencc/Micronautjs";
console.log("buffer", buffer);

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
  Micronaut.getAppInfo(49584323).then((bricksInfo) => {
    console.log("bricksInfo");
    console.log(bricksInfo);
  });

  console.log("finished");
})();
