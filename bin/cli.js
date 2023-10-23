#!/usr/bin/env node --enable-source-maps

// Thin wrapper around mime
import cli from '../dist/npmgraph_cli.js';

await cli();
