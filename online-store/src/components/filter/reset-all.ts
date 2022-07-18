import Filter from './filter';
import { IGoods, IFilter, ITargetElement } from '../../types';

class ResetAll {
    private filter: Filter;
    private filterWords: IFilter;
    private countRibbonFromResetAll: number;

    constructor() {
        this.filter = new Filter();
        this.countRibbonFromResetAll = 0;
        this.filterWords = {
            companyValue: [],
            cameraValue: [],
            colorValue: [],
            popularValue: [],
            quantityValue: [],
            yearValue: [],
            model: '',
            id: [],
            classRibbon: '',
        };
    }

    public getCountRibbonFromResetAll(): number {
        return this.countRibbonFromResetAll;
    }

    public getResetAllFilterWords(): IFilter {
        return this.filterWords;
    }

    public resetAll(countAndYear: number[], data: IGoods[]): void {
        //this.filterWords.id = [];

        const resetFilterByValue = document.querySelectorAll('.alt');
        resetFilterByValue.forEach((el) => el.classList.remove('alt'));

        const input = document.querySelector('.search__input') as HTMLInputElement;
        input.value = '';

        const countSlider = document.querySelector('.range-slider-by-count') as ITargetElement;
        countSlider.noUiSlider.set([countAndYear[0], countAndYear[1]]);

        const yearSlider = document.querySelector('.range-slider-by-year') as ITargetElement;
        yearSlider.noUiSlider.set([countAndYear[2], countAndYear[3]]);

        const select = document.querySelector('.sort-list') as HTMLSelectElement;
        select.value = 'sortByNameAscending';
        this.filter.filterSort(data);

        localStorage.clear();
    }
}

export default ResetAll;
