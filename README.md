# Natty extension for Visual Studio Code

This is an extension for Visual Studio Code with support for writing proofs in [Natty](https://github.com/medovina/natty).  It is in an early alpha phase of development.

## Installing

This extension is not yet available in the Visual Studio Code Marketplace.  To use it, you'll need to install it from source, following these steps:

1. Make sure that you have OCaml installed and have built Natty from source.
1. Clone this git repository to a local directory.
1. Make sure that you have Node.js installed.
1. Install the vsce tool for packaging Visual Studio extensions:

   ```
   $ npm install -g @vscode/vsce
   ```

1. In the directory where you have cloned this repository, run

   ```
   $ npm install
   $ vsce package
   ```

That will create a file `natty-proof-assistant-0.0.1.vsix`.

1. Start Visual Studio Code.
1. Open the Extensions view in the left sidebar, then click the "..." button at the top and choose "Install from VSIX...".  (Alternatively, click in the search bar at the top and type "/vsix" to find the same command.)
1. Choose the VSIX file that was generated in step 4.

The extension will automatically run the Natty executable, which contains an LSP language server.  That executable is built as `_build/default/main.exe` in the Natty source directory, but must be available in your PATH with the name `natty`.  You may wish to create a symbolic link named `natty` pointing to the actual executable.

## Features

This extension recognizes any file with the extension `.n` as a Natty source file, and will display it with syntax highlighting in a variable-width font.

By default the extension will automatically perform type checking and highlight any resulting errors, but will not attempt to prove theorems or proof steps.  To start proving, click the button that says "Proving: off" in the status bar.  Natty will begin proving theorems in the input file, displaying warnings for any theorem or step that could not be proved.  Click on any of these warnings in the Problems pane to jump to the unprovable theorem or step.  You can click the Proving button at any time to exit the automatic proving mode.
