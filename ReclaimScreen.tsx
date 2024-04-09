import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";

import { providers, styles, ReclaimProvider } from "./const";
import { transformProof, parseProof } from "./utils";
import { Reclaim, Proof } from "@reclaimprotocol/reactnative-sdk";
import * as Linking from "expo-linking";

import { Dropdown } from "react-native-element-dropdown";

import axios from "axios";

const prefix = Linking.createURL("/");

export function ReclaimScreen({ navigation, appDeepLink }) {
  const [provider, setProvider] = useState<ReclaimProvider | null>(null);
  const [reclaimUrl, setReclaimUrl] = useState<string | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(
    "0x19b7238739284d016e2f05ceb361659183266b923fa9793250a6ba533ca52899"
  );

  const identityCommitment =
    "14470594949455848069266987733570558620259476633692170241441506091279644572507"; //🚨 to replace

  const reclaimClient = new Reclaim.ProofRequest(
    process.env.EXPO_PUBLIC_APP_ID,
    {
      log: true,
    }
  );

  /// generate reclaim proof
  async function startVerificationFlow() {
    reclaimClient.setAppCallbackUrl(prefix);

    await reclaimClient.addContext("0x0", "0098967F");

    const { providerId } = provider;

    await reclaimClient.buildProofRequest(providerId);

    reclaimClient.setSignature(
      await reclaimClient.generateSignature(process.env.EXPO_PUBLIC_APP_SECRET)
    );
    try {
      const { requestUrl, statusUrl } =
        await reclaimClient.createVerificationRequest();

      setReclaimUrl(requestUrl);
    } catch (e: any) {
      console.log(e.toString());
      setError(e.toString());
    }

    await reclaimClient.startSession({
      onSuccessCallback: (proof) => {
        console.log("Verification success", proof);
        // Your business logic here
        setProof({
          claimData: JSON.parse(proof.claimData as any),
          identifier: proof.identifier,
          signatures: JSON.parse(proof.signatures as any),
          witnesses: JSON.parse(proof.witnesses as any),
          extractedParameterValues: proof.extractedParameterValues,
        });
      },
      onFailureCallback: (e: any) => {
        console.error("Verification failed", e);

        setError("error startSession");
      },
    });
  }

  // send reclaim proof to backend to create blockchain tx to eternis contract and generate eternis ID
  async function createIdentity() {
    await axios
      .post(process.env.EXPO_PUBLIC_BACKEND_URL + "createIdentity", {
        providerHash: provider?.providerHash,
        identityCommitment,
        reclaimProof: transformProof(test_proofs[0]),
      })
      .then((response) => {
        setTxHash(response.data);
      })
      .catch((e) => {
        setError(e.response.data);
      });
  }

  return (
    <SafeAreaView>
      <View>
        {!reclaimUrl && (
          <Dropdown
            data={providers}
            valueField={"providerId"}
            labelField={"provider"}
            onChange={(item) => setProvider(item)}
            placeholder="Select provider"
            style={{
              maxHeight: "auto",
            }}
          />
        )}

        {!reclaimUrl && provider && (
          <Button title="Start verification" onPress={startVerificationFlow} />
        )}

        {!proof && reclaimUrl && (
          <Button
            title="Generate a proof"
            onPress={() => Linking.openURL(reclaimUrl)}
          />
        )}

        {proof && (
          <View style={styles.container}>
            <Image
              source={require("./assets/approved.png")} // Make sure to place your checkmark image in the project directory
              style={styles.checkmark}
            />
            <Text style={styles.text}>Proof generated</Text>

            <Button title="Create identity" onPress={createIdentity} />
          </View>
        )}

        <Button title="Create identity" onPress={createIdentity} />

        {txHash && (
          <View style={styles.container}>
            <Image
              source={require("./assets/approved.png")} // Make sure to place your checkmark image in the project directory
              style={styles.checkmark}
            />
            <Text style={styles.tx}>
              Identity created.{" "}
              <Pressable
                onPress={() =>
                  Linking.openURL("https://sepolia.arbiscan.io/tx/" + txHash)
                }
              >
                See transaction
              </Pressable>
            </Text>
          </View>
        )}
        {error && <Text>Error: {error}</Text>}
      </View>
    </SafeAreaView>
  );
}

