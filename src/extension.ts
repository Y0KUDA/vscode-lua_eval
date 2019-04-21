import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {

	const lua = require('../node_modules/fengari/src/lua.js');
	const lauxlib = require('../node_modules/fengari/src/lauxlib.js');
	const lualib = require('../node_modules/fengari/src/lualib.js');
	const { to_luastring } = require("../node_modules/fengari/src/fengaricore.js");

	function eval_as_lua_code(code: string): string {
		let L = lauxlib.luaL_newstate();
		lualib.luaL_openlibs(L);
		lauxlib.luaL_loadstring(L, to_luastring(code));
		lua.lua_call(L, 0, -1);
		return lua.lua_tojsstring(L, -1);
	}

	let disposable = vscode.commands.registerCommand('lua_eval.replace', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor !== undefined) {
			const selections = editor.selections;
			editor.edit(builder => {
				for (const selection of selections) {
					var text = editor.document.getText(selection);
					builder.replace(selection, eval_as_lua_code(text));
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
