import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/Counter"; // this is the interface class we just implemented
import dotenv from "dotenv";

dotenv.config();
export async function run() {
    try {
        // initialize ton rpc client on testnet
        const endpoint = await getHttpEndpoint({ network: "testnet" });
        const client = new TonClient({ endpoint });
        const address = process.env.ADDRESS;

        if (!address) {
            console.error("ADDRESS environment variable is not set");
            return;
        }

        // open Counter instance by address
        const counterAddress = Address.parse(address); // replace with your address from step 8
        const counter = new Counter(counterAddress);
        const counterContract = client.open(counter);

        // call the getter on chain
        const counterValue = await counterContract.getCounter();
        console.log("value:", counterValue.toString());
    } catch (error) {
        console.error("Error executing getCounter:", error);
    }
}

run();

