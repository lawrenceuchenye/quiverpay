// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/QuiverPayManager.sol";

contract QuiverPayManagerTest is Test {
    QuiverPayManager public qpay;
    address public mockPrimaryToken = address(0x1);

    function setUp() public {
        qpay = new QuiverPayManager(mockPrimaryToken);
    }

    function testDeployment() public {
        // Assuming the contract stores the primary token or has some public getter
        assertEq(address(qpay), address(qpay)); // Dummy test to ensure deployment
    }

    function testSupportedToken() public {
        // Add a function to your contract like:
        // function getSupportedToken(uint256 index) external view returns (address) { return supportedTokens[index]; }
        assertEq(qpay.getSupportedToken(), mockPrimaryToken);
    }
}
