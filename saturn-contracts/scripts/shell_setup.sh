# Add the `saturn` command to the current shell.
[ "${ZSH_VERSION}" = "" ] && this_dir=`dirname ${BASH_SOURCE[0]}` || this_dir=`dirname ${(%):-%N}`
root_dir=`realpath ${this_dir}/..`
alias saturn="node ${root_dir}/dist/src/tool/main.js"
