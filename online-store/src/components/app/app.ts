import { IGoods, ITargetElement } from '../../types';
import Goods from '../goods/goods';
import data from '../goods/goods.json';
import Filter from '../filter/filter';
import Range from '../view/range';
import Favorite from '../favorite/favorite';

class App {
    private view: Goods;
    private data: IGoods[];
    private filter: Filter;
    private viewRange: Range;
    private favoriteItem: Favorite;

    constructor() {
        this.view = new Goods();
        this.data = data;
        this.filter = new Filter();
        this.viewRange = new Range();
        this.favoriteItem = new Favorite();
    }

    public start(): void {
        const filterByValue = document.querySelector('.filter-by-value') as HTMLDivElement;
        const countSlider = document.querySelector('.range-slider-by-count') as ITargetElement;
        const yearSlider = document.querySelector('.range-slider-by-year') as ITargetElement;
        const input = document.querySelector('.search__input') as HTMLInputElement;
        const select = document.querySelector('.sort-list') as HTMLSelectElement;
        const favoriteItems = document.querySelector('.item-list') as HTMLDivElement;

        this.view.draw(this.data);
        this.viewRange.rangeSliderByCount();
        this.viewRange.rangeSliderByYear();

        filterByValue.addEventListener('click', (e) => this.filter.filterByValue(e, data));
        countSlider.noUiSlider.on('set', () => this.filter.rangeByCount(data));
        yearSlider.noUiSlider.on('set', () => this.filter.rangeByYear(data));
        input.addEventListener('input', () => this.filter.filterSearch(data));
        select.addEventListener('change', (e) => this.filter.filterSort(e, data));
        //const favoriteItems = document.querySelectorAll<HTMLDivElement>('.item');
        //console.log(favoriteItems);
        favoriteItems.addEventListener('click', (e) => this.filter.chooseFavorite(e));
        // favoriteItems.forEach((tab) => {
        //     tab.addEventListener('click', (e) => this.favoriteItem.chooseFavorite(e));
        // });
    }
}

export default App;
