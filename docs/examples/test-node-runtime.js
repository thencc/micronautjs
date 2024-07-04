const { default: MicronautJS } = require("../dist/cjs");

const appIndex = 50213785;

const Micronaut = new MicronautJS({
  BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
  LEDGER: "TestNet",
  PORT: "",
  API_TOKEN: { "X-API-Key": "" },
});

Micronaut.recoverAccount(
  "wine slice height claw science approve know egg task chase story boost lonely confirm purpose rack kite soldier proud opinion wish pencil hire abstract blade"
);

console.log("starting tests");
//console.log(Micronaut);

async function runTxTest() {
  // opt into general purpose account app
  // const optIn = await Micronaut.optInApp(appIndex, ['set_all',
  // 	'Another',
  // 	'Another swell guy',
  // 	'https://ncc.la/another-dawg.png',
  // 	'https://ncc.la',
  // 	'https://ncc.la/something-else.md',
  // 	'@memeeme']);

  // console.log(optIn);

  const update = await Micronaut.callApp(appIndex, [
    "set_all",
    "Loopy",
    "A really swell guy",
    "https://ncc.la/loopy-dawg.png",
    "https://ncc.la",
    "https://ncc.la/something-loopy.md",
    "@loopyloop997",
  ]);

  console.log(update);
}

runTxTest();
