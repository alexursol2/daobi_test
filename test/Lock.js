const { expect } = require("chai");
const { ethers } = require("hardhat");
const { bigint } = require("hardhat/internal/core/params/argumentTypes");

describe("DAObi Contract", function () {

  let owner, addr1, addr2;
  let treasurer, pauser, chancellor, pauser2, sealManager;
  let pauser3, minter, burner, nftManager, voteAdmin, minReqAdmin;
  let daobi, vote, seal;
  
  beforeEach(async function () {
    [owner, addr1, addr2, treasurer, pauser, chancellor, pauser2, sealManager, 
      pauser3, minter, burner, nftManager, voteAdmin, minReqAdmin
    ] = await ethers.getSigners();

    const DAObiFactory = await ethers.getContractFactory("DAObi3");
    daobi = await DAObiFactory.deploy();
    await daobi.waitForDeployment();

    const DaobiVoteContract = await ethers.getContractFactory("DaobiVoteContract");
    vote = await DaobiVoteContract.deploy();
    await vote.waitForDeployment();

    const DaobiChancellorsSeal = await ethers.getContractFactory("DaobiChancellorsSeal");
    seal = await DaobiChancellorsSeal.deploy();
    await seal.waitForDeployment();

    // Grant roles
    await daobi.grantRole(await daobi.TREASURER_ROLE(), treasurer.address);
    await daobi.grantRole(await daobi.PAUSER_ROLE(), pauser.address);
    await daobi.grantRole(await daobi.CHANCELLOR_ROLE(), chancellor.address);
  
    await seal.grantRole(await seal.PAUSER_ROLE(), pauser2.address);
    await seal.grantRole(await seal.SEAL_MANAGER(), sealManager.address);
    
    await vote.grantRole(await vote.PAUSER_ROLE(), pauser3.address);
    await vote.grantRole(await vote.MINTER_ROLE(), minter.address);
    await vote.grantRole(await vote.BURNER_ROLE(), burner.address);
    await vote.grantRole(await vote.NFT_MANAGER(), nftManager.address);
    await vote.grantRole(await vote.VOTE_ADMIN_ROLE(), voteAdmin.address);
    await vote.grantRole(await vote.MINREQ_ROLE(), minReqAdmin.address);

  });

  describe("DAObi", function () {
    describe("Check role", function () {
      it("Should set the right owner", async function () {
        expect(await daobi.hasRole(await daobi.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
      });

      it("Should assign the treasurer role", async function () {
        expect(await daobi.hasRole(await daobi.TREASURER_ROLE(), treasurer.address)).to.be.true;
      });

      it("Should assign the pauser role", async function () {
        expect(await daobi.hasRole(await daobi.PAUSER_ROLE(), pauser.address)).to.be.true;
      });

      it("Should assign the chancellor role", async function () {
        expect(await daobi.hasRole(await daobi.CHANCELLOR_ROLE(), chancellor.address)).to.be.true;
      });
    });

    describe("Pausing", function () {
      it("Should pause the contract", async function () {
        await daobi.connect(pauser).pause();
        expect(await daobi.paused()).to.be.true;
      });

      it("Should unpause the contract", async function () {
        await daobi.connect(pauser).pause();
        await daobi.connect(pauser).unpause();
        expect(await daobi.paused()).to.be.false;
      });

      it("Should fail to pause if not pauser", async function () {
        await expect(daobi.connect(addr1).pause()).to.be.revertedWithCustomError(
          daobi,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, daobi.PAUSER_ROLE());
      });
    });

    describe("Minting", function () {
      it("Successful mint", async function () {
        
      });

      it("Mint Must pass non 0 DB amount", async function () {
        
      });
    });

    describe("Make Claim", function () {
      it("Successful make claim", async function () {
        
      });

      it("Daobi: You don't even have a voting token!", async function () {
        
      });

      it("Daobi: You have withdrawn from service!", async function () {
        
      });

      it("Daobi: You need AT LEAST one vote!", async function () {
        
      });

      it("You are already Chancellor!", async function () {
        
      });
    });

    describe("Recover Seal", function () {
      it("Successful recover seal", async function () {
        
      });

      it("Only the Chancellor can reclaim this Seal!", async function () {
        
      });

      it("The Seal doesn't currently exist", async function () {
        
      });
    });

    describe("Assume Chancellorship", function () {
      it("Successful assume chancellorship", async function () {
        
      });
    });

    describe("Claiming Chancellor Salary", function () {
      it("Should claim chancellor salary", async function () {
        await ethers.provider.send("evm_increaseTime", [86400]); // Increase time by 24 hours
        await ethers.provider.send("evm_mine"); // Mine a new block

        await daobi.connect(chancellor).claimChancellorSalary();
        expect(await daobi.balanceOf(chancellor.address)).to.equal(await daobi.chancellorSalary());
      });

      it("Should fail to claim salary if not enough time has passed", async function () {
        await daobi.connect(chancellor).claimChancellorSalary();
        await expect(daobi.connect(chancellor).claimChancellorSalary()).to.be.revertedWith(
          "Not enough time has elapsed since last payment"
        );
      });

      it("When not paused", async function () {
        await daobi.connect(pauser).pause();
        await expect(daobi.claimChancellorSalary()).to.be.revertedWithCustomError(
          daobi,
          "EnforcedPause"
        ).withArgs();
      });
    });

    describe("Adjusting Salary and Interval", function () {
      it("Should adjust salary interval", async function () {
        const newInterval = 172800; // 48 hours
        await daobi.connect(treasurer).adjustSalaryInterval(newInterval);
        expect(await daobi.salaryInterval()).to.equal(newInterval);
      });

      it("Should adjust salary amount", async function () {
        const newSalary = ethers.parseEther("2000");
        await daobi.connect(treasurer).adjustSalaryAmount(newSalary);
        expect(await daobi.chancellorSalary()).to.equal(newSalary);
      });

      it("Should fail to adjust salary interval if not treasurer", async function () {
        const newInterval = 172800; // 48 hours
        
        await expect(daobi.connect(addr1).adjustSalaryInterval(newInterval)).to.be.revertedWithCustomError(
          daobi,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, daobi.TREASURER_ROLE());
      });

      it("Should fail to adjust salary amount if not treasurer", async function () {
        const newSalary = ethers.parseEther("2000");
        
        await expect(daobi.connect(addr1).adjustSalaryAmount(newSalary)).to.be.revertedWithCustomError(
          daobi,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, daobi.TREASURER_ROLE());
      });
    });

    describe("Retargeting DAO", function () {
      it("Should retarget DAO", async function () {
        const newVault = addr1.address;

        await daobi.connect(owner).grantRole(await daobi.PAUSER_ROLE(), treasurer.address);
        await daobi.connect(treasurer).retargetDAO(newVault);
        
        expect(await daobi.DAOvault()).to.equal(newVault);
        expect(await daobi.paused()).to.be.true;
      });

      it("Should fail to retarget DAO if not treasurer", async function () {
        const newVault = addr1.address;

        await expect(daobi.connect(addr1).retargetDAO(newVault)).to.be.revertedWithCustomError(
          daobi,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, daobi.TREASURER_ROLE());
      });
    });

    describe("Setting Swap Fee", function () {
      it("Should set swap fee", async function () {
        const newSwapFee = 5000;
        await daobi.connect(treasurer).setSwapFee(newSwapFee);
        expect(await daobi.swapFee()).to.equal(newSwapFee);
      });

      it("Should fail to set swap fee if not treasurer", async function () {
        const newSwapFee = 5000;
        
        await expect(daobi.connect(addr1).setSwapFee(newSwapFee)).to.be.revertedWithCustomError(
          daobi,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, daobi.TREASURER_ROLE());
      });

      it("When not paused", async function () {
        await daobi.connect(pauser).pause();
        await expect(daobi.setSwapFee(10)).to.be.revertedWithCustomError(
          daobi,
          "EnforcedPause"
        ).withArgs();
      });
    });

    describe("Making a Claim", function () {
      /*
      it("Should succeed if conditions are met", async function () {
        // Assuming dvc and seal contracts are deployed and set up
        // You would need to mock or deploy these contracts and set their addresses in DAObi
        // This is a simplified example
        await daobi.connect(addr1).makeClaim();
        expect(await daobi.chancellor()).to.equal(addr1.address);
      });
      
      it("Should fail if claimant has no voting tokens", async function () {
        await expect(daobi.connect(addr1).makeClaim()).to.be.revertedWith(
          "Daobi: You don't even have a voting token!"
        );
      });
      */

      it("When not paused", async function () {
        await daobi.connect(pauser).pause();
        await expect(daobi.makeClaim()).to.be.revertedWithCustomError(
          daobi,
          "EnforcedPause"
        ).withArgs();
      });
    });

    describe("Recovering Seal", function () {
      /*
      it("Should recover the seal", async function () {
        // Assuming seal contract is deployed and set up
        // You would need to mock or deploy the seal contract and set its address in DAObi
        // This is a simplified example
        await daobi.connect(chancellor).recoverSeal();
        expect(await seal.ownerOf(1)).to.equal(chancellor.address);
      });
      */

      it("Should fail to recover the seal if not chancellor", async function () {
        await expect(daobi.connect(addr1).recoverSeal()).to.be.revertedWith(
          "Only the Chancellor can reclaim this Seal!"
        );
      });
    });
  });

  describe("Daobi Chancellors Seal", function () {
    describe("Check role", function () {
      it("Should set the right owner as default admin", async function () {
        expect(await seal.hasRole(await seal.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
      });
  
      it("Should assign the PAUSER_ROLE to the pauser", async function () {
        expect(await seal.hasRole(await seal.PAUSER_ROLE(), pauser2.address)).to.be.true;
      });
  
      it("Should assign the SEAL_MANAGER role to the seal manager", async function () {
        expect(await seal.hasRole(await seal.SEAL_MANAGER(), sealManager.address)).to.be.true;
      });
    });
  
    describe("Pausing", function () {
      it("Should pause the contract", async function () {
        await seal.connect(pauser2).pause();
        expect(await seal.paused()).to.be.true;
      });

      it("Should unpause the contract", async function () {
        await seal.connect(pauser2).pause();
        await seal.connect(pauser2).unpause();
        expect(await seal.paused()).to.be.false;
      });

      it("Should fail to pause if not pauser", async function () {
        await expect(seal.connect(addr1).pause()).to.be.revertedWithCustomError(
          seal,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, seal.PAUSER_ROLE());
      });
    });
  
    describe("Minting", function () {
      it("Should mint a new seal", async function () {
        const newURI = "https://example.com/seal/1";
        await seal.connect(sealManager).setURI(newURI);
        await seal.connect(sealManager).mint(addr1.address);
  
        expect(await seal.ownerOf(1)).to.equal(addr1.address);
        expect(await seal.tokenURI(1)).to.equal(newURI);
        expect(await seal.totalSupply()).to.equal(1);
      });
  
      it("Should fail to mint if not SEAL_MANAGER", async function () {
        await expect(seal.connect(addr1).mint(addr1.address)).to.be.revertedWithCustomError(
          seal,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, seal.SEAL_MANAGER());
      });
  
      it("Should fail to mint if a seal already exists", async function () {
        const newURI = "https://example.com/seal/1";
        await seal.connect(sealManager).setURI(newURI);
        await seal.connect(sealManager).mint(addr1.address);
  
        await expect(seal.connect(sealManager).mint(addr2.address)).to.be.revertedWith(
          "A Chancellor Seal Already Exists!"
        );
      });
    });
  
    describe("Setting URI", function () {
      it("Should set the URI for the seal", async function () {
        const newURI = "https://example.com/seal/1";
        await seal.connect(sealManager).setURI(newURI);
  
        expect(await seal.URIaddr()).to.equal(newURI);
      });
  
      it("Should fail to set URI if not SEAL_MANAGER", async function () {
        const newURI = "https://example.com/seal/1";

        await expect(seal.connect(addr1).setURI(newURI)).to.be.revertedWithCustomError(
          seal,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, seal.SEAL_MANAGER());
      });
    });
  
    describe("Events", function () {
      it("Should emit SealMinted event when minting", async function () {
        const newURI = "https://example.com/seal/1";
        await seal.connect(sealManager).setURI(newURI);
  
        await expect(seal.connect(sealManager).mint(addr1.address))
          .to.emit(seal, "SealMinted")
          .withArgs(addr1.address);
      });
  
      it("Should emit SealURIRetarget event when setting URI", async function () {
        const newURI = "https://example.com/seal/1";
        await expect(seal.connect(sealManager).setURI(newURI))
          .to.emit(seal, "SealURIRetarget")
          .withArgs(newURI);
      });
    });
  });

  describe("Daobi Vote Contract", function () {
    describe("Check roles", function () {
      it("Should set the right owner as default admin", async function () {
        expect(await vote.hasRole(await vote.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
      });
  
      it("Should assign roles correctly", async function () {
        expect(await vote.hasRole(await vote.PAUSER_ROLE(), pauser3.address)).to.be.true;
        expect(await vote.hasRole(await vote.MINTER_ROLE(), minter.address)).to.be.true;
        expect(await vote.hasRole(await vote.BURNER_ROLE(), burner.address)).to.be.true;
        expect(await vote.hasRole(await vote.NFT_MANAGER(), nftManager.address)).to.be.true;
        expect(await vote.hasRole(await vote.VOTE_ADMIN_ROLE(), voteAdmin.address)).to.be.true;
        expect(await vote.hasRole(await vote.MINREQ_ROLE(), minReqAdmin.address)).to.be.true;
      });
    });

    describe("Pausing", function () {
      it("Should pause the contract", async function () {
        await vote.connect(pauser3).pause();
        expect(await vote.paused()).to.be.true;
      });
  
      it("Should unpause the contract", async function () {
        await vote.connect(pauser3).pause();
        await vote.connect(pauser3).unpause();
        expect(await vote.paused()).to.be.false;
      });
  
      it("Should fail to pause if not pauser", async function () {
        
        await expect(vote.connect(addr1).pause()).to.be.revertedWithCustomError(
          vote,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, vote.PAUSER_ROLE());
      });
    });
  
    describe("Minting", function () {
      it("Should mint a new token", async function () {
        // Set stake amount and approve tokens
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        
        await daobi.connect(owner).approve(await vote.getAddress(), 10);
  
        // Mint token
        await vote.connect(minter).mint(owner);
        expect(await vote.balanceOf(owner.address)).to.equal(1);
      });
  
      it("Should fail to mint if account already has a token", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
  
        await vote.connect(minter).mint(addr1);
        await expect(vote.connect(minter).mint(addr1.address)).to.be.revertedWith(
          "Account already has a token"
        );
      });
  
      it("Should fail to mint if not minter", async function () {
        await expect(vote.connect(addr1).mint(addr1.address)).to.be.revertedWithCustomError(
          vote,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, vote.MINTER_ROLE());
      });
    });
  
    describe("Voting", function () {
      it("Should register and vote", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
  
        await vote.connect(minter).mint(addr1);
  
        await vote.connect(addr1).register(addr1, ethers.encodeBytes32String("Alice"));
        await vote.connect(addr1).vote(addr1);
  
        expect(await vote.assessVotes(addr1)).to.equal(1);
      });
  
      it("Should fail to vote if not registered", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
  
        await vote.connect(minter).mint(addr1);
        

        await expect(vote.connect(addr1).vote(addr2.address)).to.be.revertedWith(
          "Not registered"
        );
      });

      it("Should fail to vote if don't have a token", async function () {
        await expect(vote.connect(addr1).vote(addr2.address)).to.be.revertedWith(
          "You don't have a token"
        );
      });

      it("Invalid candidate in vote function", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
  
        await vote.connect(minter).mint(addr1);
  
        await vote.connect(addr1).register(addr1, ethers.encodeBytes32String("Alice"));
        await expect(vote.connect(addr1).vote(addr2)).to.be.revertedWith(
          "Invalid candidate"
        );
      });

      it("Insufficient balance in vote function", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
  
        await vote.connect(minter).mint(addr1);
  
        await vote.connect(addr1).register(addr1, ethers.encodeBytes32String("Alice"));
        await vote.connect(minReqAdmin).setMinimumTokenReq(1010);
        await expect(vote.connect(addr1).vote(addr1)).to.be.revertedWith(
          "Insufficient balance"
        );
      });
    });

    describe("Recluse", function () {
      it("Successful recluse when stakedAmount > 0", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        await daobi.transfer(addr1, 1000);
        await daobi.connect(addr1).approve(await vote.getAddress(), 1000);
        
        await vote.connect(minter).mint(addr1);
        await vote.connect(addr1).register(addr1, ethers.encodeBytes32String("Alice"));
  
        await vote.connect(addr1).recluse();
      });

      it("Recluse already inactive", async function () {
        await expect(vote.connect(addr1).recluse()).to.be.revertedWith(
          "Already inactive"
        );
      });
    });

    describe("Burn", function () {
      it("Successful burn", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        
        await daobi.connect(owner).approve(await vote.getAddress(), 10);
  
        // Mint token
        await vote.connect(minter).mint(owner);
        await vote.connect(owner).voluntary_burn();
      });

      it("Successful voluntary burn", async function () {

      });
    });
  
    describe("Small Functions", function () {
      it("Refresh Token URI", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
        
        await daobi.connect(owner).approve(await vote.getAddress(), 10);
  
        // Mint token
        await vote.connect(minter).mint(owner);
        await vote.refreshTokenURI();
      });

      it("Target Daobi", async function () {
        await vote.connect(voteAdmin).targetDaobi(await daobi.getAddress());
      });

      it("You don`t have a role for Target Daobi", async function () {
        await expect(vote.connect(addr1).targetDaobi(addr1.address)).to.be.revertedWithCustomError(
          vote,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, vote.VOTE_ADMIN_ROLE());
      });

      it("Set Minimum Token Req", async function () {
        await vote.connect(minReqAdmin).setMinimumTokenReq(10);
      });

      it("You don`t have a role for Set Minimum Token Req", async function () {
        await expect(vote.connect(addr1).setMinimumTokenReq(10)).to.be.revertedWithCustomError(
          vote,
          "AccessControlUnauthorizedAccount"
        ).withArgs(addr1.address, vote.MINREQ_ROLE());
      });
    });
  });
});
