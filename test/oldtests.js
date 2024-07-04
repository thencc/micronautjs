const { default: Micronaut } = require("../dist/index.cjs");
const approvalProgram = require("./contract");
const clearProgram = require("./contract-clear");
const accountv1 = require("./accountv1");
const accountv2 = require("./accountv2");
const accountClear = require("./account-clear");
const dotenv = require("dotenv");
dotenv.config();

const Micronaut = new Micronaut({
  BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
  LEDGER: "TestNet",
  PORT: "",
  API_TOKEN: { "X-API-Key": process.env.PURESTAKE_API_TOKEN },
});

const testAccountMnemonic = process.env.Micronaut_TEST_MNEMONIC;
if (!testAccountMnemonic) {
  console.error("Please set Micronaut_TEST_MNEMONIC in your environment");
  process.exit(1);
}

// change these to include/exclude certain test blocks
const testPayment = true;
const testAsset = true;
const testApp = true;

let response;
let appState;
let appId;

// add function to this on error
var errors = [];

(async () => {
  console.log("Running Micronaut tests.");

  console.log("getNodeConfig(): ");
  console.log(JSON.stringify(Micronaut.getNodeConfig(), null, 2));

  console.log("checkStatus():");
  await Micronaut.checkStatus();

  // ACCOUNT OPERATIONS

  // createWallet
  console.log("Create a wallet:");
  let wallet = Micronaut.createWallet();
  let firstWallet = Object.assign({}, wallet); // so we can use this later
  console.log("Micronaut.account is now:");
  console.log(JSON.stringify(Micronaut.account.addr, null, 2));

  // recoverAccount
  console.log(
    "For the rest of the tests we will use Micronaut_TEST_MNEMONIC from env"
  );
  console.log("I hope this account has a lil bit of Algo in it!");
  console.log("Recovering that now...");
  Micronaut.recoverAccount(testAccountMnemonic);

  if (!Micronaut.account) {
    console.error("That mnemonic did not work.");
    process.exit(1);
  }

  console.log("The account is now: ");
  console.log(Micronaut.account.addr);

  // getAccountInfo
  console.log("Getting account info for: " + Micronaut.account.addr);
  let accountInfo = await Micronaut.getAccountInfo(Micronaut.account.addr);
  console.log(accountInfo);

  // getAlgoBalance
  console.log("getAlgoBalance(Micronaut.account.addr): ");
  let balance = await Micronaut.getAlgoBalance(Micronaut.account.addr);
  console.log(balance);

  // sendAlgo
  if (testPayment) {
    console.log(
      "Sending a little bit of ALGO to the first account we created:"
    );
    try {
      let payment = await Micronaut.sendAlgo({
        to: firstWallet.address,
        amount: 1000000,
      });
      console.log(payment);
    } catch (e) {
      console.error("Error sending payment");
      errors.push("sendAlgo");
      console.error(e);
    }
  } else {
    console.log("Skipping payment test");
  }

  // ASSET OPERATIONS
  // createAsset
  if (testAsset) {
    try {
      console.log("Let's try creating an asset.");
      const assetArgs = {
        assetName: "Presto Testo",
        symbol: "TEST",
        metaBlock: "This is a test of Micronaut",
        decimals: 3,
        amount: 5,
      };
      console.log(assetArgs);
      let asset = await Micronaut.createAsset(assetArgs);
      console.log("Created asset:");
      console.log(asset); // this should be an ID
      let newAsset = parseInt(asset.createdIndex);

      // getAssetInfo
      console.log("Getting info for our new asset: " + newAsset);
      console.log(await Micronaut.getAssetInfo(newAsset));

      // accountHasTokens
      console.log("Does our account have these tokens now?");
      console.log(
        await Micronaut.accountHasTokens(Micronaut.account.addr, newAsset)
      );

      // getTokenBalance
      console.log("How many of this asset do we have?");
      console.log(
        await Micronaut.getTokenBalance(Micronaut.account.addr, newAsset)
      );

      // optInAsset
      console.log("Going back to our first wallet!");
      Micronaut.recoverAccount(firstWallet.mnemonic);
      console.log("Wallet is now: " + Micronaut.account.addr);

      console.log("Checking if account is opted into asset " + newAsset);
      let optedIn = await Micronaut.isOptedIntoAsset({
        account: Micronaut.account.addr,
        assetId: newAsset,
      });
      console.log("Opted in? " + optedIn);

      console.log("Opting into asset: " + newAsset);
      let response = await Micronaut.optInAsset(newAsset);
      console.log(response);

      console.log("Checking again if account is opted into asset " + newAsset);
      optedIn = await Micronaut.isOptedIntoAsset({
        account: Micronaut.account.addr,
        assetId: newAsset,
      });
      console.log("Opted in? " + optedIn);

      // sendAsset
      console.log(
        "Now we are going back to the account that created the asset, and we will send one to the account that just opted in."
      );
      Micronaut.recoverAccount(testAccountMnemonic);
      console.log("Account is now: " + Micronaut.account.addr);

      response = await Micronaut.sendAsset({
        to: firstWallet.address,
        amount: 1,
        assetIndex: newAsset,
      });
      console.log(response);

      console.log("Let us see if they got it? Checking token balance.");
      console.log(
        await Micronaut.getTokenBalance(firstWallet.address, newAsset)
      );

      // deleteAsset
      console.log(
        "Now we are going to test deletion. Time to make a new asset!"
      );
      const asset2Args = {
        assetName: "Presto Deleto",
        symbol: "DEL",
        metaBlock: "Everything is temporary!",
        decimals: 3,
        amount: 1,
      };
      let asset2 = await Micronaut.createAsset(asset2Args);
      console.log("Created asset: ", asset2.createdIndex);
      console.log("Deleting asset: " + asset2.createdIndex);
      response = await Micronaut.deleteAsset(asset2.createdIndex);
      console.log(response);
    } catch (error) {
      errors.push("asset");
      console.error("Error testing asset code.");
      console.error(error);
    }
  } else {
    console.log("Skipping asset tests");
  }

  // APP OPERATIONS
  if (testApp) {
    const ACCOUNT_APP = 51066775; // the account app from arts-council

    // optInApp
    try {
      console.log("Opting into app " + ACCOUNT_APP);
      response = await Micronaut.optInApp({
        appIndex: ACCOUNT_APP,
        appArgs: [
          "set_all",
          "Name",
          "Description of me",
          "",
          "https://example.com",
          "",
          "example@example.com",
        ],
      });
      console.log(response);
    } catch (e) {
      errors.push("optInApp");
      console.error("Error opting into app");
      console.error(e);
    }

    // getAppLocalState
    try {
      console.log("Get local state of app: " + ACCOUNT_APP);
      appState = await Micronaut.getAppLocalState(ACCOUNT_APP);
      console.log(JSON.stringify(appState, null, 2));
    } catch (e) {
      errors.push("getAppLocalState(app)");
      console.error("Error getting state");
    }

    try {
      console.log("Getting local state for different address.");
      appState = await Micronaut.getAppLocalState(
        ACCOUNT_APP,
        firstWallet.address
      );
      console.log(JSON.stringify(appState, null, 2));
    } catch (e) {
      errors.push("getAppLocalState(app, address)");
      console.error("Error getting state");
      console.error(e);
    }

    // callApp
    try {
      console.log("Calling app to update profile:");
      response = await Micronaut.callApp({
        appIndex: ACCOUNT_APP,
        appArgs: [
          "set_all",
          "New Name",
          "Updated bio",
          "New avatar",
          "New link",
          "",
          "newemail@email.com",
        ],
      });
      console.log(response);
      console.log("Get local state of app again: " + ACCOUNT_APP);
      appState = await Micronaut.getAppLocalState(ACCOUNT_APP);
      console.log(JSON.stringify(appState, null, 2));
    } catch (e) {
      errors.push("callApp");
      console.error("Error calling app");
      console.error(e);
    }

    // closeOutApp
    try {
      console.log("Closing out of app: " + ACCOUNT_APP);
      response = await Micronaut.closeOutApp({
        appIndex: ACCOUNT_APP,
        appArgs: ["set_all", "", "", "", "", "", ""],
      });
      console.log(response);
    } catch (e) {
      errors.push("closeOutApp");
      console.error("Error closing out of app");
      console.error(e);
    }

    try {
      // createApp
      console.log("Deploying a contract from TEAL");
      const deployResult = await Micronaut.createApp({
        tealApprovalCode: accountv1,
        tealClearCode: accountClear,
        appArgs: [],
        schema: {
          localInts: 4,
          localBytes: 12,
          globalInts: 1,
          globalBytes: 1,
        },
      });
      console.log(deployResult);
      console.log("App ID is: " + deployResult.createdIndex);
      appId = deployResult.createdIndex;
      if (!appId) errors.push("createApp");

      // getAppGlobalState
      try {
        console.log("Getting app global state");
        let state = await Micronaut.getAppGlobalState(
          appId,
          Micronaut.account.addr
        );
        console.log(state);
      } catch (e) {
        errors.push("getAppGlobalState");
        console.error(e);
      }

      // getAppEscrowAccount
      try {
        console.log("get escrow account of new app");
        console.log(Micronaut.getAppEscrowAccount(appId));
      } catch (e) {
        errors.push("getAppEscrowAccount");
        console.error(e);
      }

      // getAppInfo
      try {
        console.log("Get app info:");
        console.log(await Micronaut.getAppInfo(appId));
      } catch (e) {
        errors.push("getAppInfo");
        console.error(e);
      }

      // updateApp
      console.log("the following call should fail:");
      try {
        let optIn = await Micronaut.optInApp({
          appIndex: appId,
          appArgs: [
            "set_all",
            "Name",
            "Description of me",
            "",
            "https://example.com",
            "",
            "example@example.com",
          ],
        });
        console.log(optIn);
        let res = await Micronaut.callApp({
          appIndex: appId,
          appArgs: ["version_test"],
        });
      } catch (e) {
        console.log(e);
      }

      try {
        console.log("updating the app now...");
        const updateResult = await Micronaut.updateApp({
          appIndex: appId,
          tealApprovalCode: accountv2,
          tealClearCode: accountClear,
          appArgs: [],
        });
        console.log("updated app");
        console.log(updateResult);
      } catch (e) {
        errors.push("updateApp");
        console.error(e);
      }

      console.log("trying the call again on v2 contract");
      try {
        let res = await Micronaut.callApp({
          appIndex: appId,
          appArgs: ["version_test"],
        });
        console.log(res);
      } catch (e) {
        errors.push("updateApp_callApp");
        console.error(e);
      }

      // getAppInfo
      try {
        console.log("Get app info:");
        console.log(await Micronaut.getAppInfo(appId));
      } catch (e) {
        errors.push("getAppInfo");
        console.error(e);
      }

      // deleteApplication
      try {
        console.log("Delete application:");
        let deleteAppResponse = await Micronaut.deleteApplication(appId);
        console.log(deleteAppResponse);
      } catch (e) {
        errors.push("deleteApplication");
        console.error(e);
      }
    } catch (e) {
      console.error("Error with our new contract");
      console.log(e);
    }
  } else {
    console.log("Skipping app tests");
  }

  if (errors.length > 0) {
    console.log("There were errors, check these:");
    console.log(errors);
  } else {
    console.log("All tests passed");
  }
})();
