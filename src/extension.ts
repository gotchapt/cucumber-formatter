// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { off } from 'process';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const indentString = (str: string, count = 1) => {
		return str.replace(/^(?!\s*$)/gm, ' '.repeat(count));
	};


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cucumber-formatter.formatCucumberFeature', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Please open a .feature file to run this command');

			return;
		}

		const { languageId, uri } = editor.document;

		if (languageId !== 'feature') {
			vscode.window.showErrorMessage('This command can only be used on a opened .feature file');

			return;
		}

		// Get all content of opened document
		const content = editor.document.getText();
		const regex = /"""(.*?)\"""/sg;
		let success = 0;

		const formatGQL = (str: string, tabSize: number) => {
			const lines = str.split(`\n`);
			let formatted = '';
			let currentSpaces = 0;
			for (const line of lines) {
				if (line) {
					const trimmedLine = line.trim();
					if (trimmedLine[0] === '}') {
						currentSpaces -= tabSize;
					}
					formatted = `${formatted}\n${' '.repeat(currentSpaces)}${trimmedLine}`;
					if (line[line.length - 1] === '{') {
						currentSpaces += tabSize;
					}
				} else {
					formatted = `${formatted}\n`;
				}
			}

			return formatted.substring(1); // remove initial "\n"
		};

		const formattedContent = content.replace(regex, (match, offset, index) => {
			let json = null;
			const tabSize = editor.options.tabSize as number;
			const [tripleQuotes] = content
				.slice(0, index)
				.split(/\n/g)
				.reverse();
			const fileIndentSize = tripleQuotes.search(/\S|$/);

			try {
				json = JSON.parse(offset); // check if json
			} catch (error) {
				// not json, let's format GQL
				const formattedGQL = formatGQL(offset, tabSize);
				success += 1;
				return `"""${indentString(`${formattedGQL}"""`, fileIndentSize)}`;
			}

			const formattedJSON = JSON.stringify(json, null, tabSize);

			success += 1;
			return `"""\n${indentString(`${formattedJSON}\n"""`, fileIndentSize)}`;
		});

		try {
			const firstLine = editor.document.lineAt(0);
			const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
			const textRange = new vscode.Range(0,
				firstLine.range.start.character,
				editor.document.lineCount - 1,
				lastLine.range.end.character);
			editor.edit(edit => edit.replace(textRange, formattedContent));
		} catch (err) {
			console.log(err);
			vscode.window.showErrorMessage('Could not format file, an error occurred.');
		}

		if (success > 0) {
			vscode.window.showInformationMessage(`${success} Cucumber steps formatted!`);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
