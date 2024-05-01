import { ServerApp } from "./ServerApp";
class Launcher {
  private server: ServerApp;
  constructor() {
    this.server = new ServerApp();
  }
  public launchApp() {
    this.server.createServer();
  }
}
new Launcher().launchApp();
