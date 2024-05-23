import * as vscode from 'vscode';

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind }
	from 'vscode-languageclient/node';

let client: LanguageClient;

let proving: boolean = false;
let provingItem: vscode.StatusBarItem;

function refresh(): void {
	provingItem.text = 'Proving: ' + (proving ? 'on' : 'off');
}

function updateStatus(): void {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.document.languageId == 'natty')
		provingItem.show();
	else
		provingItem.hide();
}

export function activate({subscriptions}: vscode.ExtensionContext) {
	var provingCommand = vscode.commands.registerCommand('natty.proving', () => {
		proving = !proving;
		refresh();
	});
	subscriptions.push(provingCommand);

	provingItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	provingItem.command = 'natty.proving';
	refresh();
	provingItem.show();
	subscriptions.push(provingItem);

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => updateStatus()));

	const serverOptions: ServerOptions = {
		command: '/home/adam/projects/prover/_build/default/main.exe',
		args: ['-l'], transport: TransportKind.pipe, options: { shell: true }
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'natty' }]
	};

	client = new LanguageClient( 'nattyServer', 'Natty Server', serverOptions, clientOptions);
	client.start();
	client.sendNotification('natty/hello', true);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client)
		return undefined;

	return client.stop();
}
