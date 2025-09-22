#!/bin/bash
cd /home/kavia/workspace/code-generation/wordsnap-vocabulary-manager-7781-7790/wordsnap_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

