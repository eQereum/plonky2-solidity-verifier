# Solidity verifier for Plonky2

The first milestone of this project is to verify a dummy plonky2 proof with high_rate_config, GoldilocksField,
QuadraticExtension and KeccakHash<25>.

Things to do for the above milestone:

+ [ ] implement verify_fri_proof()
+ [ ] support public inputs

The second milestone is to verify any recursive proof with the above settings.

Things to do for this milestone:

+ [ ] implement evaluate_gate_constraints()

Run tests with the following command lines.

```shell
npm install --save-dev hardhat
```

```shell
./test.sh

Generating solidity verifier files ...

successes:
    verifier::tests::test_verifier_without_public_inputs

test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 1 filtered out; finished in 4.27s

  Verifier
    Verify
proof size: 50855
      ✓ Should verify the proof
    TestGoldilocks
      ✓ test_add
      ✓ test_mul
      ✓ test_inverse
      ✓ test_mul_ext
      ✓ test_div_ext
      ✓ test_inverse_2exp_12
      ✓ test_inverse_2exp_109
      ✓ test_exp_ext
      ✓ test_u160_times_7
      ✓ test_repeated_frobenius
    TestChallenger
      ✓ test_challenger
    TestPlonk
      ✓ test_eval_l_1

·-----------------------|---------------------------|-------------|-----------------------------·
|  Solc version: 0.8.9  ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
························|···························|·············|······························
|  Methods                                                                                      │
·············|··········|·············|·············|·············|···············|··············
|  Contract  ·  Method  ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|··········|·············|·············|·············|···············|··············
|  Deployments          ·                                         ·  % of limit   ·             │
························|·············|·············|·············|···············|··············
|  Plonky2Verifier      ·          -  ·          -  ·    2492500  ·        8.3 %  ·          -  │
························|·············|·············|·············|···············|··············
|  TestChallenger       ·          -  ·          -  ·     625046  ·        2.1 %  ·          -  │
························|·············|·············|·············|···············|··············
|  TestGoldilocks       ·          -  ·          -  ·     977910  ·        3.3 %  ·          -  │
························|·············|·············|·············|···············|··············
|  TestPlonk            ·          -  ·          -  ·     887669  ·          3 %  ·          -  │
·-----------------------|-------------|-------------|-------------|---------------|-------------·

  13 passing (3s)
```

