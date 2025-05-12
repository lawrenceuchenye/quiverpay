
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {QuiverPayManager} from "../src/QuiverPayManager.sol";

contract QuiverPayManagerScript is Script {
    QuiverPayManager public QpayManager;
    address[] supportedTokens=["0x036CbD53842c5426634e7929541eC2318f3dCF7e"];

    function setUp() public {}

    function run() public returns(QuiverPayManager){
        vm.startBroadcast();

        QpayManager = new QuiverPayManager(supportedTokens[0],supportedTokens);

        vm.stopBroadcast();

        return QpayManager;
    }
}
