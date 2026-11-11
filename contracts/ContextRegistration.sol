// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContextRegistration
 * @dev Minimal contract for registering wallets on BOT Chain for ContextHQ.
 */
contract ContextRegistration {
    // Owner of the contract
    address public owner;

    // Registration fee in native BOT (in wei)
    uint256 public registrationFee;

    // Reentrancy guard state
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // Registration records
    struct Registration {
        bool isRegistered;
        uint64 registeredAt;
    }

    mapping(address => Registration) private _registrations;
    uint256 public totalRegistered;

    // Events
    event Registered(address indexed user, uint256 feePaid, uint256 timestamp);
    event RegistrationFeeUpdated(uint256 oldFee, uint256 newFee);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "ContextRegistration: caller is not the owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ContextRegistration: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(uint256 _initialFee) {
        owner = msg.sender;
        registrationFee = _initialFee;
        _status = _NOT_ENTERED;
    }

    /**
     * @notice Register the sender's wallet by paying the registration fee.
     */
    function register() external payable nonReentrant {
        require(!_registrations[msg.sender].isRegistered, "ContextRegistration: already registered");
        require(msg.value >= registrationFee, "ContextRegistration: insufficient fee");

        _registrations[msg.sender] = Registration({
            isRegistered: true,
            registeredAt: uint64(block.timestamp)
        });
        totalRegistered++;

        emit Registered(msg.sender, msg.value, block.timestamp);

        // Refund any excess payment
        if (msg.value > registrationFee) {
            uint256 refund = msg.value - registrationFee;
            (bool success, ) = msg.sender.call{value: refund}("");
            require(success, "ContextRegistration: refund failed");
        }
    }

    /**
     * @notice Check whether an address is registered and its registration timestamp.
     */
    function isRegistered(address user) external view returns (bool registered, uint256 registeredAt) {
        Registration memory reg = _registrations[user];
        return (reg.isRegistered, reg.registeredAt);
    }

    /**
     * @notice Update registration fee (only owner).
     */
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = registrationFee;
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(oldFee, _newFee);
    }

    /**
     * @notice Transfer contract ownership.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ContextRegistration: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Withdraw collected BOT fees (only owner).
     */
    function withdraw(address payable to) external onlyOwner nonReentrant {
        require(to != address(0), "ContextRegistration: invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "ContextRegistration: no funds to withdraw");
        emit FundsWithdrawn(to, balance);
        (bool success, ) = to.call{value: balance}("");
        require(success, "ContextRegistration: transfer failed");
    }
}
