# Contributing to Aukt

Thanks for stopping by. This public repository mirrors the design notes, prototypes, and community-facing artifacts for Aukt. The live client, service, and on-chain program are developed in private repositories during pre-launch; once the public devnet window opens, select packages will move here.

## What we take

- Typos and clarity fixes in `docs/`, `assets-spec/`, and the top-level README
- Suggestions for the pixel art direction, opened as issues with clear references
- Palette or canvas corrections that respect the Dawn Market palette
- Sound design references (no direct audio assets unless the rights are clearly yours)

## What we do not take

- Pull requests that add frameworks, build tooling, or linters the project does not already use
- Changes that widen scope beyond the dawn-market / Dutch auction theme
- Redesigns of the banner, mascots, or palette without discussion first
- Any asset or copy written or co-authored by an external generator unless disclosed

## Tone

Short sentences. Ending with a period. No emoji. No hype words.

## Local workflow

```
git clone https://github.com/auktdev/aukt.git
cd aukt
python3 main.py --days 60 --seed 42 --dry-run
```

Dry runs are safe and print the plan without touching git.

## Reporting issues

Open an issue with:

1. A short title that names the area (for example `sprite sheet -- auctioneer_shout bounds off`).
2. Steps to reproduce or a link to the commit where you saw the problem.
3. A suggested direction, if you have one. It is fine to leave this blank.

Thanks again.
