.PHONY: build test coverage

define compose
	docker-compose $(1)
endef

define yarn
	$(call compose, run dev yarn $1)
endef

all: build bash

build:
	$(call compose, build --pull)

bash:
	$(call compose, run --service-ports dev bash)

test lint coverage:
	$(call yarn, $@)
