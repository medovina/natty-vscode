import * as vscode from 'vscode';

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind }
	from 'vscode-languageclient/node';

let client: LanguageClient;

let proving: boolean = false;
let progress: number = 0, total: number = 0;
let provingItem: vscode.StatusBarItem;

function refresh(): void {
	provingItem.text = 'Proving: ' + (proving ? progress + ' of ' + total : 'off');
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
		if (proving)
			progress = total = 0;
		refresh();
		client.sendNotification('natty/setProving', proving);
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
	
	var listener = client.onNotification("natty/progress",
		(new_progress: number, new_total: number) => {
			progress = new_progress;
			total = new_total;
			refresh();
		});
	subscriptions.push(listener);
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client)
		return undefined;

	return client.stop();
}
