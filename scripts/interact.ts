import { ethers } from "hardhat";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

async function main() {
    const ComomitReveal = await ethers.getContractFactory("CommitReveal")
    const commitReveal = await ComomitReveal.deploy(120, "YES", "NO").then(async (result) => {
        console.log(
            `Deployed CommitReveal at ${result.target}, kindly proceed...`
          );
        const comrev = await ethers.getContractAt("IcommitReveal", result.target);
        
          async function performOperation(operation: string, votecommit: string, vote: string, secret : string): Promise<string | number> {
            try {
              switch (operation) {
                case 'commit':                 
                  await comrev.commitVote(votecommit);
                      return 'committed';                   
                case 'reveal':
                  if(vote == 'yes'){
                    await comrev.revealVote(`${1+'~'+secret}`,votecommit);
                    return 'revealed';
                  }else {
                    await comrev.revealVote(`${2+'~'+secret}`,votecommit);
                    return 'revealed'
                  }
                case 'getwinner':
                  return await comrev.getWinner();
                default:
                  return 'Invalid operation';
              }
            } catch (error) {
              return 'An error occurred'; 
            }              
        }            
            async function handleInput(operation: string, votecommit: string, vote: string, secret :string) {
              const result = await performOperation(operation, votecommit, vote, secret);
              console.log(`Result: ${result}`);
              if(operation == 'getwinner'){
                rl.close();
              }else {
                requestInput();
              }
            }

            function handleCommitresolve(option : string, secret : string){
               switch (option) {
                case 'yes':
                  return ethers.keccak256(ethers.toUtf8Bytes(`${1+'~'+secret}`));
                case 'no':
                    return ethers.keccak256(ethers.toUtf8Bytes(`${2+'~'+secret}`));
                default:
                  return 'invalid operation';
               }
            }         
          async function requestInput(){
              rl.question('Enter operation (commit/reveal/getwinner): ', async (operation) => {
                  if(operation == 'getwinner'){
                    await ethers.provider.send("evm_increaseTime", [120]);
                    await ethers.provider.send('evm_mine', []);
                    handleInput(operation,'','','');
                  }else {
                    rl.question('Enter vote (yes/no): ', (voteopt) => {
                      rl.question('Enter secretmessage: ', (secret) => {
                        const finalCommit = handleCommitresolve(voteopt,secret);
                        handleInput(operation,finalCommit,voteopt,secret)
                      });
                    });
                  }
                
          });
          }
      requestInput()  
    }).catch((err) => {
        
    });
}

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });



