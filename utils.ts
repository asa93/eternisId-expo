

export type SignedClaim = {
    claimInfo: {
        [k: string]: any;
        provider: string;
        parameters: string;
        context: string;
    };
    signedClaim: {
        claim: {
            identifier: `0x${string}`;
            owner: `0x${string}`;
            timestampS: number;
            epoch: number;
        };
        signatures: readonly `0x${string}`[];
    };
};

export const transformProof = (proof: any) => {


    const data: SignedClaim = {
        claimInfo: {
            provider: proof["claimData"]["provider"],
            parameters: proof["claimData"]["parameters"],
            context: proof["claimData"]["context"],
        },
        signedClaim: {
            claim: {
                identifier: proof["claimData"]["identifier"],
                owner: proof["claimData"]["owner"],
                timestampS: proof["claimData"]["timestampS"],
                epoch: proof["claimData"]["epoch"],
            },
            signatures: proof["signatures"],
        },
    };

    return data;
};

export const parseProof = (proof: any) => {


    return {
        claimData: JSON.parse(proof.claimData as any),
        identifier: proof.identifier,
        signatures: JSON.parse(proof.signatures as any),
        witnesses: JSON.parse(proof.witnesses as any),
        extractedParameterValues: proof.extractedParameterValues,
    }
}