#!/usr/bin/env node

import { subcommands, run } from "cmd-ts";
import { deploy } from "./deploy";
import { submit } from "./submit";
import { getstate } from "./getstate";

const root = subcommands({
  name: "simple-app",
  cmds: {
    deploy,
    submit,
    "get-state": getstate,
  },
});

run(root, process.argv.slice(2))
  .then(() => {
    process.exit();
  })
  .catch((error) => {
    console.error("Simple-app error: ", error);
  });
