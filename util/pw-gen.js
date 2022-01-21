import readline from 'readline';
import bcrypt from "bcrypt";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your password to be hashed:", function(plainPassword) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword, salt);

  console.log(`Your hash: ${hash}`);

  rl.close();
});

rl.on("close", function() {
    console.log("\nDone, exit.");
    process.exit(0);
});
