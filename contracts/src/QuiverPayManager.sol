// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract QuiverPayManager is ReentrancyGuard, Ownable {
    IERC20 public stablecoin;
    address[] supportedTokens;

    struct Order {
        address user;
        uint256 amount;
        address node;
        bool fulfilled;
        bool refunded;
        string orderType;
    }

    struct Node {
        uint256 stakedETH;
        uint256 transactionCount;
    }

    uint256 public orderCounter;

    mapping(uint256 => Order) public orders;
    mapping(address => Node) public nodes;
    mapping(address => uint256[]) public userOrders;

    event OrderCreated(uint256 indexed orderId, address indexed user, uint256 amount);
    event OrderClaimed(uint256 indexed orderId, address indexed node,address indexed user);
    event OrderFulfilled(uint256 indexed orderId,address indexed node,address indexed user);
    event OrderRefunded(uint256 indexed orderId,address indexed node,address indexed user);
    event NodeStaked(address indexed node, uint256 amount);
    event NodeUnStaked(address indexed node);


    error TokenNotSupported();

    constructor(address _stablecoin, address[] _supportedTokens) {
        stablecoin = IERC20(_stablecoin);
        supportedToekns=supportedTokens
    }

    function stake() external payable {
        require(msg.value > 0, "Must stake ETH");
        nodes[msg.sender].stakedETH += msg.value;
        emit NodeStaked(msg.sender, msg.value);
    }

    function unStake() external{
        require(nodeS[msg.sender].stakedETH !=0 , "Must stake ETH");
        nodes[msg.sender].stakedETH -= amount;
        payable(msg.sender).transfer(node[msg.sender].stakedETH);
        emit NodeUnStaked(msg.sender);
    }

    function createOrder(uint256 amount,string orderType) external nonReentrant returns(uint256){
        require(amount > 0, "Amount must be greater than 0");
        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        orders[orderCounter] = Order({
            user: msg.sender,
            amount: amount,
            node: address(0),
            fulfilled: false,
            refunded: false,
            orderType:orderType
        });
        userOrders[msg.sender].push(orderCounter);
        emit OrderCreated(orderCounter, msg.sender, amount);
        orderCounter++;

        return orderCounter;
    }
    

    /* DON'T KNOW IF I WILL BE NEDING THIS FUNC */
    function claimOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.node == address(0), "Order already claimed");
        require(!order.fulfilled && !order.refunded, "Order already processed");
        order.node = msg.sender;
        emit OrderClaimed(orderId, msg.sender);
    }

    function fulfillOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.node == msg.sender, "Not assigned to this node");
        require(!order.fulfilled && !order.refunded, "Order already processed");
        order.fulfilled = true;
        nodes[msg.sender].transactionCount++;

        emit OrderFulfilled(orderId);
    }

    function refundUser(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.node == msg.sender, "Not assigned to this node");
        require(!order.fulfilled && !order.refunded, "Order already processed");
        uint256 nodeRefundAmount = 0.05 * 10**6;  // 0.05 USDC (6 decimals for USDC)

        // Check if the user's order balance is sufficient to cover the 0.05 USDC subtraction
        require(order.amount >= nodeRefundAmount, "Insufficient balance to cover node refund");

        // Subtract 0.05 USDC from the user's order balance
        order.amount -= nodeRefundAmount;

      // Refund the user the remaining balance
        uint256 userRefundAmount = order.amount;
        require(stablecoin.transfer(order.user, userRefundAmount), "User refund failed");

        // Refund the node operator 0.05 USDC
        address nodeOperator = msg.sender;  // Assuming msg.sender is the node operator
        require(stablecoin.transfer(nodeOperator, nodeRefundAmount), "Node operator refund failed");
        order.refunded = true;
      
        emit OrderRefunded(orderId,msg.sender,order.user);
    }


    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    function getNodeInfo(address node) external view returns (uint256 stakedETH, uint256 txCount) {
        Node memory n = nodes[node];
        return (n.stakedETH, n.transactionCount);
    }

    // New function to return the USDC balance of a user
    function getUserUSDCBalance(address user) external view returns (uint256) {
        return stablecoin.balanceOf(user);
    }

    receive() external payable {
        stake();
    }
}
