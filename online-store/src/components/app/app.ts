
class App {
    private view: AppView;

    constructor() {
        this.view = new AppView();
    }

    public start(): void {
        this.view.drawNews(data);
    }
}