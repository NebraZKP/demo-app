# Add the `saturn` and `simple-app` commands to the current shell.
[ "${ZSH_VERSION}" = "" ] && this_dir=`dirname ${BASH_SOURCE[0]}` || this_dir=`dirname ${(%):-%N}`
simple_app_root_dir=`realpath ${this_dir}/..`
. ${simple_app_root_dir}/../saturn-contracts/scripts/shell_setup.sh
alias simple-app="node ${simple_app_root_dir}/dist/src/index.js"
