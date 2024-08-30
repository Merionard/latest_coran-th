DATE := $(shell date +%Y-%m-%d)

.PHONY: help build-and-push-images

# Affiche la liste des commandes disponibles si "make" est exécuté sans arguments
help:
	@echo "Usage: make <command> [args]"
	@echo
	@echo "Commands:"
	@echo "  build-and-push-images   - Build image and push images on docker hub."
	@echo "  help                    - Displays this help message."

build-and-push-images:
	@sed -i "s/^LABEL date=\"[^\"]*\"/LABEL date=\"$(DATE)\"/" Dockerfile; \
	docker login --username merionard && \
	docker build --file ./Dockerfile -t coran-th:latest . && \
	docker tag coran-th:latest merionard/coran-th:latest && \
	docker push merionard/coran-th:latest && \
	echo "done";
