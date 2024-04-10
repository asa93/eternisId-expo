import {
    StyleSheet
} from "react-native";

import { Reclaim, WitnessData, ProviderClaimData } from "@reclaimprotocol/reactnative-sdk";

export type ReclaimProvider = {
    provider: string;
    providerId: string;
    providerHash: string;
};
export const providers: ReclaimProvider[] = [
    {
        provider: "Steam ID",
        providerId: "1bba104c-f7e3-4b58-8b42-f8c0346cdeab",
        providerHash: "0xeda3e4cee88b5cbaec045410a0042f99ab3733a4d5b5eb2da5cecc25aa9e9df1",
    },

    {
        provider: "amazon",
        providerId: "5f83ab14-9656-4552-9fbc-482e07022766",
        providerHash:
            "0x1719390930dc8d13cbedb754aa4d04e83988b321013a2114809228eb43096808",
    },
    // {
    //     provider: 'github',
    //     providerId: '61f75e73-0bb5-42a9-8a43-d6ac4434487b',
    //     description: 'repo contribution',
    //     juridictionId: '0098967F', // 🚨 tbd
    //     country: Country.US
    // },
    {
        provider: "ameli.fr",
        providerId: "f0679ffd-fb22-42b7-87c7-54a45ab66e87",
        providerHash:
            "0xf2cd42b328a20dadc41cd2cc1b38b848807795a0ea925c56b25f13f27b02b6de",
    },
    {
        provider: "US SSN",
        providerId: "162f8437-237e-4efd-a300-1d43b61f28c6",
        providerHash:
            "0x75ac9bd838676e81f9b257dc1c68a75bfb748ffdb46a04eaba15075b572de074",
    },
    {
        provider: "Aadhaar",
        providerId: "5e1302ca-a3dd-4ef8-bc25-24fcc97dc800",
        providerHash:
            "0x5fc4afdd97f71fc426fe1269fc3090a6b07d1e964105b8d059a91c0199fe1e96",
    },

    {
        provider: "ELSTER",
        providerId: "3278e764-5133-4d9f-859a-2e1582e4bcda",
        providerHash:
            "0x1719390930dc8d13cbedb754aa4d04e83988b321013a2114809228eb43096808",
    },

    {
        provider: "DUMMY",
        providerId: "3278e764-5133-4d9f-859a-2e1582e4bcda",
        providerHash:
            "0x83bb01a856be1650c99dfe892f2541eae99109b9bb9d63655f93c091ef7d1b50",
    },

    {
        provider: "DUMMY2",
        providerId: "3278e764-5133-4d9f-859a-2e1582e4bcda",
        providerHash:
            "0xd3627ae7b55923a994f93cf83e92c61363634c290f1339fb1a36fafd48fc87d8",
    },
];

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        verticalAlign: "middle",
    },
    checkmark: {
        width: 70,
        height: 70,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",

        color: "black",
        textAlign: "center",
    },
    link: {
        color: "blue"

    },
    button: {},
});

export type ReclaimProof = {
    claimData: ProviderClaimData,
    identifier: string,
    signatures: string[],
    witnesses: WitnessData[],
    extractedParameterValues?: any
}