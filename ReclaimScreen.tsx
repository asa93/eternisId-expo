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

import { test_proofs } from "./test_proofs";

const prefix = Linking.createURL("/");

export function ReclaimScreen({ navigation, appDeepLink }) {
  const [provider, setProvider] = useState<ReclaimProvider | null>(null);
  const [reclaimUrl, setReclaimUrl] = useState<string | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  //tx hash 0x19b7238739284d016e2f05ceb361659183266b923fa9793250a6ba533ca52899
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
        reclaimProof: transformProof(proof),
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
              source={require("./assets/approved.png")}
              style={styles.checkmark}
            />
            <Text style={styles.text}>Proof generated</Text>

            <Button title="Create identity" onPress={createIdentity} />
          </View>
        )}

        {txHash && (
          <View style={styles.container}>
            <Image
              source={require("./assets/approved.png")} // Make sure to place your checkmark image in the project directory
              style={styles.checkmark}
            />
            <Text style={styles.text}>
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
