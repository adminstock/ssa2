*This document is intended for programmers and developers.*

*For comfortable work with this document in Visual Studio, recommended to install [Markdown Editor](https://visualstudiogallery.msdn.microsoft.com/eaab33c3-437b-4918-8354-872dfe5d1bfe).*

---

# SmallServerAdmin App

This is client-side application that implements the interaction with server **API**.

## Getting Started

The project is created in [Visual Studio 2015](https://www.visualstudio.com) (with **Update 3**).

To the comfortable work required:

* [Node.js](https://nodejs.org/) (v4.4.7 + npm v2.15.8)
* [TypeScript](https://www.typescriptlang.org/) (v1.8)
* [Webpack Task Runner](https://visualstudiogallery.msdn.microsoft.com/5497fd10-b1ba-474c-8991-1438ae47012a)
* [NPM Scripts Task Runner](https://visualstudiogallery.msdn.microsoft.com/8f2f2cbc-4da5-43ba-9de2-c9d08ade4941)

## Structure

* **AppStart** - folder contains main files of the application:
  * **Init.tsx** - routes, configuration and initialization of the application;
  * **Index.tsx** - main page of the **SmallServerAdmin**.
* **bin** - folder for binary assemblies. It created automatically. Not used. This folder should not be part of the solution.
* **Content** - folder to store additional static content:
  * **Images** - single images;
  * **Sprites** - images to create sprites:
    * ***Any folder*** - group name of sprites.
  * **Styles** - style files:
    * **.sprites** - folder with styles of sprites. It created automatically. This folder should not be part of the solution;
    * ***Any files .scss and folders***.
* **dist** - the folder contains resulting (compiled) files. Created automatically when building the **webpack**. This folder should not be part of the solution.
* **Helpers** - helper classes.
* **Layouts** - layouts (templates).
* **Models** - general classes of models.
* **Modules** - modules of **SmallServerAdmin**:
  * ***Any module***
    * **Index.tsx** - the main page of the module;
    * ***Any folders and files***.
* **node_modules** - **NPM** folder. It created automatically. This folder should not be part of the solution.
* **obj** - folder is used to store temporary object files and other files used to create the final binary. It created automatically. This folder should not be part of the solution.
* **src** - folder in which to place the compiled **TypeScript** files. It created automatically. This folder should not be part of the solution.
* **typings** - folder contains definition files for **TypeScript**. It created automatically. Change the contents of this folder manually is not necessary. For proper operation in **Visual Studio**, the folder and all the contents to be included in the solution.
* **typings.local** - folder contains additional definition files. Created manually.
* **UI** - contains common components of user interface.
* **index.html** - the main page of the application.
* **package.json** - this file for **NPM** to handle the project dependencies.
* **typings.json** - config of **TypeScript Definition Manager**.
* **web.config** - configuration of **IIS**.
* **webpack.config.js** - configuration of **Webpack**.

## Problems and solutions

### Invariant Violation

> Uncaught Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. Check the render method of `Index`.

This is some strange bug that can sometimes occur.

To solve the problem, you must rebuild **webpack**.

The best way through the menu **Build** -> **Rebuild App** (or Solution) or **Build** -> **Clean App** (or Solution) + **Build** -> **Build App** (or Solution).

Then rebuild **webpack**: menu **View** -> **Other Windows** -> **Task Runner Explorer**. Select **webpack.config.js** and start **Run - Development**.

If the problem persists, try to remove the folders `/app/src` and `/app/dist`, and try again.

### Cannot resolve 'file' or 'directory' ./AppStart/Init in /SmallServerAdmin2/app/src

> ERROR in Entry module not found: Error: Cannot resolve 'file' or 'directory' ./AppStart/Init in F:\AdminStock.net\SmallServerAdmin2\app/src

The problem is that **TypeScript** files were not compiled in **JavaScript**.

Use menu **Build** -> **Build App** (or Solution).

NOTE: Building will fail if there is an error in the code.