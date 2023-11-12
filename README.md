# Demo Instructions

## Pre-requisites

yarn and Node 20+. These may be installed as follows:

```
# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc # Update bash terminal so we can use the command `nvm`.

# npm
nvm install 20

# yarn
corepack enable
yarn set version stable
yarn install
```

## Submit a proof:
```
git clone git@github.com:NebraZKP/simple-app-demo.git && cd simple-app-demo

# Build simple-app
yarn setup

# Set up simple-app commands in shell
source scripts/shell_setup.sh

# Use saturn local to generate a key
saturn local ethkeygen --keyfile keyfilename.key
```
Use a faucet such as www.sepoliafaucet.com to fund your address with sepolia ETH.
```
# Submit a solution along with a proof
simple-app submit --keyfile keyfilename.key
```
The last command will print a link to the proof's status on NEBRA's proof explorer. The proof should be either verified or pending verification.


### Check state of the UPA contract:

```console
$ saturn stats
```

### Check state of the simple-app contract:

```console
$ simple-app get-state
```
