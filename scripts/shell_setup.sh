#!/usr/bin/env bash
# Add the `saturn` and `simple-app` commands to the current shell.

if [ -z "${ZSH_VERSION}" ]; then
    this_dir=$(dirname "${BASH_SOURCE[0]}")
else
    this_dir=$(dirname "${(%):-%N}")
fi

demo_root_dir=$(realpath "${this_dir}/../")

. "${demo_root_dir}/saturn-contracts/scripts/shell_setup.sh"
. "${demo_root_dir}/simple-app/scripts/shell_setup.sh"

