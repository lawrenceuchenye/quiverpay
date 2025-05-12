
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import { QuiverPayManager } from "../src/QuiverPayManager.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    )
        payable
        ERC20(name, symbol)
    {
        _mint(initialAccount, initialBalance);
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    function transferInternal(address from, address to, uint256 value) public {
        _transfer(from, to, value);
    }

    function approveInternal(address owner, address spender, uint256 value) public {
        _approve(owner, spender, value);
    }
}

contract QuiverPayManagerTest is Test {
    QuiverPayManager public qpm;
    ERC20 public stablecoin;
    address public user = makeAddr("user");
    address public node = makeAddr("node");

    function setUp() public {
        stablecoin = new ERC20Mock("USD COIN","USDC",user,1000000 * 10 ** 6);  // 1 million USDC with 6 decimals
        qpm = new QuiverPayManager(address(stablecoin));
        vm.deal(user,10 ether);

          // Staking 1 ETH
      
    
    }

    // Test: Stake ETH
    function testStake() public {
        uint256 initialBalance = address(user).balance;
        vm.startPrank(user);
        qpm.stake{value: 1 ether}();
        uint256 finalBalance = address(user).balance;
        assertEq(finalBalance, initialBalance - 1 ether);
        assertEq(qpm.getNodeBalance(),1 ether);
        vm.stopPrank();
    }

    // Test: Unstake ETH
    function testUnstake() public {
        // Stake ETH first
        vm.startPrank(user);
         uint256 initialBalance = address(user).balance;
     
        qpm.stake{value: 1 ether}();
       
        // Unstake
        qpm.unStake();  
        uint256 finalBalance = address(user).balance;
        assertEq(finalBalance, initialBalance);
        assertEq(qpm.getNodeBalance(), 0);
        vm.stopPrank();
    }

    // Test: Create Order
    function testCreateOrder() public {
        vm.startPrank(user);
        uint256 amount = 100 * 10 ** 6;  // 100 USDC with 6 decimals
        stablecoin.approve(address(qpm),amount);
        stablecoin.allowance(user,address(qpm));
        uint256 orderId = qpm.createOrder(amount, "Bill Payment");
        console.log("ID",orderId);
        vm.stopPrank();
        assertEq(qpm.getOrder(orderId).amount, amount);
        assertEq(qpm.getOrder(orderId).user, user);
    }

    // Test: Claim Order
    function testClaimOrder() public {
        uint256 amount = 100 * 10 ** 6;  // 100 USDC with 6 decimals
        uint256 orderId = qpm.createOrder(amount, "Bill Payment");

        qpm.claimOrder(orderId);
        assertEq(qpm.getOrder(orderId).node, address(this));
    }

    // Test: Fulfill Order
    function testFulfillOrder() public {
        uint256 amount = 100 * 10 ** 6;  // 100 USDC with 6 decimals
        uint256 orderId = qpm.createOrder(amount, "Bill Payment");

        qpm.claimOrder(orderId);
        
        // Fulfill order
        qpm.fulfillOrder(orderId);

        assertTrue(qpm.getOrder(orderId).fulfilled);
        assertEq(qpm.getNode().transactionCount, 1);
    }

    // Test: Refund User
    function testRefundUser() public {
        uint256 amount = 100 * 10 ** 6;  // 100 USDC with 6 decimals
        uint256 orderId = qpm.createOrder(amount, "Bill Payment");

        qpm.claimOrder(orderId);

        // Refund user
        qpm.refundUser(orderId);

        assertEq(qpm.getOrder(orderId).refunded, true);
        assertEq(stablecoin.balanceOf(address(this)), 100 * 10 ** 6 - 5 * 10 ** 4); // Subtract 0.05 USDC
    }

    // Test: Non-reentrant check on stake
    function testNonReentrantOnStake() public {
        // Stake some ETH
        vm.deal(address(this), 1 ether);
        qpm.stake{value: 1 ether}();

        // Attempt to reenter (simulate reentrancy attack)
        vm.expectRevert("ReentrancyGuard: reentrant call");
        qpm.stake{value: 1 ether}();
    }

    // Test: Ensure token is supported
    function testGetSupportedToken() public {
        address token = qpm.getSupportedToken();
        assertEq(token, address(stablecoin));
    }
}
