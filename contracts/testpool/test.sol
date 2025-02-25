
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "node_modules/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "node_modules/@uniswap/v3-core/contracts/UniswapV3Factory.sol";
import "node_modules/@uniswap/v3-periphery/contracts/NonfungiblePositionManager.sol";

contract Token2 is ERC20, UniswapV3Factory, NonfungiblePositionManager {

    address stabletoken, pool;
    constructor(address _stabletoken) ERC20("USDC", "USDC") {
        _mint(msg.sender, 100 * 10 ** 18);
        stabletoken = _stabletoken;
    }

    function createpoolwithliquidity() public{
        pool = createPool(address(this), stabletoken, 3000);
        mint(pool, 1000000000000000000, 1000000000000000000, "");
    }
}
