# Scalable-Consortium-Blockchain

This project demonstrates the setup and execution of a scalable consortium blockchain using Truffle, Ganache, MetaMask, and Besu. It is designed to simulate two different hospitals interacting within a blockchain-based healthcare system.

## Prerequisites
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
- [MetaMask](https://metamask.io/) (installed on two different Google Chrome profiles)
- [Node.js](https://nodejs.org/) (v12 or above)
- [VSCode](https://code.visualstudio.com/)
- [Besu](https://besu.hyperledger.org/)

## Setup Instructions

### Step 1: Create Two Different Truffle Ganache Projects
1. Open Ganache and create two separate projects with different configurations.
   - ![image](https://github.com/user-attachments/assets/81e37014-c1af-4dbe-89b7-24014c3c3d9f)
   - Ensure that the **RPC Server** and **Network ID** are distinct for both projects.
   - Example:
	- ![image](https://github.com/user-attachments/assets/4fd812b9-7fe1-4503-b38b-3814de353678)
	- ![image](https://github.com/user-attachments/assets/ca222dc3-60f5-40f5-87c5-95559d387988)
     
### Step 2: Clone the Repository Twice
2. Clone this repository twice in different directories:
   ```bash
   git clone https://github.com/HarSen0604/Scalable-Consortium-Blockchain.git
   cd Scalable-Consortium-Blockchain
   ```
   - Example directory names: `hospital1` and `hospital2`.

### Step 3: Configure Truffle Projects
3. In Ganache, go to **Settings** > **Workspace** and add the two Truffle projects (`hospital1` and `hospital2`) to the respective workspaces.
![image](https://github.com/user-attachments/assets/bae5a267-5f85-49ed-8b3f-0844d57dc87f)

### Step 4: Set Up MetaMask Accounts
4. Install MetaMask on two different Google Chrome profiles (recommended).
5. In each MetaMask account, create a new test network, or use the default provided test networks.
![image](https://github.com/user-attachments/assets/98deee61-6fb1-4bb5-a44e-e5fc87ba88e6)
![image](https://github.com/user-attachments/assets/3b395d9f-984c-49fe-9fc4-2784c12160a8)

### Step 5: Link Ganache Accounts to MetaMask
6. From each Truffle Ganache project, copy the private key of an account and import it into the corresponding MetaMask account.
   - **hospital1** project account should be linked to **MetaMask acc1**.
   - **hospital2** project account should be linked to **MetaMask acc2**.
![image](https://github.com/user-attachments/assets/c535b77f-75e8-4d2c-ad3d-5355e008b758)
![image](https://github.com/user-attachments/assets/80526641-ebd0-43af-89d0-06ebf6b3ef18)

### Step 6: Check Balances
7. After importing, verify that both MetaMask accounts show balances corresponding to the Ganache accounts.

### Step 7: Open Projects in VSCode
8. Open two separate instances of VSCode, one for each cloned repository (`hospital1` and `hospital2`).

### Step 8: Execute Commands
9. Open the terminal in each VSCode instance and execute the commands listed in `commands.txt` to start the blockchain network. The commands are specific to Besu.

### Step 9: Start Live Server
10. Start the **Live Server** in both VSCode instances.
    - Ensure that the **hospital1** HTML is previewed in the Google Chrome profile with **MetaMask acc1**.
    - Similarly, **hospital2** HTML should be previewed in the profile with **MetaMask acc2**.
    
This will prevent any errors such as "Ran Out of Gas."

---

### Notes
- Be cautious of warnings related to already-deployed contracts when reusing test networks.
- Use different Google Chrome profiles to avoid account conflicts between MetaMask wallets.
- Ensure both projects are running on different ports and networks for seamless communication.
- Run only `server2.js` using `node server2.js` command. THe client side code responsible for sending the blockchain data is integrated in the `app.js` itself.

That's it! You now have a scalable consortium blockchain setup for a healthcare system.
