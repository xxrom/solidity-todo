# Updating build for updating in netlify.app
build:
	yarn --cwd ./client/
	yarn --cwd ./client/ build && yarn --cwd ./client/ export
