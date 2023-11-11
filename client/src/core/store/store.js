import { makeObservable, observable, action } from "mobx";

export class Store {
    constructor() {
        this.user = {
            type: "student"
        }
        this.loading = false;
        makeObservable(this, {
            user: observable,
            loading: observable,
            setLoading: action
        })
    }

    setLoading(state) {

    }
}

export default new Store()