const test_proofs = [
  {
    identifier:
      "0x82f094050e9e08e0b66ec2d8771918d2c80479b41f314786cbaa8f4e53784868",
    claimData: {
      provider: "http",
      parameters:
        '{"body":"","geoLocation":null,"method":"GET","responseMatches":[{"type":"contains","value":"num-orders\\">0 orders</span>"}],"responseRedactions":[{"jsonPath":"","regex":"num\\\\-orders\\">(.*)</span>","xPath":"id(\\"a-page\\")/section[@class=\\"your-orders-content-container aok-relative js-yo-container\\"]/div[@class=\\"your-orders-content-container__content js-yo-main-content\\"]/div[@class=\\"a-row a-spacing-base\\"]/form[@class=\\"js-time-filter-form a-spacing-none\\"]/label[@class=\\"a-form-label time-filter__label aok-inline-block a-text-normal\\"]/span[@class=\\"num-orders\\"]"}],"url":"https://www.amazon.in/your-orders/orders?timeFilter=year-2023&ref_=ppx_yo2ov_dt_b_filter_all_y2023"}',
      owner: "0xc6e6e8bcbcc527df45a608cd7513f98bc7cd3f5b",
      timestampS: 1711300412,
      context:
        '{"contextAddress":"0x0","contextMessage":"0098967F","providerHash":"0x83bb01a856be1650c99dfe892f2541eae99109b9bb9d63655f93c091ef7d1b50"}',
      identifier:
        "0x82f094050e9e08e0b66ec2d8771918d2c80479b41f314786cbaa8f4e53784868",
      epoch: 1,
    },
    signatures: [
      "0x1b7c91178cf37f890d6ec5dc593ebdd8ea740fb780fe9e4560009049fa83242d1a68776f3119f4a8269478ed675baec3fa85e33fe97a9688713b5077ccbc72bf1c",
    ],
    witnesses: [
      {
        id: "0x244897572368eadf65bfbc5aec98d8e5443a9072",
        url: "https://reclaim-node.questbook.app",
      },
    ],
    extractedParameterValues: {
      CLAIM_DATA: "0 orders",
    },
  },

  {
    identifier:
      "0xa30a0406eb62e104916cddc73cb92e55b61c99a286be05f1f41ee027c4b943ff",
    claimData: {
      provider: "http",
      parameters:
        '{"body":"","geoLocation":"","method":"GET","responseMatches":[{"type":"regex","value":"\\"formattedName\\":\\"(?<username>.*)\\""}],"responseRedactions":[{"jsonPath":"$.loggedInUserInfo.formattedName","regex":"\\"formattedName\\":\\"(?<username>.*)\\"","xPath":""}],"url":"https://secure.ssa.gov/myssa/myprofile-api/profileInfo"}',
      owner: "0x52c8aa4f2f01b60f19b21d4e95dc673414dac4c5",
      timestampS: 1711976339,
      context:
        '{"contextAddress":"0x0","contextMessage":"0098967F","extractedParameters":{"username":"Jensmichael Ernstberger"},"providerHash":"0xd3627ae7b55923a994f93cf83e92c61363634c290f1339fb1a36fafd48fc87d8"}',
      identifier:
        "0xa30a0406eb62e104916cddc73cb92e55b61c99a286be05f1f41ee027c4b943ff",
      epoch: 1,
    },
    signatures: [
      "0xb446a1834b2ed7901dee997e6d3f6155605a923824c03437a2a35cb4e3c929e6385b759634339ecf48b7578beca116908414a83482d3f756027ae894ef34fbbb1b",
    ],
    witnesses: [
      {
        id: "0x244897572368eadf65bfbc5aec98d8e5443a9072",
        url: "https://reclaim-node.questbook.app",
      },
    ],
  },
  {
    identifier:
      "0x735ab4b5cf9c2880fedcf9c95caf3a30c343d2d32dc86ef74637a62849095d64",
    claimData: {
      provider: "http",
      parameters:
        '{"body":"","geoLocation":"","method":"GET","responseMatches":[{"type":"contains","value":"\\"formattedName\\":\\"Pratyushranjan Tiwari\\""}],"responseRedactions":[{"jsonPath":"$.loggedInUserInfo.formattedName","regex":"\\"formattedName\\":\\"(.*)\\"","xPath":""}],"url":"https://secure.ssa.gov/myssa/myprofile-api/profileInfo"}',
      owner: "0x0e98bbd113e6c6b0407b417633101b91c6271e50",
      timestampS: 1711641751,
      context:
        '{"contextAddress":"0x0","contextMessage":"0098967F","providerHash":"0xa85093144aa9926d88fa9fc41c45dfd9786e8190b8128b4d3cb3c419d236a3f4"}',
      identifier:
        "0x735ab4b5cf9c2880fedcf9c95caf3a30c343d2d32dc86ef74637a62849095d64",
      epoch: 1,
    },
    signatures: [
      "0xeed2dc2a5caf8f7f84e3c4e348c068b8d3ec2cb9616d2582f6c048ce9a14ebd819ff6a0493b919c03253715b12971bd595f04098eb91c4d3e9a911a8c2d292471c",
    ],
    witnesses: [
      {
        id: "0x244897572368eadf65bfbc5aec98d8e5443a9072",
        url: "https://reclaim-node.questbook.app",
      },
    ],
    extractedParameterValues: {
      username: "Pratyushranjan Tiwari",
    },
  },
  ,
  {
    identifier:
      "0x930a5687ac463eb8f048bd203659bd8f73119c534969258e5a7c5b8eb0987b16",
    claimData: {
      provider: "http",
      parameters:
        '{"body":"","geoLocation":"in","method":"GET","responseMatches":[{"type":"contains","value":"_steamid\\">Steam ID: 76561198155115943</div>"}],"responseRedactions":[{"jsonPath":"","regex":"_steamid\\">Steam ID: (.*)</div>","xPath":"id(\\"responsive_page_template_content\\")/div[@class=\\"page_header_ctn\\"]/div[@class=\\"page_content\\"]/div[@class=\\"youraccount_steamid\\"]"}],"url":"https://store.steampowered.com/account/"}',
      owner: "0xef27fa8830a070aa6e26703be6f17858b61d3fba",
      timestampS: 1712685785,
      context:
        '{"contextAddress":"0x0","contextMessage":"0098967F","providerHash":"0xeda3e4cee88b5cbaec045410a0042f99ab3733a4d5b5eb2da5cecc25aa9e9df1","extractedParameterValues":{"CLAIM_DATA":"76561198155115943"}}',
      identifier:
        "0x930a5687ac463eb8f048bd203659bd8f73119c534969258e5a7c5b8eb0987b16",
      epoch: 1,
    },
    signatures: [
      "0xb246a05693f3e21a70eab5dfd5edc1d0597a160c82b8bf9e24d1f09f9dde9899154bb1672c1bf38193a7829e96e4ed09bc327657bf266e90451f6a90c8b45dfb1c",
    ],
    witnesses: [
      {
        id: "0x244897572368eadf65bfbc5aec98d8e5443a9072",
        url: "https://reclaim-node.questbook.app",
      },
    ],
  },
];
