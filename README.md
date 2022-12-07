# Ticking-Conway

### An on-chain interactive Conway's Game of Life built with [mud](https://mud.dev) running on [ticking-optimism](https://github.com/therealbytes/ticking-optimism/tree/conway) with a modified [op-geth](https://github.com/therealbytes/conway-op-geth).

![Conway's Game of Life](/img/coway.png)

**Run locally**

```bash
make build
make devnet-up
make start
```

Append `&burnerWalletPrivateKey=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` to the local client URL to use a funded developer account. You will need it to send transactions.

MUD's developer mode is disabled because it sets the transaction gas price to 0. The ECS state will be stored in a local cache. If you run multiple boards on the same browser profile, you may experience unexpected behavior. To avoid this, use a fresh incognito session for each board, or clear your local storage in-between boards.

**Manage devnet**

```bash
make devnet-up          # start
make devnet-down        # stop
make devnet-clean-state # clear
```
