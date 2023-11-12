import { SaturnInstanceDescriptor, SaturnInstance } from "../sdk/saturn";
import * as ethers from "ethers";
export declare function loadInstance(instanceFile: string): SaturnInstanceDescriptor;
export declare function saturnFromInstanceFile(instanceFile: string, provider: ethers.ContractRunner): SaturnInstance;
export declare function loadWallet(keyfile: string, password: string, provider?: ethers.Provider): Promise<ethers.BaseWallet>;
export declare function handleTxRequest(wallet: ethers.Signer, txReq: ethers.PreparedTransactionRequest, estimateGas: boolean, dumpTx: boolean, wait: boolean, maxFeePerGasGwei?: string | number | undefined): Promise<void>;
