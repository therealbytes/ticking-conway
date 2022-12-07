install: submodules
	yarn install
.PHONY: install

submodules:
	# CI will checkout submodules on its own (and fails on these commands)
	if [ -z "$$GITHUB_ENV" ]; then \
		git submodule init; \
		git submodule update; \
	fi
.PHONY: submodules

devnet-up:
	make -C ./ticking-optimism devnet-up
.PHONY: devnet-up

devnet-down:
	make -C ./ticking-optimism devnet-down
.PHONY: devnet-down

devnet-clean-state:
	rm -rf ./ticking-optimism/packages/contracts-bedrock/deployments/devnetL1
	rm -rf ./ticking-optimism/.devnet
	cd ./ticking-optimism/ops-bedrock && docker-compose down
	docker volume ls --filter name=ops-bedrock --format='{{.Name}}' | xargs -r docker volume rm
.PHONY: devnet-clean-state

build: install build-contracts build-client
.PHONY: build

build-contracts:
	yarn workspace contracts build
.PHONY: build-contracts

build-client:
	yarn workspace client build
.PHONY: build-client

start: start-contracts start-client
.PHONY: start

start-contracts:
	yarn workspace contracts deploy:tick
.PHONY: start-contracts

start-client: build-contracts
	yarn workspace client start
.PHONY: start-client
