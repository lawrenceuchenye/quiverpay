// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {QuiverPayManagerScript} from "../script/QuiverPayManager.s.sol";
import {QuiverPayManager} from "../src/QuiverPayManager.sol";

contract QuiverPayManager is Test {
    QuiverPayManager public QpayManger;

    function setUp() public {
        QpayManger = new QuiverPayManagerScript().run(); 
    }

}
