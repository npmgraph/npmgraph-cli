# npmgraph-cli URL API Audit Report

## Overview

This document compares npmgraph-cli CLI options with npmgraph's URL API to ensure consistency and identify gaps.

## URL API Parameters (from npmgraph README)

### Search Parameters

These go in the URL query string (`?`):

- **`q`** - Comma-separated packages (required)
- **`registry`** - Custom npm registry URL (optional, defaults to npmjs.org)

### Hash Parameters

These go in the URL hash fragment (`#`):

- **`collapse`** - Comma-separated list of modules to collapse
- **`color`** - Colorization mode: `moduleType` (default), `bus`, `outdated`
- **`deps`** - Dependency types: `devDependencies`, `peerDependencies`
- **`hide`** - Hide inspector panel (or `hide=graph` for report-only view)
- **`packages`** - JSON-encoded local package array
- **`section`** - Inspector section to expand
- **`select`** - Highlight a module (exact, name, license, or maintainer)
- **`sizing`** - Scale modules by unpacked size
- **`tab`** - Active tab: `info`, `report`, `module`, `view`

## Current CLI Implementation

### Supported Options

- `-f, --file <files...>` → sets `packages` hash param
- `--select [select]` → sets `select` hash param
- `--hide` → sets `hide` (no value, flag form)
- `--zoom [zoom]` → **NOT IN URL API** ❌
- `--deps [deps]` → sets `deps` hash param
- `--color [color]` → sets `color` hash param

### Arguments

- `[packages...]` → sets `q` search param

## Audit Results

### ✅ Correctly Mapped

| CLI Option      | URL Param  | Status     |
| --------------- | ---------- | ---------- |
| `[packages...]` | `q`        | ✅ Correct |
| `--file`        | `packages` | ✅ Correct |
| `--select`      | `select`   | ✅ Correct |
| `--hide`        | `hide`     | ✅ Correct |
| `--deps`        | `deps`     | ✅ Correct |
| `--color`       | `color`    | ✅ Correct |

### ⚠️ Issues Found

#### 1. `--zoom` Does Not Exist in URL API ❌

- **Current CLI behavior**: Accepts `--zoom` parameter
- **URL API reality**: No `zoom` parameter exists
- **Impact**: CLI option is non-functional
- **Action**: Remove or document as deprecated

#### 2. Missing CLI Options for Available URL Parameters 🔴

These URL API parameters have no CLI equivalent:

| URL Param  | CLI Option | Use Case                                 | Priority |
| ---------- | ---------- | ---------------------------------------- | -------- |
| `collapse` | ❌ None    | Collapse module subtrees                 | Medium   |
| `registry` | ❌ None    | Custom npm registry                      | Medium   |
| `section`  | ❌ None    | Open inspector section                   | Low      |
| `sizing`   | ❌ None    | Scale by package size                    | Low      |
| `tab`      | ❌ None    | Set active tab (info/report/module/view) | Low      |

#### 3. `--hide` Implementation Issues

- **Current**: Boolean flag (shows inspector panel or hides it)
- **URL API**: Can take values: `hide` (close inspector) or `hide=graph` (report-only)
- **Fix needed**: Support optional value for graph hiding

## Recommendations

### High Priority (Break/Fix)

1. **Remove `--zoom` option** ❌
   - No corresponding URL parameter
   - Currently non-functional
   - Breaking change: bump major version

2. **Fix `--hide` option** ⚠️
   - Support optional value: `--hide` or `--hide graph`
   - Current: boolean flag only
   - Needs improvement

### Medium Priority (Enhancements)

3. **Add `--collapse` option**
   - Useful for large dependency graphs
   - Maps to URL `collapse` parameter
   - Example: `npmgraph express --collapse debug,lodash`

4. **Add `--registry` option**
   - Support custom npm registries
   - Example: `npmgraph package --registry https://registry.example.com`

### Low Priority (Nice-to-have)

5. **Add `--sizing` flag**
   - Enable package size scaling
   - Example: `npmgraph react --sizing`

6. **Add `--tab` option**
   - Set initial tab view
   - Values: `info`, `report`, `module`, `view`
   - Example: `npmgraph express --tab report`

7. **Add `--section` option**
   - Open specific inspector section
   - Example: `npmgraph express --section "release timeline"`

## Proposed CLI Interface (Future)

```bash
# Basic usage (current)
npmgraph react

# With local packages (current)
npmgraph --file ./package.json

# With options (current + fixed)
npmgraph react --select exact:lodash@4.17.21
npmgraph react --hide          # Close inspector
npmgraph react --hide graph    # Report-only view
npmgraph react --deps devDependencies
npmgraph react --color outdated

# New high-priority options
npmgraph express --collapse debug,lodash
npmgraph package --registry https://registry.example.com

# New medium-priority options
npmgraph express --sizing
npmgraph express --tab report
npmgraph express --section "licenses"
```

## Migration Path

### Phase 1 (This PR)

- [ ] Remove `--zoom` option ⚠️ **BREAKING**
- [ ] Fix `--hide` to support optional values
- [ ] Update CLI type definitions

### Phase 2 (Next Minor)

- [ ] Add `--collapse` option
- [ ] Add `--registry` option
- [ ] Add CLI tests for new options

### Phase 3 (Future)

- [ ] Add `--sizing`, `--tab`, `--section` options
- [ ] Create compatibility matrix document

## Notes

- The `--zoom` parameter appears to be a historical CLI option that was never part of npmgraph's URL API
- The `--hide` option needs clarification on whether graph hiding is a common use case
- Most missing options are lower priority but would improve CLI completeness
- Consider creating CLI examples in README documenting these options

---

**Audit Date**: 2026-11-14  
**npmgraph Version**: 3.1.1  
**npmgraph-cli Version**: 0.2.1  
**Status**: ⚠️ One breaking issue found, multiple enhancements recommended
