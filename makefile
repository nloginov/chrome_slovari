all:
	mkdir -p production
	cp README.md production/
	cp icon*.png production/
	cp contentscript.js production/
	cp -rf external/ production/external
	cp -rf _locales/ production/_locales
	cp manifest.json production/
	node compile_templates.sh > production/compiled_templates.js
	lessc style.less > production/style.css
clean:
	rm -rf production/
