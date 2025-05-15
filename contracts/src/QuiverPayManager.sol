// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Test, console} from "forge-std/Test.sol";

contract QuiverPayManager is ReentrancyGuard, Ownable {
    IERC20 public stablecoin;
    address public supportedToken;
    uint256 public feeProfit=0;

    struct Order {
        address user;
        uint256 amount;
        bool fulfilled;
        bool refunded;
        string orderType;
    }

    struct Node {
        uint256 stakedETH;
        uint256 transactionCount;
        uint256 lifetimeEarning;
    }

    uint256 public orderCounter;

    mapping(uint256 => Order) public orders;
    mapping(address => Node) public nodes;
    mapping(address => uint256[]) public userOrders;

    event OrderCreated(uint256 indexed orderId, address indexed user, uint256 amount,string billType);
    event OrderFulfilled(uint256 indexed orderId,address indexed node,address indexed user);
    event OrderRefunded(uint256 indexed orderId,address indexed node,address indexed user);
    event NodeStaked(address indexed node, uint256 amount);
    event NodeUnStaked(address indexed node);


    error TokenNotSupported();
    error NotEnoughUSDC();

    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        supportedToken=_stablecoin;
    }

    function getNodeBalance() external view returns(uint256){
        Node storage n=nodes[msg.sender];
        return n.stakedETH;
    }

    function stake() public payable {
        require(msg.value > 0, "Must stake ETH");
        require(nodes[msg.sender].stakedETH <= 0,"Already staked with this wallet");
        nodes[msg.sender].stakedETH += msg.value;
        emit NodeStaked(msg.sender, msg.value);
    }

    function unStake() external{
        require(nodes[msg.sender].stakedETH !=0 , "Must stake ETH");
        uint256 amount=nodes[msg.sender].stakedETH;
        nodes[msg.sender].stakedETH -= amount;
        payable(msg.sender).transfer(amount);
        emit NodeUnStaked(msg.sender);
    }

    function getNode() public view returns(Node memory){
        return nodes[msg.sender];
    }

    function createOrder(uint256 amount,string memory orderType) external nonReentrant returns(uint256){
        require(amount > 0, "Amount must be greater than 0");
         // Optional: Check allowance first (for user clarity)
        uint256 allowance = stablecoin.allowance(msg.sender, address(this));

        require(allowance >= amount, "Insufficient allowance");
        console.log(stablecoin.balanceOf(msg.sender),amount);
        if(stablecoin.balanceOf(msg.sender) < amount){
            console.log("less tthan");
            revert NotEnoughUSDC();
        }
        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        orders[orderCounter] = Order({
            user: msg.sender,
            amount: amount,
            fulfilled: false,
            refunded: false,
            orderType:orderType
        });
        userOrders[msg.sender].push(orderCounter);
        emit OrderCreated(orderCounter, msg.sender, amount,orderType);
        orderCounter++;
        return (orderCounter-1);
    }
    

    function fulfillOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(nodes[msg.sender].stakedETH > 0,"Must Be Node Operator Stake ETH To Become One");
        require(!order.fulfilled && !order.refunded, "Order already processed");
        uint256 platformFee = 0.05 * 10**6;  // 0.05 USDC (6 decimals for USDC)
        require(order.amount >= platformFee, "Insufficient balance to cover node refund");
        // Subtract 0.05 USDC from the user's order balance
        order.amount-=platformFee;
        feeProfit+=platformFee;
        order.fulfilled = true;
        nodes[msg.sender].transactionCount++;
        nodes[msg.sender].lifetimeEarning+=order.amount;
        require(stablecoin.transfer(msg.sender,order.amount), "Node operator credit failed");
      
        emit OrderFulfilled(orderId,msg.sender,order.user);
    }

    function getOrder(uint256 orderId) external view returns(Order memory){
        return orders[orderId];
    }

    function refundUser(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(nodes[msg.sender].stakedETH > 0,"Must Be Node Operator");
        require(!order.fulfilled && !order.refunded, "Order already processed");
        uint256 nodeRefundAmountFee= 0.1 * 10** 6;  // 0.05 USDC (6 decimals for USDC)
        uint256 platformRefundAmountFee=0.05 * 10 ** 6;
        // Check if the user's order balance is sufficient to cover the 0.05 USDC subtraction
        require(order.amount >= nodeRefundAmountFee, "Insufficient balance to cover node refund");

        // Subtract 0.05 USDC from the user's order balance
        order.amount -= nodeRefundAmountFee;
        order.amount -= platformRefundAmountFee;
        feeProfit += platformRefundAmountFee;

      // Refund the user the remaining balance
        uint256 userRefundAmount = order.amount;
        require(stablecoin.transfer(order.user, userRefundAmount), "User refund failed");
        // Refund the node operator 0.1 USDC
        address nodeOperator = msg.sender;  // Assuming msg.sender is the node operator
        require(stablecoin.transfer(nodeOperator, nodeRefundAmountFee), "Node operator refund failed");
        order.refunded = true;
      
        emit OrderRefunded(orderId,msg.sender,order.user);
    }

    function takeProfit() public onlyOwner{
           feeProfit=0;
           require(stablecoin.transfer(msg.sender, feeProfit), "Node operator refund failed");
    }

    function getFeeProfit() external returns(uint256){
        return feeProfit;
    }


    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    function getNodeInfo(address node) external view returns (uint256 stakedETH, uint256 txCount,uit256 lifeEarning) {
        Node memory n = nodes[node];
        return (n.stakedETH, n.transactionCount,n.lifetimeEarning);
    }

    // New function to return the USDC balance of a user
    function getUserUSDCBalance(address user) external view returns (uint256) {
        return stablecoin.balanceOf(user);
    }

    function getSupportedToken() external view returns(address){
        return supportedToken;
    }

    receive() external payable {
        stake();
    }
}
