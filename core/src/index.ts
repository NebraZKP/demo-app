#!/usr/bin/env node

import { subcommands, run } from "cmd-ts";
import { batchFiller } from "./batch_filler";
import { deploy } from "./deploy";
import { submitDirect } from "./submitDirect";
import { getstate } from "./getstate";
import { multiSubmit } from "./multiSubmit";
import { submit } from "./submit";
import { submitInvalid } from "./submitInvalid";
import { generateProofs } from "./generateProofs";

const root = subcommands({
  name: "demo-app",
  cmds: {
    deploy,
    submit: submit,
    "generate-proofs": generateProofs,
    "submit-invalid": submitInvalid,
    "multi-submit": multiSubmit,
    "submit-direct": submitDirect,
    "get-state": getstate,
    "batch-filler": batchFiller,
  },
});

run(root, process.argv.slice(2))
  .then(() => {
    process.exit();
  })
  .catch((error) => {
    console.error("demo-app error: ", error);
  });
