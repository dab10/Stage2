import {
  Cars, Sort, Order, Winners, Winner,
} from '../../types';
import View from '../view/view';

class Api {
  private base: string;

  private garage: string;

  private engine: string;

  private winners: string;

  private sortAndOrder: string;

  protected view: View;

  constructor() {
    this.base = 'http://localhost:3000';
    this.garage = `${this.base}/garage`;
    this.engine = `${this.base}/engine`;
    this.winners = `${this.base}/winners`;
    this.sortAndOrder = '';
    this.view = new View();
  }

  public async carsForStartPage() {
    const { items, count } = (await this.getCars(1));
    this.view.renderStartPage(items, count);
  }

  public getCars = async (page: number, limit = 7): Promise< {
    items: Cars[]; count: string;
  } > => {
    const response = await fetch(`${this.garage}?_page=${page}&_limit=${limit}`);
    return {
      items: await response.json(),
      count: response.headers.get('X-Total-Count') as string,
    };
  };

  public getCar = async (id: number): Promise<Cars> => (await fetch(`${this.garage}/${id}`)).json();

  public createCar = async (body: Cars): Promise<Cars> => (
    await fetch(this.garage, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

  public deleteCar = async (id: number): Promise<Cars> => (await fetch(`${this.garage}/${id}`, { method: 'DELETE' })).json();

  public updateCar = async (id: number, body: Pick<Cars, 'name' | 'color'>): Promise<Cars> => (await fetch(`${this.garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json();

  public startEngine = async (id: number) => (await fetch(`${this.engine}?id=${id}&status=started`, { method: 'PATCH' })).json();

  public stopEngine = async (id: number) => (await fetch(`${this.engine}?id=${id}&status=stopped`, { method: 'PATCH' })).json();

  public drive = async (id: number) => {
    const res = await fetch(`${this.engine}?id=${id}&status=drive`, { method: 'PATCH' }).catch();
    return res.status === 200 ? { success: true } : { success: false }; // : { ...(await res.json())
  };

  public getSortOrder = (sort: Sort, order: Order) => {
    if (sort && order) {
      this.sortAndOrder = `&_sort=${sort}&_order=${order}`;
      return this.sortAndOrder;
    }
    this.sortAndOrder = '';
    return this.sortAndOrder;
  };

  public getWinners = async ({
    page, limit = 10, sort, order,
  }: Winners) => {
    const response = await fetch(`${this.winners}?_page=${page}&_limit=${limit}${this.getSortOrder(sort, order)}`);
    const items = await response.json();

    return {
      items: await Promise.all(
        items.map(async (winner: Winner) => ({ ...winner, car: await this.getCar(winner.id) })),
      ),
      count: response.headers.get('X-Total-Count'),
    };
  };

  public getWinner = async (id: number) => (await fetch(`${this.winners}/${id}`)).json();

  public getWinnerStatus = async (id: number) => (await fetch(`${this.winners}/${id}`)).status;

  public deleteWinner = async (id: number) => (await fetch(`${this.winners}/${id}`, { method: 'DELETE' })).json();

  public createWinner = async (body: Winner) => (await fetch(this.winners, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json();

  public updateWinner = async (id: number, body: Winner) => (await fetch(`${this.winners}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json();

  public saveWinner = async ({ id, time }: Pick<Winner, 'id' | 'time'>) => {
    const winnerStatus = await this.getWinnerStatus(id);

    if (winnerStatus === 404) {
      await this.createWinner({
        id,
        wins: 1,
        time,
      });
    } else {
      const winner = await this.getWinner(id);
      await this.updateWinner(id, {
        id,
        wins: winner.wins + 1,
        time: time < winner.time ? time : winner.time,
      });
    }
  };
}

export default Api;
