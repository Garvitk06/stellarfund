import { 
  Address, 
  Contract, 
  rpc, 
  scValToNative, 
  xdr, 
  TransactionBuilder, 
  Networks 
} from "@stellar/stellar-sdk";
import { server, CONTRACT_ID, NETWORK_PASSPHRASE } from "./stellar";

export async function incrementCounter(publicKey: string, signTx: (xdr: string) => Promise<{ signedTxXdr: string }>) {
  try {
    const contract = new Contract(CONTRACT_ID);
    const account = await server.getAccount(publicKey);
    
    const operation = contract.call("increment");
    
    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(operation)
    .setTimeout(30)
    .build();

    // Prepare the transaction for Soroban (simulate to get footprint/fees)
    const preparedTx = await server.prepareTransaction(tx);
    
    // Sign the transaction using the wallet
    const { signedTxXdr } = await signTx(preparedTx.toXDR());
    
    // Submit the transaction
    const sendResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE));
    
    if (sendResponse.status !== "PENDING") {
      throw new Error(`Transaction failed with status: ${sendResponse.status}`);
    }

    return sendResponse.hash;
  } catch (error) {
    console.error("Increment failed:", error);
    throw error;
  }
}

export async function getCounterValue(): Promise<number> {
  try {
    const contract = new Contract(CONTRACT_ID);
    const result = await server.simulateTransaction(
      new TransactionBuilder(
        new rpc.Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAA", "0"),
        { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
      )
      .addOperation(contract.call("get_value"))
      .setTimeout(30)
      .build()
    );

    if (rpc.Api.isSimulationSuccess(result)) {
      return scValToNative(result.result!.retval);
    }
    return 0;
  } catch (error) {
    console.error("Failed to get counter value:", error);
    return 0;
  }
}

export async function getContractEvents(startLedger?: number) {
  try {
    const response = await server.getEvents({
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [CONTRACT_ID],
        },
      ],
    });
    return response.events;
  } catch (error) {
    console.error("Failed to fetch contract events:", error);
    return [];
  }
}
