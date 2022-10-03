import {ethers} from "hardhat";
import {Plonky2Verifier} from "../typechain-types";

const proof = require("./data/proof.json");
const conf = require("./data/conf.json")

function deserialize_vec(buf: Buffer, size: number) {
    let res = [];
    let pos = 0;
    while (pos < buf.length) {
        res.push(buf.subarray(pos, pos + size));
        pos += size;
    }
    console.assert(pos == buf.length);
    return res;
}

function deserialize_2d_vec(buf: Buffer, size: number, x0: number, x1: number) {
    let res = [];
    let pos = 0;
    console.assert(size * x0 * x1 == buf.length);
    for (let i = 0; i < x0; i++) {
        let row = [];
        for (let j = 0; j < x1; j++) {
            row.push(buf.subarray(pos, pos + size));
            pos += size;
        }
        res.push(row);
    }
    return res;
}

describe("Verifier", function () {
    describe("Verify", function () {
        it("Should verify the proof", async function () {
            const Verifier = await ethers.getContractFactory("Plonky2Verifier");
            const verifier = await Verifier.deploy();

            const buf = Buffer.from(proof[0], 'base64');
            console.log("proof size: " + buf.length);

            let pos = 0;
            let wires_cap_size = conf.num_wires_cap * conf.hash_size;
            let wires_cap = deserialize_vec(buf.subarray(pos, pos + wires_cap_size), conf.hash_size);
            pos += wires_cap_size;

            let plonk_zs_partial_products_cap_size = conf.num_plonk_zs_partial_products_cap * conf.hash_size;
            let plonk_zs_partial_products_cap = deserialize_vec(buf.subarray(pos, pos + plonk_zs_partial_products_cap_size), conf.hash_size);
            pos += plonk_zs_partial_products_cap_size;

            let quotient_polys_cap_size = conf.num_quotient_polys_cap * conf.hash_size;
            let quotient_polys_cap = deserialize_vec(buf.subarray(pos, pos + quotient_polys_cap_size), conf.hash_size);
            pos += quotient_polys_cap_size;

            let openings_constants_size = conf.num_openings_constants * conf.ext_field_size;
            let openings_constants = deserialize_vec(buf.subarray(pos, pos + openings_constants_size), conf.ext_field_size);
            pos += openings_constants_size;

            let openings_plonk_sigmas_size = conf.num_openings_plonk_sigmas * conf.ext_field_size;
            let openings_plonk_sigmas = deserialize_vec(buf.subarray(pos, pos + openings_plonk_sigmas_size), conf.ext_field_size);
            pos += openings_plonk_sigmas_size;

            let openings_wires_size = conf.num_openings_wires * conf.ext_field_size;
            let openings_wires = deserialize_vec(buf.subarray(pos, pos + openings_wires_size), conf.ext_field_size);
            pos += openings_wires_size;

            let openings_plonk_zs_size = conf.num_openings_plonk_zs * conf.ext_field_size;
            let openings_plonk_zs = deserialize_vec(buf.subarray(pos, pos + openings_plonk_zs_size), conf.ext_field_size);
            pos += openings_plonk_zs_size;

            let openings_plonk_zs_next_size = conf.num_openings_plonk_zs_next * conf.ext_field_size;
            let openings_plonk_zs_next = deserialize_vec(buf.subarray(pos, pos + openings_plonk_zs_next_size), conf.ext_field_size);
            pos += openings_plonk_zs_next_size;

            let openings_partial_products_size = conf.num_openings_partial_products * conf.ext_field_size;
            let openings_partial_products = deserialize_vec(buf.subarray(pos, pos + openings_partial_products_size), conf.ext_field_size);
            pos += openings_partial_products_size;

            let openings_quotient_polys_size = conf.num_openings_quotient_polys * conf.ext_field_size;
            let openings_quotient_polys = deserialize_vec(buf.subarray(pos, pos + openings_quotient_polys_size), conf.ext_field_size);
            pos += openings_quotient_polys_size;

            let fri_commit_phase_merkle_caps_size = conf.num_fri_commit_round * conf.fri_commit_merkle_cap_height * conf.hash_size;
            let fri_commit_phase_merkle_caps = deserialize_2d_vec(buf.subarray(pos, pos + fri_commit_phase_merkle_caps_size), conf.hash_size, conf.num_fri_commit_round, conf.fri_commit_merkle_cap_height);
            pos += fri_commit_phase_merkle_caps_size;

            let fri_query_init_constants_sigmas_v = [];
            let fri_query_init_constants_sigmas_p = [];
            let fri_query_init_wires_v = [];
            let fri_query_init_wires_p = [];
            let fri_query_init_zs_partial_v = [];
            let fri_query_init_zs_partial_p = [];
            let fri_query_init_quotient_v = [];
            let fri_query_init_quotient_p = [];
            let fri_query_step0_v = [];
            let fri_query_step0_p = [];
            let fri_query_step1_v = [];
            let fri_query_step1_p = [];
            for (let i = 0; i < conf.num_fri_query_round; ++i) {
                let fri_query_init_constants_sigmas_v_size = conf.num_fri_query_init_constants_sigmas_v * conf.field_size;
                fri_query_init_constants_sigmas_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_constants_sigmas_v_size), conf.field_size));
                pos += fri_query_init_constants_sigmas_v_size;

                console.assert(conf.num_fri_query_init_constants_sigmas_p == buf.readUint8(pos));
                pos++;
                let fri_query_init_constants_sigmas_p_size = conf.num_fri_query_init_constants_sigmas_p * conf.hash_size;
                fri_query_init_constants_sigmas_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_constants_sigmas_p_size), conf.hash_size));
                pos += fri_query_init_constants_sigmas_p_size;

                let fri_query_init_wires_v_size = conf.num_fri_query_init_wires_v * conf.field_size;
                fri_query_init_wires_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_wires_v_size), conf.field_size));
                pos += fri_query_init_wires_v_size;

                console.assert(conf.num_fri_query_init_wires_p == buf.readUint8(pos));
                pos++;
                let fri_query_init_wires_p_size = conf.num_fri_query_init_wires_p * conf.hash_size;
                fri_query_init_wires_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_wires_p_size), conf.hash_size));
                pos += fri_query_init_wires_p_size;

                let fri_query_init_zs_partial_v_size = conf.num_fri_query_init_zs_partial_v * conf.field_size;
                fri_query_init_zs_partial_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_zs_partial_v_size), conf.field_size));
                pos += fri_query_init_zs_partial_v_size;

                console.assert(conf.num_fri_query_init_zs_partial_p == buf.readUint8(pos));
                pos++;
                let fri_query_init_zs_partial_p_size = conf.num_fri_query_init_zs_partial_p * conf.hash_size;
                fri_query_init_zs_partial_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_zs_partial_p_size), conf.hash_size));
                pos += fri_query_init_zs_partial_p_size;

                let fri_query_init_quotient_v_size = conf.num_fri_query_init_quotient_v * conf.field_size;
                fri_query_init_quotient_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_quotient_v_size), conf.field_size));
                pos += fri_query_init_quotient_v_size;

                console.assert(conf.num_fri_query_init_quotient_p == buf.readUint8(pos));
                pos++;
                let fri_query_init_quotient_p_size = conf.num_fri_query_init_quotient_p * conf.hash_size;
                fri_query_init_quotient_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_init_quotient_p_size), conf.hash_size));
                pos += fri_query_init_quotient_p_size;

                let fri_query_step0_v_size = conf.num_fri_query_step0_v * conf.ext_field_size;
                fri_query_step0_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_step0_v_size), conf.ext_field_size));
                pos += fri_query_step0_v_size;

                console.assert(conf.num_fri_query_step0_p == buf.readUint8(pos));
                pos++;
                let fri_query_step0_p_size = conf.num_fri_query_step0_p * conf.hash_size;
                fri_query_step0_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_step0_p_size), conf.hash_size));
                pos += fri_query_step0_p_size;

                let fri_query_step1_v_size = conf.num_fri_query_step1_v * conf.ext_field_size;
                fri_query_step1_v.push(deserialize_vec(buf.subarray(pos, pos + fri_query_step1_v_size), conf.ext_field_size));
                pos += fri_query_step1_v_size;

                console.assert(conf.num_fri_query_step1_p == buf.readUint8(pos));
                pos++;
                let fri_query_step1_p_size = conf.num_fri_query_step1_p * conf.hash_size;
                fri_query_step1_p.push(deserialize_vec(buf.subarray(pos, pos + fri_query_step1_p_size), conf.hash_size));
                pos += fri_query_step1_p_size;
            }

            let fri_final_poly_ext_v_size = conf.num_fri_final_poly_ext_v * conf.ext_field_size;
            let fri_final_poly_ext_v = deserialize_vec(buf.subarray(pos, pos + fri_final_poly_ext_v_size), conf.ext_field_size);
            pos += fri_final_poly_ext_v_size;

            let fri_pow_witness = buf.subarray(pos, pos + conf.field_size)
            pos += conf.field_size;

            let public_inputs_size = conf.field_size * conf.num_public_inputs;
            let public_inputs = deserialize_vec(buf.subarray(pos, pos + public_inputs_size), conf.field_size);
            pos += public_inputs_size;
            console.assert(pos == buf.length);

            let input: Plonky2Verifier.ProofStruct = {
                fri_commit_phase_merkle_caps,
                fri_final_poly_ext_v,
                fri_pow_witness,
                public_inputs,
            };
            await verifier.execute_verify(input, buf);
        });
    });

    describe("TestGoldilocks", function () {
        it("test_add", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_add();
        });
        it("test_mul", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_mul();
        });
        it("test_inverse", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_inverse();
        });
        it("test_mul_ext", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_mul_ext();
        });
        it("test_div_ext", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_div_ext();
        });
        it("test_inverse_2exp_12", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_inverse_2exp_12();
        });
        it("test_inverse_2exp_109", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_inverse_2exp_109();
        });
        it("test_exp", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_exp();
        });
        it("test_exp_ext", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_exp_ext();
        });
        it("test_repeated_frobenius", async function () {
            const Contract = await ethers.getContractFactory("TestGoldilocks");
            const tests = await Contract.deploy();

            await tests.test_repeated_frobenius();
        });
    });

    describe("TestChallenger", function () {
        it("test_challenger", async function () {
            const Contract = await ethers.getContractFactory("TestChallenger");
            const tests = await Contract.deploy();

            await tests.test_challenger();
        });
    });

    describe("TestPlonk", function () {
        it("test_eval_l_1", async function () {
            const Contract = await ethers.getContractFactory("TestPlonk");
            const tests = await Contract.deploy();

            await tests.test_eval_l_1();
        });
    });
});
