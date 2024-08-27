import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";

import { TonClient, WalletContractV4, Address } from "@ton/ton";
import CounterWrapper from "../wrappers/Counter";
import dotenv from "dotenv";

dotenv.config();

export async function run() {
    // 选择节点
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    // new 一个客户端
    const client = new TonClient({ endpoint });
    // 钱包助记词
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        console.error("Please set MNEMONIC in your .env file");
        return;
    }
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    // 创建钱包
    const wallet = WalletContractV4.create({
        publicKey: key.publicKey,
        workchain: 0
    });
    // 判定钱包是否部署
    if (!await client.isContractDeployed(wallet.address)) {
        return console.error("Please deploy the contract first");
    }
    // 使用这个钱包
    const walletContract = client.open(wallet);
    // 实例一个发送者
    const walletSender = walletContract.sender(key.secretKey);
    // 获取交易序列号
    const seqno = await walletContract.getSeqno();
    // console.log("Address:", new Address(0, key.publicKey));

    const address = process.env.ADDRESS;
    if (!address) {
        console.error("Please set ADDRESS in your .env file");
        return;
    }
    const counterAddress = Address.parse(address);
    console.log("counterAddress:", counterAddress.toString());

    const counter = new CounterWrapper(counterAddress);
    const counterContract = client.open(counter);

    await counterContract.sendIncrement(walletSender);
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("Waiting for transaction to be included in a block...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("Transaction included in a block!");

}

run();