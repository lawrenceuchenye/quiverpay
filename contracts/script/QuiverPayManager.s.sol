
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script } from "forge-std/Script.sol";
import {QuiverPayManager} from "../src/QuiverPayManager.sol";

contract QuiverPayManagerScript is Script {
    QuiverPayManager public QpayManager;
    address supportedToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function setUp() public {}

    function run() public returns(QuiverPayManager){
        vm.startBroadcast();

        QpayManager = new QuiverPayManager(supportedToken);

        vm.stopBroadcast();

        return QpayManager;
    }
}
