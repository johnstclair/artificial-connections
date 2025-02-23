# Artificial Connections

Just like the NYTimes connections game, just with an AI twist.

You need (Ollama)[https://ollama.com/] to play, DeepSeek-R1:8B is recommended, other models, such as Qwen2.5:7B or smaller versions of DeepSeek-R1 will work, but won't be as consitant or enjoyable. 

All other instructions are in game.

## Installation

### Prebuilt binaries

Coming soon.

### Building from source

Install all of the prerequisites of (Tauri)[https://tauri.app/start/prerequisites/]. If you use Nix you can just use my nix-shell, with `nix-shell`. 

Then after installing the dependencies, `npm i` in the main directory of the project, run in dev mode with, `npm run tuari dev` and use `npm run tauri build` to build.

## Note

I created this project to see how far local LLM's have come since I messed with them last. Sadly, the man who told told me AI was going to steal our jobs in 6 months, 2 years ago, was wrong.

Using a powerful reasoning model, such as Deepseek-R1, will yeild you the best results, but the gameplay can still be inconsitant.

That is to say, Artificial Connections is more of a proof of concept, rather than a polished game. Either way, it's at least somewhat entertaing, so please enjoy!
