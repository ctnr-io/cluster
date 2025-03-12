get-input = $(shell read -p "$(1): " input; echo $$input)
get-secret = $(shell read -s -p "$(1): " secret; echo $$secret; echo 1>&0)

docker-run := docker run $(shell [ -t 0 ] && echo -it || echo -i)

.PHONY: build
build:
	docker build -t kubespray -f Dockerfile .

.PHONY: install 
apply: ## Apply the kubernetes cluster
apply: generate private.key build
	${docker-run} -v .:/inventory kubespray cluster.yml

.PHONY: reset
reset: ## Reset the kubernetes cluster
reset: generate private.key build
	${docker-run} -v .:/inventory kubespray reset.yml

.PHONY: private.key
private.key: .FORCE
	@chmod 400 $@

.PHONY: .FORCE
.FORCE:

.PHONY: ssh
ssh: ## SSH into the control plane node
ssh: private.key
	ssh -i private.key root@62.171.183.141

.PHONY: login 
login: ## Configure the provider credentials 
login: oauth2-clientid ?= $(call get-input,oauth2-clientid)
login: oauth2-client-secret ?= $(call get-secret,oauth2-client-secret)
login: oauth2-user ?= $(call get-input,oauth2-user)
login: oauth2-password ?= $(call get-secret,oauth2-password)
login: ${HOME}/.cntb.yaml
	@echo "Logged in"
${HOME}/.cntb.yaml:
	@cntb config set-credentials \
		--oauth2-clientid=$(oauth2-clientid) \
		--oauth2-client-secret=$(oauth2-client-secret) \
		--oauth2-user=$(oauth2-user) \
		--oauth2-password=$(oauth2-password)

.PHONY: generate
generate: ## Generate the ansible inventory
generate: .cntb .cntb/private-networks.json .cntb/instances.json
	@deno -A ./templates/_generate.ts
.cntb:
	@mkdir -p .cntb
.cntb/private-networks.json: .FORCE
	@cntb get privateNetworks --output json > .cntb/private-networks.json
.cntb/instances.json: .FORCE
	@cntb get instances --output json > .cntb/instances.json

