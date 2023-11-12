"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../src/index");
describe("Application", () => {
    // Sample snarkjs proof data from the simple-app.
    // eslint-disable-next-line
    const snarkjsProofData = {
        proof: {
            pi_a: [
                // eslint-disable-next-line
                "17744376663532097317485783491747860775914678513822928001932875741042914462904",
                // eslint-disable-next-line
                "11094770315232978073638548164398910587900468733763894156880072738084987419865",
                "1",
            ],
            pi_b: [
                [
                    // eslint-disable-next-line
                    "605206633930345541695663273400816523037437407926507669953314174314721503561",
                    // eslint-disable-next-line
                    "15625484640176526230536130091583840235150831606466440955050523683990973723264",
                ],
                [
                    // eslint-disable-next-line
                    "8846788807317690941528557528412121111448355240241260094197162224542284891820",
                    // eslint-disable-next-line
                    "16791610613411431006300402330693144962764699630402441713438537252601919981899",
                ],
                ["1", "0"],
            ],
            pi_c: [
                // eslint-disable-next-line
                "5833867748280713133669878270309873032973505621834726589591128740396310269504",
                // eslint-disable-next-line
                "1260394973503253533411972689781095642144990723677131064119173013755801805746",
                "1",
            ],
            protocol: "groth16",
            curve: "bn128",
        },
        publicSignals: ["23774", "13148", "47548"],
    };
    // eslint-enable
    const proofExpect = new index_1.application.Proof([
        "0x273af6169ad92751e3b20a67cc67c2ddf998960e41c0f456f2e12a28c8d58cb8",
        "0x18876adeeff085c8178690b518670f4719a7d16df94d5fa65c9b9e2b2c913cd9",
    ], [
        [
            "0x015688e9b0ab398daa2bf5af85f64025ab04fc5f1bb6f68033253ffba0eae949",
            "0x228bb5fd592018b905921baffe58158f4c3069d8f625a0faaafde83168f43280",
        ],
        [
            "0x138f1ae294508de4ce974a81e13b52a2c092a35785c428aac82103ec1371c6ac",
            "0x251fb6fdac11473f2e173bc97e217cb7ea5104cf004de544abe2e064b5d0494b",
        ],
    ], [
        "0x0ce5da25579a4983c5468454ac2639eaf7ca540612fc53714ecaa5cfa24d0e40",
        "0x02c95bb7e150b5900bb3474bcfa2ca0772b6524836b8ba1ff43227fc424ea3b2",
    ]);
    describe("Proof", () => {
        it("proof from snarkjs to snarkjs", async function () {
            const proof = index_1.application.Proof.from_json(snarkjsProofData.proof);
            (0, chai_1.expect)(proof).eql(proofExpect);
        });
    });
});
//# sourceMappingURL=applicationTest.js.map